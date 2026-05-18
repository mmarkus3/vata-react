import {
  getLowestRetailPriceLast30Days,
  sanitizeRetailPriceHistory,
  trimRetailPriceHistory,
  MAX_RETAIL_PRICE_HISTORY_ENTRIES,
} from '@/services/productPricing';

describe('product pricing history utilities', () => {
  it('returns null when there is no retail price and no history', () => {
    expect(getLowestRetailPriceLast30Days(null, [], new Date('2026-05-18T00:00:00.000Z'))).toBeNull();
  });

  it('includes current retail price and in-window history in lowest calculation', () => {
    const result = getLowestRetailPriceLast30Days(
      5.5,
      [
        { price: 6.2, changedAt: '2026-05-10T12:00:00.000Z' },
        { price: 4.9, changedAt: '2026-05-01T12:00:00.000Z' },
      ],
      new Date('2026-05-18T00:00:00.000Z')
    );

    expect(result).toBe(4.9);
  });

  it('ignores out-of-window history entries', () => {
    const result = getLowestRetailPriceLast30Days(
      5.5,
      [{ price: 3.9, changedAt: '2026-01-01T12:00:00.000Z' }],
      new Date('2026-05-18T00:00:00.000Z')
    );

    expect(result).toBe(5.5);
  });

  it('sanitizes malformed history entries', () => {
    const sanitized = sanitizeRetailPriceHistory([
      { price: 6.2, changedAt: '2026-05-10T12:00:00.000Z' },
      { price: 'bad', changedAt: '2026-05-11T12:00:00.000Z' },
      { price: 5.7, changedAt: 'invalid-date' },
    ]);

    expect(sanitized).toEqual([{ price: 6.2, changedAt: '2026-05-10T12:00:00.000Z' }]);
  });

  it('trims history entries to retention limit', () => {
    const entries = Array.from({ length: MAX_RETAIL_PRICE_HISTORY_ENTRIES + 5 }).map((_, index) => ({
      price: index,
      changedAt: new Date(2026, 0, 1 + index).toISOString(),
    }));

    const trimmed = trimRetailPriceHistory(entries);
    expect(trimmed).toHaveLength(MAX_RETAIL_PRICE_HISTORY_ENTRIES);
    expect(trimmed[0]?.price).toBe(5);
  });
});
