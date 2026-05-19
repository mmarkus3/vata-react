import { hasOrderProductLines } from '@/app/order/orderDetailProductsState';

describe('orderDetailProductsState', () => {
  it('returns true when order has one or more product lines', () => {
    expect(hasOrderProductLines([{ id: 'p1', name: 'Milk', amount: 2 }])).toBe(true);
  });

  it('returns false for empty or missing product lines', () => {
    expect(hasOrderProductLines([])).toBe(false);
    expect(hasOrderProductLines(undefined)).toBe(false);
    expect(hasOrderProductLines(null)).toBe(false);
  });
});
