import { themeColors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function AppLayout() {
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
          title: 'Varasto',
          tabBarLabel: 'Varasto',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="storefront-outline" size={size} color={color} />
          ),
          headerTitle: 'Varasto',
        }}
      />
      <Tabs.Screen
        name="clients"
        options={{
          title: 'Asiakkaat',
          tabBarLabel: 'Asiakkaat',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="business-outline" size={size} color={color} />
          ),
          headerTitle: 'Asiakkaat',
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: 'Raportti',
          tabBarLabel: 'Raportti',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text-outline" size={size} color={color} />
          ),
          headerTitle: 'Raportti',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Profiili',
          tabBarLabel: 'Profiili',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
          headerTitle: 'Profiili',
        }}
      />
    </Tabs>
  );
}
