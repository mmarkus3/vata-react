import AddCategoryModal from '@/components/categories/AddCategoryModal';
import CategoryList from '@/components/categories/CategoryList';
import { useCategories } from '@/hooks/useCategories';
import { Category } from '@/types/category';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function CategoriesScreen() {
  const { categories, isLoading, error } = useCategories();
  const router = useRouter();
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddPress = () => {
    setShowAddModal(true);
  };

  const handleCategoryCreated = useCallback(() => {
    setShowAddModal(false);
  }, []);

  const handleCategoryPress = useCallback((category: Category) => {
    if (!category.id) {
      return;
    }
    router.push(`/category/${category.id}`);
  }, [router]);

  const handleRetry = useCallback(() => {
    // Refresh by re-fetching categories
    // The hook will automatically re-fetch on mount if needed
  }, []);

  const categoryNames = categories.map(c => c.name);

  return (
    <View className="flex-1 bg-gray-50">
      <View className="px-6 pt-6 pb-4 bg-white border-b border-gray-200">
        <View className="flex-row justify-end items-center mb-4">
          <TouchableOpacity
            className="rounded-2xl bg-primary-600 px-4 py-2"
            onPress={handleAddPress}
          >
            <Text className="text-white font-semibold">Lisää kategoria</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-1">
        <CategoryList
          categories={categories}
          isLoading={isLoading}
          error={error}
          onPressCategory={handleCategoryPress}
          onRetry={handleRetry}
        />
      </View>

      <AddCategoryModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onCategoryCreated={handleCategoryCreated}
        existingNames={categoryNames}
      />
    </View>
  );
}
