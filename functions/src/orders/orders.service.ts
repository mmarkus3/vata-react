import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { firestore } from 'firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import vismaPay from 'visma-pay';
import { Campaign } from '../campaigns/campaign.interface';
import { Product } from '../products/product.interface';
import { Order } from './order.interface';

const bringHeaders = {
  Accept: 'application/json',
  'X-Mybring-API-Uid': process.env.BRING_UID,
  'X-Mybring-API-Key': process.env.BRING_API_KEY,
}

@Injectable()
export class OrdersService {
  private static readonly MAX_PERCENTAGE = 100;

  private async setupVismaPay(companyId: string) {
    const doc = await firestore().doc(`options/${companyId}`).get();
    const item = doc.data();
    vismaPay.setPrivateKey(item.vismapay.privateKey ?? '');
    vismaPay.setApiKey(item.vismapay.apiKey ?? '');
  }

  async getPaymentMethods(companyId: string) {
    await this.setupVismaPay(companyId);
    try {
      const result = await vismaPay.getMerchantPaymentMethods('EUR');
      return result.payment_methods;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async getPoints(companyId: string, postalCode: string) {
    const companyDoc = await firestore().doc(`companies/${companyId}`).get();
    if (!companyDoc.exists) {
      throw new NotFoundException('Company not found');
    }
    const response = await fetch(`https://api.bring.com/pickuppoint/api/pickuppoint/FI/postalCode/${postalCode}`, {
      headers: bringHeaders,
    });
    const data = await response.json();
    return data;
  }

  async getPoint(id: string) {
    const response = await fetch(`https://api.bring.com/pickuppoint/api/pickuppoint/FI/id/${id}`, {
      headers: bringHeaders,
    });
    const data = await response.json() as { pickupPoint: any[] };
    return data.pickupPoint.length > 0 ? data.pickupPoint[0] : null;
  }

  async getPrices(companyId: string) {
    const doc = await firestore().doc(`options/${companyId}`).get();
    const item = doc.data();
    return { over: item.over as number, delivery: item.delivery as number };
  }

  private toDate(value: unknown): Date | null {
    if (!value) return null;
    if (value instanceof Date) {
      return Number.isNaN(value.getTime()) ? null : value;
    }
    if (typeof value === 'string') {
      const parsed = new Date(value);
      return Number.isNaN(parsed.getTime()) ? null : parsed;
    }
    if (typeof value === 'object' && value !== null && 'toDate' in value && typeof (value as { toDate?: unknown }).toDate === 'function') {
      const parsed = (value as { toDate: () => Date }).toDate();
      return parsed instanceof Date && !Number.isNaN(parsed.getTime()) ? parsed : null;
    }
    return null;
  }

  private isCampaignActive(campaign: Campaign, now: Date): boolean {
    const start = campaign?.start.toDate();
    const end = campaign?.end.toDate();
    if (!start || !end) return false;
    return now.getTime() >= start.getTime() && now.getTime() <= end.getTime();
  }

  private getLineFinalPrice(product: Product, campaign: Campaign): number {
    if (!campaign || !Array.isArray(campaign.products)) {
      return product.retailPrice;
    }
    const line = campaign.products.find((item) => item?.id === product.id);
    if (!line) {
      return product.retailPrice;
    }
    if (campaign.discountType === 'fixed') {
      const fixed = typeof line.discountFixed === 'number' ? line.discountFixed : Number(line.discountFixed);
      return Number.isFinite(fixed) && fixed > 0 ? fixed : product.retailPrice;
    }
    if (campaign.discountType === 'percentage') {
      const percentage = typeof line.discountPercentage === 'number' ? line.discountPercentage : Number(line.discountPercentage);
      if (!Number.isFinite(percentage) || percentage <= 0 || percentage > OrdersService.MAX_PERCENTAGE) {
        return product.retailPrice;
      }
      const discounted = product.retailPrice * (1 - (percentage / 100));
      return Number.isFinite(discounted) && discounted > 0 ? discounted : product.retailPrice;
    }
    return product.retailPrice;
  }

  async placeOrder(companyId: string, order: Order) {
    if (!order.id) {
      throw new BadRequestException('Order id is required');
    }

    const orderDoc = await firestore().doc(`orders/${order.id}`).get();
    if (!orderDoc.exists) {
      throw new NotFoundException('Order not found');
    }
    const dbOrder = { ...orderDoc.data(), id: orderDoc.id } as Order;
    if (dbOrder.company !== companyId) {
      throw new BadRequestException('Company mismatch');
    }

    const optionsDoc = await firestore().doc(`options/${companyId}`).get();
    const vat = optionsDoc.data().vat as number;
    const overFree = optionsDoc.data().over as number;
    const deliveryFee = optionsDoc.data().delivery as number;
    const orderProducts = Array.isArray(dbOrder.products) ? dbOrder.products : [];
    const discountCode = typeof dbOrder.discount === 'string' ? dbOrder.discount.trim() : '';
    let campaign: Campaign | null = null;

    if (discountCode.length > 0) {
      const campaignDocs = await firestore().collection('campaigns').where('company', '==', companyId).where('code', '==', discountCode).get();
      const now = new Date();
      campaign = campaignDocs.docs
        .map((doc) => ({ ...doc.data(), id: doc.id }) as Campaign)
        .find((item) => {
          const code = typeof item?.code === 'string' ? item.code.trim() : '';
          return code === discountCode && this.isCampaignActive(item, now);
        }) ?? null;
    }

    const productsPromise = orderProducts.map(async (line) => {
      if (!line?.id) {
        throw new BadRequestException('Order contains invalid product reference');
      }
      if (typeof line.amount !== 'number' || line.amount <= 0) {
        throw new BadRequestException(`Invalid amount for product ${line.id}`);
      }

      const productDoc = await firestore().doc(`products/${line.id}`).get();
      if (!productDoc.exists) {
        throw new BadRequestException(`Product not found: ${line.id}`);
      }

      const product = productDoc.data() as Product;
      const stockAmount = typeof product.amount === 'number' ? product.amount : Number(product.amount);
      if (!Number.isFinite(stockAmount)) {
        throw new BadRequestException(`Invalid stock amount for product ${line.id}`);
      }
      if (stockAmount < line.amount) {
        throw new BadRequestException(`Insufficient stock for product ${line.id}`);
      }
      const finalPrice = this.getLineFinalPrice(product, campaign);
      return { ...product, orderAmount: line.amount, pretaxPrice: finalPrice - (finalPrice * vat), finalPrice };
    });

    const products = await Promise.all(productsPromise);
    const amount = products.reduce((prev, curr) => prev + curr.finalPrice, 0);

    const chargeObj = {
      amount,
      order_number: order.id,
      currency: 'EUR',
      email: order.customer.email,
      payment_method: {
        type: 'e-payment',
        return_url: order.returnUrl,
        notify_url: 'https://api-a5kgud3tvq-lz.a.run.app/e-payment-notify',
        lang: 'fi',
        selected: [order.paymentMethod]
      },
      customer: { ...order.customer },
      products: products.map((p) => ({
        id: p.id,
        title: p.name,
        amount: p.orderAmount,
        pretax_price: p.pretaxPrice,
        tax: vat * 100,
        price: p.finalPrice,
        type: 1
      })),
    }

    // Add shipment cost
    if (amount < overFree) {
      const pretaxPrice = deliveryFee - (deliveryFee * vat);
      chargeObj.products = [...chargeObj.products, { id: order.deliveryMethod, title: order.deliveryMethod, amount: 1, pretax_price: pretaxPrice, tax: vat * 100, price: deliveryFee, type: 2 }]
    }

    const chargeResult = await vismaPay.createCharge(chargeObj);
    const updated = {
      ...dbOrder,
      status: 'placed' as const,
      updated: Timestamp.now(),
      amount,
      products: products.map((p) => ({
        id: p.id,
        name: p.name,
        amount: p.orderAmount,
        finalPrice: p.finalPrice,
      })),
    };
    Logger.log(updated);
    Logger.log(chargeObj);
    /*await firestore().doc(`orders/${order.id}`).set(updated);
    return updated;*/
  }

  async createOrder(order: Order) {
    order.created = Timestamp.now();
    const doc = await firestore().collection('orders').add(order);
    return { ...order, id: doc.id };
  }

  async updateOrder(companyId: string, order: Order) {
    const orderDoc = await firestore().doc(`orders/${order.id!}`).get();
    const dbOrder = orderDoc.data() as Order;
    if (dbOrder.company !== companyId) {
      throw new BadRequestException('Company mismatch');
    }
    const updatedOrder = Object.assign(dbOrder, order);
    updatedOrder.updated = Timestamp.now();
    const doc = await firestore().doc(`orders/${updatedOrder.id!}`).set(updatedOrder);
    return { ...order, updated: doc.writeTime };
  }

  async updateOnlyOrder(companyId: string, order: Partial<Order>) {
    const orderDoc = await firestore().doc(`orders/${order.id!}`).get();
    const dbOrder = orderDoc.data() as Order;
    if (dbOrder.company !== companyId) {
      throw new BadRequestException('Company mismatch');
    }
    order.updated = Timestamp.now();
    const doc = await firestore().doc(`orders/${order.id!}`).update(order);
    return { ...order, updated: doc.writeTime };
  }
}
