import { overflowMenuItems } from '@/app/(home)/overflowMenuConfig';

describe('overflowMenuConfig', () => {
  it('contains asiakkaat, kategoriat and profiili entries', () => {
    expect(overflowMenuItems.map((item) => item.labelKey)).toEqual([
      'nav.clients',
      'nav.categories',
      'nav.profile',
    ]);
  });

  it('maps overflow entries to existing routes', () => {
    expect(overflowMenuItems.map((item) => item.route)).toEqual([
      '/(home)/clients',
      '/(home)/categories',
      '/(home)/settings',
    ]);
  });
});
