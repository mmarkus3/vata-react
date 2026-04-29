import { getProductsByCompany } from '@/services/product';
import type { Product } from '@/types/product';
import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';

export const useProducts = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!user?.profile?.company) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        getProductsByCompany(user.profile.company, (fetchedProducts) => setProducts(fetchedProducts));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch products';
        setError(message);
        console.error('Failed to fetch products:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [user?.profile?.company]);

  return { products, isLoading, error };
};
