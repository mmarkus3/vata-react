import { getOrderListState } from '@/app/order/orderListState';

describe('orderListState', () => {
  it('returns loading while fetching orders', () => {
    expect(getOrderListState({ isLoading: true, error: null, orders: [] })).toBe('loading');
  });

  it('returns error when fetch fails', () => {
    expect(getOrderListState({ isLoading: false, error: 'Boom', orders: [] })).toBe('error');
  });

  it('returns empty when loaded with no orders', () => {
    expect(getOrderListState({ isLoading: false, error: null, orders: [] })).toBe('empty');
  });

  it('returns success when orders exist', () => {
    expect(
      getOrderListState({
        isLoading: false,
        error: null,
        orders: [{ id: 'o1', company: 'c1', status: 'pending', products: [] }],
      })
    ).toBe('success');
  });
});
