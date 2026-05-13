import { CATEGORY_VALIDATION } from '@/constants/category';
import type { Category } from '@/types/category';
import { deleteItem, getItem, getSnapshotItems, saveItem, updateItem, whereEqual } from './firestore';

const CATEGORIES_COLLECTION = 'categories';

/**
 * Get all categories with real-time listener
 * @param callback Function to call with updated categories array
 * @returns Unsubscribe function to stop listening
 */
export function getAllCategories(companyId: string, cb: (results: Category[]) => void) {
  try {
    return getSnapshotItems<Category>(CATEGORIES_COLLECTION, cb, [whereEqual('company', companyId)]);
  } catch (error) {
    console.error('Error setting up categories listener:', error);
    cb([]);
    return () => { };
  }
};

export async function getCategoryById(id: string): Promise<Category | null> {
  if (!id) {
    throw new Error('Category ID is required');
  }

  try {
    return await getItem<Category>(CATEGORIES_COLLECTION, id);
  } catch (error) {
    console.error('Error fetching category by id:', error);
    throw new Error('Failed to fetch category');
  }
}

/**
 * Create a new category
 * @param name Category name
 * @param description Category description
 * @returns Promise resolving to the new category ID
 * @throws Error if validation fails or save fails
 */
export async function createCategory(name: string, description: string, companyId: string): Promise<string> {
  if (!name || !name.trim()) {
    throw new Error(CATEGORY_VALIDATION.ERRORS.NAME_REQUIRED);
  }

  if (name.trim().length > CATEGORY_VALIDATION.MAX_NAME_LENGTH) {
    throw new Error(CATEGORY_VALIDATION.ERRORS.NAME_TOO_LONG);
  }

  try {
    return await saveItem(CATEGORIES_COLLECTION, {
      name: name.trim(),
      description: description?.trim() || '',
      company: companyId,
      createdAt: new Date(),
      updatedAt: new Date(),

    });
  } catch (error) {
    console.error('Error creating category:', error);
    throw new Error(CATEGORY_VALIDATION.ERRORS.CREATE_FAILED);
  }
};

/**
 * Update an existing category
 * @param id Category ID
 * @param name New category name
 * @param description New category description
 * @throws Error if validation fails or update fails
 */
export async function updateCategory(
  id: string,
  name: string,
  description: string
) {
  if (!id) {
    throw new Error('Category ID is required');
  }

  if (!name || !name.trim()) {
    throw new Error(CATEGORY_VALIDATION.ERRORS.NAME_REQUIRED);
  }

  if (name.trim().length > CATEGORY_VALIDATION.MAX_NAME_LENGTH) {
    throw new Error(CATEGORY_VALIDATION.ERRORS.NAME_TOO_LONG);
  }

  try {
    await updateItem(CATEGORIES_COLLECTION, id, {
      name: name.trim(),
      description: description?.trim() || '',
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error updating category:', error);
    throw new Error(CATEGORY_VALIDATION.ERRORS.UPDATE_FAILED);
  }
};

/**
 * Delete a category
 * @param id Category ID
 * @throws Error if deletion fails
 */
export async function deleteCategory(id: string): Promise<void> {
  if (!id) {
    throw new Error('Category ID is required');
  }

  try {
    await deleteItem(CATEGORIES_COLLECTION, id);
  } catch (error) {
    console.error('Error deleting category:', error);
    throw new Error(CATEGORY_VALIDATION.ERRORS.DELETE_FAILED);
  }
};
