import type { Product } from '@/types/product';

export type AssignmentCandidatesState = 'loading' | 'empty' | 'ready';

export function getAssignmentCandidatesState(args: {
  isLoadingCandidates: boolean;
  filteredProducts: Product[];
}): AssignmentCandidatesState {
  if (args.isLoadingCandidates) {
    return 'loading';
  }

  if (args.filteredProducts.length === 0) {
    return 'empty';
  }

  return 'ready';
}

export function isAssignmentSubmitDisabled(args: {
  selectedCount: number;
  isAssigningProducts: boolean;
}): boolean {
  return args.selectedCount === 0 || args.isAssigningProducts;
}
