import type { Product } from '@/types/product';

export type CategoryDetailProductsState = 'loading' | 'error' | 'empty' | 'success';

export function getCategoryDetailProductsState(args: {
  isLoadingProducts: boolean;
  error: string | null;
  products: Product[];
}): CategoryDetailProductsState {
  if (args.isLoadingProducts) {
    return 'loading';
  }

  if (args.error) {
    return 'error';
  }

  if (args.products.length === 0) {
    return 'empty';
  }

  return 'success';
}
