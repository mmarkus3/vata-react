import type { Path } from 'react-hook-form';

import type { AddProductFormValues } from '@/components/home/addProductForm';

export type AddProductSectionKey = 'basic' | 'additionalInfo' | 'price' | 'nutritions';

export const sectionFields: Record<AddProductSectionKey, Path<AddProductFormValues>[]> = {
  basic: [
    'category',
    'name',
    'countryOfOrigin',
    'amount',
    'ean',
    'barcode',
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

export const getSectionForField = (field: Path<AddProductFormValues>): AddProductSectionKey | null => {
  for (const [section, fields] of Object.entries(sectionFields) as [AddProductSectionKey, Path<AddProductFormValues>[]][]) {
    if (fields.includes(field)) {
      return section;
    }
  }

  return null;
};
