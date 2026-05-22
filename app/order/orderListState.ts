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

const normalize = (value: unknown): string => {
  if (typeof value !== 'string') return '';
  return value.trim().toLowerCase();
};

const getCustomerSearchText = (order: Order): string => {
  const firstName = normalize(order.customer?.firstname);
  const lastName = normalize(order.customer?.lastname);
  const fullName = `${firstName} ${lastName}`.trim();
  const email = normalize(order.customer?.email);
  return `${firstName} ${lastName} ${fullName} ${email}`.trim();
};

const filterBySegmentAndSort = (orders: Order[], segment: OrderSegment): Order[] => {
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
};

export function getSegmentedOrders(orders: Order[], segment: OrderSegment): Order[] {
  return filterBySegmentAndSort(orders, segment);
}

export function getFilteredSegmentedOrders(orders: Order[], segment: OrderSegment, query: string): Order[] {
  const segmented = filterBySegmentAndSort(orders, segment);
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) {
    return segmented;
  }

  return segmented.filter((order) => {
    const orderId = normalize(order.id ?? '');
    const customerText = getCustomerSearchText(order);
    return orderId.includes(normalizedQuery) || customerText.includes(normalizedQuery);
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
