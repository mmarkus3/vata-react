import { createProductCategoryMigrationPlan, resolveLegacyCategoryReferenceToId } from '@/services/productCategoryMigration';

const categories = [
  { id: 'cat-1', name: 'Dairy', description: '', company: 'co-1' },
  { id: 'cat-2', name: 'Bakery', description: '', company: 'co-1' },
];

describe('productCategoryMigration', () => {
  it('resolves name and id references', () => {
    expect(resolveLegacyCategoryReferenceToId(categories as any, 'Dairy')).toBe('cat-1');
    expect(resolveLegacyCategoryReferenceToId(categories as any, 'cat-2')).toBe('cat-2');
    expect(resolveLegacyCategoryReferenceToId(categories as any, 'Unknown')).toBeNull();
  });

  it('creates migration plan with migrated, unresolved, and skip statuses', () => {
    const plan = createProductCategoryMigrationPlan(
      [
        { id: 'p1', category: 'Dairy' },
        { id: 'p2', category: 'cat-2' },
        { id: 'p3', category: 'Unknown' },
        { id: 'p4', category: '' },
      ] as any,
      categories as any
    );

    expect(plan).toEqual([
      { productId: 'p1', currentReference: 'Dairy', nextReference: 'cat-1', status: 'migrated' },
      { productId: 'p2', currentReference: 'cat-2', nextReference: 'cat-2', status: 'skip' },
      { productId: 'p3', currentReference: 'Unknown', nextReference: null, status: 'unresolved' },
      { productId: 'p4', currentReference: '', nextReference: null, status: 'skip' },
    ]);
  });
});
