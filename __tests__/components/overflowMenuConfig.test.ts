import { overflowMenuItems } from '@/home-config/overflowMenuConfig';

describe('overflowMenuConfig', () => {
  it('contains kategoriat, kampanjat, asetukset and profiili entries', () => {
    expect(overflowMenuItems.map((item) => item.labelKey)).toEqual([
      'nav.categories',
      'nav.campaigns',
      'nav.options',
      'nav.profile',
    ]);
  });

  it('maps overflow entries to existing routes', () => {
    expect(overflowMenuItems.map((item) => item.route)).toEqual([
      '/(home)/categories',
      '/(home)/campaigns',
      '/(home)/options',
      '/(home)/settings',
    ]);
  });
});
