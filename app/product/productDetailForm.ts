import type { Product } from '@/types/product';

export interface ProductDetailFormValues {
  category: string;
  name: string;
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
  amount: string;
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

export const defaultProductDetailFormValues: ProductDetailFormValues = {
  category: '',
  name: '',
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
  amount: '',
  barcode: '',
  ean: '',
};

export const parseOptionalDecimal = (raw: string): number | null => {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  return Number(trimmed.replace(',', '.'));
};

export const isNonNegativeNumber = (raw: string): boolean => {
  const value = Number(raw.trim().replace(',', '.'));
  return !Number.isNaN(value) && value >= 0;
};

export const isRequiredNonNegativeNumber = (raw: string): boolean => {
  if (!raw.trim()) return false;
  return isNonNegativeNumber(raw);
};

export const toProductDetailFormValues = (product: Product): ProductDetailFormValues => {
  const barcode = /^https?:\/\//i.test(product.barcode) ? '' : product.barcode;

  return {
    category: product.category ?? '',
    name: product.name,
    price: String(product.price),
    retailPrice: product.retailPrice != null ? String(product.retailPrice) : '',
    unitPrice: product.unitPrice != null ? String(product.unitPrice) : '',
    energyJoule: product.energyJoule != null ? String(product.energyJoule) : '',
    energyCalory: product.energyCalory != null ? String(product.energyCalory) : '',
    fat: product.fat != null ? String(product.fat) : '',
    saturatedFat: product.saturatedFat != null ? String(product.saturatedFat) : '',
    carbohydrate: product.carbohydrate != null ? String(product.carbohydrate) : '',
    saturatedCarbohydrate: product.saturatedCarbohydrate != null ? String(product.saturatedCarbohydrate) : '',
    protein: product.protein != null ? String(product.protein) : '',
    salt: product.salt != null ? String(product.salt) : '',
    fiber: product.fiber != null ? String(product.fiber) : '',
    amount: String(product.amount),
    barcode,
    ean: product.ean,
  };
};

export const buildNutritionValues = (
  values: ProductDetailFormValues
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
