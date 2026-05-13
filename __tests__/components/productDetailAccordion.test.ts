import { getSectionForField } from '@/app/product/productDetailAccordion';

describe('productDetailAccordion', () => {
  it('maps basic section fields', () => {
    expect(getSectionForField('barcode')).toBe('basic');
    expect(getSectionForField('category')).toBe('basic');
    expect(getSectionForField('name')).toBe('basic');
    expect(getSectionForField('amount')).toBe('basic');
    expect(getSectionForField('ean')).toBe('basic');
  });

  it('maps price and nutrition fields', () => {
    expect(getSectionForField('price')).toBe('price');
    expect(getSectionForField('retailPrice')).toBe('price');
    expect(getSectionForField('unitPrice')).toBe('price');
    expect(getSectionForField('energyJoule')).toBe('nutritions');
    expect(getSectionForField('fiber')).toBe('nutritions');
  });
});
