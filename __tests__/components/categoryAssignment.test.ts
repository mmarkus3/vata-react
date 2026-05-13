import { filterProductsByName, getAssignableProducts, getCategoryAssignmentStatus } from '@/app/category/categoryAssignment';

describe('categoryAssignment helpers', () => {
  it('filters out products already assigned to active category', () => {
    const products = [
      { id: '1', name: 'Milk', category: 'cat-1' },
      { id: '2', name: 'Bread', category: 'cat-2' },
      { id: '3', name: 'Butter', category: 'Dairy' },
    ] as any;

    const result = getAssignableProducts(products, 'cat-1', 'Dairy');

    expect(result).toEqual([{ id: '2', name: 'Bread', category: 'cat-2' }]);
  });

  it('returns all products when active category id and legacy name are empty', () => {
    const products = [{ id: '1', name: 'Milk', category: 'Dairy' }] as any;
    expect(getAssignableProducts(products, '  ', '  ')).toEqual(products);
  });

  it('filters products by name case-insensitively', () => {
    const products = [
      { id: '1', name: 'Organic Milk' },
      { id: '2', name: 'Bread' },
      { id: '3', name: 'Almond milk' },
    ] as any;

    expect(filterProductsByName(products, 'milk')).toEqual([
      { id: '1', name: 'Organic Milk' },
      { id: '3', name: 'Almond milk' },
    ]);
    expect(filterProductsByName(products, '   ')).toEqual(products);
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
