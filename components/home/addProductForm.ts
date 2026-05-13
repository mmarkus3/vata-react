import { Product } from '@/types/product';

export interface AddProductFormValues {
  name: string;
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
  name: '',
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

export const parseOptionalDecimal = (raw: string): number | undefined => {
  const trimmed = raw.trim();
  if (!trimmed) {
    return undefined;
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
): Partial<
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
  >
> => {
  return Object.fromEntries(
    nutritionFieldKeys.map((key) => [key, parseOptionalDecimal(values[key])])
  ) as Partial<
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
    >
  >;
};
