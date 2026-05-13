import type { Path } from 'react-hook-form';

import type { AddProductFormValues } from '@/components/home/addProductForm';

export type AddProductSectionKey = 'basic' | 'price' | 'nutritions';

export const sectionFields: Record<AddProductSectionKey, Path<AddProductFormValues>[]> = {
  basic: ['category', 'name', 'amount', 'ean', 'barcode'],
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
