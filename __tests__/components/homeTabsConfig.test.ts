import { getHomeTabsConfig } from '@/app/(home)/tabsConfig';

describe('homeTabsConfig', () => {
  const t = (key: string) => key;

  it('includes orders tab in primary tab config', () => {
    const tabs = getHomeTabsConfig(t);
    const tabNames = tabs.map((tab) => tab.name);
    expect(tabNames).toContain('orders');
  });
});
