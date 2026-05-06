import type { Product } from '@/types/product';

export type ProductSource = 'clientFullfilments' | 'allProducts';

export function filterProductsBySource(products: Product[], clientUsedProductIds: Set<string>, source: number): Product[] {
  if (source === 1) {
    return products;
  }

  return products.filter((product) => !!product.id && clientUsedProductIds.has(product.id));
}
