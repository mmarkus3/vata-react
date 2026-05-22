import { getFilteredSegmentedOrders, getOrderListState, getSegmentedOrders } from '@/app/order/orderListState';

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

  it('filters orders by selected segment status', () => {
    const orders = [
      { id: 'o1', company: 'c1', created: new Date('2026-05-20T10:00:00.000Z'), status: 'placed', products: [] },
      { id: 'o2', company: 'c1', created: new Date('2026-05-20T11:00:00.000Z'), status: 'paid', products: [] },
      { id: 'o3', company: 'c1', created: new Date('2026-05-20T12:00:00.000Z'), status: 'sent', products: [] },
      { id: 'o4', company: 'c1', created: new Date('2026-05-20T13:00:00.000Z'), status: 'pending', products: [] },
    ] as any;

    expect(getSegmentedOrders(orders, 'placed').map((item) => item.id)).toEqual(['o1']);
    expect(getSegmentedOrders(orders, 'paid').map((item) => item.id)).toEqual(['o2']);
    expect(getSegmentedOrders(orders, 'sent').map((item) => item.id)).toEqual(['o3']);
  });

  it('sorts segmented orders oldest first', () => {
    const placed = [
      { id: 'o3', company: 'c1', created: new Date('2026-05-20T13:00:00.000Z'), status: 'placed', products: [] },
      { id: 'o1', company: 'c1', created: new Date('2026-05-20T11:00:00.000Z'), status: 'placed', products: [] },
      { id: 'o2', company: 'c1', created: new Date('2026-05-20T12:00:00.000Z'), status: 'placed', products: [] },
    ] as any;

    expect(getSegmentedOrders(placed, 'placed').map((item) => item.id)).toEqual(['o1', 'o2', 'o3']);
  });

  it('filters by order id, customer name, and email case-insensitively', () => {
    const orders = [
      {
        id: 'ORD-1001',
        company: 'c1',
        created: new Date('2026-05-20T10:00:00.000Z'),
        status: 'paid',
        products: [],
        customer: { firstname: 'Ada', lastname: 'Lovelace', email: 'ada@example.com' },
      },
      {
        id: 'ORD-2002',
        company: 'c1',
        created: new Date('2026-05-20T11:00:00.000Z'),
        status: 'paid',
        products: [],
        customer: { firstname: 'Grace', lastname: 'Hopper', email: 'grace@example.com' },
      },
    ] as any;

    expect(getFilteredSegmentedOrders(orders, 'paid', '1001').map((item) => item.id)).toEqual(['ORD-1001']);
    expect(getFilteredSegmentedOrders(orders, 'paid', 'lovelace').map((item) => item.id)).toEqual(['ORD-1001']);
    expect(getFilteredSegmentedOrders(orders, 'paid', 'GRACE@EXAMPLE.COM').map((item) => item.id)).toEqual(['ORD-2002']);
  });

  it('combines segment and query filter and resets when query is empty', () => {
    const orders = [
      {
        id: 'ORD-1001',
        company: 'c1',
        created: new Date('2026-05-20T10:00:00.000Z'),
        status: 'paid',
        products: [],
        customer: { firstname: 'Ada', lastname: 'Lovelace', email: 'ada@example.com' },
      },
      {
        id: 'ORD-1002',
        company: 'c1',
        created: new Date('2026-05-20T09:00:00.000Z'),
        status: 'placed',
        products: [],
        customer: { firstname: 'Ada', lastname: 'Byron', email: 'ab@example.com' },
      },
    ] as any;

    expect(getFilteredSegmentedOrders(orders, 'paid', 'ada').map((item) => item.id)).toEqual(['ORD-1001']);
    expect(getFilteredSegmentedOrders(orders, 'paid', 'missing')).toEqual([]);
    expect(getFilteredSegmentedOrders(orders, 'paid', '   ').map((item) => item.id)).toEqual(['ORD-1001']);
  });
});
