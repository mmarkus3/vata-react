import { getCategoryDetailProductsState } from '@/app/category/categoryDetailState';

describe('categoryDetailState', () => {
  it('returns loading when product query is loading', () => {
    expect(getCategoryDetailProductsState({ isLoadingProducts: true, error: null, products: [] })).toBe('loading');
  });

  it('returns error when error exists and not loading', () => {
    expect(getCategoryDetailProductsState({ isLoadingProducts: false, error: 'Boom', products: [] })).toBe('error');
  });

  it('returns empty when loaded and no products', () => {
    expect(getCategoryDetailProductsState({ isLoadingProducts: false, error: null, products: [] })).toBe('empty');
  });

  it('returns success when products exist', () => {
    expect(
      getCategoryDetailProductsState({
        isLoadingProducts: false,
        error: null,
        products: [{ id: 'p-1', name: 'Milk' } as any],
      })
    ).toBe('success');
  });
});
