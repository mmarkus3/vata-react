export interface RetailPriceHistoryEntry {
  price: number;
  changedAt: string;
}

const THIRTY_DAYS_IN_MS = 30 * 24 * 60 * 60 * 1000;
export const MAX_RETAIL_PRICE_HISTORY_ENTRIES = 120;

const toValidDate = (value: string): Date | null => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const sanitizeRetailPriceHistory = (history: unknown): RetailPriceHistoryEntry[] => {
  if (!Array.isArray(history)) {
    return [];
  }

  return history
    .map((entry) => {
      if (!entry || typeof entry !== 'object') {
        return null;
      }
      const rawPrice = (entry as { price?: unknown }).price;
      const rawChangedAt = (entry as { changedAt?: unknown }).changedAt;
      const price = typeof rawPrice === 'number' ? rawPrice : Number(rawPrice);
      if (!Number.isFinite(price)) {
        return null;
      }
      if (typeof rawChangedAt !== 'string') {
        return null;
      }
      const parsedDate = toValidDate(rawChangedAt);
      if (!parsedDate) {
        return null;
      }
      return {
        price,
        changedAt: parsedDate.toISOString(),
      };
    })
    .filter((entry): entry is RetailPriceHistoryEntry => entry !== null)
    .sort((a, b) => new Date(a.changedAt).getTime() - new Date(b.changedAt).getTime());
};

export const trimRetailPriceHistory = (history: RetailPriceHistoryEntry[]): RetailPriceHistoryEntry[] => {
  if (history.length <= MAX_RETAIL_PRICE_HISTORY_ENTRIES) {
    return history;
  }
  return history.slice(history.length - MAX_RETAIL_PRICE_HISTORY_ENTRIES);
};

export const getLowestRetailPriceLast30Days = (
  retailPrice: number | null | undefined,
  retailPriceHistory: RetailPriceHistoryEntry[],
  now: Date = new Date()
): number | null => {
  const threshold = now.getTime() - THIRTY_DAYS_IN_MS;
  const candidates: number[] = [];

  if (typeof retailPrice === 'number' && Number.isFinite(retailPrice)) {
    candidates.push(retailPrice);
  }

  for (const entry of retailPriceHistory) {
    const date = toValidDate(entry.changedAt);
    if (!date) {
      continue;
    }
    if (date.getTime() >= threshold) {
      candidates.push(entry.price);
    }
  }

  if (candidates.length === 0) {
    return null;
  }

  return Math.min(...candidates);
};
