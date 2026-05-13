import { Product } from '@/types/product';

export interface AddProductFormValues {
  showInWebshop: boolean;
  category: string;
  name: string;
  countryOfOrigin: string;
  ingredients_fi: string;
  ingredients_sv: string;
  ingredients_en: string;
  description_fi: string;
  description_sv: string;
  description_en: string;
  amount: string;
  price: string;
  retailPrice: string;
  unitPrice: string;
  energyJoule: string;
  energyCalory: string;
  fat: string;
  saturatedFat: string;
  carbohydrate: string;
  saturatedCarbohydrate: string;
  protein: string;
  salt: string;
  fiber: string;
  barcode: string;
  ean: string;
}

export const nutritionFieldKeys = [
  'energyJoule',
  'energyCalory',
  'fat',
  'saturatedFat',
  'carbohydrate',
  'saturatedCarbohydrate',
  'protein',
  'salt',
  'fiber',
] as const;

export type NutritionFieldKey = (typeof nutritionFieldKeys)[number];

export const defaultAddProductFormValues: AddProductFormValues = {
  showInWebshop: false,
  category: '',
  name: '',
  countryOfOrigin: '',
  ingredients_fi: '',
  ingredients_sv: '',
  ingredients_en: '',
  description_fi: '',
  description_sv: '',
  description_en: '',
  amount: '',
  price: '',
  retailPrice: '',
  unitPrice: '',
  energyJoule: '',
  energyCalory: '',
  fat: '',
  saturatedFat: '',
  carbohydrate: '',
  saturatedCarbohydrate: '',
  protein: '',
  salt: '',
  fiber: '',
  barcode: '',
  ean: '',
};

export const parseOptionalDecimal = (raw: string): number | null => {
  const trimmed = raw.trim();
  if (!trimmed) {
    return null;
  }

  return Number(trimmed.replace(',', '.'));
};

export const isNonNegativeNumber = (raw: string): boolean => {
  const value = Number(raw.trim().replace(',', '.'));
  return !Number.isNaN(value) && value >= 0;
};

export const isRequiredNonNegativeNumber = (raw: string): boolean => {
  if (!raw.trim()) {
    return false;
  }

  return isNonNegativeNumber(raw);
};

export const buildNutritionValues = (
  values: AddProductFormValues
):
  Pick<
    Product,
    | 'energyJoule'
    | 'energyCalory'
    | 'fat'
    | 'saturatedFat'
    | 'carbohydrate'
    | 'saturatedCarbohydrate'
    | 'protein'
    | 'salt'
    | 'fiber'
  > => {
  return Object.fromEntries(
    nutritionFieldKeys.map((key) => [key, parseOptionalDecimal(values[key])])
  ) as
    Pick<
      Product,
      | 'energyJoule'
      | 'energyCalory'
      | 'fat'
      | 'saturatedFat'
      | 'carbohydrate'
      | 'saturatedCarbohydrate'
      | 'protein'
      | 'salt'
      | 'fiber'
    >;
};
