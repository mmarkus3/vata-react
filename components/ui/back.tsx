import { useRouter } from 'expo-router';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity } from 'react-native';

const Back: FC = () => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <TouchableOpacity onPress={() => router.back()} className="mb-4 rounded-full bg-white px-4 py-3 shadow-sm">
      <Text className="text-sm font-semibold text-primary-600">← {t('common.back')}</Text>
    </TouchableOpacity>
  );
};

export default Back;