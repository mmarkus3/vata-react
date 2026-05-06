import type { Product } from '@/types/product';

export type ProductSource = 'clientFullfilments' | 'allProducts';

export function filterProductsBySource(products: Product[], clientUsedProductIds: Set<string>, source: ProductSource): Product[] {
  if (source === 'allProducts') {
    return products;
  }

  return products.filter((product) => !!product.id && clientUsedProductIds.has(product.id));
}
