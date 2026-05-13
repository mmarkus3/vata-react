import { getSectionForField } from '@/components/home/addProductAccordion';

describe('addProductAccordion', () => {
  it('maps basic section fields', () => {
    expect(getSectionForField('name')).toBe('basic');
    expect(getSectionForField('amount')).toBe('basic');
    expect(getSectionForField('ean')).toBe('basic');
    expect(getSectionForField('category')).toBe('basic');
  });

  it('maps price and nutrition section fields', () => {
    expect(getSectionForField('price')).toBe('price');
    expect(getSectionForField('retailPrice')).toBe('price');
    expect(getSectionForField('energyJoule')).toBe('nutritions');
    expect(getSectionForField('fiber')).toBe('nutritions');
  });
});
