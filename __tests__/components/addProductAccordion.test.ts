import { getSectionForField } from '@/components/home/addProductAccordion';

describe('addProductAccordion', () => {
  it('maps basic section fields', () => {
    expect(getSectionForField('name')).toBe('basic');
    expect(getSectionForField('amount')).toBe('basic');
    expect(getSectionForField('ean')).toBe('basic');
    expect(getSectionForField('category')).toBe('basic');
    expect(getSectionForField('countryOfOrigin')).toBe('basic');
  });

  it('maps additional info section fields', () => {
    expect(getSectionForField('ingredients_fi')).toBe('additionalInfo');
    expect(getSectionForField('ingredients_sv')).toBe('additionalInfo');
    expect(getSectionForField('ingredients_en')).toBe('additionalInfo');
    expect(getSectionForField('description_fi')).toBe('additionalInfo');
    expect(getSectionForField('description_sv')).toBe('additionalInfo');
    expect(getSectionForField('description_en')).toBe('additionalInfo');
  });

  it('maps price and nutrition section fields', () => {
    expect(getSectionForField('price')).toBe('price');
    expect(getSectionForField('retailPrice')).toBe('price');
    expect(getSectionForField('energyJoule')).toBe('nutritions');
    expect(getSectionForField('fiber')).toBe('nutritions');
  });
});
