import type { Category } from '@/types/category';
import type { FC } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import CategoryListItem from './CategoryListItem';

interface CategoryListProps {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  onPressCategory: (category: Category) => void;
  onRetry: () => void;
}

const CategoryList: FC<CategoryListProps> = ({
  categories,
  isLoading,
  error,
  onPressCategory,
  onRetry,
}) => {
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="small" color="#1d4ed8" />
        <Text className="ml-2 text-sm text-gray-600">Ladataan kategorioita...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center px-4">
        <View className="bg-red-100 border border-red-400 rounded-lg p-4 mb-4">
          <Text className="bg-secondary-700 font-semibold mb-2">Virhe</Text>
          <Text className="bg-secondary-600 text-sm">{error}</Text>
        </View>
        <TouchableOpacity
          className="bg-secondary-600 rounded-lg px-6 py-3 active:bg-red-700"
          onPress={onRetry}
        >
          <Text className="text-white font-semibold">Yritä uudelleen</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (categories.length === 0) {
    return (
      <View className="flex-1 justify-center items-center px-4">
        <Text className="px-4 py-3 text-gray-500">
          Ei kategorioita
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={categories}
      className="px-4 py-3"
      renderItem={({ item }) => (
        <CategoryListItem
          category={item}
          onPress={onPressCategory}
        />
      )}
      keyExtractor={(item) => item.id || ''}
      scrollEnabled={true}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
    />
  );
};

export default CategoryList;
