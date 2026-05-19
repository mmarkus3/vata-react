import { getCampaignListState, getCampaignName, getCampaignStatus } from '@/app/campaign/campaignListState';
import type { Campaign } from '@/types/campaign';

const baseCampaign = {
  company: 'c1',
  name: 'Spring Sale',
  products: [],
  discountType: 'percentage',
} as unknown as Campaign;

describe('campaignListState', () => {
  it('returns loading, error, empty and success states', () => {
    expect(getCampaignListState({ isLoading: true, error: null, campaigns: [] })).toBe('loading');
    expect(getCampaignListState({ isLoading: false, error: 'Boom', campaigns: [] })).toBe('error');
    expect(getCampaignListState({ isLoading: false, error: null, campaigns: [] })).toBe('empty');
    expect(getCampaignListState({ isLoading: false, error: null, campaigns: [baseCampaign] })).toBe('success');
  });

  it('returns fallback name when campaign name is empty', () => {
    expect(getCampaignName({ ...baseCampaign, name: '   ' })).toBe('-');
    expect(getCampaignName({ ...baseCampaign, name: 'Summer' })).toBe('Summer');
  });

  it('resolves campaign status from date window', () => {
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;

    expect(
      getCampaignStatus({ ...baseCampaign, start: new Date(now - oneHour), end: new Date(now + oneHour) }),
    ).toBe('active');
    expect(
      getCampaignStatus({ ...baseCampaign, start: new Date(now + oneHour), end: new Date(now + 2 * oneHour) }),
    ).toBe('upcoming');
    expect(
      getCampaignStatus({ ...baseCampaign, start: new Date(now - 2 * oneHour), end: new Date(now - oneHour) }),
    ).toBe('ended');
  });
});
