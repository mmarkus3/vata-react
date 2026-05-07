import { themeColors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function AppLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: themeColors.primary[600],
        tabBarInactiveTintColor: themeColors.gray[400],
        tabBarStyle: {
          borderTopColor: themeColors.gray[200],
          backgroundColor: '#ffffff',
        },
        headerStyle: {
          backgroundColor: '#ffffff',
          borderBottomColor: themeColors.gray[200],
          borderBottomWidth: 1,
        },
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: '600',
          color: themeColors.gray[900],
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('nav.storage'),
          tabBarLabel: t('nav.storage'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="storefront-outline" size={size} color={color} />
          ),
          headerTitle: t('nav.storage'),
        }}
      />
      <Tabs.Screen
        name="clients"
        options={{
          title: t('nav.clients'),
          tabBarLabel: t('nav.clients'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="business-outline" size={size} color={color} />
          ),
          headerTitle: t('nav.clients'),
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: t('nav.report'),
          tabBarLabel: t('nav.report'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text-outline" size={size} color={color} />
          ),
          headerTitle: t('nav.report'),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('nav.profile'),
          tabBarLabel: t('nav.profile'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
          headerTitle: t('nav.profile'),
        }}
      />
    </Tabs>
  );
}
