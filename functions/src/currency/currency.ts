import { Currency } from './currency.interface';

const api = 'https://api.frankfurter.dev/v2/rate/eur/sek';

export async function getRate() {
  const response = await fetch(api);
  const data = await response.json() as Currency;
  return data;
}