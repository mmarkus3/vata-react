import type { OrderProduct } from '@/types/order';

export const hasOrderProductLines = (products: OrderProduct[] | null | undefined): boolean =>
  Array.isArray(products) && products.length > 0;
