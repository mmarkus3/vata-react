import type { Category } from '@/types/category';
import { getCategoryLabelFromReference, resolveCategoryIdFromReference } from '@/utils/categoryReference';

export interface ProductCategoryOption {
  value: string;
  label: string;
  isFallback?: boolean;
}

export const buildProductCategoryOptions = (
  categories: Category[],
  selectedCategory?: string | null
): ProductCategoryOption[] => {
  const uniqueById = new Map<string, ProductCategoryOption>();

  for (const category of categories) {
    const value = category.id?.trim();
    const label = category.name.trim();
    if (!value || !label) continue;

    if (!uniqueById.has(value)) {
      uniqueById.set(value, {
        value,
        label,
      });
    }
  }

  const options = Array.from(uniqueById.values()).sort((a, b) => a.label.localeCompare(b.label));

  const normalizedSelected = resolveCategoryIdFromReference(categories, selectedCategory);
  if (normalizedSelected && !uniqueById.has(normalizedSelected)) {
    options.unshift({
      value: normalizedSelected,
      label: getCategoryLabelFromReference(categories, selectedCategory),
      isFallback: true,
    });
  }

  return options;
};
