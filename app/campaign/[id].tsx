import { getCampaignDetailSummary, getCampaignDetailState } from '@/app/campaign/campaignDetailState';
import { themeColors } from '@/constants/colors';
import Back from '@/components/ui/back';
import { getCampaignById } from '@/services/campaign';
import { formatDate } from 'date-fns';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import type { Campaign } from '@/types/campaign';

export default function CampaignDetailPage() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      if (!id) {
        setError(t('campaigns.detail.errors.notSelected'));
        setIsLoading(false);
        return;
      }

      try {
        const result = await getCampaignById(id);
        if (!isMounted) return;
        setCampaign(result);
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : t('campaigns.detail.errors.loadFailed'));
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [id, t]);

  const state = getCampaignDetailState({ isLoading, error, campaign });

  if (state === 'loading') {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color={themeColors.primary[600]} />
      </View>
    );
  }

  if (state === 'error') {
    return (
      <View className="flex-1 bg-slate-50 px-6 py-6">
        <Back />
        <View className="rounded-2xl border border-red-300 bg-red-50 p-4">
          <Text className="text-base text-secondary-600">{error}</Text>
        </View>
      </View>
    );
  }

  if (state === 'not_found') {
    return (
      <View className="flex-1 bg-slate-50 px-6 py-6">
        <Back />
        <View className="rounded-2xl border border-gray-200 bg-white p-4">
          <Text className="text-base text-gray-700">{t('campaigns.detail.notFound')}</Text>
        </View>
      </View>
    );
  }

  const summary = getCampaignDetailSummary(campaign!);
  const startDate = campaign!.start instanceof Date ? campaign!.start : new Date(campaign!.start as unknown as string);
  const endDate = campaign!.end instanceof Date ? campaign!.end : new Date(campaign!.end as unknown as string);

  return (
    <ScrollView className="flex-1 bg-slate-50 px-6 py-6">
      <Back />
      <Stack.Screen options={{ title: campaign?.name ?? t('campaigns.detail.title') }} />

      <View className="rounded-2xl bg-white p-4">
        <Text className="text-lg font-semibold text-gray-900">{summary.name}</Text>
        <Text className="mt-2 text-sm text-gray-700">{t(`campaigns.modes.${summary.mode}`)}</Text>
        <Text className="mt-1 text-sm text-gray-700">
          {t(`campaigns.discount.${campaign!.discountType}`, { value: summary.discountValue ?? '-' })}
        </Text>
        <Text className="mt-1 text-sm text-gray-700">
          {t('campaigns.period', {
            start: formatDate(startDate, 'd.M.yyyy'),
            end: formatDate(endDate, 'd.M.yyyy'),
          })}
        </Text>
      </View>

      <View className="mt-3 rounded-2xl bg-white p-4">
        <Text className="text-base font-semibold text-gray-900">{t('campaigns.detail.targetingTitle')}</Text>
        <Text className="mt-2 text-sm text-gray-700">{t(`campaigns.create.targeting.${campaign!.targetingMode ?? 'selected'}`)}</Text>

        {campaign!.targetingMode === 'all_products' ? (
          <Text className="mt-1 text-sm text-gray-700">{t('campaigns.detail.allProducts')}</Text>
        ) : null}

        {campaign!.targetingMode === 'category' ? (
          <Text className="mt-1 text-sm text-gray-700">
            {t('campaigns.detail.category', { value: campaign!.categoryId ?? '-' })}
          </Text>
        ) : null}

        {campaign!.targetingMode === 'selected' ? (
          <View className="mt-2 space-y-2">
            {campaign!.products?.length ? (
              campaign!.products.map((product) => (
                <View key={`${product.id}-${product.name}`} className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
                  <Text className="text-sm text-gray-900">{product.name || '-'}</Text>
                </View>
              ))
            ) : (
              <Text className="text-sm text-gray-500">{t('campaigns.detail.emptyProducts')}</Text>
            )}
          </View>
        ) : null}

        <Text className="mt-3 text-sm text-gray-700">{t('campaigns.detail.productsCount', { count: summary.productsCount })}</Text>
      </View>
    </ScrollView>
  );
}
