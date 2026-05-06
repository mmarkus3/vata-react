import { createFullfilment } from '@/services/fullfliment';
import { getProductsByCompany } from '@/services/product';
import type { Client } from '@/types/client';
import type { Product } from '@/types/product';
import { mapSelectedLinesToFullfilmentProducts, parseLinePrice } from '@/utils/fullfilmentLinePrice';
import type { FC } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import SelectProduct from './SelectProduct';

interface AddFullfilmentModalProps {
  visible: boolean;
  client: Client;
  onClose: () => void;
  onCreated: () => void;
}

interface SelectedProduct {
  product: Product;
  amount: string;
  price: string;
}

const AddFullfilmentModal: FC<AddFullfilmentModalProps> = ({ visible, client, onClose, onCreated }) => {
  const [date, setDate] = useState(new Date().toLocaleDateString('fi-FI'));
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedAmount, setSelectedAmount] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const selectedProduct = useMemo(() => products.find((item) => item.id === selectedProductId), [products, selectedProductId]);

  useEffect(() => {
    if (!visible) {
      return;
    }

    setIsLoadingProducts(true);
    setGeneralError(null);

    const unsubscribe = getProductsByCompany(client.company, (result) => {
      setProducts(result);
      setIsLoadingProducts(false);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [client.company, client.id, visible]);

  useEffect(() => {
    if (!selectedProductId) {
      return;
    }

    const existsInCurrentSource = products.some((item) => item.id === selectedProductId);
    if (!existsInCurrentSource) {
      setSelectedProductId('');
      setSelectedPrice('');
    }
  }, [products, selectedProductId]);

  useEffect(() => {
    const selected = products.find((item) => item.id === selectedProductId);
    if (selected) {
      setSelectedPrice(String(selected.price ?? 0));
    }
  }, [products, selectedProductId]);

  const resetForm = () => {
    setDate(new Date().toLocaleDateString('fi-FI'));
    setSelectedProductId('');
    setSelectedAmount('');
    setSelectedPrice('');
    setSelectedProducts([]);
    setGeneralError(null);
    setFieldErrors({});
  };

  const handleClose = () => {
    if (isSubmitting) return;
    resetForm();
    onClose();
  };

  const addProductToList = () => {
    const errors: Record<string, string> = {};

    if (!selectedProduct) {
      errors.product = 'Valitse tuote';
    }

    const parsedAmount = Number(selectedAmount);
    if (!selectedAmount.trim() || Number.isNaN(parsedAmount) || parsedAmount <= 0 || !Number.isInteger(parsedAmount)) {
      errors.amount = 'Anna kelvollinen määrä (kokonaisluku > 0)';
    }
    if (parseLinePrice(selectedPrice) == null) {
      errors.price = 'Anna kelvollinen hinta (>= 0)';
    }

    if (selectedProduct && selectedProducts.some((item) => item.product.id === selectedProduct.id)) {
      errors.product = 'Tuote on jo lisätty';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors((prev) => ({ ...prev, ...errors }));
      return;
    }

    setSelectedProducts((prev) => [...prev, { product: selectedProduct!, amount: selectedAmount.trim(), price: selectedPrice.trim() }]);
    setSelectedProductId('');
    setSelectedAmount('');
    setSelectedPrice('');
    setFieldErrors((prev) => ({ ...prev, product: '', amount: '', price: '' }));
  };

  const removeProductFromList = (productId: string) => {
    setSelectedProducts((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    const [day, month, year] = date.split('.').map((value) => Number(value));
    const parsedDate = new Date(year, month - 1, day);
    const isDateValid =
      Number.isInteger(day) &&
      Number.isInteger(month) &&
      Number.isInteger(year) &&
      parsedDate.getFullYear() === year &&
      parsedDate.getMonth() === month - 1 &&
      parsedDate.getDate() === day;

    if (!isDateValid) {
      errors.date = 'Anna päivämäärä muodossa pp.kk.vvvv';
    }

    if (selectedProducts.length === 0) {
      errors.products = 'Lisää vähintään yksi tuote';
    }

    if (selectedProducts.some((item) => Number(item.amount) <= 0 || !Number.isInteger(Number(item.amount)))) {
      errors.products = 'Tuotemäärien tulee olla kokonaislukuja > 0';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setGeneralError(null);

    try {
      const [day, month, year] = date.split('.').map((value) => Number(value));
      const isoDate = new Date(year, month - 1, day).toISOString();

      await createFullfilment({
        client: { guid: client.id!, name: client.name },
        company: client.company,
        date: isoDate,
        products: mapSelectedLinesToFullfilmentProducts(selectedProducts),
      });

      resetForm();
      onCreated();
      onClose();
    } catch (error) {
      setGeneralError(error instanceof Error ? error.message : 'Täytön luonti epäonnistui');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={handleClose}>
      <View className="flex-1 justify-end bg-black/40 px-4 py-6">
        <View className="max-h-[90%] rounded-3xl bg-white p-6 shadow-lg">
          <Text className="text-xl font-semibold text-gray-900">Lisää täyttö</Text>
          <Text className="mt-2 text-sm text-gray-500">Lisää täytön päivämäärä ja tuotteet asiakkaalle {client.name}.</Text>

          <ScrollView className="mt-5" contentContainerStyle={{ paddingBottom: 8 }}>
            <View>
              <TextInput
                value={date}
                onChangeText={setDate}
                placeholder="pp.kk.vvvv"
                className="rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-base text-gray-900"
                placeholderTextColor="#9ca3af"
              />
              <Text className="mt-1 text-xs text-gray-500">Päivämäärä: pp.kk.vvvv</Text>
              {fieldErrors.date ? <Text className="mt-1 text-sm text-secondary-600">{fieldErrors.date}</Text> : null}
            </View>

            <View className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-3">
              <SelectProduct visible={visible} selected={selectedProductId} client={client} products={products} isLoading={isLoadingProducts} onSelect={setSelectedProductId} onError={setGeneralError} />

              {!isLoadingProducts && (
                <>
                  {fieldErrors.product ? <Text className="mt-1 text-sm text-secondary-600">{fieldErrors.product}</Text> : null}

                  <TextInput
                    value={selectedAmount}
                    onChangeText={setSelectedAmount}
                    placeholder="Määrä"
                    keyboardType="number-pad"
                    className="mt-3 rounded-2xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900"
                    placeholderTextColor="#9ca3af"
                  />
                  {fieldErrors.amount ? <Text className="mt-1 text-sm text-secondary-600">{fieldErrors.amount}</Text> : null}

                  <TextInput
                    value={selectedPrice}
                    onChangeText={setSelectedPrice}
                    placeholder="Hinta"
                    keyboardType="decimal-pad"
                    className="mt-3 rounded-2xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900"
                    placeholderTextColor="#9ca3af"
                  />
                  {fieldErrors.price ? <Text className="mt-1 text-sm text-secondary-600">{fieldErrors.price}</Text> : null}

                  <TouchableOpacity onPress={addProductToList} disabled={isLoadingProducts} className="mt-3 rounded-2xl bg-primary-600 px-4 py-3">
                    <Text className="text-center text-sm font-semibold text-white">Lisää tuote</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>

            <View className="mt-4">
              <Text className="mb-2 text-sm font-semibold text-gray-700">Lisätyt tuotteet</Text>
              {selectedProducts.length === 0 ? (
                <Text className="text-gray-500">Ei lisättyjä tuotteita</Text>
              ) : (
                selectedProducts.map((item) => (
                  <View key={item.product.id} className="mb-2 flex-row items-center justify-between rounded-xl bg-gray-100 px-3 py-2">
                    <Text className="flex-1 text-gray-900">{item.product.name} ({item.product.ean}) - {item.amount} kpl - {item.price} EUR</Text>
                    <TouchableOpacity onPress={() => removeProductFromList(item.product.id!)} className="ml-2 rounded-lg bg-red-100 px-3 py-1">
                      <Text className="text-red-700">Poista</Text>
                    </TouchableOpacity>
                  </View>
                ))
              )}
              {fieldErrors.products ? <Text className="mt-1 text-sm text-secondary-600">{fieldErrors.products}</Text> : null}
            </View>

            {generalError ? <Text className="mt-3 text-sm text-secondary-600">{generalError}</Text> : null}
          </ScrollView>

          <View className="mt-4 flex-row justify-end space-x-3">
            <TouchableOpacity onPress={handleClose} disabled={isSubmitting} className="rounded-2xl bg-gray-100 px-5 py-3">
              <Text className="text-sm font-semibold text-gray-700">Peruuta</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave} disabled={isSubmitting} className="rounded-2xl bg-primary-600 px-5 py-3">
              {isSubmitting ? <ActivityIndicator size="small" color="#fff" /> : <Text className="text-sm font-semibold text-white">Tallenna</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddFullfilmentModal;
