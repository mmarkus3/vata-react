import {
  buildNutritionValues,
  defaultProductDetailFormValues,
  isNonNegativeNumber,
  isRequiredNonNegativeNumber,
  parseOptionalDecimal,
  toProductDetailFormValues,
} from '@/app/product/productDetailForm';

describe('productDetailForm helpers', () => {
  it('parses optional decimal values', () => {
    expect(parseOptionalDecimal('')).toBeNull();
    expect(parseOptionalDecimal('12,5')).toBe(12.5);
    expect(parseOptionalDecimal('12.5')).toBe(12.5);
  });

  it('validates optional and required non-negative numeric values', () => {
    expect(isNonNegativeNumber('')).toBe(true);
    expect(isNonNegativeNumber('10,2')).toBe(true);
    expect(isNonNegativeNumber('-1')).toBe(false);

    expect(isRequiredNonNegativeNumber('')).toBe(false);
    expect(isRequiredNonNegativeNumber('0')).toBe(true);
    expect(isRequiredNonNegativeNumber('abc')).toBe(false);
  });

  it('maps nutrition fields for payload', () => {
    const mapped = buildNutritionValues({
      ...defaultProductDetailFormValues,
      energyJoule: '250',
      energyCalory: '75',
      fat: '1,2',
      saturatedFat: '0,3',
      carbohydrate: '14',
      saturatedCarbohydrate: '11',
      protein: '4',
      salt: '0,7',
      fiber: '',
    });

    expect(mapped).toEqual({
      energyJoule: 250,
      energyCalory: 75,
      fat: 1.2,
      saturatedFat: 0.3,
      carbohydrate: 14,
      saturatedCarbohydrate: 11,
      protein: 4,
      salt: 0.7,
      fiber: null,
    });
  });

  it('builds form defaults from product and clears barcode input when barcode is image URL', () => {
    const values = toProductDetailFormValues({
      name: 'Milk',
      category: 'Dairy',
      amount: 5,
      company: 'company-1',
      ean: '123',
      barcode: 'https://example.com/barcode.png',
      price: 1.99,
      images: [],
      retailPrice: 2.5,
      unitPrice: 3.5,
      energyJoule: 100,
      energyCalory: 50,
      fat: 1,
      saturatedFat: 0.2,
      carbohydrate: 10,
      saturatedCarbohydrate: 8,
      protein: 3,
      salt: 0.5,
      fiber: 0.1,
      countryOfOrigin: 'Finland',
      ingredients_fi: 'maito, suola',
      ingredients_sv: 'mjolk, salt',
      ingredients_en: 'milk, salt',
      description_fi: 'Kotimainen maito',
      description_sv: 'Inhemsk mjolk',
      description_en: 'Domestic milk',
    });

    expect(values.name).toBe('Milk');
    expect(values.category).toBe('Dairy');
    expect(values.price).toBe('1.99');
    expect(values.amount).toBe('5');
    expect(values.barcode).toBe('');
    expect(values.retailPrice).toBe('2.5');
    expect(values.energyJoule).toBe('100');
    expect(values.countryOfOrigin).toBe('Finland');
    expect(values.ingredients_fi).toBe('maito, suola');
    expect(values.ingredients_sv).toBe('mjolk, salt');
    expect(values.ingredients_en).toBe('milk, salt');
    expect(values.description_fi).toBe('Kotimainen maito');
    expect(values.description_sv).toBe('Inhemsk mjolk');
    expect(values.description_en).toBe('Domestic milk');
  });
});
