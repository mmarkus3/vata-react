import type { Product } from '@/types/product';
import { useRouter } from 'expo-router';
import { FC } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

interface ProductListItemProps {
  product: Product;
}

const ProductListItem: FC<ProductListItemProps> = ({ product }) => {
  const router = useRouter();

  const handlePress = () => {
    if (product.id) {
      router.push(`/product/${product.id}`);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="bg-white rounded-2xl border border-gray-200 px-4 py-4 mb-3 shadow-sm"
      activeOpacity={0.8}
    >
      <View className="flex-row items-center justify-between">
        <Text className="text-base font-semibold text-gray-900">{product.name}</Text>
        <Text className="text-sm font-bold text-primary-600">{product.price.toFixed(2) ?? '-'}€</Text>
      </View>
      <View className="mt-3 space-y-2">
        {product.images?.[0] ? (
          <Image
            source={{ uri: product.images[0] }}
            className="h-10 w-10 rounded-xl bg-gray-100"
            resizeMode="contain"
          />
        ) : null}
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
      </View>
    </TouchableOpacity>
  );
};

export default ProductListItem;
