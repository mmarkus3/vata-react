import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { firestore } from 'firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import { Order } from './order.interface';

const bringHeaders = {
  Accept: 'application/json',
  'X-Mybring-API-Uid': process.env.BRING_UID,
  'X-Mybring-API-Key': process.env.BRING_API_KEY,
}

@Injectable()
export class OrdersService {

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
}
