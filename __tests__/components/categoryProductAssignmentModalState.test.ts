import { getAssignmentCandidatesState, isAssignmentSubmitDisabled } from '@/app/category/categoryProductAssignmentModalState';

describe('categoryProductAssignmentModalState', () => {
  it('resolves candidate state correctly', () => {
    expect(getAssignmentCandidatesState({ isLoadingCandidates: true, filteredProducts: [] as any[] })).toBe('loading');
    expect(getAssignmentCandidatesState({ isLoadingCandidates: false, filteredProducts: [] as any[] })).toBe('empty');
    expect(getAssignmentCandidatesState({ isLoadingCandidates: false, filteredProducts: [{ id: '1' } as any] })).toBe('ready');
  });

  it('disables submit when assigning or nothing selected', () => {
    expect(isAssignmentSubmitDisabled({ selectedCount: 0, isAssigningProducts: false })).toBe(true);
    expect(isAssignmentSubmitDisabled({ selectedCount: 2, isAssigningProducts: true })).toBe(true);
    expect(isAssignmentSubmitDisabled({ selectedCount: 2, isAssigningProducts: false })).toBe(false);
  });
});
