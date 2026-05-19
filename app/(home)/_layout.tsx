import { getHomeTabsConfig, homeTabsScreenOptions } from '@/app/(home)/tabsConfig';
import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function AppLayout() {
  const { t } = useTranslation();

  return (
    <Tabs screenOptions={homeTabsScreenOptions}>
      {getHomeTabsConfig(t).map((tab) => (
        <Tabs.Screen key={tab.name} name={tab.name} options={tab.options} />
      ))}
    </Tabs>
  );
}
