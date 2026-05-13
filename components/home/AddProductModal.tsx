import {
  AddProductFormValues,
  buildNutritionValues,
  defaultAddProductFormValues,
  isNonNegativeNumber,
  isRequiredNonNegativeNumber,
  nutritionFieldKeys,
  parseOptionalDecimal,
} from '@/components/home/addProductForm';
import { AddProductSectionKey, getSectionForField } from '@/components/home/addProductAccordion';
import { useAuth } from '@/hooks/useAuth';
import { useCategories } from '@/hooks/useCategories';
import { createProduct } from '@/services/product';
import Accordion from '@/components/ui/accordion';
import { buildProductCategoryOptions } from '@/utils/productCategoryOptions';
import * as ImagePicker from 'expo-image-picker';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { Controller, FieldErrors, Path, RegisterOptions, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Image, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface AddProductModalProps {
  visible: boolean;
  onClose: () => void;
  onProductCreated: () => void;
}

const fieldErrorOrder: Path<AddProductFormValues>[] = [
  'category',
  'name',
  'amount',
  'price',
  'retailPrice',
  'unitPrice',
  ...nutritionFieldKeys,
];

const AddProductModal: FC<AddProductModalProps> = ({ visible, onClose, onProductCreated }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { categories, isLoading: isLoadingCategories } = useCategories();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddProductFormValues>({
    defaultValues: defaultAddProductFormValues,
    mode: 'onSubmit',
  });

  const [imageUrl, setImageUrl] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [selectedProductImageUris, setSelectedProductImageUris] = useState<string[]>([]);
  const [selectedBarcodeImageUri, setSelectedBarcodeImageUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openSections, setOpenSections] = useState<Record<AddProductSectionKey, boolean>>({
    basic: true,
    price: false,
    nutritions: false,
  });

  const numericOptionalRule = (key: typeof nutritionFieldKeys[number] | 'retailPrice' | 'unitPrice') => ({
    validate: (value: string) => {
      if (!value.trim()) {
        return true;
      }
      return isNonNegativeNumber(value) || t(`addProduct.errors.${key}Invalid`);
    },
  });

  const numericRequiredRule = (errorKey: 'amountInvalid' | 'priceInvalid'): RegisterOptions<AddProductFormValues> => ({
    validate: (value: string) => {
      return isRequiredNonNegativeNumber(value) || t(`addProduct.errors.${errorKey}`);
    },
  });

  const firstFieldError = (fieldErrors: FieldErrors<AddProductFormValues>): string | null => {
    for (const key of fieldErrorOrder) {
      const message = fieldErrors[key]?.message;
      if (typeof message === 'string' && message.length > 0) {
        return message;
      }
    }
    return null;
  };

  const clearFormAndAssets = () => {
    reset(defaultAddProductFormValues);
    setOpenSections({ basic: true, price: false, nutritions: false });
    setImageUrl('');
    setImageUrls([]);
    setSelectedProductImageUris([]);
    setSelectedBarcodeImageUri(null);
  };

  const pickProductImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      setError(t('addProduct.errors.mediaPermissionDenied'));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setSelectedProductImageUris((prev) => [...prev, uri]);
      setError(null);
    }
  };

  const pickBarcodeImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      setError(t('addProduct.errors.mediaPermissionDenied'));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedBarcodeImageUri(result.assets[0].uri);
      setError(null);
    }
  };

  const handleAddImageUrl = () => {
    const trimmedUrl = imageUrl.trim();
    if (!trimmedUrl) {
      setError(t('addProduct.errors.imageUrlRequired'));
      return;
    }

    if (!/^https?:\/\//i.test(trimmedUrl)) {
      setError(t('addProduct.errors.imageUrlInvalid'));
      return;
    }

    setImageUrls((prev) => [...prev, trimmedUrl]);
    setImageUrl('');
    setError(null);
  };

  const handleRemoveImageUrl = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveSelectedProductImage = (index: number) => {
    setSelectedProductImageUris((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (values: AddProductFormValues) => {
    setError(null);

    if (!user?.profile?.company) {
      setError(t('addProduct.errors.companyMissing'));
      return;
    }

    const amountValue = Number(values.amount.trim().replace(',', '.'));
    const priceValue = Number(values.price.trim().replace(',', '.'));
    const retailPriceValue = parseOptionalDecimal(values.retailPrice);
    const unitPriceValue = parseOptionalDecimal(values.unitPrice);
    const nutritionValues = buildNutritionValues(values);

    try {
      setIsLoading(true);
      await createProduct(
        {
          category: values.category.trim(),
          name: values.name.trim(),
          amount: amountValue,
          price: priceValue,
          retailPrice: retailPriceValue,
          unitPrice: unitPriceValue,
          ...nutritionValues,
          barcode: values.barcode.trim(),
          ean: values.ean.trim(),
          company: user.profile.company,
          images: [],
        },
        {
          barcodeImageUri: selectedBarcodeImageUri ?? undefined,
          productImageUris: selectedProductImageUris,
          imageLinks: imageUrls,
        }
      );

      clearFormAndAssets();
      onProductCreated();
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : t('addProduct.errors.saveFailed');
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const displayedError = error ?? firstFieldError(errors);
  const categoryOptions = buildProductCategoryOptions(categories);

  useEffect(() => {
    const firstErrorField = fieldErrorOrder.find((field) => Boolean(errors[field]));
    if (!firstErrorField) {
      return;
    }

    const section = getSectionForField(firstErrorField);
    if (!section) {
      return;
    }

    setOpenSections((prev) => {
      if (prev[section]) {
        return prev;
      }

      return { ...prev, [section]: true };
    });
  }, [errors]);

  const toggleSection = (section: AddProductSectionKey) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const renderInput = (
    name: Path<AddProductFormValues>,
    placeholder: string,
    options?: {
      keyboardType?: 'default' | 'numeric';
      rules?: RegisterOptions<AddProductFormValues>;
    }
  ) => (
    <Controller
      key={name}
      control={control}
      name={name}
      rules={options?.rules}
      render={({ field: { onChange, value, onBlur } }) => (
        <TextInput
          value={value}
          onBlur={onBlur}
          onChangeText={(nextValue) => {
            setError(null);
            onChange(nextValue);
          }}
          placeholder={placeholder}
          keyboardType={options?.keyboardType ?? 'default'}
          className="rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-base text-gray-900"
          placeholderTextColor="#9ca3af"
        />
      )}
    />
  );

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/40 px-4 py-6">
        <ScrollView className="rounded-3xl bg-white p-6 shadow-lg">
          <Text className="text-xl font-semibold text-gray-900">Lisää tuote</Text>
          <Text className="text-sm text-gray-500 mt-2">Täytä tuotteen tiedot ja tallenna varastoon.</Text>

          <View className="mt-5 space-y-3">
            <Accordion
              title={t('addProduct.sections.basic')}
              isOpen={openSections.basic}
              onToggle={() => toggleSection('basic')}
            >
              <View className="space-y-3">
                <View>
                  <Text className="mb-2 text-sm font-medium text-gray-700">{t('addProduct.fields.categoryLabel')}</Text>
                  <Controller
                    control={control}
                    name="category"
                    render={({ field: { value, onChange } }) => (
                      <View className="space-y-2">
                        <View className="flex-row flex-wrap gap-2">
                          <TouchableOpacity
                            onPress={() => {
                              setError(null);
                              onChange('');
                            }}
                            className={`rounded-2xl border px-3 py-2 ${!value ? 'border-primary-600 bg-primary-50' : 'border-gray-300 bg-gray-50'}`}
                          >
                            <Text className={`text-sm ${!value ? 'text-primary-700' : 'text-gray-700'}`}>{t('addProduct.fields.noCategory')}</Text>
                          </TouchableOpacity>
                          {categoryOptions.map((option) => {
                            const isSelected = value === option.value;
                            return (
                              <TouchableOpacity
                                key={option.value}
                                onPress={() => {
                                  setError(null);
                                  onChange(option.value);
                                }}
                                className={`rounded-2xl border px-3 py-2 ${isSelected ? 'border-primary-600 bg-primary-50' : 'border-gray-300 bg-gray-50'}`}
                              >
                                <Text className={`text-sm ${isSelected ? 'text-primary-700' : 'text-gray-700'}`}>{option.label}</Text>
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                        {isLoadingCategories ? <Text className="text-xs text-gray-500">{t('addProduct.fields.categoryLoading')}</Text> : null}
                        {!isLoadingCategories && categoryOptions.length === 0 ? (
                          <Text className="text-xs text-gray-500">{t('addProduct.fields.noCategoriesAvailable')}</Text>
                        ) : null}
                      </View>
                    )}
                  />
                </View>
                {renderInput('name', 'Tuotteen nimi', {
                  rules: {
                    validate: (value) => (value.trim() ? true : t('addProduct.errors.nameRequired')),
                  },
                })}
                {renderInput('amount', 'Varastosaldo', {
                  keyboardType: 'numeric',
                  rules: numericRequiredRule('amountInvalid'),
                })}
                {renderInput('ean', 'EAN')}
              </View>
            </Accordion>

            <Accordion
              title={t('addProduct.sections.price')}
              isOpen={openSections.price}
              onToggle={() => toggleSection('price')}
            >
              <View className="space-y-3">
                {renderInput('price', 'Hinta', {
                  keyboardType: 'numeric',
                  rules: numericRequiredRule('priceInvalid'),
                })}
                {renderInput('retailPrice', t('addProduct.fields.retailPricePlaceholder'), {
                  keyboardType: 'numeric',
                  rules: numericOptionalRule('retailPrice'),
                })}
                {renderInput('unitPrice', t('addProduct.fields.unitPricePlaceholder'), {
                  keyboardType: 'numeric',
                  rules: numericOptionalRule('unitPrice'),
                })}
              </View>
            </Accordion>

            <Accordion
              title={t('addProduct.sections.nutritions')}
              isOpen={openSections.nutritions}
              onToggle={() => toggleSection('nutritions')}
            >
              <View className="space-y-3">
                {renderInput('energyJoule', t('addProduct.fields.energyJoulePlaceholder'), {
                  keyboardType: 'numeric',
                  rules: numericOptionalRule('energyJoule'),
                })}
                {renderInput('energyCalory', t('addProduct.fields.energyCaloryPlaceholder'), {
                  keyboardType: 'numeric',
                  rules: numericOptionalRule('energyCalory'),
                })}
                {renderInput('fat', t('addProduct.fields.fatPlaceholder'), {
                  keyboardType: 'numeric',
                  rules: numericOptionalRule('fat'),
                })}
                {renderInput('saturatedFat', t('addProduct.fields.saturatedFatPlaceholder'), {
                  keyboardType: 'numeric',
                  rules: numericOptionalRule('saturatedFat'),
                })}
                {renderInput('carbohydrate', t('addProduct.fields.carbohydratePlaceholder'), {
                  keyboardType: 'numeric',
                  rules: numericOptionalRule('carbohydrate'),
                })}
                {renderInput('saturatedCarbohydrate', t('addProduct.fields.saturatedCarbohydratePlaceholder'), {
                  keyboardType: 'numeric',
                  rules: numericOptionalRule('saturatedCarbohydrate'),
                })}
                {renderInput('protein', t('addProduct.fields.proteinPlaceholder'), {
                  keyboardType: 'numeric',
                  rules: numericOptionalRule('protein'),
                })}
                {renderInput('salt', t('addProduct.fields.saltPlaceholder'), {
                  keyboardType: 'numeric',
                  rules: numericOptionalRule('salt'),
                })}
                {renderInput('fiber', t('addProduct.fields.fiberPlaceholder'), {
                  keyboardType: 'numeric',
                  rules: numericOptionalRule('fiber'),
                })}
              </View>
            </Accordion>
          </View>

          <View className="mt-5 space-y-3">
            <Text className="text-sm font-medium text-gray-700">Tuotekuvat</Text>
            <TextInput
              value={imageUrl}
              onChangeText={setImageUrl}
              placeholder="Lisää kuvan URL"
              className="rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-base text-gray-900"
              placeholderTextColor="#9ca3af"
            />
            <View className="flex-row gap-3 justify-end">
              <TouchableOpacity onPress={handleAddImageUrl} className="rounded-2xl bg-primary-600 px-4 py-3">
                <Text className="text-center text-sm font-semibold text-white">Lisää URL</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={pickProductImage}
                className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-3 items-center justify-center"
              >
                <Text className="text-sm text-gray-600">Valitse kuva</Text>
              </TouchableOpacity>
            </View>

            {(imageUrls.length > 0 || selectedProductImageUris.length > 0) && (
              <View className="space-y-3">
                {imageUrls.map((url, index) => (
                  <View key={`link-${index}`} className="rounded-2xl border border-gray-200 bg-gray-50 p-3">
                    <View className="flex-row items-center justify-between">
                      <Text className="flex-1 text-sm text-gray-900" numberOfLines={1}>
                        {url}
                      </Text>
                      <TouchableOpacity onPress={() => handleRemoveImageUrl(index)}>
                        <Text className="text-sm font-semibold text-secondary-600">Poista</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
                {selectedProductImageUris.map((uri, index) => (
                  <View key={`local-${index}`} className="space-y-2">
                    <Image source={{ uri }} className="h-32 w-full rounded-2xl bg-gray-100" resizeMode="contain" />
                    <TouchableOpacity
                      onPress={() => handleRemoveSelectedProductImage(index)}
                      className="rounded-2xl bg-secondary-100 px-4 py-3"
                    >
                      <Text className="text-center text-sm font-semibold text-secondary-700">Poista valittu kuva</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>

          <View className="mt-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">Viivakoodikuva (valinnainen)</Text>
            <TouchableOpacity
              onPress={pickBarcodeImage}
              className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-6 items-center"
            >
              <Text className="text-sm text-gray-600">Valitse viivakoodikuva</Text>
            </TouchableOpacity>
            {selectedBarcodeImageUri ? (
              <View className="mt-3 space-y-3">
                <Image source={{ uri: selectedBarcodeImageUri }} className="w-full h-32 rounded-lg" resizeMode="contain" />
              </View>
            ) : null}
          </View>

          {displayedError ? <Text className="text-sm text-secondary-600 mt-3">{displayedError}</Text> : null}

          <View className="mt-6 flex-row justify-end space-x-3">
            <TouchableOpacity onPress={onClose} className="rounded-2xl bg-gray-100 px-5 py-3">
              <Text className="text-sm font-semibold text-gray-700">Peruuta</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSubmit(onSubmit)} className="rounded-2xl bg-primary-600 px-5 py-3">
              {isLoading ? <ActivityIndicator size="small" color="#fff" /> : <Text className="text-sm font-semibold text-white">Tallenna</Text>}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default AddProductModal;
