import { BadRequestException, Injectable } from '@nestjs/common';
import { firestore } from 'firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import { Order } from './order.interface';

@Injectable()
export class OrdersService {

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
