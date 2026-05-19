import type { Order } from '@/types/order';

export type OrderListState = 'loading' | 'error' | 'empty' | 'success';

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
