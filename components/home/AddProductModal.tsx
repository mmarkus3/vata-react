import { useAuth } from '@/hooks/useAuth';
import { createProduct } from '@/services/product';
import * as ImagePicker from 'expo-image-picker';
import type { FC } from 'react';
import { useState } from 'react';
import { ActivityIndicator, Image, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface AddProductModalProps {
  visible: boolean;
  onClose: () => void;
  onProductCreated: () => void;
}

const AddProductModal: FC<AddProductModalProps> = ({ visible, onClose, onProductCreated }) => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [barcode, setBarcode] = useState('');
  const [ean, setEan] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [selectedProductImageUris, setSelectedProductImageUris] = useState<string[]>([]);
  const [selectedBarcodeImageUri, setSelectedBarcodeImageUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pickProductImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      setError('Tarvitset luvan käyttää kuvakirjastoa');
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
      setError('Tarvitset luvan käyttää kuvakirjastoa');
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
      setError('Anna kuvan URL-osoite');
      return;
    }

    if (!/^https?:\/\//i.test(trimmedUrl)) {
      setError('Anna kelvollinen URL-osoite, joka alkaa http:// tai https://');
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

  const handleCreate = async () => {
    setError(null);

    if (!name.trim()) {
      setError('Anna tuotteen nimi');
      return;
    }

    const amountValue = Number(amount);
    const priceValue = Number(price);

    if (Number.isNaN(amountValue) || amountValue < 0) {
      setError('Anna kelvollinen varastosaldo');
      return;
    }

    if (Number.isNaN(priceValue) || priceValue < 0) {
      setError('Anna kelvollinen hinta');
      return;
    }

    if (!user?.profile?.company) {
      setError('Käyttäjällä ei ole yritystä liitettynä');
      return;
    }

    try {
      setIsLoading(true);
      await createProduct(
        {
          name: name.trim(),
          amount: amountValue,
          price: priceValue,
          barcode: barcode.trim(),
          ean: ean.trim(),
          company: user.profile.company,
          images: [],
        },
        {
          barcodeImageUri: selectedBarcodeImageUri ?? undefined,
          productImageUris: selectedProductImageUris,
          imageLinks: imageUrls,
        }
      );
      setName('');
      setAmount('');
      setPrice('');
      setBarcode('');
      setEan('');
      setImageUrl('');
      setImageUrls([]);
      setSelectedProductImageUris([]);
      setSelectedBarcodeImageUri(null);
      onProductCreated();
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Tuotteen tallennus epäonnistui';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/40 px-4 py-6">
        <View className="rounded-3xl bg-white p-6 shadow-lg">
          <Text className="text-xl font-semibold text-gray-900">Lisää tuote</Text>
          <Text className="text-sm text-gray-500 mt-2">Täytä tuotteen tiedot ja tallenna varastoon.</Text>

          <View className="mt-5 space-y-3">
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Tuotteen nimi"
              className="rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-base text-gray-900"
              placeholderTextColor="#9ca3af"
            />
            <TextInput
              value={amount}
              onChangeText={setAmount}
              placeholder="Varastosaldo"
              keyboardType="numeric"
              className="rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-base text-gray-900"
              placeholderTextColor="#9ca3af"
            />
            <TextInput
              value={price}
              onChangeText={setPrice}
              placeholder="Hinta"
              keyboardType="numeric"
              className="rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-base text-gray-900"
              placeholderTextColor="#9ca3af"
            />
            <TextInput
              value={ean}
              onChangeText={setEan}
              placeholder="EAN"
              className="rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-base text-gray-900"
              placeholderTextColor="#9ca3af"
            />
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
              <TouchableOpacity
                onPress={handleAddImageUrl}
                className="rounded-2xl bg-primary-600 px-4 py-3"
              >
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
                  <View
                    key={`link-${index}`}
                    className="rounded-2xl border border-gray-200 bg-gray-50 p-3"
                  >
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
                    <TouchableOpacity onPress={() => handleRemoveSelectedProductImage(index)} className="rounded-2xl bg-secondary-100 px-4 py-3">
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
                <Image
                  source={{ uri: selectedBarcodeImageUri }}
                  className="w-full h-32 rounded-lg"
                  resizeMode="contain"
                />
              </View>
            ) : null}
          </View>

          {error ? <Text className="text-sm text-secondary-600 mt-3">{error}</Text> : null}

          <View className="mt-6 flex-row justify-end space-x-3">
            <TouchableOpacity onPress={onClose} className="rounded-2xl bg-gray-100 px-5 py-3">
              <Text className="text-sm font-semibold text-gray-700">Peruuta</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCreate} className="rounded-2xl bg-primary-600 px-5 py-3">
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text className="text-sm font-semibold text-white">Tallenna</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddProductModal;
