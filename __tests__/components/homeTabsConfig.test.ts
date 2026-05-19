import { getHomeTabsConfig } from '@/app/(home)/tabsConfig';

describe('homeTabsConfig', () => {
  const t = (key: string) => key;

  it('keeps storage, orders, clients, and report as primary visible tabs', () => {
    const tabs = getHomeTabsConfig(t);
    const visibleTabs = tabs.filter((tab) => tab.options.href !== null).map((tab) => tab.name);

    expect(visibleTabs).toEqual(['index', 'orders', 'clients', 'reports', 'menu']);
  });

  it('includes menu tab and hides categories/campaigns/settings from tab bar', () => {
    const tabs = getHomeTabsConfig(t);
    const menuTab = tabs.find((tab) => tab.name === 'menu');
    const hiddenTabs = tabs.filter((tab) => tab.options.href === null).map((tab) => tab.name);

    expect(menuTab).toBeDefined();
    expect(hiddenTabs).toEqual(['categories', 'campaigns', 'settings']);
  });
});
