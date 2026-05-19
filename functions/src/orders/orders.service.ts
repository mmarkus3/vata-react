import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { firestore } from 'firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import vismaPay from 'visma-pay';
import { Product } from '../products/product.interface';
import { Order } from './order.interface';

const bringHeaders = {
  Accept: 'application/json',
  'X-Mybring-API-Uid': process.env.BRING_UID,
  'X-Mybring-API-Key': process.env.BRING_API_KEY,
}

@Injectable()
export class OrdersService {

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
    const data = await response.json();
    return data;
  }

  async getPrices(companyId: string) {
    const doc = await firestore().doc(`options/${companyId}`).get();
    const item = doc.data();
    return { over: item.over as number, delivery: item.delivery as number };
  }

  async placeOrder(companyId: string, order: Order) {
    if (!order.id) {
      throw new BadRequestException('Order id is required');
    }

    const orderDoc = await firestore().doc(`orders/${order.id}`).get();
    if (!orderDoc.exists) {
      throw new NotFoundException('Order not found');
    }
    const dbOrder = orderDoc.data() as Order;
    if (dbOrder.company !== companyId) {
      throw new BadRequestException('Company mismatch');
    }

    const optionsDoc = await firestore().doc(`options/${companyId}`).get();
    const vat = optionsDoc.data().vat as number;
    const overFree = optionsDoc.data().over as number;
    const deliveryFee = optionsDoc.data().delivery as number;
    const orderProducts = Array.isArray(dbOrder.products) ? dbOrder.products : [];

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
      return { ...product, orderAmount: line.amount, pretaxPrice: product.retailPrice - (product.retailPrice * vat) };
    });

    const products = await Promise.all(productsPromise);
    const amount = products.reduce((prev, curr) => prev + curr.retailPrice, 0);

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
        price: p.retailPrice,
        type: 1
      })),
    }

    // Add shipment cost
    if (amount < overFree) {
      const pretaxPrice = deliveryFee - (deliveryFee * vat);
      chargeObj.products = [...chargeObj.products, { id: order.deliveryMethod, title: order.deliveryMethod, amount: 1, pretax_price: pretaxPrice, tax: vat * 100, price: deliveryFee, type: 2 }]
    }

    const chargeResult = await vismaPay.createCharge(chargeObj);
    /*const updated = {
      ...dbOrder,
      status: 'placed' as const,
      updated: Timestamp.now(),
    };
    await firestore().doc(`orders/${order.id}`).set(updated);
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
