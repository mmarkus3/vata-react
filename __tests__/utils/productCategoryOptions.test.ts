import { buildProductCategoryOptions } from '@/utils/productCategoryOptions';

describe('buildProductCategoryOptions', () => {
  it('returns sorted unique options by category name', () => {
    const options = buildProductCategoryOptions([
      { id: '2', name: 'Beverages', description: '', company: 'c1' },
      { id: '1', name: 'Snacks', description: '', company: 'c1' },
      { id: '3', name: 'Snacks', description: '', company: 'c1' },
    ]);

    expect(options).toEqual([
      { value: 'Beverages', label: 'Beverages' },
      { value: 'Snacks', label: 'Snacks' },
    ]);
  });

  it('prepends fallback option when selected category is stale', () => {
    const options = buildProductCategoryOptions(
      [{ id: '1', name: 'Snacks', description: '', company: 'c1' }],
      'Legacy Category'
    );

    expect(options[0]).toEqual({
      value: 'Legacy Category',
      label: 'Legacy Category',
      isFallback: true,
    });
  });
});
