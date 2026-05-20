import { getCampaignTargetProducts, type CampaignCreateFormValues } from '@/app/campaign/campaignCreateForm';
import { htmlDateToIso, isoToHtmlDate } from '@/app/campaign/campaignCreateModalState';
import SelectProduct from '@/components/clients/SelectProduct';
import type { Category } from '@/types/category';
import type { Product } from '@/types/product';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface CampaignEditModalProps {
  visible: boolean;
  values: CampaignCreateFormValues;
  categories: Category[];
  products: Product[];
  error: string | null;
  isSaving: boolean;
  onClose: () => void;
  onSave: () => void;
  onApplyBulkFixedPrice: () => void;
  onChange: <K extends keyof CampaignCreateFormValues>(key: K, value: CampaignCreateFormValues[K]) => void;
  onToggleProduct: (productId: string) => void;
}

export default function CampaignEditModal({
  visible,
  values,
  categories,
  products,
  error,
  isSaving,
  onClose,
  onSave,
  onApplyBulkFixedPrice,
  onChange,
  onToggleProduct,
}: CampaignEditModalProps) {
  const { t } = useTranslation();
  const targetProducts = getCampaignTargetProducts(values, products);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/40 px-4 py-6">
        <ScrollView className="rounded-3xl bg-white p-6 shadow-lg">
          <Text className="text-xl font-semibold text-gray-900">{t('campaigns.edit.title')}</Text>

          <View className="mt-4 space-y-3">
            <TextInput
              value={values.name}
              onChangeText={(value) => onChange('name', value)}
              placeholder={t('campaigns.create.fields.name')}
              className="rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-base text-gray-900"
            />
            <TextInput
              value={values.code}
              onChangeText={(value) => onChange('code', value)}
              placeholder={t('campaigns.create.fields.code')}
              className="rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-base text-gray-900"
            />

            <Text className="text-sm font-semibold text-gray-900">{t('campaigns.create.fields.start')}</Text>
            {Platform.OS === 'web' ? (
              <input
                type="date"
                value={isoToHtmlDate(values.start)}
                onChange={(event) => onChange('start', htmlDateToIso(event.currentTarget.value))}
                style={{ border: '1px solid #d1d5db', borderRadius: 16, padding: 12, backgroundColor: '#f9fafb' }}
              />
            ) : (
              <TextInput
                value={values.start}
                onChangeText={(value) => onChange('start', value)}
                placeholder={t('campaigns.create.fields.start')}
                className="rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-base text-gray-900"
              />
            )}

            <Text className="text-sm font-semibold text-gray-900">{t('campaigns.create.fields.end')}</Text>
            {Platform.OS === 'web' ? (
              <input
                type="date"
                value={isoToHtmlDate(values.end)}
                onChange={(event) => onChange('end', htmlDateToIso(event.currentTarget.value))}
                style={{ border: '1px solid #d1d5db', borderRadius: 16, padding: 12, backgroundColor: '#f9fafb' }}
              />
            ) : (
              <TextInput
                value={values.end}
                onChangeText={(value) => onChange('end', value)}
                placeholder={t('campaigns.create.fields.end')}
                className="rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-base text-gray-900"
              />
            )}

            <Text className="text-sm font-semibold text-gray-900">{t('campaigns.create.fields.targetingMode')}</Text>
            <View className="flex-row flex-wrap gap-2">
              {(['selected', 'all_products', 'category'] as const).map((mode) => {
                const isActive = values.targetingMode === mode;
                return (
                  <TouchableOpacity
                    key={mode}
                    onPress={() => onChange('targetingMode', mode)}
                    className={`rounded-2xl border px-3 py-2 ${isActive ? 'border-primary-600 bg-primary-50' : 'border-gray-300 bg-gray-50'}`}
                  >
                    <Text className={`text-sm ${isActive ? 'text-primary-700' : 'text-gray-700'}`}>
                      {t(`campaigns.create.targeting.${mode}`)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {values.targetingMode === 'selected' ? (
              <View>
                <SelectProduct
                  visible={visible}
                  products={products}
                  isLoading={false}
                  mode="multi"
                  selectedIds={values.selectedProductIds}
                  enableSourceFilter={false}
                  onToggleSelect={onToggleProduct}
                />
              </View>
            ) : null}

            {values.targetingMode === 'category' ? (
              <View>
                <Text className="mb-2 text-sm font-semibold text-gray-900">{t('campaigns.create.fields.category')}</Text>
                <View className="space-y-2">
                  {categories.map((category) => {
                    if (!category.id) return null;
                    const isSelected = values.categoryId === category.id;
                    return (
                      <TouchableOpacity
                        key={category.id}
                        onPress={() => onChange('categoryId', category.id!)}
                        className={`rounded-2xl border px-3 py-2 ${isSelected ? 'border-primary-600 bg-primary-50' : 'border-gray-300 bg-gray-50'}`}
                      >
                        <Text className={`text-sm ${isSelected ? 'text-primary-700' : 'text-gray-700'}`}>{category.name}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ) : null}

            <Text className="text-sm font-semibold text-gray-900">{t('campaigns.create.fields.discountType')}</Text>
            <View className="flex-row gap-2">
              {(['percentage', 'fixed'] as const).map((type) => {
                const isActive = values.discountType === type;
                return (
                  <TouchableOpacity
                    key={type}
                    onPress={() => onChange('discountType', type)}
                    className={`rounded-2xl border px-3 py-2 ${isActive ? 'border-primary-600 bg-primary-50' : 'border-gray-300 bg-gray-50'}`}
                  >
                    <Text className={`text-sm ${isActive ? 'text-primary-700' : 'text-gray-700'}`}>
                      {t(`campaigns.create.discountTypes.${type}`)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {values.discountType === 'percentage' ? (
              <TextInput
                value={values.discountValue}
                onChangeText={(value) => onChange('discountValue', value)}
                placeholder={t('campaigns.create.fields.discountValue')}
                keyboardType="decimal-pad"
                className="rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-base text-gray-900"
              />
            ) : (
              <View className="space-y-2">
                <View className="rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2">
                  <Text className="mb-1 text-sm font-medium text-gray-800">
                    {t('campaigns.create.fields.discountValue')}
                  </Text>
                  <View className="flex-row items-center gap-2">
                    <TextInput
                      value={values.discountFixedBulkValue}
                      onChangeText={(value) => onChange('discountFixedBulkValue', value)}
                      placeholder={t('campaigns.create.fields.discountValue')}
                      keyboardType="decimal-pad"
                      className="flex-1 rounded-xl border border-gray-300 bg-white px-3 py-2 text-base text-gray-900"
                    />
                    <TouchableOpacity
                      onPress={onApplyBulkFixedPrice}
                      className="rounded-xl border border-primary-300 bg-primary-50 px-3 py-2"
                    >
                      <Text className="text-sm font-medium text-primary-700">
                        {t('common.apply', { defaultValue: 'Apply' })}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                {targetProducts.map((product) => (
                  <View key={product.id} className="rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2">
                    <Text className="mb-1 text-sm font-medium text-gray-800">{product.name}</Text>
                    <TextInput
                      value={values.discountFixedValues[product.id] ?? ''}
                      onChangeText={(value) =>
                        onChange('discountFixedValues', { ...values.discountFixedValues, [product.id]: value })
                      }
                      placeholder={t('campaigns.create.fields.discountValue')}
                      keyboardType="decimal-pad"
                      className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-base text-gray-900"
                    />
                  </View>
                ))}
              </View>
            )}

            {error ? <Text className="text-sm text-secondary-600">{error}</Text> : null}

            <View className="mt-2 flex-row justify-end gap-2">
              <TouchableOpacity onPress={onClose} className="rounded-2xl border border-gray-300 px-4 py-3">
                <Text className="text-center text-sm font-semibold text-gray-700">{t('common.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onSave} disabled={isSaving} className="rounded-2xl bg-primary-600 px-4 py-3">
                {isSaving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-center text-sm font-semibold text-white">{t('campaigns.edit.save')}</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
