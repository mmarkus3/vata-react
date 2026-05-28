import { getCampaignDiscountValue, getCampaignMode, getCampaignName } from '@/app/campaign/campaignListState';
import type { Campaign } from '@/types/campaign';

export type CampaignDetailState = 'loading' | 'error' | 'not_found' | 'success';

export const getCampaignDetailState = (input: {
  isLoading: boolean;
  error: string | null;
  campaign: Campaign | null;
}): CampaignDetailState => {
  if (input.isLoading) {
    return 'loading';
  }
  if (input.error) {
    return 'error';
  }
  if (!input.campaign) {
    return 'not_found';
  }
  return 'success';
};

export const getCampaignDetailSummary = (campaign: Campaign) => {
  return {
    name: getCampaignName(campaign),
    mode: getCampaignMode(campaign),
    discountValue: getCampaignDiscountValue(campaign),
    productsCount: campaign.products?.length ?? 0,
  };
};

export const isCampaignDeleteDisabled = (input: {
  isDeleting: boolean;
  isSaving: boolean;
  isEditOpen: boolean;
}): boolean => input.isDeleting || input.isSaving || input.isEditOpen;
