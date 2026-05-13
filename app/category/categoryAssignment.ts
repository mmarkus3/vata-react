import type { Product } from '@/types/product';

export function getAssignableProducts(
  products: Product[],
  activeCategoryId: string,
  legacyCategoryName?: string
): Product[] {
  const normalizedCategoryId = activeCategoryId.trim();
  const normalizedLegacyName = legacyCategoryName?.trim() ?? '';
  if (!normalizedCategoryId && !normalizedLegacyName) {
    return products;
  }

  return products.filter((product) => {
    const reference = product.category ?? '';
    return reference !== normalizedCategoryId && (!normalizedLegacyName || reference !== normalizedLegacyName);
  });
}

export function filterProductsByName(products: Product[], searchTerm: string): Product[] {
  const normalizedTerm = searchTerm.trim().toLowerCase();
  if (!normalizedTerm) {
    return products;
  }

  return products.filter((product) => product.name.toLowerCase().includes(normalizedTerm));
}

export type CategoryAssignmentStatus = 'idle' | 'assigning' | 'success' | 'error';

export function getCategoryAssignmentStatus(args: {
  isAssigningProducts: boolean;
  assignmentError: string | null;
  assignmentSuccess: string | null;
}): CategoryAssignmentStatus {
  if (args.isAssigningProducts) {
    return 'assigning';
  }

  if (args.assignmentError) {
    return 'error';
  }

  if (args.assignmentSuccess) {
    return 'success';
  }

  return 'idle';
}
