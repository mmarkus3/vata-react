import { getCampaignsByCompany } from '@/services/campaign';
import type { Campaign } from '@/types/campaign';
import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';

export const useCampaigns = () => {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.profile?.company) {
      setCampaigns([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const unsubscribe = getCampaignsByCompany(user.profile.company, (results) => {
      setCampaigns(results);
      setIsLoading(false);
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [user?.profile?.company]);

  return { campaigns, isLoading, error };
};
