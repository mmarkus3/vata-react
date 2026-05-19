import { getClientFullfilments } from '@/services/fullfliment';
import type { Client } from '@/types/client';
import type { Product } from '@/types/product';
import { filterProductsBySource } from '@/utils/productSourceFilter';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';
import SegmentControl from '../common/SegmentControl';

export type SelectProductMode = 'single' | 'multi';

interface SelectProductProps {
  visible: boolean;
  products: Product[];
  isLoading: boolean;
  client?: Client;
  selected?: string;
  selectedIds?: string[];
  mode?: SelectProductMode;
  enableSourceFilter?: boolean;
  onSelect?: (id: string) => void;
  onToggleSelect?: (id: string) => void;
  onError?: (error: string) => void;
}

const SelectProduct: FC<SelectProductProps> = ({
  visible,
  products,
  isLoading,
  client,
  selected = '',
  selectedIds = [],
  mode = 'single',
  enableSourceFilter = true,
  onSelect,
  onToggleSelect,
  onError,
}) => {
  const [source, setSource] = useState<number>(0);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [clientUsedProductIds, setClientUsedProductIds] = useState<Set<string>>(new Set());
  const [isLoadingClientProducts, setIsLoadingClientProducts] = useState(false);
  const [query, setQuery] = useState('');

  const filteredProducts = useMemo(() => {
    if (!enableSourceFilter) {
      return products;
    }

    return filterProductsBySource(products, clientUsedProductIds, source);
  }, [products, clientUsedProductIds, source, enableSourceFilter]);

  const searchedProducts = useCallback(() => {
    if (query.length < 2) {
      return filteredProducts;
    }

    return filteredProducts.filter((product) => product.name.toLowerCase().includes(query.toLowerCase()));
  }, [query, filteredProducts]);

  useEffect(() => {
    if (mode === 'single' && !selected) {
      setSelectedProductId('');
      setQuery('');
    }
  }, [selected, mode]);

  useEffect(() => {
    if (!visible || !enableSourceFilter) {
      return;
    }

    setIsLoadingClientProducts(true);
    setSource(0);

    if (!client?.id) {
      setClientUsedProductIds(new Set());
      setIsLoadingClientProducts(false);
      return;
    }

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
        onError?.(message);
        setClientUsedProductIds(new Set());
      })
      .finally(() => {
        setIsLoadingClientProducts(false);
      });
  }, [client?.company, client?.id, visible, onError, enableSourceFilter]);

  const handleSelectProduct = (id: string) => {
    if (mode === 'multi') {
      onToggleSelect?.(id);
      return;
    }

    onSelect?.(id);
    setSelectedProductId(id);
  };

  return (
    <>
      <Text className="mb-2 text-sm font-semibold text-gray-700">Tuotteen valinta</Text>
      {enableSourceFilter ? (
        <SegmentControl options={['Kaupan tuotteet', 'Kaikki tuotteet']} selectedIndex={source} onSelectionChange={setSource} />
      ) : null}
      <View className="flex-1 w-100 py-4">
        <TextInput
          className="border border-gray-300 rounded-lg px-4 py-3 text-base text-gray-900 bg-white"
          onChangeText={(val) => setQuery(val)}
          placeholder="Suodata"
          value={query}
        />
      </View>
      {isLoading || isLoadingClientProducts ? (
        <View className="flex-row items-center py-2">
          <ActivityIndicator size="small" color="#1d4ed8" />
          <Text className="ml-2 text-sm text-gray-600">Ladataan tuotteita...</Text>
        </View>
      ) : (
        <View className="rounded-xl border border-gray-300 bg-white">
          {filteredProducts.length === 0 ? (
            <Text className="px-4 py-3 text-gray-500">
              {enableSourceFilter && source === 0
                ? 'Ei tuotteita asiakkaan aiemmissa täytöissä. Vaihda kohtaan "Kaikki tuotteet".'
                : 'Ei tuotteita'}
            </Text>
          ) : searchedProducts().length === 0 ? (
            <View className="flex-1 items-center justify-center px-6 py-10">
              <Text className="text-lg font-semibold text-gray-900">Ei hakutuloksia</Text>
            </View>
          ) : (
            searchedProducts().map((item) => {
              const isSelected = mode === 'multi' ? selectedIds.includes(item.id ?? '') : selectedProductId === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => handleSelectProduct(item.id ?? '')}
                  className={`px-4 py-3 ${isSelected ? 'bg-primary-50' : ''}`}
                >
                  <Text className={`${isSelected ? 'text-primary-700' : 'text-gray-900'}`}>
                    {item.name} ({item.ean}) ({item.amount})
                  </Text>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      )}
    </>
  );
};

export default SelectProduct;
