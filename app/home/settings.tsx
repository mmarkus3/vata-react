import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {
  const { user, signOut, company } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/login');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return (
    <View className="flex-1 bg-white px-6 py-8">

      {/* User Info */}
      <View className="bg-gray-50 rounded-lg p-4 mb-6">
        <Text className="text-sm text-gray-600 mb-1">Kirjautuneena</Text>
        <Text className="text-lg font-semibold text-gray-900">{user?.email}</Text>
      </View>

      <View className="bg-gray-50 rounded-lg p-4 mb-6">
        <Text className="text-sm text-gray-600 mb-1">Yritys</Text>
        <Text className="text-lg font-semibold text-gray-900">
          {company?.name}
        </Text>
      </View>

      {/* Sign Out Button */}
      <TouchableOpacity
        className="bg-secondary-600 rounded-lg py-3 active:bg-secondary-700"
        onPress={handleSignOut}
      >
        <Text className="text-white font-semibold text-center">Kirjaudu ulos</Text>
      </TouchableOpacity>
    </View>
  );
}
