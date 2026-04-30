import { getClientsByCompany } from '@/services/client';
import type { Client } from '@/types/client';
import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';

export const useClients = () => {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.profile?.company) {
      setClients([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const unsubscribe = getClientsByCompany(user.profile.company, (fetchedClients) => {
      setClients(fetchedClients);
      setIsLoading(false);
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [user?.profile?.company]);

  return { clients, isLoading, error };
};