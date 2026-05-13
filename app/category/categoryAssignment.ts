import type { Product } from '@/types/product';

export function getAssignableProducts(products: Product[], activeCategoryName: string): Product[] {
  const normalizedCategory = activeCategoryName.trim();
  if (!normalizedCategory) {
    return products;
  }

  return products.filter((product) => (product.category ?? '') !== normalizedCategory);
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
