import { deleteCategory as deleteCategoryService, getAllCategories } from '@/services/category';
import type { Category } from '@/types/category';
import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';

/**
 * Custom hook for managing categories
 * Provides real-time category data and mutation functions
 */
export const useCategories = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Set up real-time listener on mount
  useEffect(() => {
    if (!user?.profile?.company) {
      setCategories([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const unsubscribe = getAllCategories(user?.profile?.company, (fetchedCategories) => {
      setCategories(fetchedCategories);
      setIsLoading(false);
    });

    // Cleanup listener on unmount
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [user?.profile?.company]);

  /**
   * Delete a category
   * @param id Category ID
   */
  const deleteCategory = async (id: string): Promise<void> => {
    try {
      setError(null);
      await deleteCategoryService(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete category';
      setError(errorMessage);
      throw err;
    }
  };

  return {
    categories,
    isLoading,
    error,
    deleteCategory,
  };
};
