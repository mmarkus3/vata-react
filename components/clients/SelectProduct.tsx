import { getClientFullfilments } from '@/services/fullfliment';
import { Client } from '@/types/client';
import { Product } from '@/types/product';
import { filterProductsBySource } from '@/utils/productSourceFilter';
import { FC, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import SegmentControl from '../common/SegmentControl';

interface SelectProductProps {
  visible: boolean;
  client: Client;
  products: Product[];
  isLoading: boolean;
  selected: string;
  onSelect: (id: string) => void;
  onError: (error: string) => void;
}

const SelectProduct: FC<SelectProductProps> = ({ visible, products, isLoading, client, selected, onSelect, onError }) => {
  const [source, setSource] = useState<number>(0);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [clientUsedProductIds, setClientUsedProductIds] = useState<Set<string>>(new Set());
  const [isLoadingClientProducts, setIsLoadingClientProducts] = useState(false);

  const filteredProducts = useMemo(() => filterProductsBySource(products, clientUsedProductIds, source), [products, clientUsedProductIds, source]);

  useEffect(() => {
    if (!selected) setSelectedProductId('');
  }, [selected]);

  useEffect(() => {
    if (!visible) {
      return;
    }
    setIsLoadingClientProducts(true);
    setSource(0);


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
          onError(message);
          setClientUsedProductIds(new Set());
        })
        .finally(() => {
          setIsLoadingClientProducts(false);
        });
    }
  }, [client.company, client.id, visible, onError]);

  const handleSelectProduct = (id: string) => {
    onSelect(id);
    setSelectedProductId(id);
  }

  return (
    <>
      <Text className="mb-2 text-sm font-semibold text-gray-700">Tuotteen valinta</Text>
      <SegmentControl options={['Kaupan tuotteet', 'Kaikki tuotteet']} selectedIndex={source} onSelectionChange={setSource} />
      {isLoading || isLoadingClientProducts ? (
        <View className="flex-row items-center py-2">
          <ActivityIndicator size="small" color="#1d4ed8" />
          <Text className="ml-2 text-sm text-gray-600">Ladataan tuotteita...</Text>
        </View>
      ) : (
        <>
          <View className="rounded-xl border border-gray-300 bg-white">
            {filteredProducts.length === 0 ? (
              <Text className="px-4 py-3 text-gray-500">
                {source === 0
                  ? 'Ei tuotteita asiakkaan aiemmissa täytöissä. Vaihda kohtaan "Kaikki tuotteet".'
                  : 'Ei tuotteita'}
              </Text>
            ) : (
              filteredProducts.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => handleSelectProduct(item.id ?? '')}
                  className={`px-4 py-3 ${selectedProductId === item.id ? 'bg-primary-50' : ''}`}
                >
                  <Text className={`${selectedProductId === item.id ? 'text-primary-700' : 'text-gray-900'}`}>
                    {item.name} ({item.ean}) ({item.amount})
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </View>
        </>
      )}
    </>
  );
}

export default SelectProduct;