import type { Category } from '@/types/category';

export interface ProductCategoryOption {
  value: string;
  label: string;
  isFallback?: boolean;
}

export const buildProductCategoryOptions = (
  categories: Category[],
  selectedCategory?: string | null
): ProductCategoryOption[] => {
  const uniqueByName = new Map<string, ProductCategoryOption>();

  for (const category of categories) {
    const value = category.name.trim();
    if (!value) continue;

    if (!uniqueByName.has(value)) {
      uniqueByName.set(value, {
        value,
        label: value,
      });
    }
  }

  const options = Array.from(uniqueByName.values()).sort((a, b) => a.label.localeCompare(b.label));

  const normalizedSelected = selectedCategory?.trim();
  if (normalizedSelected && !uniqueByName.has(normalizedSelected)) {
    options.unshift({
      value: normalizedSelected,
      label: normalizedSelected,
      isFallback: true,
    });
  }

  return options;
};
