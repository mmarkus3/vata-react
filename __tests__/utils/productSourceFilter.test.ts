import { filterProductsBySource } from '@/utils/productSourceFilter';

describe('filterProductsBySource', () => {
  const products = [
    { id: 'p1', name: 'A', ean: '111', amount: 1, company: 'c', barcode: '', price: 10 },
    { id: 'p2', name: 'B', ean: '222', amount: 1, company: 'c', barcode: '', price: 20 },
    { id: 'p3', name: 'C', ean: '333', amount: 1, company: 'c', barcode: '', price: 30 },
  ];

  it('returns only client fullfilment products by default source', () => {
    const result = filterProductsBySource(products, new Set(['p1', 'p3']), 'clientFullfilments');
    expect(result.map((it) => it.id)).toEqual(['p1', 'p3']);
  });

  it('returns all products when source is all products', () => {
    const result = filterProductsBySource(products, new Set(['p1']), 'allProducts');
    expect(result.map((it) => it.id)).toEqual(['p1', 'p2', 'p3']);
  });

  it('returns empty list for client source when no matching history exists', () => {
    const result = filterProductsBySource(products, new Set(), 'clientFullfilments');
    expect(result).toHaveLength(0);
  });
});
