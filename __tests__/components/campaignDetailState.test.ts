import { getCampaignDetailState, getCampaignDetailSummary, isCampaignDeleteDisabled } from '@/app/campaign/campaignDetailState';

describe('campaignDetailState', () => {
  const campaign = {
    name: 'Spring',
    code: 'SAVE10',
    discountType: 'percentage',
    products: [{ id: 'p1', name: 'Milk', discountPercentage: 10 }],
  } as any;

  it('returns loading, error, not_found and success states', () => {
    expect(getCampaignDetailState({ isLoading: true, error: null, campaign: null })).toBe('loading');
    expect(getCampaignDetailState({ isLoading: false, error: 'Boom', campaign: null })).toBe('error');
    expect(getCampaignDetailState({ isLoading: false, error: null, campaign: null })).toBe('not_found');
    expect(getCampaignDetailState({ isLoading: false, error: null, campaign })).toBe('success');
  });

  it('builds detail summary', () => {
    expect(getCampaignDetailSummary(campaign)).toEqual({
      name: 'Spring',
      mode: 'code',
      discountValue: 10,
      productsCount: 1,
    });
  });

  it('disables campaign delete while deleting, saving or editing', () => {
    expect(isCampaignDeleteDisabled({ isDeleting: false, isSaving: false, isEditOpen: false })).toBe(false);
    expect(isCampaignDeleteDisabled({ isDeleting: true, isSaving: false, isEditOpen: false })).toBe(true);
    expect(isCampaignDeleteDisabled({ isDeleting: false, isSaving: true, isEditOpen: false })).toBe(true);
    expect(isCampaignDeleteDisabled({ isDeleting: false, isSaving: false, isEditOpen: true })).toBe(true);
  });
});
