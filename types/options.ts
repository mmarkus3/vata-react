export interface Options {
  currencyRate?: { currency: string, date: string, rate: number };
  delivery: number;
  email: string;
  over: number;
  vat: number;
  vismapay?: { apiKey: string; privateKey: string };
}