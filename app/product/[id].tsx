import { themeColors } from '@/constants/colors';
import { deleteProduct, getProductById, updateProduct } from '@/services/product';
import type { Product } from '@/types/product';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ProductDetailPage() {
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
  const [amount, setAmount] = useState('');
  const [barcode, setBarcode] = useState('');
  const [barcodeImageUrl, setBarcodeImageUrl] = useState<string | null>(null);
  const [newBarcodeImageUri, setNewBarcodeImageUri] = useState<string | null>(null);
  const [originalBarcodeImageUrl, setOriginalBarcodeImageUrl] = useState<string | null>(null);
  const [barcodeUploadProgress, setBarcodeUploadProgress] = useState<number | null>(null);
  const [ean, setEan] = useState('');
  const [error, setError] = useState<string | null>(null);
  const previewBarcodeImageUri = newBarcodeImageUri ?? barcodeImageUrl;

  useEffect(() => {
    const load = async () => {
      if (!productId) {
        setError('Tuotetta ei ole valittu.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await getProductById(productId);
        if (!result) {
          setError('Tuotetta ei löytynyt.');
        } else {
          setProduct(result);
          setName(result.name);
          setPrice(String(result.price));
          setAmount(String(result.amount));
          setEan(result.ean);

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
        const message = err instanceof Error ? err.message : 'Tuotteen lataus epäonnistui.';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [productId]);

  const handleSelectBarcodeImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        setError('Käyttöoikeutta mediakirjastoon ei myönnetty.');
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
      const message = err instanceof Error ? err.message : 'Kuvan valinta epäonnistui.';
      setError(message);
    }
  };

  const handleRemoveBarcodeImage = () => {
    setNewBarcodeImageUri(null);
    setBarcodeImageUrl(null);
    setError(null);
  };

  const handleSave = async () => {
    if (!productId) return;
    if (!name.trim()) {
      setError('Anna tuotteen nimi.');
      return;
    }

    const amountValue = Number(amount);
    const priceValue = Number(price);

    if (Number.isNaN(amountValue) || amountValue < 0) {
      setError('Anna kelvollinen määrä.');
      return;
    }

    if (Number.isNaN(priceValue) || priceValue < 0) {
      setError('Anna kelvollinen hinta.');
      return;
    }

    setIsSaving(true);
    setBarcodeUploadProgress(null);
    setError(null);

    try {
      const data: Partial<Omit<Product, 'id' | 'company'>> = {
        name: name.trim(),
        price: priceValue,
        amount: amountValue,
        ean: ean.trim(),
      };

      if (newBarcodeImageUri) {
        // Save the new image URL and replace the existing barcode image.
      } else if (previewBarcodeImageUri) {
        data.barcode = previewBarcodeImageUri;
      } else {
        data.barcode = barcode.trim();
      }

      await updateProduct(
        productId,
        data,
        product?.company,
        originalBarcodeImageUrl ?? undefined,
        newBarcodeImageUri ?? undefined,
        (progress) => setBarcodeUploadProgress(progress)
      );

      const updated = await getProductById(productId);
      if (updated) {
        setProduct(updated);
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
      setEditMode(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Tallennus epäonnistui.';
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
      const message = err instanceof Error ? err.message : 'Määrän nollaus epäonnistui.';
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    if (!productId) return;

    Alert.alert('Poista tuote', 'Haluatko varmasti poistaa tämän tuotteen?', [
      { text: 'Peruuta', style: 'cancel' },
      {
        text: 'Poista',
        style: 'destructive',
        onPress: async () => {
          setIsDeleting(true);
          setError(null);

          try {
            await deleteProduct(productId);
            router.replace('/home');
          } catch (err) {
            const message = err instanceof Error ? err.message : 'Poisto epäonnistui.';
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
      <Stack.Screen options={{ title: product?.name ?? 'Tuotteen tiedot' }} />
      <ScrollView className="px-6 py-6">
        <TouchableOpacity onPress={() => router.back()} className="mb-4 rounded-full bg-white px-4 py-3 shadow-sm">
          <Text className="text-sm font-semibold text-primary-600">← Palaa</Text>
        </TouchableOpacity>

        <View className="rounded-3xl bg-white p-6 shadow-sm">
          <Text className="text-2xl font-bold text-gray-900">Tuotteen tiedot</Text>
          <Text className="text-sm text-gray-500 mt-1">ID: {product?.id}</Text>

          <View className="mt-5 space-y-4">
            <View>
              <Text className="text-sm text-gray-500">Viivakoodi</Text>
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
                    <Text className="text-sm text-gray-500">Uusi kuva on valittu ja tallennetaan.</Text>
                  ) : (
                    <Text className="text-sm text-gray-500">Tallennettu viivakoodikuva.</Text>
                  )}
                </View>
              ) : editMode ? (
                <View className="space-y-3">
                  <TextInput
                    value={barcode}
                    onChangeText={setBarcode}
                    placeholder="Syötä viivakoodi tai lisää kuva"
                    className="mt-1 rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-base text-gray-900"
                  />
                  <TouchableOpacity
                    onPress={handleSelectBarcodeImage}
                    className="rounded-2xl bg-primary-600 px-4 py-3"
                  >
                    <Text className="text-center text-sm font-semibold text-white">Lisää viivakoodikuva</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <Text className="mt-1 text-base font-medium text-gray-900">{product?.barcode || '-'}</Text>
              )}
              {barcodeUploadProgress !== null ? (
                <Text className="mt-2 text-sm text-gray-500">Ladataan kuvaa {barcodeUploadProgress}%</Text>
              ) : null}
            </View>

            <View>
              <Text className="text-sm text-gray-500">Nimi</Text>
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
              <Text className="text-sm text-gray-500">Hinta</Text>
              {editMode ? (
                <TextInput
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="numeric"
                  className="mt-1 rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-base text-gray-900"
                />
              ) : (
                <Text className="mt-1 text-base font-medium text-gray-900">€{product?.price.toFixed(2)}</Text>
              )}
            </View>

            <View>
              <Text className="text-sm text-gray-500">Määrä</Text>
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
              <Text className="text-sm text-gray-500">EAN</Text>
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
              <Text className="text-center text-sm font-semibold text-white">{editMode ? 'Keskeytä muokkaus' : 'Muokkaa tuotetta'}</Text>
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
