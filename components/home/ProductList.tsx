import type { Product } from '@/types/product';
import { FC } from 'react';
import { FlatList, Text, View } from 'react-native';
import ProductListItem from './ProductListItem';

interface ProductListProps {
  products: Product[];
}

const ProductList: FC<ProductListProps> = ({ products }) => {
  if (products.length === 0) {
    return (
      <View className="flex-1 items-center justify-center px-6 py-10">
        <Text className="text-lg font-semibold text-gray-900">Ei vielä tuotteita</Text>
        <Text className="text-sm text-gray-500 mt-2 text-center">
          Lisää tuotteita varastoon nähdäksesi ne täällä.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      className="px-4 py-3"
      data={products}
      keyExtractor={(item) => item.id ?? `${item.name}-${item.ean}`}
      renderItem={({ item }) => <ProductListItem product={item} />}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default ProductList;
