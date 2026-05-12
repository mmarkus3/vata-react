import { themeColors } from '@/constants/colors';
import { deleteProduct, getProductById, updateProduct } from '@/services/product';
import type { Product } from '@/types/product';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ProductDetailPage() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const productId = typeof id === 'string' ? id : undefined;

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [retailPrice, setRetailPrice] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [energyJoule, setEnergyJoule] = useState('');
  const [energyCalory, setEnergyCalory] = useState('');
  const [fat, setFat] = useState('');
  const [saturatedFat, setSaturatedFat] = useState('');
  const [carbohydrate, setCarbohydrate] = useState('');
  const [saturatedCarbohydrate, setSaturatedCarbohydrate] = useState('');
  const [protein, setProtein] = useState('');
  const [salt, setSalt] = useState('');
  const [fiber, setFiber] = useState('');
  const [amount, setAmount] = useState('');
  const [barcode, setBarcode] = useState('');
  const [barcodeImageUrl, setBarcodeImageUrl] = useState<string | null>(null);
  const [newBarcodeImageUri, setNewBarcodeImageUri] = useState<string | null>(null);
  const [originalBarcodeImageUrl, setOriginalBarcodeImageUrl] = useState<string | null>(null);
  const [barcodeUploadProgress, setBarcodeUploadProgress] = useState<number | null>(null);
  const [productImages, setProductImages] = useState<string[]>([]);
  const [newProductImageUris, setNewProductImageUris] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [ean, setEan] = useState('');
  const [error, setError] = useState<string | null>(null);
  const previewBarcodeImageUri = newBarcodeImageUri ?? barcodeImageUrl;
  const previewProductImages = [...productImages, ...newProductImageUris];

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
          setName(result.name);
          setPrice(String(result.price));
          setRetailPrice(result.retailPrice !== undefined ? String(result.retailPrice) : '');
          setUnitPrice(result.unitPrice !== undefined ? String(result.unitPrice) : '');
          setEnergyJoule(result.energyJoule !== undefined ? String(result.energyJoule) : '');
          setEnergyCalory(result.energyCalory !== undefined ? String(result.energyCalory) : '');
          setFat(result.fat !== undefined ? String(result.fat) : '');
          setSaturatedFat(result.saturatedFat !== undefined ? String(result.saturatedFat) : '');
          setCarbohydrate(result.carbohydrate !== undefined ? String(result.carbohydrate) : '');
          setSaturatedCarbohydrate(result.saturatedCarbohydrate !== undefined ? String(result.saturatedCarbohydrate) : '');
          setProtein(result.protein !== undefined ? String(result.protein) : '');
          setSalt(result.salt !== undefined ? String(result.salt) : '');
          setFiber(result.fiber !== undefined ? String(result.fiber) : '');
          setAmount(String(result.amount));
          setEan(result.ean);
          setProductImages(Array.isArray(result.images) ? result.images : []);

          if (/^https?:\/\//i.test(result.barcode)) {
            setBarcodeImageUrl(result.barcode);
            setOriginalBarcodeImageUrl(result.barcode);
            setBarcode('');
          } else {
            setBarcode(result.barcode);
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
  }, [productId, t]);

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

  const handleSave = async () => {
    if (!productId) return;
    if (!name.trim()) {
      setError(t('productDetail.errors.nameRequired'));
      return;
    }

    const amountValue = Number(amount);
    const priceValue = Number(price);
    const retailPriceInput = retailPrice.trim();
    const unitPriceInput = unitPrice.trim();
    const retailPriceValue = retailPriceInput ? Number(retailPriceInput.replace(',', '.')) : undefined;
    const unitPriceValue = unitPriceInput ? Number(unitPriceInput.replace(',', '.')) : undefined;
    const nutritionEntries = [
      ['energyJoule', energyJoule],
      ['energyCalory', energyCalory],
      ['fat', fat],
      ['saturatedFat', saturatedFat],
      ['carbohydrate', carbohydrate],
      ['saturatedCarbohydrate', saturatedCarbohydrate],
      ['protein', protein],
      ['salt', salt],
      ['fiber', fiber],
    ] as const;
    const nutritionValues = Object.fromEntries(
      nutritionEntries.map(([key, raw]) => {
        const trimmed = raw.trim();
        return [key, trimmed ? Number(trimmed.replace(',', '.')) : undefined];
      })
    ) as Partial<
      Pick<
        Product,
        | 'energyJoule'
        | 'energyCalory'
        | 'fat'
        | 'saturatedFat'
        | 'carbohydrate'
        | 'saturatedCarbohydrate'
        | 'protein'
        | 'salt'
        | 'fiber'
      >
    >;

    if (Number.isNaN(amountValue) || amountValue < 0) {
      setError(t('productDetail.errors.amountInvalid'));
      return;
    }

    if (Number.isNaN(priceValue) || priceValue < 0) {
      setError(t('productDetail.errors.priceInvalid'));
      return;
    }
    if (retailPriceValue !== undefined && (Number.isNaN(retailPriceValue) || retailPriceValue < 0)) {
      setError(t('productDetail.errors.retailPriceInvalid'));
      return;
    }
    if (unitPriceValue !== undefined && (Number.isNaN(unitPriceValue) || unitPriceValue < 0)) {
      setError(t('productDetail.errors.unitPriceInvalid'));
      return;
    }
    for (const [key, value] of Object.entries(nutritionValues)) {
      if (value !== undefined && (Number.isNaN(value) || value < 0)) {
        setError(t(`productDetail.errors.${key}Invalid`));
        return;
      }
    }

    setIsSaving(true);
    setBarcodeUploadProgress(null);
    setError(null);

    try {
      const data: Partial<Omit<Product, 'id' | 'company'>> = {
        name: name.trim(),
        price: priceValue,
        retailPrice: retailPriceValue,
        unitPrice: unitPriceValue,
        ...nutritionValues,
        amount: amountValue,
        ean: ean.trim(),
        images: [...productImages, ...imageUrls],
      };

      if (newBarcodeImageUri) {
        data.barcode = previewBarcodeImageUri ?? undefined;
      } else if (previewBarcodeImageUri) {
        data.barcode = previewBarcodeImageUri;
      } else {
        data.barcode = barcode.trim();
      }

      await updateProduct(
        productId,
        data,
        {
          companyId: product?.company,
          oldBarcodeImageUrl: originalBarcodeImageUrl ?? undefined,
          newBarcodeImageUri: newBarcodeImageUri ?? undefined,
          productImageUris: newProductImageUris,
          onUploadProgress: (progress) => setBarcodeUploadProgress(progress),
        }
      );

      const updated = await getProductById(productId);
      if (updated) {
        setProduct(updated);
        setRetailPrice(updated.retailPrice !== undefined ? String(updated.retailPrice) : '');
        setUnitPrice(updated.unitPrice !== undefined ? String(updated.unitPrice) : '');
        setEnergyJoule(updated.energyJoule !== undefined ? String(updated.energyJoule) : '');
        setEnergyCalory(updated.energyCalory !== undefined ? String(updated.energyCalory) : '');
        setFat(updated.fat !== undefined ? String(updated.fat) : '');
        setSaturatedFat(updated.saturatedFat !== undefined ? String(updated.saturatedFat) : '');
        setCarbohydrate(updated.carbohydrate !== undefined ? String(updated.carbohydrate) : '');
        setSaturatedCarbohydrate(updated.saturatedCarbohydrate !== undefined ? String(updated.saturatedCarbohydrate) : '');
        setProtein(updated.protein !== undefined ? String(updated.protein) : '');
        setSalt(updated.salt !== undefined ? String(updated.salt) : '');
        setFiber(updated.fiber !== undefined ? String(updated.fiber) : '');
        setProductImages(Array.isArray(updated.images) ? updated.images : []);
        if (/^https?:\/\//i.test(updated.barcode)) {
          setBarcodeImageUrl(updated.barcode);
          setOriginalBarcodeImageUrl(updated.barcode);
          setBarcode('');
        } else {
          setBarcode(updated.barcode);
          setBarcodeImageUrl(null);
          setOriginalBarcodeImageUrl(null);
        }
      }

      setNewBarcodeImageUri(null);
      setNewProductImageUris([]);
      setImageUrls([]);
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
      setAmount('0');
      const updated = await getProductById(productId);
      setProduct(updated);
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
            <View>
              <Text className="text-sm text-gray-500">{t('productDetail.fields.barcode')}</Text>
              {previewBarcodeImageUri ? (
                <View className="mt-3 space-y-3">
                  <Image
                    source={{ uri: previewBarcodeImageUri }}
                    className="h-48 w-full rounded-2xl bg-gray-100"
                    resizeMode="contain"
                  />
                  {editMode ? (
                    <View className="flex-row flex-wrap gap-3">
                      <TouchableOpacity
                        onPress={handleRemoveBarcodeImage}
                        className="rounded-2xl bg-secondary-600 px-4 py-3"
                      >
                        <Text className="text-center text-sm font-semibold text-white">Poista kuva</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={handleSelectBarcodeImage}
                        className="rounded-2xl bg-primary-600 px-4 py-3"
                      >
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
                  <TextInput
                    value={barcode}
                    onChangeText={setBarcode}
                    placeholder={t('productDetail.barcode.inputPlaceholder')}
                    className="mt-1 rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-base text-gray-900"
                  />
                  <TouchableOpacity
                    onPress={handleSelectBarcodeImage}
                    className="rounded-2xl bg-primary-600 px-4 py-3"
                  >
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
              <Text className="text-sm text-gray-500">{t('productDetail.fields.name')}</Text>
              {editMode ? (
                <TextInput
                  value={name}
                  onChangeText={setName}
                  className="mt-1 rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-base text-gray-900"
                />
              ) : (
                <Text className="mt-1 text-base font-medium text-gray-900">{product?.name}</Text>
              )}
            </View>

            <View>
              <Text className="text-sm text-gray-500">{t('productDetail.fields.price')}</Text>
              {editMode ? (
                <TextInput
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="numeric"
                  className="mt-1 rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-base text-gray-900"
                />
              ) : (
                <Text className="mt-1 text-base font-medium text-gray-900">{product?.price.toFixed(2)}€</Text>
              )}
            </View>

            <View>
              <Text className="text-sm text-gray-500">{t('productDetail.fields.retailPrice')}</Text>
              {editMode ? (
                <TextInput
                  value={retailPrice}
                  onChangeText={setRetailPrice}
                  keyboardType="numeric"
                  placeholder={t('productDetail.fields.retailPricePlaceholder')}
                  className="mt-1 rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-base text-gray-900"
                />
              ) : (
                <Text className="mt-1 text-base font-medium text-gray-900">
                  {product?.retailPrice !== undefined ? `${product.retailPrice.toFixed(2)}€` : '-'}
                </Text>
              )}
            </View>

            <View>
              <Text className="text-sm text-gray-500">{t('productDetail.fields.unitPrice')}</Text>
              {editMode ? (
                <TextInput
                  value={unitPrice}
                  onChangeText={setUnitPrice}
                  keyboardType="numeric"
                  placeholder={t('productDetail.fields.unitPricePlaceholder')}
                  className="mt-1 rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-base text-gray-900"
                />
              ) : (
                <Text className="mt-1 text-base font-medium text-gray-900">
                  {product?.unitPrice !== undefined ? `${product.unitPrice.toFixed(2)}€/kg` : '-'}
                </Text>
              )}
            </View>

            <View>
              <Text className="text-sm text-gray-500">{t('productDetail.fields.energyJoule')}</Text>
              {editMode ? (
                <TextInput
                  value={energyJoule}
                  onChangeText={setEnergyJoule}
                  keyboardType="numeric"
                  placeholder={t('productDetail.fields.energyJoulePlaceholder')}
                  className="mt-1 rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-base text-gray-900"
                />
              ) : (
                <Text className="mt-1 text-base font-medium text-gray-900">{product?.energyJoule ?? '-'}</Text>
              )}
            </View>

            <View>
              <Text className="text-sm text-gray-500">{t('productDetail.fields.energyCalory')}</Text>
              {editMode ? (
                <TextInput
                  value={energyCalory}
                  onChangeText={setEnergyCalory}
                  keyboardType="numeric"
                  placeholder={t('productDetail.fields.energyCaloryPlaceholder')}
                  className="mt-1 rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-base text-gray-900"
                />
              ) : (
                <Text className="mt-1 text-base font-medium text-gray-900">{product?.energyCalory ?? '-'}</Text>
              )}
            </View>

            <View>
              <Text className="text-sm text-gray-500">{t('productDetail.fields.fat')}</Text>
              {editMode ? (
                <TextInput
                  value={fat}
                  onChangeText={setFat}
                  keyboardType="numeric"
                  placeholder={t('productDetail.fields.fatPlaceholder')}
                  className="mt-1 rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-base text-gray-900"
                />
              ) : (
                <Text className="mt-1 text-base font-medium text-gray-900">{product?.fat ?? '-'}</Text>
              )}
            </View>

            <View>
              <Text className="text-sm text-gray-500">{t('productDetail.fields.saturatedFat')}</Text>
              {editMode ? (
                <TextInput
                  value={saturatedFat}
                  onChangeText={setSaturatedFat}
                  keyboardType="numeric"
                  placeholder={t('productDetail.fields.saturatedFatPlaceholder')}
                  className="mt-1 rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-base text-gray-900"
                />
              ) : (
                <Text className="mt-1 text-base font-medium text-gray-900">{product?.saturatedFat ?? '-'}</Text>
              )}
            </View>

            <View>
              <Text className="text-sm text-gray-500">{t('productDetail.fields.carbohydrate')}</Text>
              {editMode ? (
                <TextInput
                  value={carbohydrate}
                  onChangeText={setCarbohydrate}
                  keyboardType="numeric"
                  placeholder={t('productDetail.fields.carbohydratePlaceholder')}
                  className="mt-1 rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-base text-gray-900"
                />
              ) : (
                <Text className="mt-1 text-base font-medium text-gray-900">{product?.carbohydrate ?? '-'}</Text>
              )}
            </View>

            <View>
              <Text className="text-sm text-gray-500">{t('productDetail.fields.saturatedCarbohydrate')}</Text>
              {editMode ? (
                <TextInput
                  value={saturatedCarbohydrate}
                  onChangeText={setSaturatedCarbohydrate}
                  keyboardType="numeric"
                  placeholder={t('productDetail.fields.saturatedCarbohydratePlaceholder')}
                  className="mt-1 rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-base text-gray-900"
                />
              ) : (
                <Text className="mt-1 text-base font-medium text-gray-900">{product?.saturatedCarbohydrate ?? '-'}</Text>
              )}
            </View>

            <View>
              <Text className="text-sm text-gray-500">{t('productDetail.fields.protein')}</Text>
              {editMode ? (
                <TextInput
                  value={protein}
                  onChangeText={setProtein}
                  keyboardType="numeric"
                  placeholder={t('productDetail.fields.proteinPlaceholder')}
                  className="mt-1 rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-base text-gray-900"
                />
              ) : (
                <Text className="mt-1 text-base font-medium text-gray-900">{product?.protein ?? '-'}</Text>
              )}
            </View>

            <View>
              <Text className="text-sm text-gray-500">{t('productDetail.fields.salt')}</Text>
              {editMode ? (
                <TextInput
                  value={salt}
                  onChangeText={setSalt}
                  keyboardType="numeric"
                  placeholder={t('productDetail.fields.saltPlaceholder')}
                  className="mt-1 rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-base text-gray-900"
                />
              ) : (
                <Text className="mt-1 text-base font-medium text-gray-900">{product?.salt ?? '-'}</Text>
              )}
            </View>

            <View>
              <Text className="text-sm text-gray-500">{t('productDetail.fields.fiber')}</Text>
              {editMode ? (
                <TextInput
                  value={fiber}
                  onChangeText={setFiber}
                  keyboardType="numeric"
                  placeholder={t('productDetail.fields.fiberPlaceholder')}
                  className="mt-1 rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-base text-gray-900"
                />
              ) : (
                <Text className="mt-1 text-base font-medium text-gray-900">{product?.fiber ?? '-'}</Text>
              )}
            </View>

            <View>
              <Text className="text-sm text-gray-500">{t('productDetail.fields.amount')}</Text>
              {editMode ? (
                <TextInput
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                  className="mt-1 rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-base text-gray-900"
                />
              ) : (
                <Text className="mt-1 text-base font-medium text-gray-900">{product?.amount}</Text>
              )}
            </View>

            <View>
              <Text className="text-sm text-gray-500">{t('productDetail.fields.ean')}</Text>
              {editMode ? (
                <TextInput
                  value={ean}
                  onChangeText={setEan}
                  className="mt-1 rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-base text-gray-900"
                />
              ) : (
                <Text className="mt-1 text-base font-medium text-gray-900">{product?.ean || '-'}</Text>
              )}
            </View>

          </View>

          {error ? <Text className="mt-4 text-sm text-secondary-600">{error}</Text> : null}

          <View className="mt-6 space-y-3">
            <TouchableOpacity
              onPress={() => setEditMode((prev) => !prev)}
              className="rounded-2xl bg-primary-600 px-4 py-3"
            >
              <Text className="text-center text-sm font-semibold text-white">{editMode ? t('productDetail.actions.cancelEdit') : t('productDetail.actions.editProduct')}</Text>
            </TouchableOpacity>

            {editMode ? (
              <TouchableOpacity
                onPress={handleSave}
                className="rounded-2xl bg-primary-700 px-4 py-3"
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text className="text-center text-sm font-semibold text-white">Tallenna muutokset</Text>
                )}
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity
              onPress={handleResetAmount}
              className="rounded-2xl bg-gray-100 px-4 py-3"
              disabled={isSaving}
            >
              <Text className="text-center text-sm font-semibold text-gray-700">Nollaa määrä</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDelete}
              className="rounded-2xl bg-secondary-600 px-4 py-3"
              disabled={isDeleting}
            >
              <Text className="text-center text-sm font-semibold text-white">Poista tuote</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
