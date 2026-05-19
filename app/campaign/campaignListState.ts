import type { Campaign } from '@/types/campaign';

export type CampaignListState = 'loading' | 'error' | 'empty' | 'success';

export function getCampaignListState(input: {
  isLoading: boolean;
  error: string | null;
  campaigns: Campaign[];
}): CampaignListState {
  if (input.isLoading) {
    return 'loading';
  }
  if (input.error) {
    return 'error';
  }
  if (input.campaigns.length === 0) {
    return 'empty';
  }
  return 'success';
}

export function getCampaignName(campaign: Campaign): string {
  const rawName = campaign.name?.trim();
  return rawName && rawName.length > 0 ? rawName : '-';
}

export function getCampaignStatus(campaign: Campaign): 'active' | 'upcoming' | 'ended' {
  const now = new Date();
  const start = campaign.start as unknown as Date;
  const end = campaign.end as unknown as Date;

  if (start instanceof Date && now < start) {
    return 'upcoming';
  }
  if (end instanceof Date && now > end) {
    return 'ended';
  }
  return 'active';
}
