import { getSectionForField, ProductDetailSectionKey } from '@/app/product/productDetailAccordion';
import {
  buildNutritionValues,
  defaultProductDetailFormValues,
  isNonNegativeNumber,
  isRequiredNonNegativeNumber,
  NutritionFieldKey,
  nutritionFieldKeys,
  parseOptionalDecimal,
  ProductDetailFormValues,
  toProductDetailFormValues,
} from '@/app/product/productDetailForm';
import Accordion from '@/components/ui/accordion';
import { themeColors } from '@/constants/colors';
import { useCategories } from '@/hooks/useCategories';
import { deleteProduct, getProductById, updateProduct } from '@/services/product';
import type { Product } from '@/types/product';
import { buildProductCategoryOptions } from '@/utils/productCategoryOptions';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Controller, FieldErrors, Path, RegisterOptions, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

const fieldErrorOrder: Path<ProductDetailFormValues>[] = [
  'category',
  'name',
  'countryOfOrigin',
  'ingredients_fi',
  'ingredients_sv',
  'ingredients_en',
  'description_fi',
  'description_sv',
  'description_en',
  'price',
  'amount',
  'retailPrice',
  'unitPrice',
  ...nutritionFieldKeys,
];

export default function ProductDetailPage() {
  const { t } = useTranslation();
  const { categories, isLoading: isLoadingCategories } = useCategories();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const productId = typeof id === 'string' ? id : undefined;

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<ProductDetailFormValues>({
    defaultValues: defaultProductDetailFormValues,
    mode: 'onSubmit',
  });

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [barcodeImageUrl, setBarcodeImageUrl] = useState<string | null>(null);
  const [newBarcodeImageUri, setNewBarcodeImageUri] = useState<string | null>(null);
  const [originalBarcodeImageUrl, setOriginalBarcodeImageUrl] = useState<string | null>(null);
  const [barcodeUploadProgress, setBarcodeUploadProgress] = useState<number | null>(null);
  const [productImages, setProductImages] = useState<string[]>([]);
  const [newProductImageUris, setNewProductImageUris] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [openSections, setOpenSections] = useState<Record<ProductDetailSectionKey, boolean>>({
    basic: true,
    additionalInfo: false,
    price: false,
    nutritions: false,
  });
  const previewBarcodeImageUri = newBarcodeImageUri ?? barcodeImageUrl;
  const previewProductImages = [...productImages, ...newProductImageUris];

  const firstFieldError = (fieldErrors: FieldErrors<ProductDetailFormValues>): string | null => {
    for (const key of fieldErrorOrder) {
      const message = fieldErrors[key]?.message;
      if (typeof message === 'string' && message.length > 0) {
        return message;
      }
    }
    return null;
  };

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

  useEffect(() => {
    const load = async () => {
      if (!productId) {
        setError(t('productDetail.errors.notSelected'));
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await getProductById(productId);
        if (!result) {
          setError(t('productDetail.errors.notFound'));
        } else {
          setProduct(result);
          reset(toProductDetailFormValues(result));
          setProductImages(Array.isArray(result.images) ? result.images : []);

          if (/^https?:\/\//i.test(result.barcode)) {
            setBarcodeImageUrl(result.barcode);
            setOriginalBarcodeImageUrl(result.barcode);
          } else {
            setBarcodeImageUrl(null);
            setOriginalBarcodeImageUrl(null);
          }
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : t('productDetail.errors.loadFailed');
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [productId, reset, t]);

  const resetEditAssets = () => {
    setNewBarcodeImageUri(null);
    setNewProductImageUris([]);
    setImageUrlInput('');
    setImageUrls([]);
    setBarcodeUploadProgress(null);
  };

  const handleToggleEdit = () => {
    if (!editMode && product) {
      reset(toProductDetailFormValues(product));
      setError(null);
      resetEditAssets();
      setOpenSections({ basic: true, additionalInfo: false, price: false, nutritions: false });
    }

    setEditMode((prev) => !prev);
  };

  const toggleSection = (section: ProductDetailSectionKey) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSelectBarcodeImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        setError(t('productDetail.errors.mediaPermissionDenied'));
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });

      if (result.canceled) {
        return;
      }

      const selectedUri = result.assets?.[0]?.uri;
      if (!selectedUri) {
        return;
      }

      setNewBarcodeImageUri(selectedUri);
      setBarcodeImageUrl(null);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : t('productDetail.errors.imagePickFailed');
      setError(message);
    }
  };

  const handleRemoveBarcodeImage = () => {
    setNewBarcodeImageUri(null);
    setBarcodeImageUrl(null);
    setError(null);
  };

  const handleSelectProductImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        setError(t('productDetail.errors.mediaPermissionDenied'));
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });

      if (result.canceled) {
        return;
      }

      const selectedUri = result.assets?.[0]?.uri;
      if (!selectedUri) {
        return;
      }

      setNewProductImageUris((prev) => [...prev, selectedUri]);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : t('productDetail.errors.imagePickFailed');
      setError(message);
    }
  };

  const handleAddImageUrl = () => {
    const trimmedUrl = imageUrlInput.trim();
    if (!trimmedUrl) {
      setError(t('productDetail.errors.imageUrlRequired'));
      return;
    }

    if (!/^https?:\/\//i.test(trimmedUrl)) {
      setError(t('productDetail.errors.imageUrlInvalid'));
      return;
    }

    setImageUrls((prev) => [...prev, trimmedUrl]);
    setImageUrlInput('');
    setError(null);
  };

  const handleRemoveExistingProductImage = (index: number) => {
    setProductImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveNewProductImage = (index: number) => {
    setNewProductImageUris((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveImageUrl = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const numericOptionalRule = (key: (typeof nutritionFieldKeys)[number] | 'retailPrice' | 'unitPrice') => ({
    validate: (value: string) => {
      if (!value.trim()) {
        return true;
      }
      return isNonNegativeNumber(value) || t(`productDetail.errors.${key}Invalid`);
    },
  });

  const numericRequiredRule = (errorKey: 'amountInvalid' | 'priceInvalid'): RegisterOptions<ProductDetailFormValues> => ({
    validate: (value: string) => {
      return isRequiredNonNegativeNumber(value) || t(`productDetail.errors.${errorKey}`);
    },
  });

  const onSubmit = async (values: ProductDetailFormValues) => {
    if (!productId) return;

    const amountValue = Number(values.amount.trim().replace(',', '.'));
    const priceValue = Number(values.price.trim().replace(',', '.'));
    const retailPriceValue = parseOptionalDecimal(values.retailPrice);
    const unitPriceValue = parseOptionalDecimal(values.unitPrice);
    const nutritionValues = buildNutritionValues(values);
    const countryOfOrigin = values.countryOfOrigin.trim();
    const ingredientsFi = values.ingredients_fi.trim();
    const ingredientsSv = values.ingredients_sv.trim();
    const ingredientsEn = values.ingredients_en.trim();
    const descriptionFi = values.description_fi.trim();
    const descriptionSv = values.description_sv.trim();
    const descriptionEn = values.description_en.trim();

    setIsSaving(true);
    setBarcodeUploadProgress(null);
    setError(null);

    try {
      const data: Partial<Omit<Product, 'id' | 'company'>> = {
        category: values.category.trim() || undefined,
        name: values.name.trim(),
        price: priceValue,
        retailPrice: retailPriceValue,
        unitPrice: unitPriceValue,
        countryOfOrigin: countryOfOrigin || undefined,
        ingredients_fi: ingredientsFi || undefined,
        ingredients_sv: ingredientsSv || undefined,
        ingredients_en: ingredientsEn || undefined,
        description_fi: descriptionFi || undefined,
        description_sv: descriptionSv || undefined,
        description_en: descriptionEn || undefined,
        ...nutritionValues,
        amount: amountValue,
        ean: values.ean.trim(),
        images: [...productImages, ...imageUrls],
      };

      if (newBarcodeImageUri) {
        data.barcode = previewBarcodeImageUri ?? undefined;
      } else if (previewBarcodeImageUri) {
        data.barcode = previewBarcodeImageUri;
      } else {
        data.barcode = values.barcode.trim();
      }

      await updateProduct(productId, data, {
        companyId: product?.company,
        oldBarcodeImageUrl: originalBarcodeImageUrl ?? undefined,
        newBarcodeImageUri: newBarcodeImageUri ?? undefined,
        productImageUris: newProductImageUris,
        onUploadProgress: (progress) => setBarcodeUploadProgress(progress),
      });

      const updated = await getProductById(productId);
      if (updated) {
        setProduct(updated);
        reset(toProductDetailFormValues(updated));
        setProductImages(Array.isArray(updated.images) ? updated.images : []);

        if (/^https?:\/\//i.test(updated.barcode)) {
          setBarcodeImageUrl(updated.barcode);
          setOriginalBarcodeImageUrl(updated.barcode);
        } else {
          setBarcodeImageUrl(null);
          setOriginalBarcodeImageUrl(null);
        }
      }

      resetEditAssets();
      setEditMode(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : t('productDetail.errors.saveFailed');
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetAmount = async () => {
    if (!productId) return;
    setIsSaving(true);
    setError(null);

    try {
      await updateProduct(productId, { amount: 0 });
      reset({ ...getValues(), amount: '0' });
      const updated = await getProductById(productId);
      if (updated) {
        setProduct(updated);
        reset(toProductDetailFormValues(updated));
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : t('productDetail.errors.resetAmountFailed');
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    if (!productId) return;

    Alert.alert(t('productDetail.delete.title'), t('productDetail.delete.confirmMessage'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: async () => {
          setIsDeleting(true);
          setError(null);

          try {
            await deleteProduct(productId);
            router.replace('/(home)');
          } catch (err) {
            const message = err instanceof Error ? err.message : t('productDetail.errors.deleteFailed');
            setError(message);
          } finally {
            setIsDeleting(false);
          }
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color={themeColors.primary[600]} />
      </View>
    );
  }

  const displayedError = error ?? firstFieldError(errors);
  const categoryOptions = buildProductCategoryOptions(categories, getValues('category'));

  const renderInput = (
    name: Path<ProductDetailFormValues>,
    options?: {
      keyboardType?: 'default' | 'numeric';
      placeholder?: string;
      rules?: RegisterOptions<ProductDetailFormValues>;
    }
  ) => (
    <Controller
      key={name}
      control={control}
      name={name}
      rules={options?.rules}
      render={({ field: { onChange, onBlur, value } }) => (
        <TextInput
          value={value}
          onBlur={onBlur}
          onChangeText={(nextValue) => {
            setError(null);
            onChange(nextValue);
          }}
          placeholder={options?.placeholder}
          keyboardType={options?.keyboardType ?? 'default'}
          className="mt-1 rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-base text-gray-900"
        />
      )}
    />
  );

  const renderNumericNutritionInput = (name: NutritionFieldKey, placeholderKey: string) =>
    editMode
      ? renderInput(name, {
        keyboardType: 'numeric',
        placeholder: t(placeholderKey),
        rules: numericOptionalRule(name),
      })
      : <Text className="mt-1 text-base font-medium text-gray-900">{product?.[name] ?? '-'}</Text>;

  return (
    <View className="flex-1 bg-slate-50">
      <Stack.Screen options={{ title: product?.name ?? t('productDetail.title') }} />
      <ScrollView className="px-6 py-6">
        <TouchableOpacity onPress={() => router.back()} className="mb-4 rounded-full bg-white px-4 py-3 shadow-sm">
          <Text className="text-sm font-semibold text-primary-600">← Palaa</Text>
        </TouchableOpacity>

        <View className="rounded-3xl bg-white p-6 shadow-sm">
          <Text className="text-2xl font-bold text-gray-900">{t('productDetail.title')}</Text>

          <View className="mt-5 space-y-4">
            <Accordion
              title={t('productDetail.sections.basic')}
              isOpen={openSections.basic}
              onToggle={() => toggleSection('basic')}
            >
              <View className="space-y-4">
                <View>
                  <Text className="text-sm text-gray-500">{t('productDetail.fields.barcode')}</Text>
                  {previewBarcodeImageUri ? (
                    <View className="mt-3 space-y-3">
                      <Image source={{ uri: previewBarcodeImageUri }} className="h-48 w-full rounded-2xl bg-gray-100" resizeMode="contain" />
                      {editMode ? (
                        <View className="flex-row flex-wrap gap-3">
                          <TouchableOpacity onPress={handleRemoveBarcodeImage} className="rounded-2xl bg-secondary-600 px-4 py-3">
                            <Text className="text-center text-sm font-semibold text-white">Poista kuva</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={handleSelectBarcodeImage} className="rounded-2xl bg-primary-600 px-4 py-3">
                            <Text className="text-center text-sm font-semibold text-white">Valitse uusi kuva</Text>
                          </TouchableOpacity>
                        </View>
                      ) : null}
                      {newBarcodeImageUri ? (
                        <Text className="text-sm text-gray-500">{t('productDetail.barcode.newImageSelected')}</Text>
                      ) : (
                        <Text className="text-sm text-gray-500">{t('productDetail.barcode.savedImage')}</Text>
                      )}
                    </View>
                  ) : editMode ? (
                    <View className="space-y-3">
                      {renderInput('barcode', { placeholder: t('productDetail.barcode.inputPlaceholder') })}
                      <TouchableOpacity onPress={handleSelectBarcodeImage} className="rounded-2xl bg-primary-600 px-4 py-3">
                        <Text className="text-center text-sm font-semibold text-white">{t('productDetail.barcode.addImage')}</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <Text className="mt-1 text-base font-medium text-gray-900">{product?.barcode || '-'}</Text>
                  )}
                  {barcodeUploadProgress !== null ? (
                    <Text className="mt-2 text-sm text-gray-500">{t('productDetail.barcode.uploadProgress', { progress: barcodeUploadProgress })}</Text>
                  ) : null}
                </View>

                <View>
                  <Text className="text-sm text-gray-500">{t('productDetail.productImages.title')}</Text>
                  {previewProductImages.length > 0 ? (
                    <View className="mt-3 space-y-3">
                      {previewProductImages.map((uri, index) => (
                        <View key={`${uri}-${index}`} className="rounded-2xl bg-gray-50 p-3">
                          <Image source={{ uri }} className="h-10 w-10 rounded-2xl bg-gray-100" resizeMode="contain" />
                          {editMode ? (
                            <TouchableOpacity
                              onPress={() => {
                                if (index < productImages.length) {
                                  handleRemoveExistingProductImage(index);
                                } else {
                                  handleRemoveNewProductImage(index - productImages.length);
                                }
                              }}
                              className="mt-3 rounded-2xl bg-secondary-100 px-4 py-3"
                              accessibilityRole="button"
                              accessibilityLabel={t('productDetail.productImages.removeImage')}
                            >
                              <Text className="text-center text-sm font-semibold text-secondary-700">{t('productDetail.productImages.removeImage')}</Text>
                            </TouchableOpacity>
                          ) : null}
                        </View>
                      ))}
                    </View>
                  ) : (
                    <Text className="mt-2 text-base font-medium text-gray-900">{t('productDetail.productImages.empty')}</Text>
                  )}

                  {editMode ? (
                    <View className="mt-4 space-y-3">
                      <View className="flex-row gap-3">
                        <TextInput
                          value={imageUrlInput}
                          onChangeText={setImageUrlInput}
                          placeholder={t('productDetail.productImages.urlPlaceholder')}
                          className="flex-1 rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-base text-gray-900"
                          placeholderTextColor="#9ca3af"
                        />
                        <TouchableOpacity
                          onPress={handleAddImageUrl}
                          className="rounded-2xl bg-primary-600 px-4 py-3"
                          accessibilityRole="button"
                          accessibilityLabel={t('productDetail.productImages.addUrl')}
                        >
                          <Text className="text-center text-sm font-semibold text-white">{t('productDetail.productImages.addUrl')}</Text>
                        </TouchableOpacity>
                      </View>
                      <TouchableOpacity
                        onPress={handleSelectProductImage}
                        className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-6 items-center"
                        accessibilityRole="button"
                        accessibilityLabel={t('productDetail.productImages.addFromDevice')}
                      >
                        <Text className="text-sm text-gray-600">{t('productDetail.productImages.addFromDevice')}</Text>
                      </TouchableOpacity>
                      {imageUrls.length > 0 && (
                        <View className="space-y-3">
                          {imageUrls.map((url, index) => (
                            <View key={`url-${index}`} className="rounded-2xl border border-gray-200 bg-gray-50 p-3">
                              <View className="flex-row items-center justify-between">
                                <Text className="flex-1 text-sm text-gray-900" numberOfLines={1}>
                                  {url}
                                </Text>
                                <TouchableOpacity onPress={() => handleRemoveImageUrl(index)}>
                                  <Text className="text-sm font-semibold text-secondary-600">{t('common.delete')}</Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  ) : null}
                </View>

                <View>
                  <Text className="text-sm text-gray-500">{t('productDetail.fields.category')}</Text>
                  {editMode ? (
                    <Controller
                      control={control}
                      name="category"
                      render={({ field: { value, onChange } }) => (
                        <View className="mt-2 space-y-2">
                          <View className="flex-row flex-wrap gap-2">
                            <TouchableOpacity
                              onPress={() => {
                                setError(null);
                                onChange('');
                              }}
                              className={`rounded-2xl border px-3 py-2 ${!value ? 'border-primary-600 bg-primary-50' : 'border-gray-300 bg-gray-50'}`}
                            >
                              <Text className={`text-sm ${!value ? 'text-primary-700' : 'text-gray-700'}`}>{t('productDetail.fields.noCategory')}</Text>
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
                                  <Text className={`text-sm ${isSelected ? 'text-primary-700' : 'text-gray-700'}`}>
                                    {option.isFallback ? `${option.label} (${t('productDetail.fields.categoryFallback')})` : option.label}
                                  </Text>
                                </TouchableOpacity>
                              );
                            })}
                          </View>
                          {isLoadingCategories ? <Text className="text-xs text-gray-500">{t('productDetail.fields.categoryLoading')}</Text> : null}
                          {!isLoadingCategories && categoryOptions.length === 0 ? (
                            <Text className="text-xs text-gray-500">{t('productDetail.fields.noCategoriesAvailable')}</Text>
                          ) : null}
                        </View>
                      )}
                    />
                  ) : (
                    <Text className="mt-1 text-base font-medium text-gray-900">{product?.category || '-'}</Text>
                  )}
                </View>

                <View>
                  <Text className="text-sm text-gray-500">{t('productDetail.fields.name')}</Text>
                  {editMode ? renderInput('name', { rules: { validate: (value) => (value.trim() ? true : t('productDetail.errors.nameRequired')) } }) : <Text className="mt-1 text-base font-medium text-gray-900">{product?.name}</Text>}
                </View>

                <View>
                  <Text className="text-sm text-gray-500">{t('productDetail.fields.countryOfOrigin')}</Text>
                  {editMode ? renderInput('countryOfOrigin', { placeholder: t('productDetail.fields.countryOfOriginPlaceholder') }) : <Text className="mt-1 text-base font-medium text-gray-900">{product?.countryOfOrigin || '-'}</Text>}
                </View>

                <View>
                  <Text className="text-sm text-gray-500">{t('productDetail.fields.amount')}</Text>
                  {editMode ? renderInput('amount', { keyboardType: 'numeric', rules: numericRequiredRule('amountInvalid') }) : <Text className="mt-1 text-base font-medium text-gray-900">{product?.amount}</Text>}
                </View>

                <View>
                  <Text className="text-sm text-gray-500">{t('productDetail.fields.ean')}</Text>
                  {editMode ? renderInput('ean') : <Text className="mt-1 text-base font-medium text-gray-900">{product?.ean || '-'}</Text>}
                </View>
              </View>
            </Accordion>

            <Accordion
              title={t('productDetail.sections.additionalInfo')}
              isOpen={openSections.additionalInfo}
              onToggle={() => toggleSection('additionalInfo')}
            >
              <View className="space-y-4">
                <View>
                  <Text className="text-sm text-gray-500">{t('productDetail.fields.ingredientsFi')}</Text>
                  {editMode ? renderInput('ingredients_fi', { placeholder: t('productDetail.fields.ingredientsFiPlaceholder') }) : <Text className="mt-1 text-base font-medium text-gray-900">{product?.ingredients_fi || '-'}</Text>}
                </View>

                <View>
                  <Text className="text-sm text-gray-500">{t('productDetail.fields.ingredientsSv')}</Text>
                  {editMode ? renderInput('ingredients_sv', { placeholder: t('productDetail.fields.ingredientsSvPlaceholder') }) : <Text className="mt-1 text-base font-medium text-gray-900">{product?.ingredients_sv || '-'}</Text>}
                </View>

                <View>
                  <Text className="text-sm text-gray-500">{t('productDetail.fields.ingredientsEn')}</Text>
                  {editMode ? renderInput('ingredients_en', { placeholder: t('productDetail.fields.ingredientsEnPlaceholder') }) : <Text className="mt-1 text-base font-medium text-gray-900">{product?.ingredients_en || '-'}</Text>}
                </View>

                <View>
                  <Text className="text-sm text-gray-500">{t('productDetail.fields.descriptionFi')}</Text>
                  {editMode ? renderInput('description_fi', { placeholder: t('productDetail.fields.descriptionFiPlaceholder') }) : <Text className="mt-1 text-base font-medium text-gray-900">{product?.description_fi || '-'}</Text>}
                </View>

                <View>
                  <Text className="text-sm text-gray-500">{t('productDetail.fields.descriptionSv')}</Text>
                  {editMode ? renderInput('description_sv', { placeholder: t('productDetail.fields.descriptionSvPlaceholder') }) : <Text className="mt-1 text-base font-medium text-gray-900">{product?.description_sv || '-'}</Text>}
                </View>

                <View>
                  <Text className="text-sm text-gray-500">{t('productDetail.fields.descriptionEn')}</Text>
                  {editMode ? renderInput('description_en', { placeholder: t('productDetail.fields.descriptionEnPlaceholder') }) : <Text className="mt-1 text-base font-medium text-gray-900">{product?.description_en || '-'}</Text>}
                </View>
              </View>
            </Accordion>

            <Accordion
              title={t('productDetail.sections.price')}
              isOpen={openSections.price}
              onToggle={() => toggleSection('price')}
            >
              <View className="space-y-4">
                <View>
                  <Text className="text-sm text-gray-500">{t('productDetail.fields.price')}</Text>
                  {editMode ? renderInput('price', { keyboardType: 'numeric', rules: numericRequiredRule('priceInvalid') }) : <Text className="mt-1 text-base font-medium text-gray-900">{product?.price.toFixed(2)}€</Text>}
                </View>

                <View>
                  <Text className="text-sm text-gray-500">{t('productDetail.fields.retailPrice')}</Text>
                  {editMode
                    ? renderInput('retailPrice', {
                      keyboardType: 'numeric',
                      placeholder: t('productDetail.fields.retailPricePlaceholder'),
                      rules: numericOptionalRule('retailPrice'),
                    })
                    : <Text className="mt-1 text-base font-medium text-gray-900">{product?.retailPrice != null ? `${product.retailPrice.toFixed(2)}€` : '-'}</Text>}
                </View>

                <View>
                  <Text className="text-sm text-gray-500">{t('productDetail.fields.unitPrice')}</Text>
                  {editMode
                    ? renderInput('unitPrice', {
                      keyboardType: 'numeric',
                      placeholder: t('productDetail.fields.unitPricePlaceholder'),
                      rules: numericOptionalRule('unitPrice'),
                    })
                    : <Text className="mt-1 text-base font-medium text-gray-900">{product?.unitPrice != null ? `${product.unitPrice.toFixed(2)}€/kg` : '-'}</Text>}
                </View>
              </View>
            </Accordion>

            <Accordion
              title={t('productDetail.sections.nutritions')}
              isOpen={openSections.nutritions}
              onToggle={() => toggleSection('nutritions')}
            >
              <View className="space-y-4">
                <View>
                  <Text className="text-sm text-gray-500">{t('productDetail.fields.energyJoule')}</Text>
                  {renderNumericNutritionInput('energyJoule', 'productDetail.fields.energyJoulePlaceholder')}
                </View>
                <View>
                  <Text className="text-sm text-gray-500">{t('productDetail.fields.energyCalory')}</Text>
                  {renderNumericNutritionInput('energyCalory', 'productDetail.fields.energyCaloryPlaceholder')}
                </View>
                <View>
                  <Text className="text-sm text-gray-500">{t('productDetail.fields.fat')}</Text>
                  {renderNumericNutritionInput('fat', 'productDetail.fields.fatPlaceholder')}
                </View>
                <View>
                  <Text className="text-sm text-gray-500">{t('productDetail.fields.saturatedFat')}</Text>
                  {renderNumericNutritionInput('saturatedFat', 'productDetail.fields.saturatedFatPlaceholder')}
                </View>
                <View>
                  <Text className="text-sm text-gray-500">{t('productDetail.fields.carbohydrate')}</Text>
                  {renderNumericNutritionInput('carbohydrate', 'productDetail.fields.carbohydratePlaceholder')}
                </View>
                <View>
                  <Text className="text-sm text-gray-500">{t('productDetail.fields.saturatedCarbohydrate')}</Text>
                  {renderNumericNutritionInput('saturatedCarbohydrate', 'productDetail.fields.saturatedCarbohydratePlaceholder')}
                </View>
                <View>
                  <Text className="text-sm text-gray-500">{t('productDetail.fields.protein')}</Text>
                  {renderNumericNutritionInput('protein', 'productDetail.fields.proteinPlaceholder')}
                </View>
                <View>
                  <Text className="text-sm text-gray-500">{t('productDetail.fields.salt')}</Text>
                  {renderNumericNutritionInput('salt', 'productDetail.fields.saltPlaceholder')}
                </View>
                <View>
                  <Text className="text-sm text-gray-500">{t('productDetail.fields.fiber')}</Text>
                  {renderNumericNutritionInput('fiber', 'productDetail.fields.fiberPlaceholder')}
                </View>
              </View>
            </Accordion>
          </View>

          {displayedError ? <Text className="mt-4 text-sm text-secondary-600">{displayedError}</Text> : null}

          <View className="mt-6 space-y-3">
            <TouchableOpacity onPress={handleToggleEdit} className="rounded-2xl bg-primary-600 px-4 py-3">
              <Text className="text-center text-sm font-semibold text-white">{editMode ? t('productDetail.actions.cancelEdit') : t('productDetail.actions.editProduct')}</Text>
            </TouchableOpacity>

            {editMode ? (
              <TouchableOpacity onPress={handleSubmit(onSubmit)} className="rounded-2xl bg-primary-700 px-4 py-3" disabled={isSaving}>
                {isSaving ? <ActivityIndicator size="small" color="#fff" /> : <Text className="text-center text-sm font-semibold text-white">Tallenna muutokset</Text>}
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity onPress={handleResetAmount} className="rounded-2xl bg-gray-100 px-4 py-3" disabled={isSaving}>
              <Text className="text-center text-sm font-semibold text-gray-700">Nollaa määrä</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleDelete} className="rounded-2xl bg-secondary-600 px-4 py-3" disabled={isDeleting}>
              <Text className="text-center text-sm font-semibold text-white">Poista tuote</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
