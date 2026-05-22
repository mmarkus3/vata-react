import type { Order } from '@/types/order';
import { isTimestamp } from '@/utils/date';
import { DocumentData, QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore';
import { getItem, getSnapshotItems, whereEqual, whereIn } from './firestore';

export interface SelectedPointInfo {
  id: string;
  name?: string;
  address?: string;
  city?: string;
  postalCode?: string;
}

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
    return getSnapshotItems<Order>('orders', cb, [whereEqual('company', companyId), whereIn('status', ['paid', 'placed', 'sent'])], converter);
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

export function resolveOrderPointId(order: Order | null | undefined): string | null {
  if (!order) return null;

  return order.deliveryMethod?.trim() ?? null;
}

const normalizeSelectedPointInfo = (pointId: string, data: unknown): SelectedPointInfo => {
  if (!data || typeof data !== 'object') {
    return { id: pointId };
  }

  const root = data as Record<string, unknown>;
  const point = (root.point && typeof root.point === 'object' ? root.point : root) as Record<string, unknown>;

  return {
    id: pointId,
    name: typeof point.name === 'string' ? point.name : undefined,
    address: typeof point.address === 'string' ? point.address : undefined,
    city: typeof point.city === 'string' ? point.city : undefined,
    postalCode:
      typeof point.postalCode === 'string'
        ? point.postalCode
        : typeof point.zip === 'string'
          ? point.zip
          : undefined,
  };
};

export async function getSelectedPointInfo(company: string, pointId: string): Promise<SelectedPointInfo> {
  const apiBase = process.env.EXPO_PUBLIC_FIREBASE_API;
  if (!apiBase) {
    throw new Error('Missing EXPO_PUBLIC_FIREBASE_API');
  }

  if (!company?.trim() || !pointId?.trim()) {
    throw new Error('Missing company or point id');
  }

  const companySafe = encodeURIComponent(company.trim());
  const pointSafe = encodeURIComponent(pointId.trim());
  const base = apiBase.replace(/\/$/, '');
  const url = `${base}/orders/company/${companySafe}/point/${pointSafe}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Point fetch failed (${response.status})`);
  }

  const data = await response.json();
  return normalizeSelectedPointInfo(pointId, data);
}
