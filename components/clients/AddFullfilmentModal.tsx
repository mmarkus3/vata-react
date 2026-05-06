import { createFullfilment, getClientFullfilments } from '@/services/fullfliment';
import { getProductsByCompany } from '@/services/product';
import type { Client } from '@/types/client';
import type { Product } from '@/types/product';
import { filterProductsBySource, type ProductSource } from '@/utils/productSourceFilter';
import type { FC } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface AddFullfilmentModalProps {
  visible: boolean;
  client: Client;
  onClose: () => void;
  onCreated: () => void;
}

interface SelectedProduct {
  product: Product;
  amount: string;
}

const AddFullfilmentModal: FC<AddFullfilmentModalProps> = ({ visible, client, onClose, onCreated }) => {
  const [date, setDate] = useState(new Date().toLocaleDateString('fi-FI'));
  const [products, setProducts] = useState<Product[]>([]);
  const [source, setSource] = useState<ProductSource>('clientFullfilments');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedAmount, setSelectedAmount] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isLoadingClientProducts, setIsLoadingClientProducts] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [clientUsedProductIds, setClientUsedProductIds] = useState<Set<string>>(new Set());

  const filteredProducts = useMemo(() => filterProductsBySource(products, clientUsedProductIds, source), [products, clientUsedProductIds, source]);
  const selectedProduct = useMemo(() => filteredProducts.find((item) => item.id === selectedProductId), [filteredProducts, selectedProductId]);

  useEffect(() => {
    if (!visible) {
      return;
    }

    setIsLoadingProducts(true);
    setIsLoadingClientProducts(true);
    setGeneralError(null);
    setSource('clientFullfilments');

    const unsubscribe = getProductsByCompany(client.company, (result) => {
      setProducts(result);
      setIsLoadingProducts(false);
    });

    if (!client.id) {
      setClientUsedProductIds(new Set());
      setIsLoadingClientProducts(false);
    } else {
      getClientFullfilments(client.id, client.company)
        .then((fullfilments) => {
          const usedIds = new Set<string>();
          fullfilments.forEach((fullfilment) => {
            fullfilment.products.forEach((item) => {
              if (item.product.guid) {
                usedIds.add(item.product.guid);
              }
            });
          });
          setClientUsedProductIds(usedIds);
        })
        .catch((error) => {
          const message = error instanceof Error ? error.message : 'Tuotteiden lataus epäonnistui';
          setGeneralError(message);
          setClientUsedProductIds(new Set());
        })
        .finally(() => {
          setIsLoadingClientProducts(false);
        });
    }

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

    const existsInCurrentSource = filteredProducts.some((item) => item.id === selectedProductId);
    if (!existsInCurrentSource) {
      setSelectedProductId('');
    }
  }, [filteredProducts, selectedProductId]);

  const resetForm = () => {
    setDate(new Date().toLocaleDateString('fi-FI'));
    setSource('clientFullfilments');
    setSelectedProductId('');
    setSelectedAmount('');
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

    if (selectedProduct && selectedProducts.some((item) => item.product.id === selectedProduct.id)) {
      errors.product = 'Tuote on jo lisätty';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors((prev) => ({ ...prev, ...errors }));
      return;
    }

    setSelectedProducts((prev) => [...prev, { product: selectedProduct!, amount: selectedAmount.trim() }]);
    setSelectedProductId('');
    setSelectedAmount('');
    setFieldErrors((prev) => ({ ...prev, product: '', amount: '' }));
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
        products: selectedProducts.map((item) => ({
          amount: Number(item.amount),
          product: {
            guid: item.product.id!,
            name: item.product.name,
            ean: item.product.ean,
            price: item.product.price,
          },
        })),
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

  const isLoading = isLoadingProducts || isLoadingClientProducts;

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
              <Text className="mb-2 text-sm font-semibold text-gray-700">Tuotteen valinta</Text>

              <View className="mb-3 flex-row rounded-xl border border-gray-300 bg-white p-1">
                <TouchableOpacity
                  onPress={() => setSource('clientFullfilments')}
                  className={`flex-1 rounded-lg px-3 py-2 ${source === 'clientFullfilments' ? 'bg-primary-600' : ''}`}
                >
                  <Text className={`text-center text-sm font-semibold ${source === 'clientFullfilments' ? 'text-white' : 'text-gray-700'}`}>
                    Kaupan tuotteet
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setSource('allProducts')}
                  className={`flex-1 rounded-lg px-3 py-2 ${source === 'allProducts' ? 'bg-primary-600' : ''}`}
                >
                  <Text className={`text-center text-sm font-semibold ${source === 'allProducts' ? 'text-white' : 'text-gray-700'}`}>
                    Kaikki tuotteet
                  </Text>
                </TouchableOpacity>
              </View>

              {isLoading ? (
                <View className="flex-row items-center py-2">
                  <ActivityIndicator size="small" color="#1d4ed8" />
                  <Text className="ml-2 text-sm text-gray-600">Ladataan tuotteita...</Text>
                </View>
              ) : (
                <>
                  <View className="rounded-xl border border-gray-300 bg-white">
                    {filteredProducts.length === 0 ? (
                      <Text className="px-4 py-3 text-gray-500">
                        {source === 'clientFullfilments'
                          ? 'Ei tuotteita asiakkaan aiemmissa täytöissä. Vaihda kohtaan "Kaikki tuotteet".'
                          : 'Ei tuotteita'}
                      </Text>
                    ) : (
                      filteredProducts.map((item) => (
                        <TouchableOpacity
                          key={item.id}
                          onPress={() => setSelectedProductId(item.id ?? '')}
                          className={`px-4 py-3 ${selectedProductId === item.id ? 'bg-primary-50' : ''}`}
                        >
                          <Text className={`${selectedProductId === item.id ? 'text-primary-700' : 'text-gray-900'}`}>
                            {item.name} ({item.ean}) ({item.amount})
                          </Text>
                        </TouchableOpacity>
                      ))
                    )}
                  </View>

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

                  <TouchableOpacity onPress={addProductToList} disabled={isLoading} className="mt-3 rounded-2xl bg-primary-600 px-4 py-3">
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
                    <Text className="flex-1 text-gray-900">{item.product.name} ({item.product.ean}) - {item.amount} kpl</Text>
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
