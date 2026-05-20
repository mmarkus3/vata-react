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
    name: 'menu',
    options: {
      title: t('nav.menu'),
      tabBarLabel: t('nav.menu'),
      tabBarIcon: ({ color, size }: { color: string; size: number }) => (
        <Ionicons name="menu-outline" size={size} color={color} />
      ),
      headerTitle: t('menu.title'),
    },
  },
  {
    name: 'categories',
    options: {
      href: null,
      title: t('nav.categories'),
      headerTitle: t('nav.categories'),
    },
  },
  {
    name: 'campaigns',
    options: {
      href: null,
      title: t('nav.campaigns'),
      headerTitle: t('nav.campaigns'),
    },
  },
  {
    name: 'settings',
    options: {
      href: null,
      title: t('nav.profile'),
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
