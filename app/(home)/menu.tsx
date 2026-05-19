import { overflowMenuItems } from '@/app/(home)/overflowMenuConfig';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';

export default function MenuScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <View className="flex-1 bg-slate-50 px-6 py-6">
      <View className="rounded-2xl bg-white p-4">
        <View className="mt-4 space-y-3">
          {overflowMenuItems.map((item) => (
            <TouchableOpacity
              key={item.route}
              onPress={() => router.push(item.route)}
              className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3"
            >
              <Text className="text-base text-gray-900">{t(item.labelKey)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}
