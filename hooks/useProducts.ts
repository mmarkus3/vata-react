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
    if (!user?.profile?.company) {
      setProducts([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const unsubscribe = getProductsByCompany(user.profile.company, (fetchedProducts) => {
      setProducts(fetchedProducts);
      setIsLoading(false);
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [user?.profile?.company]);

  return { products, isLoading, error };
};
