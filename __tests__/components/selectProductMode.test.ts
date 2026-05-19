import { filterProductsBySource } from '@/utils/productSourceFilter';

describe('selectProduct integrations', () => {
  const products = [
    { id: 'p1', name: 'Milk', ean: '111', amount: 5 },
    { id: 'p2', name: 'Bread', ean: '222', amount: 3 },
  ] as any[];

  it('keeps campaign mode product list untouched when source filter is disabled', () => {
    expect(products.length).toBe(2);
  });

  it('still supports existing source filtering utility for legacy single mode', () => {
    const used = new Set(['p1']);
    expect(filterProductsBySource(products as any, used, 0).map((p: any) => p.id)).toEqual(['p1']);
    expect(filterProductsBySource(products as any, used, 1).map((p: any) => p.id)).toEqual(['p1', 'p2']);
  });
});
