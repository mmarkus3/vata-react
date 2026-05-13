import type { Path } from 'react-hook-form';

import type { ProductDetailFormValues } from '@/app/product/productDetailForm';

export type ProductDetailSectionKey = 'basic' | 'additionalInfo' | 'price' | 'nutritions';

export const productDetailSectionFields: Record<ProductDetailSectionKey, Path<ProductDetailFormValues>[]> = {
  basic: [
    'barcode',
    'category',
    'name',
    'countryOfOrigin',
    'amount',
    'ean',
  ],
  additionalInfo: [
    'ingredients_fi',
    'ingredients_sv',
    'ingredients_en',
    'description_fi',
    'description_sv',
    'description_en',
  ],
  price: ['price', 'retailPrice', 'unitPrice'],
  nutritions: [
    'energyJoule',
    'energyCalory',
    'fat',
    'saturatedFat',
    'carbohydrate',
    'saturatedCarbohydrate',
    'protein',
    'salt',
    'fiber',
  ],
};

export const getSectionForField = (field: Path<ProductDetailFormValues>): ProductDetailSectionKey | null => {
  for (const [section, fields] of Object.entries(productDetailSectionFields) as [ProductDetailSectionKey, Path<ProductDetailFormValues>[]][]) {
    if (fields.includes(field)) {
      return section;
    }
  }

  return null;
};
