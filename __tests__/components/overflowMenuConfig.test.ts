import { overflowMenuItems } from '@/app/(home)/overflowMenuConfig';

describe('overflowMenuConfig', () => {
  it('contains kategoriat, kampanjat and profiili entries', () => {
    expect(overflowMenuItems.map((item) => item.labelKey)).toEqual([
      'nav.categories',
      'nav.campaigns',
      'nav.profile',
    ]);
  });

  it('maps overflow entries to existing routes', () => {
    expect(overflowMenuItems.map((item) => item.route)).toEqual([
      '/(home)/categories',
      '/(home)/campaigns',
      '/(home)/settings',
    ]);
  });
});
