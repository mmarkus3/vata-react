import {
  applyBulkDiscountFixedValue,
  buildCampaignCreatePayload,
  mapCampaignToFormValues,
  syncDiscountFixedValues,
  validateCampaignCreateForm,
  type CampaignCreateFormValues,
} from '@/app/campaign/campaignCreateForm';
import { getCampaignDetailSummary, getCampaignDetailState } from '@/app/campaign/campaignDetailState';
import CampaignEditModal from '@/components/campaigns/CampaignEditModal';
import Back from '@/components/ui/back';
import { themeColors } from '@/constants/colors';
import { useAuth } from '@/hooks/useAuth';
import { useCategories } from '@/hooks/useCategories';
import { useProducts } from '@/hooks/useProducts';
import { getCampaignById, updateCampaign } from '@/services/campaign';
import type { Campaign } from '@/types/campaign';
import { formatDate } from 'date-fns';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function CampaignDetailPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { products } = useProducts();
  const { categories } = useCategories();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<CampaignCreateFormValues | null>(null);

  const loadCampaign = async (campaignId: string) => {
    const result = await getCampaignById(campaignId);
    setCampaign(result);
    if (result) {
      setEditValues(mapCampaignToFormValues(result));
    }
  };

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      if (!id) {
        setError(t('campaigns.detail.errors.notSelected'));
        setIsLoading(false);
        return;
      }

      try {
        await loadCampaign(id);
        if (!isMounted) return;
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

  const updateEditForm = <K extends keyof CampaignCreateFormValues>(key: K, value: CampaignCreateFormValues[K]) => {
    setEditError(null);
    setEditValues((prev) => (prev ? syncDiscountFixedValues({ ...prev, [key]: value }, products) : prev));
  };

  const toggleEditProductSelection = (productId: string) => {
    if (!editValues) return;
    const currentIds = editValues.selectedProductIds;
    updateEditForm(
      'selectedProductIds',
      currentIds.includes(productId)
        ? currentIds.filter((id) => id !== productId)
        : [...currentIds, productId],
    );
  };

  const onSaveEdit = async () => {
    if (!campaign || !id || !editValues) {
      return;
    }

    const validationErrorKey = validateCampaignCreateForm(editValues, products);
    if (validationErrorKey) {
      setEditError(t(validationErrorKey));
      return;
    }

    if (!user?.profile?.company) {
      setEditError(t('campaigns.create.errors.companyMissing'));
      return;
    }

    try {
      setIsSaving(true);
      setEditError(null);
      const payload = buildCampaignCreatePayload({
        values: editValues,
        company: user.profile.company,
        products,
      });
      await updateCampaign(id, payload);
      await loadCampaign(id);
      setIsEditOpen(false);
    } catch (err) {
      setEditError(err instanceof Error ? err.message : t('campaigns.edit.errors.saveFailed'));
    } finally {
      setIsSaving(false);
    }
  };

  const applyBulkFixedPrice = () => {
    if (!editValues) return;
    const nextValues = applyBulkDiscountFixedValue(editValues, products);
    if (!nextValues) {
      setEditError(t('campaigns.create.errors.discountInvalid'));
      return;
    }
    setEditError(null);
    setEditValues(syncDiscountFixedValues(nextValues, products));
  };

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

      <View className="mb-3 flex-row justify-end">
        <TouchableOpacity
          onPress={() => setIsEditOpen(true)}
          className="rounded-2xl bg-primary-600 px-4 py-3"
          activeOpacity={0.85}
        >
          <Text className="text-sm font-semibold text-white">{t('campaigns.edit.open')}</Text>
        </TouchableOpacity>
      </View>

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

      {editValues ? (
        <CampaignEditModal
          visible={isEditOpen}
          values={editValues}
          categories={categories}
          products={products}
          error={editError}
          isSaving={isSaving}
          onClose={() => {
            setIsEditOpen(false);
            setEditError(null);
            if (campaign) {
              setEditValues(mapCampaignToFormValues(campaign));
            }
          }}
          onSave={onSaveEdit}
          onApplyBulkFixedPrice={applyBulkFixedPrice}
          onChange={updateEditForm}
          onToggleProduct={toggleEditProductSelection}
        />
      ) : null}
    </ScrollView>
  );
}
