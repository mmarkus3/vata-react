import { CreateCompanyModal } from '@/components/common/CreateCompanyModal';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { themeColors } from '@/constants/colors';
import { useAuth } from '@/hooks/useAuth';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import './global.css';

function RootLayoutNav() {
  const { user, isLoading, showCreateCompanyModal, createCompany, closeCreateCompanyModal } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    // Check if we're in the login group
    const inAuthGroup = segments[0] === 'login';
    if (!user) {
      // User is not signed in, navigate to login
      if (!inAuthGroup) {
        router.replace('/login');
      }
    } else if (!user.profile?.company && !showCreateCompanyModal) {
      // User is signed in but doesn't have a company and modal is not showing
      // This will be handled by the auth provider showing the modal
    } else if (user.profile?.company) {
      // User has a company, navigate to app
      if (segments[0] === 'login' || segments[0] == null) {
        router.replace('/home');
      }
    }
  }, [user, segments, isLoading, showCreateCompanyModal, router]);

  const handleCompanyCreated = async (companyId: string, companyName: string) => {
    try {
      await createCompany(companyName);
      router.replace('/home');
    } catch (error) {
      console.error('Failed to set company:', error);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color={themeColors.primary[600]} />
      </View>
    );
  }

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="login" />
        <Stack.Screen name="home" />
      </Stack>

      <CreateCompanyModal
        visible={showCreateCompanyModal}
        onClose={closeCreateCompanyModal}
        onCompanyCreated={handleCompanyCreated}
      />
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
