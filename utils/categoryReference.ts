import type { Category } from '@/types/category';

export function resolveCategoryIdFromReference(categories: Category[], reference?: string | null): string {
  const normalizedReference = reference?.trim() ?? '';
  if (!normalizedReference) {
    return '';
  }

  const byId = categories.find((category) => category.id === normalizedReference);
  if (byId?.id) {
    return byId.id;
  }

  const byName = categories.find((category) => category.name.trim() === normalizedReference);
  return byName?.id ?? normalizedReference;
}

export function getCategoryLabelFromReference(categories: Category[], reference?: string | null): string {
  const normalizedReference = reference?.trim() ?? '';
  if (!normalizedReference) {
    return '';
  }

  const byId = categories.find((category) => category.id === normalizedReference);
  if (byId) {
    return byId.name;
  }

  const byName = categories.find((category) => category.name.trim() === normalizedReference);
  if (byName) {
    return byName.name;
  }

  return normalizedReference;
}
