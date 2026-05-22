import { firestore } from 'firebase-admin';
import { Options } from '../options/options.interface';
import { Currency } from './currency.interface';

const api = 'https://api.frankfurter.dev/v2/rate/eur/sek';
const RATE_CURRENCY = 'EUR_SEK';

const getCurrentDateKey = (now: Date = new Date()): string => now.toISOString().slice(0, 10);

const getCachedRate = (options: any, today: string): number | null => {
  const cache = options?.currencyRate;
  if (!cache || typeof cache !== 'object') return null;
  if (cache.date !== today || cache.currency !== RATE_CURRENCY) return null;
  const rate = typeof cache.rate === 'number' ? cache.rate : Number(cache.rate);
  return Number.isFinite(rate) && rate > 0 ? rate : null;
};

export async function getRate(companyId?: string) {
  if (companyId) {
    const doc = await firestore().doc(`options/${companyId}`).get();
    const options = doc.data() as Options;
    const today = getCurrentDateKey();
    const cachedRate = getCachedRate(options, today);
    if (cachedRate != null) {
      return { date: today, base: 'EUR', quote: 'SEK', rate: cachedRate };
    }
  }

  const response = await fetch(api);
  const data = await response.json() as Currency;

  if (companyId && typeof data?.rate === 'number' && Number.isFinite(data.rate) && data.rate > 0) {
    await firestore().doc(`options/${companyId}`).set(
      {
        currencyRate: {
          date: getCurrentDateKey(),
          currency: RATE_CURRENCY,
          rate: data.rate,
        },
      },
      { merge: true },
    );
  }

  return data;
}
