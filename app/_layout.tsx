import { AuthProvider } from '@/components/providers/AuthProvider';
import { themeColors } from '@/constants/colors';
import { useAuth } from '@/hooks/useAuth';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import './global.css';

function RootLayoutNav() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    // Check if we're in the login group
    const inAuthGroup = segments[0] === '(auth)';

    if (!user) {
      // User is not signed in, navigate to login
      if (!inAuthGroup) {
        router.replace('/login');
      }
    } else {
      // User is signed in, navigate to app
      if (inAuthGroup || segments[0] === 'login') {
        router.replace('/(app)');
      }
    }
  }, [user, segments, isLoading, router]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color={themeColors.primary[600]} />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="(app)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
