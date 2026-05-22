import { buildFullfilmentDelta } from '@/functions/src/on-item/fullfilment-stock';

describe('fullfilment stock delta builder', () => {
  it('returns create delta as positive consumption', () => {
    const delta = buildFullfilmentDelta(
      [],
      [
        { id: 'p1', amount: 2 },
        { id: 'p2', amount: 1 },
      ]
    );
    expect(Array.from(delta.entries())).toEqual([
      ['p1', 2],
      ['p2', 1],
    ]);
  });

  it('returns delete delta as negative consumption (restore stock)', () => {
    const delta = buildFullfilmentDelta(
      [{ id: 'p1', amount: 3 }],
      []
    );
    expect(Array.from(delta.entries())).toEqual([['p1', -3]]);
  });

  it('returns update delta by difference', () => {
    const delta = buildFullfilmentDelta(
      [
        { id: 'p1', amount: 2 },
        { id: 'p2', amount: 1 },
      ],
      [{ id: 'p1', amount: 5 }]
    );
    expect(Array.from(delta.entries())).toEqual([
      ['p1', 3],
      ['p2', -1],
    ]);
  });
});
