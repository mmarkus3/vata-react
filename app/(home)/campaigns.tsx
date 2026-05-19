import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { getCampaignListState, getCampaignName, getCampaignStatus } from '@/app/campaign/campaignListState';
import { themeColors } from '@/constants/colors';
import { useCampaigns } from '@/hooks/useCampaigns';
import { formatDate } from 'date-fns';

export default function CampaignsScreen() {
  const { t } = useTranslation();
  const { campaigns, isLoading, error } = useCampaigns();
  const state = getCampaignListState({ isLoading, error, campaigns });

  if (state === 'loading') {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color={themeColors.primary[600]} />
      </View>
    );
  }

  if (state === 'error') {
    return (
      <View className="flex-1 bg-slate-50">
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-lg font-semibold text-secondary-600">{t('campaigns.errorTitle')}</Text>
          <Text className="mt-2 text-center text-sm text-gray-600">{error}</Text>
        </View>
      </View>
    );
  }

  if (state === 'empty') {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50 px-6 py-10">
        <Text className="text-lg font-semibold text-gray-900">{t('campaigns.emptyTitle')}</Text>
        <Text className="mt-2 text-center text-sm text-gray-500">{t('campaigns.emptyDescription')}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      <FlatList
        className="px-4 py-3"
        data={campaigns}
        keyExtractor={(item) => item.id ?? `${item.company}-${item.name}`}
        renderItem={({ item }) => {
          const startDate = item.start instanceof Date ? item.start : new Date(item.start as unknown as string);
          const endDate = item.end instanceof Date ? item.end : new Date(item.end as unknown as string);

          return (
            <View className="mb-3 rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-sm">
              <View className="flex-row items-center justify-between">
                <Text className="text-base font-semibold text-gray-900">{getCampaignName(item)}</Text>
                <Text className="text-sm font-medium text-primary-600">
                  {t(`campaigns.statuses.${getCampaignStatus(item)}`)}
                </Text>
              </View>
              <Text className="mt-2 text-sm text-gray-600">
                {t('campaigns.period', {
                  start: formatDate(startDate, 'd.M.yyyy'),
                  end: formatDate(endDate, 'd.M.yyyy'),
                })}
              </Text>
            </View>
          );
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
