import type { Order } from '@/types/order';

export type OrderListState = 'loading' | 'error' | 'empty' | 'success';
export type OrderSegment = 'placed' | 'paid' | 'sent';

const getOrderTimeValue = (value: unknown): number => {
  if (value instanceof Date) {
    const time = value.getTime();
    return Number.isFinite(time) ? time : 0;
  }
  if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value).getTime();
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};

export function getSegmentedOrders(orders: Order[], segment: OrderSegment): Order[] {
  return orders
    .filter((order) => order.status === segment)
    .sort((left, right) => {
      const leftTime = getOrderTimeValue(left.created);
      const rightTime = getOrderTimeValue(right.created);
      if (leftTime !== rightTime) {
        return leftTime - rightTime;
      }
      return (left.id ?? '').localeCompare(right.id ?? '');
    });
}

export function getOrderListState(input: {
  isLoading: boolean;
  error: string | null;
  orders: Order[];
}): OrderListState {
  if (input.isLoading) {
    return 'loading';
  }
  if (input.error) {
    return 'error';
  }
  if (input.orders.length === 0) {
    return 'empty';
  }
  return 'success';
}
