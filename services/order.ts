import type { Order } from '@/types/order';
import { isTimestamp } from '@/utils/date';
import { DocumentData, QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore';
import { getItem, getSnapshotItems, whereEqual } from './firestore';

const converter = {
  toFirestore: (item: Order) => item,
  fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData, DocumentData>, options?: SnapshotOptions | undefined) => {
    const order = snapshot.data(options) as Order;
    let created: Date = new Date();
    if (isTimestamp(order.created)) {
      created = order.created.toDate();
    } else if (order.created != null) {
      created = new Date(order.created);
    }
    return { ...order, created };
  }
};

export function getOrdersByCompany(companyId: string, cb: (results: Order[]) => void) {
  try {
    return getSnapshotItems<Order>('orders', cb, [whereEqual('company', companyId)], converter);
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    throw error;
  }
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    return await getItem<Order>('orders', orderId, converter);
  } catch (error) {
    console.error('Failed to fetch order:', error);
    throw new Error(error instanceof Error ? error.message : 'Order fetch failed');
  }
}
