import { getAssignableProducts, getCategoryAssignmentStatus } from '@/app/category/categoryAssignment';

describe('categoryAssignment helpers', () => {
  it('filters out products already assigned to active category', () => {
    const products = [
      { id: '1', name: 'Milk', category: 'Dairy' },
      { id: '2', name: 'Bread', category: 'Bakery' },
      { id: '3', name: 'Butter', category: 'Dairy' },
    ] as any;

    const result = getAssignableProducts(products, 'Dairy');

    expect(result).toEqual([{ id: '2', name: 'Bread', category: 'Bakery' }]);
  });

  it('returns all products when active category is empty', () => {
    const products = [{ id: '1', name: 'Milk', category: 'Dairy' }] as any;
    expect(getAssignableProducts(products, '  ')).toEqual(products);
  });

  it('resolves assignment status precedence correctly', () => {
    expect(
      getCategoryAssignmentStatus({
        isAssigningProducts: true,
        assignmentError: 'error',
        assignmentSuccess: 'ok',
      })
    ).toBe('assigning');

    expect(
      getCategoryAssignmentStatus({
        isAssigningProducts: false,
        assignmentError: 'error',
        assignmentSuccess: 'ok',
      })
    ).toBe('error');

    expect(
      getCategoryAssignmentStatus({
        isAssigningProducts: false,
        assignmentError: null,
        assignmentSuccess: 'ok',
      })
    ).toBe('success');

    expect(
      getCategoryAssignmentStatus({
        isAssigningProducts: false,
        assignmentError: null,
        assignmentSuccess: null,
      })
    ).toBe('idle');
  });
});
