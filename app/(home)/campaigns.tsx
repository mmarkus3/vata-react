import CampaignCreateModal from '@/components/campaigns/CampaignCreateModal';
import {
  buildCampaignCreatePayload,
  defaultCampaignCreateFormValues,
  validateCampaignCreateForm,
  type CampaignCreateFormValues,
} from '@/app/campaign/campaignCreateForm';
import {
  getCampaignDiscountValue,
  getCampaignListState,
  getCampaignMode,
  getCampaignName,
  getCampaignStatus,
} from '@/app/campaign/campaignListState';
import { themeColors } from '@/constants/colors';
import { useAuth } from '@/hooks/useAuth';
import { useCampaigns } from '@/hooks/useCampaigns';
import { useCategories } from '@/hooks/useCategories';
import { useProducts } from '@/hooks/useProducts';
import { createCampaign } from '@/services/campaign';
import { formatDate } from 'date-fns';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';

export default function CampaignsScreen() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { campaigns, isLoading, error } = useCampaigns();
  const { products } = useProducts();
  const { categories } = useCategories();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<CampaignCreateFormValues>(defaultCampaignCreateFormValues);

  const state = getCampaignListState({ isLoading, error, campaigns });

  const updateForm = <K extends keyof CampaignCreateFormValues>(key: K, value: CampaignCreateFormValues[K]) => {
    setFormError(null);
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const toggleProductSelection = (productId: string) => {
    const currentIds = formValues.selectedProductIds;
    updateForm(
      'selectedProductIds',
      currentIds.includes(productId)
        ? currentIds.filter((id) => id !== productId)
        : [...currentIds, productId],
    );
  };

  const closeCreateModal = () => {
    setIsCreateOpen(false);
    setFormError(null);
    setFormValues(defaultCampaignCreateFormValues);
  };

  const onSaveCampaign = async () => {
    const validationErrorKey = validateCampaignCreateForm(formValues);
    if (validationErrorKey) {
      setFormError(t(validationErrorKey));
      return;
    }

    if (!user?.profile?.company) {
      setFormError(t('campaigns.create.errors.companyMissing'));
      return;
    }

    try {
      setIsSaving(true);
      setFormError(null);

      const payload = buildCampaignCreatePayload({
        values: formValues,
        company: user.profile.company,
        products,
      });

      await createCampaign(payload);
      closeCreateModal();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : t('campaigns.create.errors.saveFailed'));
    } finally {
      setIsSaving(false);
    }
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
      <View className="flex-1 bg-slate-50">
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-lg font-semibold text-secondary-600">{t('campaigns.errorTitle')}</Text>
          <Text className="mt-2 text-center text-sm text-gray-600">{error}</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      <View className="flex-row justify-end px-4 pt-3">
        <TouchableOpacity
          onPress={() => setIsCreateOpen(true)}
          className="rounded-2xl bg-primary-600 px-4 py-3"
          activeOpacity={0.8}
        >
          <Text className="text-center text-sm font-semibold text-white">{t('campaigns.create.open')}</Text>
        </TouchableOpacity>
      </View>

      {state === 'empty' ? (
        <View className="flex-1 items-center justify-center px-6 py-10">
          <Text className="text-lg font-semibold text-gray-900">{t('campaigns.emptyTitle')}</Text>
          <Text className="mt-2 text-center text-sm text-gray-500">{t('campaigns.emptyDescription')}</Text>
        </View>
      ) : (
        <FlatList
          className="px-4 py-3"
          data={campaigns}
          keyExtractor={(item) => item.id ?? `${item.company}-${item.name}`}
          renderItem={({ item }) => {
            const startDate = item.start instanceof Date ? item.start : new Date(item.start as unknown as string);
            const endDate = item.end instanceof Date ? item.end : new Date(item.end as unknown as string);
            const mode = getCampaignMode(item);
            const discountValue = getCampaignDiscountValue(item);

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
                <Text className="mt-1 text-sm text-gray-600">{t(`campaigns.modes.${mode}`)}</Text>
                <Text className="mt-1 text-sm text-gray-600">
                  {t(`campaigns.discount.${item.discountType}`, { value: discountValue ?? '-' })}
                </Text>
              </View>
            );
          }}
          showsVerticalScrollIndicator={false}
        />
      )}

      <CampaignCreateModal
        visible={isCreateOpen}
        values={formValues}
        categories={categories}
        products={products}
        error={formError}
        isSaving={isSaving}
        onClose={closeCreateModal}
        onSave={onSaveCampaign}
        onChange={updateForm}
        onToggleProduct={toggleProductSelection}
      />
    </View>
  );
}
