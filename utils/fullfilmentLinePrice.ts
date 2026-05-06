import type { Product } from '@/types/product';
import type { FullfilmentProduct } from '@/types/fullfilment';

export interface SelectedFullfilmentLine {
  product: Product;
  amount: string;
  price: string;
}

export function parseLinePrice(value: string): number | null {
  const normalized = value.trim().replace(',', '.');
  if (!normalized) return null;

  const parsed = Number(normalized);
  if (Number.isNaN(parsed) || parsed < 0) return null;

  return parsed;
}

export function mapSelectedLinesToFullfilmentProducts(selectedLines: SelectedFullfilmentLine[]): FullfilmentProduct[] {
  return selectedLines.map((item) => ({
    amount: Number(item.amount),
    product: {
      guid: item.product.id!,
      name: item.product.name,
      ean: item.product.ean,
      price: parseLinePrice(item.price) ?? 0,
    },
  }));
}
