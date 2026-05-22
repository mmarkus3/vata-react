import { buildPaidOrderStockUpdates } from '@/functions/src/on-item/order-status';

describe('paid order stock decrement helpers', () => {
  it('builds decrements for multiple paid order lines', () => {
    const updates = buildPaidOrderStockUpdates(
      [
        { id: 'p1', name: 'Milk', amount: 2 },
        { id: 'p2', name: 'Bread', amount: 1 },
      ] as any,
      [
        { id: 'p1', amount: 10 },
        { id: 'p2', amount: 5 },
      ]
    );

    expect(updates).toEqual([
      { id: 'p1', nextAmount: 8 },
      { id: 'p2', nextAmount: 4 },
    ]);
  });

  it('throws when referenced product is missing', () => {
    expect(() =>
      buildPaidOrderStockUpdates(
        [{ id: 'p1', name: 'Milk', amount: 2 }] as any,
        [{ id: 'p2', amount: 5 }]
      )
    ).toThrow('Product not found: p1');
  });

  it('throws when stock is insufficient', () => {
    expect(() =>
      buildPaidOrderStockUpdates(
        [{ id: 'p1', name: 'Milk', amount: 6 }] as any,
        [{ id: 'p1', amount: 5 }]
      )
    ).toThrow('Insufficient stock for product p1');
  });

  it('aggregates duplicate product lines before decrement', () => {
    const updates = buildPaidOrderStockUpdates(
      [
        { id: 'p1', name: 'Milk', amount: 2 },
        { id: 'p1', name: 'Milk', amount: 3 },
      ] as any,
      [{ id: 'p1', amount: 10 }]
    );
    expect(updates).toEqual([{ id: 'p1', nextAmount: 5 }]);
  });
});
