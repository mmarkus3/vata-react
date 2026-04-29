import type { Product } from '@/types/product';
import { FC } from 'react';
import { Image, Text, View } from 'react-native';

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
      <View className="mt-3 space-y-2">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-sm text-gray-500">Varastosaldo</Text>
            <Text className="text-base font-medium text-gray-900">{product.amount}</Text>
          </View>
          <View>
            <Text className="text-sm text-gray-500">EAN</Text>
            <Text className="text-base font-medium text-gray-900">{product.ean || '-'}</Text>
          </View>
        </View>
        {product.barcode && (
          <View className="mt-2">
            <Text className="text-sm text-gray-500 mb-1">Viivakoodikuva</Text>
            <Image source={{ uri: product.barcode }} className="w-full h-20 rounded-lg" resizeMode="contain" />
          </View>
        )}
      </View>
    </View>
  );
};

export default ProductListItem;
