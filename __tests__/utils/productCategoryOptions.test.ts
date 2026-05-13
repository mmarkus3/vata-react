import { buildProductCategoryOptions } from '@/utils/productCategoryOptions';

describe('buildProductCategoryOptions', () => {
  it('returns sorted unique options by category name', () => {
    const options = buildProductCategoryOptions([
      { id: '2', name: 'Beverages', description: '', company: 'c1' },
      { id: '1', name: 'Snacks', description: '', company: 'c1' },
      { id: '3', name: 'Snacks', description: '', company: 'c1' },
    ]);

    expect(options).toEqual([
      { value: '2', label: 'Beverages' },
      { value: '1', label: 'Snacks' },
      { value: '3', label: 'Snacks' },
    ]);
  });

  it('resolves selected legacy category name to id when possible', () => {
    const options = buildProductCategoryOptions(
      [{ id: '1', name: 'Snacks', description: '', company: 'c1' }],
      'Snacks'
    );

    expect(options[0]).toEqual({
      value: '1',
      label: 'Snacks',
    });
  });

  it('prepends fallback option when selected category reference is stale', () => {
    const options = buildProductCategoryOptions(
      [{ id: '1', name: 'Snacks', description: '', company: 'c1' }],
      'legacy-id-or-name'
    );

    expect(options[0]).toEqual({
      value: 'legacy-id-or-name',
      label: 'legacy-id-or-name',
      isFallback: true,
    });
  });
});
