import type { Product } from '@/types/product';
import { FC } from 'react';
import { Text, View } from 'react-native';

interface ProductListItemProps {
  product: Product;
}

const ProductListItem: FC<ProductListItemProps> = ({ product }) => {
  return (
    <View className="bg-white rounded-2xl border border-gray-200 px-4 py-4 mb-3 shadow-sm">
      <View className="flex-row items-center justify-between">
        <Text className="text-base font-semibold text-gray-900">{product.name}</Text>
        <Text className="text-sm font-bold text-primary-600">€{product.price.toFixed(2) ?? '-'}</Text>
      </View>
      <View className="mt-2 flex-row items-center justify-between">
        <View>
          <Text className="text-sm text-gray-500">Varastosaldo</Text>
          <Text className="text-base font-medium text-gray-900">{product.amount}</Text>
        </View>
      </View>
    </View>
  );
};

export default ProductListItem;
