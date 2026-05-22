import { buildStockUpdatesByDelta, buildStockUpdatesFromLines } from '@/functions/src/stock/stock-adjust';

describe('shared stock adjust utility', () => {
  it('builds updates from line amounts', () => {
    const updates = buildStockUpdatesFromLines(
      [
        { id: 'p1', amount: 2 },
        { id: 'p2', amount: 1 },
      ],
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

  it('builds updates from explicit delta map (supports increments)', () => {
    const delta = new Map<string, number>([
      ['p1', 3],
      ['p2', -2],
    ]);
    const updates = buildStockUpdatesByDelta(delta, [
      { id: 'p1', amount: 10 },
      { id: 'p2', amount: 5 },
    ]);
    expect(updates).toEqual([
      { id: 'p1', nextAmount: 7 },
      { id: 'p2', nextAmount: 7 },
    ]);
  });
});
