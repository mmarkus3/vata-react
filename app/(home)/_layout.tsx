import { getHomeTabsConfig, homeTabsScreenOptions } from '@/home-config/tabsConfig';
import { overflowMenuItems } from '@/home-config/overflowMenuConfig';
import { Tabs, usePathname, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

export default function AppLayout() {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <View className="flex-1">
      <Tabs screenOptions={homeTabsScreenOptions}>
        {getHomeTabsConfig(t).map((tab) => (
          <Tabs.Screen
            key={tab.name}
            name={tab.name}
            options={tab.options}
            listeners={
              tab.name === 'menu'
                ? {
                  tabPress: (event) => {
                    event.preventDefault();
                    setIsMenuOpen((prev) => !prev);
                  },
                }
                : undefined
            }
          />
        ))}
      </Tabs>
      {isMenuOpen ? (
        <>
          <Pressable
            className="absolute inset-0 bg-black/15"
            onPress={() => setIsMenuOpen(false)}
            accessibilityRole="button"
            accessibilityLabel={t('menu.close')}
          />
          <View className="absolute bottom-24 right-4 w-56 rounded-2xl border border-gray-200 bg-white p-3 shadow-lg">
            {overflowMenuItems.map((item) => (
              <Pressable
                key={item.route}
                onPress={() => {
                  setIsMenuOpen(false);
                  router.push(item.route);
                }}
                className="rounded-xl px-3 py-3"
              >
                <Text className="text-base text-gray-900">{t(item.labelKey)}</Text>
              </Pressable>
            ))}
          </View>
        </>
      ) : null}
    </View>
  );
}
