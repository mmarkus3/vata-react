import {
  buildNutritionValues,
  defaultAddProductFormValues,
  isNonNegativeNumber,
  isRequiredNonNegativeNumber,
  parseOptionalDecimal,
} from '@/components/home/addProductForm';

describe('addProductForm helpers', () => {
  it('validates optional non-negative numeric values correctly', () => {
    expect(isNonNegativeNumber('0')).toBe(true);
    expect(isNonNegativeNumber('12.5')).toBe(true);
    expect(isNonNegativeNumber('12,5')).toBe(true);
    expect(isNonNegativeNumber('')).toBe(true);
    expect(isNonNegativeNumber('-1')).toBe(false);
    expect(isNonNegativeNumber('abc')).toBe(false);
  });

  it('validates required non-negative numeric values correctly', () => {
    expect(isRequiredNonNegativeNumber('0')).toBe(true);
    expect(isRequiredNonNegativeNumber(' 2,2 ')).toBe(true);
    expect(isRequiredNonNegativeNumber('')).toBe(false);
    expect(isRequiredNonNegativeNumber('-1')).toBe(false);
    expect(isRequiredNonNegativeNumber('abc')).toBe(false);
  });

  it('parses optional decimals with comma and empty values', () => {
    expect(parseOptionalDecimal('')).toBeNull();
    expect(parseOptionalDecimal('  ')).toBeNull();
    expect(parseOptionalDecimal('12,4')).toBe(12.4);
    expect(parseOptionalDecimal('12.4')).toBe(12.4);
  });

  it('maps nutrition payload fields from form values', () => {
    const nutritionValues = buildNutritionValues({
      ...defaultAddProductFormValues,
      energyJoule: '220',
      energyCalory: '80',
      fat: '2,5',
      saturatedFat: '0,4',
      carbohydrate: '15',
      saturatedCarbohydrate: '10',
      protein: '3',
      salt: '0,9',
      fiber: '',
    });

    expect(nutritionValues).toEqual({
      energyJoule: 220,
      energyCalory: 80,
      fat: 2.5,
      saturatedFat: 0.4,
      carbohydrate: 15,
      saturatedCarbohydrate: 10,
      protein: 3,
      salt: 0.9,
      fiber: null,
    });
  });

  it('includes multilingual content fields in defaults', () => {
    expect(defaultAddProductFormValues.countryOfOrigin).toBe('');
    expect(defaultAddProductFormValues.ingredients_fi).toBe('');
    expect(defaultAddProductFormValues.ingredients_sv).toBe('');
    expect(defaultAddProductFormValues.ingredients_en).toBe('');
    expect(defaultAddProductFormValues.description_fi).toBe('');
    expect(defaultAddProductFormValues.description_sv).toBe('');
    expect(defaultAddProductFormValues.description_en).toBe('');
  });
});
