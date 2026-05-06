import { mapSelectedLinesToFullfilmentProducts, parseLinePrice } from '@/utils/fullfilmentLinePrice';

describe('fullfilment line price utils', () => {
  it('parses valid default/edited prices', () => {
    expect(parseLinePrice('12.5')).toBe(12.5);
    expect(parseLinePrice('12,5')).toBe(12.5);
    expect(parseLinePrice('0')).toBe(0);
  });

  it('rejects invalid prices', () => {
    expect(parseLinePrice('')).toBeNull();
    expect(parseLinePrice('abc')).toBeNull();
    expect(parseLinePrice('-1')).toBeNull();
  });

  it('maps edited line price into fullfilment payload product price', () => {
    const result = mapSelectedLinesToFullfilmentProducts([
      {
        amount: '3',
        price: '19.9',
        product: { id: 'p1', name: 'Tuote', ean: '123', amount: 10, company: 'c1', barcode: '', price: 10 },
      },
    ]);

    expect(result[0].product.price).toBe(19.9);
    expect(result[0].amount).toBe(3);
  });
});
