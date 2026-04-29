import ProductList from '@/components/home/ProductList';
import { themeColors } from '@/constants/colors';
import { useProducts } from '@/hooks/useProducts';
import { ActivityIndicator, Text, View } from 'react-native';

export default function StorageScreen() {
  const { products, isLoading, error } = useProducts();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color={themeColors.primary[600]} />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-slate-50">
        <View className="px-6 pt-8 pb-4 bg-white border-b border-gray-200">
          <Text className="text-2xl font-bold text-gray-900">Varasto</Text>
        </View>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-lg font-semibold text-secondary-600">Tuotteiden haku epäonnistui</Text>
          <Text className="text-sm text-gray-600 mt-2 text-center">{error}</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      <View className="px-6 pt-8 pb-4 bg-white border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">Varasto</Text>
        <Text className="text-gray-600 mt-1">
          {products.length} tuote(tta) varastossa
        </Text>
      </View>
      <ProductList products={products} />
    </View>
  );
}
