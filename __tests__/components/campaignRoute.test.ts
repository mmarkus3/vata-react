import { getCampaignDetailsRoute } from '@/app/campaign/campaignRoute';

describe('campaignRoute', () => {
  it('builds campaign detail route from campaign id', () => {
    expect(getCampaignDetailsRoute('cmp-123')).toBe('/campaign/cmp-123');
  });
});
