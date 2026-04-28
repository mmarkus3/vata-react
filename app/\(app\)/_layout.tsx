import { View } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { themeColors } from '@/constants/colors';

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
          title: 'Storage',
          tabBarLabel: 'Storage',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cloud-outline" size={size} color={color} />
          ),
          headerTitle: 'My Storage',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
          headerTitle: 'Settings',
        }}
      />
    </Tabs>
  );
}
