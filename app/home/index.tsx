import AddProductModal from '@/components/home/AddProductModal';
import ProductList from '@/components/home/ProductList';
import { themeColors } from '@/constants/colors';
import { useProducts } from '@/hooks/useProducts';
import { useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

export default function StorageScreen() {
  const [showAddModal, setShowAddModal] = useState(false);
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
        <View className="flex-row items-start justify-between">
          <View>
            <Text className="text-2xl font-bold text-gray-900">Varasto</Text>
            <Text className="text-gray-600 mt-1">
              {products.length} tuote(tta) varastossa
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowAddModal(true)}
            className="mt-1 rounded-2xl bg-primary-600 px-4 py-2"
          >
            <Text className="text-sm font-semibold text-white">Lisää tuote</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ProductList products={products} />
      <AddProductModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onProductCreated={() => setShowAddModal(false)}
      />
    </View>
  );
}
