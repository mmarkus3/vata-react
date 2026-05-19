import { themeColors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';

type TranslateFn = (key: string) => string;

export const getHomeTabsConfig = (t: TranslateFn) => [
  {
    name: 'index',
    options: {
      title: t('nav.storage'),
      tabBarLabel: t('nav.storage'),
      tabBarIcon: ({ color, size }: { color: string; size: number }) => (
        <Ionicons name="storefront-outline" size={size} color={color} />
      ),
      headerTitle: t('nav.storage'),
    },
  },
  {
    name: 'orders',
    options: {
      title: t('nav.orders'),
      tabBarLabel: t('nav.orders'),
      tabBarIcon: ({ color, size }: { color: string; size: number }) => (
        <Ionicons name="receipt-outline" size={size} color={color} />
      ),
      headerTitle: t('nav.orders'),
    },
  },
  {
    name: 'clients',
    options: {
      title: t('nav.clients'),
      tabBarLabel: t('nav.clients'),
      tabBarIcon: ({ color, size }: { color: string; size: number }) => (
        <Ionicons name="business-outline" size={size} color={color} />
      ),
      headerTitle: t('nav.clients'),
    },
  },
  {
    name: 'reports',
    options: {
      title: t('nav.report'),
      tabBarLabel: t('nav.report'),
      tabBarIcon: ({ color, size }: { color: string; size: number }) => (
        <Ionicons name="document-text-outline" size={size} color={color} />
      ),
      headerTitle: t('nav.report'),
    },
  },
  {
    name: 'categories',
    options: {
      title: t('nav.categories'),
      tabBarLabel: t('nav.categories'),
      tabBarIcon: ({ color, size }: { color: string; size: number }) => (
        <Ionicons name="folder-outline" size={size} color={color} />
      ),
      headerTitle: t('nav.categories'),
    },
  },
  {
    name: 'settings',
    options: {
      title: t('nav.profile'),
      tabBarLabel: t('nav.profile'),
      tabBarIcon: ({ color, size }: { color: string; size: number }) => (
        <Ionicons name="settings-outline" size={size} color={color} />
      ),
      headerTitle: t('nav.profile'),
    },
  },
];

export const homeTabsScreenOptions = {
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
    fontWeight: '600' as const,
    color: themeColors.gray[900],
  },
};
