import type { Category } from '@/types/category';
import type { Product } from '@/types/product';

export interface ProductCategoryMigrationResult {
  productId: string;
  currentReference: string;
  nextReference: string | null;
  status: 'migrated' | 'unresolved' | 'skip';
}

export function resolveLegacyCategoryReferenceToId(
  categories: Category[],
  categoryReference: string | undefined | null
): string | null {
  const normalizedReference = categoryReference?.trim() ?? '';
  if (!normalizedReference) {
    return null;
  }

  const byId = categories.find((category) => category.id === normalizedReference);
  if (byId?.id) {
    return byId.id;
  }

  const byName = categories.find((category) => category.name.trim() === normalizedReference);
  return byName?.id ?? null;
}

export function createProductCategoryMigrationPlan(products: Product[], categories: Category[]): ProductCategoryMigrationResult[] {
  return products.map((product) => {
    const productId = product.id ?? '';
    const currentReference = product.category?.trim() ?? '';

    if (!productId || !currentReference) {
      return {
        productId,
        currentReference,
        nextReference: null,
        status: 'skip',
      };
    }

    const nextReference = resolveLegacyCategoryReferenceToId(categories, currentReference);
    if (!nextReference) {
      return {
        productId,
        currentReference,
        nextReference: null,
        status: 'unresolved',
      };
    }

    if (nextReference === currentReference) {
      return {
        productId,
        currentReference,
        nextReference,
        status: 'skip',
      };
    }

    return {
      productId,
      currentReference,
      nextReference,
      status: 'migrated',
    };
  });
}
