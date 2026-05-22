import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { firestore } from 'firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import { Campaign } from '../campaigns/campaign.interface';
import { getRate } from '../currency/currency';
import { Options } from '../options/options.interface';
import { Product } from '../products/product.interface';
import { setupVismaPay } from '../visma/options';
import { Order } from './order.interface';

const bringHeaders = {
  Accept: 'application/json',
  'X-Mybring-API-Uid': process.env.BRING_UID,
  'X-Mybring-API-Key': process.env.BRING_API_KEY,
}

@Injectable()
export class OrdersService {
  private static readonly MAX_PERCENTAGE = 100;

  async getPaymentMethods(companyId: string, currency: string) {
    const vismaPay = await setupVismaPay(companyId);
    try {
      const result = await vismaPay.getMerchantPaymentMethods(currency);
      return result.payment_methods;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async getPoints(companyId: string, postalCode: string, country: string) {
    const companyDoc = await firestore().doc(`companies/${companyId}`).get();
    if (!companyDoc.exists) {
      throw new NotFoundException('Company not found');
    }
    const response = await fetch(`https://api.bring.com/pickuppoint/api/pickuppoint/${country}/postalCode/${postalCode}`, {
      headers: bringHeaders,
    });
    const data = await response.json();
    return data;
  }

  async getPoint(id: string, country: string) {
    const response = await fetch(`https://api.bring.com/pickuppoint/api/pickuppoint/${country}/id/${id}`, {
      headers: bringHeaders,
    });
    const data = await response.json() as { pickupPoint: any[] };
    return data.pickupPoint.length > 0 ? data.pickupPoint[0] : null;
  }

  async getPrices(companyId: string, country = 'FI') {
    const doc = await firestore().doc(`options/${companyId}`).get();
    const item = doc.data() as Options;
    const over = item.over;
    const delivery = item.delivery;

    if (country !== 'SE') {
      return { over, delivery };
    }

    try {
      const rateResponse = await getRate(companyId);
      const rate = typeof rateResponse?.rate === 'number' ? rateResponse.rate : Number.NaN;
      if (!Number.isFinite(rate) || rate <= 0) {
        return { over, delivery };
      }
      return {
        over: over * rate,
        delivery: delivery * rate,
      };
    } catch {
      return { over, delivery };
    }
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

  async placeOrder(companyId: string, orderId: string, country: string) {

    if (!orderId) {
      throw new BadRequestException('Order id is required');
    }

    const orderDoc = await firestore().doc(`orders/${orderId}`).get();
    if (!orderDoc.exists) {
      throw new NotFoundException('Order not found');
    }
    const order = { ...orderDoc.data(), id: orderDoc.id } as Order;
    if (order.company !== companyId) {
      throw new BadRequestException('Company mismatch');
    }

    const optionsDoc = await firestore().doc(`options/${companyId}`).get();
    const options = optionsDoc.data() as Options;
    const vat = options.vat;
    const overFree = options.over;
    const deliveryFee = options.delivery;
    const orderProducts = Array.isArray(order.products) ? order.products : [];
    const discountCode = typeof order.discount === 'string' ? order.discount.trim() : '';
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
      const finalPrice = this.getLineFinalPrice(product, campaign) * 100;
      const pretaxPrice = Math.floor(finalPrice - (finalPrice * vat));
      return { ...product, count: line.amount, pretaxPrice, finalPrice, id: line.id };
    });

    const products = await Promise.all(productsPromise);
    const amount = products.reduce((prev, curr) => prev + curr.finalPrice * curr.count, 0);

    const chargeObj = {
      amount,
      order_number: order.id,
      currency: country === 'SE' ? 'SEK' : 'EUR',
      email: order.customer.email,
      payment_method: {
        type: 'e-payment',
        return_url: order.returnUrl,
        notify_url: `https://api-a5kgud3tvq-lz.a.run.app/e-payment-notify?companyId=${companyId}`,
        lang: country === 'SE' ? 'sv' : 'fi',
        selected: [order.paymentMethod]
      },
      customer: { ...order.customer },
      products: products.map((p) => ({
        id: p.id,
        title: p.name,
        count: p.count,
        pretax_price: p.pretaxPrice,
        tax: vat * 100,
        price: p.finalPrice,
        type: 1
      })),
    }

    // Add shipment cost
    if (amount < (overFree * 100)) {
      const deliveryFeePrice = deliveryFee * 100;
      const pretaxPrice = Math.floor(deliveryFeePrice - (deliveryFeePrice * vat));
      chargeObj.products = [...chargeObj.products, { id: order.deliveryMethod, title: 'Kuljetusmaksu', count: 1, pretax_price: pretaxPrice, tax: vat * 100, price: deliveryFeePrice, type: 2 }];
      chargeObj.amount = chargeObj.amount + deliveryFeePrice;
    }

    try {
      const vismaPay = await setupVismaPay(companyId);
      const chargeResult = await vismaPay.createCharge(chargeObj) as { result: number; token: string; type: string };
      const updated = {
        ...order,
        status: 'placed' as const,
        updated: Timestamp.now(),
        amount,
        products: products.map((p) => ({
          id: p.id,
          name: p.name,
          amount: p.count,
          finalPrice: p.finalPrice,
        })),
        token: chargeResult.token,
      };
      await firestore().doc(`orders/${order.id}`).set(updated);
      return { url: `${vismaPay.apiUrl}/token/${chargeResult.token}` };
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
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
    if (order.id == null) {
      throw new BadRequestException('Order id missing');
    }
    const orderDoc = await firestore().doc(`orders/${order.id}`).get();
    const dbOrder = orderDoc.data() as Order;
    if (dbOrder.company !== companyId) {
      throw new BadRequestException('Company mismatch');
    }
    order.updated = Timestamp.now();
    const doc = await firestore().doc(`orders/${order.id}`).update(order);
    return { ...order, updated: doc.writeTime };
  }
}
