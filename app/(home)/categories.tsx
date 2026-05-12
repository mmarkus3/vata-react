import AddCategoryModal from '@/components/categories/AddCategoryModal';
import CategoryList from '@/components/categories/CategoryList';
import EditCategoryModal from '@/components/categories/EditCategoryModal';
import { useCategories } from '@/hooks/useCategories';
import type { Category } from '@/types/category';
import { useCallback, useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

export default function CategoriesScreen() {
  const { categories, isLoading, error, deleteCategory } = useCategories();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const handleAddPress = () => {
    setShowAddModal(true);
  };

  const handleCategoryCreated = useCallback(() => {
    setShowAddModal(false);
  }, []);

  const handleEditPress = useCallback((category: Category) => {
    setSelectedCategory(category);
    setShowEditModal(true);
  }, []);

  const handleCategoryUpdated = useCallback(() => {
    setShowEditModal(false);
    setSelectedCategory(null);
  }, []);

  const handleDeletePress = useCallback((category: Category) => {
    if (!category.id) {
      Alert.alert('Error', 'Category ID is missing');
      return;
    }

    Alert.alert(
      'Poista kategoria',
      `Haluatko varmasti poistaa kategorian?`,
      [
        {
          text: 'Peruuta',
          style: 'cancel',
        },
        {
          text: 'Poista',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCategory(category.id!);
            } catch (err) {
              Alert.alert('Error', 'Failed to delete category');
            }
          },
        },
      ]
    );
  }, [deleteCategory]);

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
          onEdit={handleEditPress}
          onDelete={handleDeletePress}
          onRetry={handleRetry}
        />
      </View>

      <AddCategoryModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onCategoryCreated={handleCategoryCreated}
        existingNames={categoryNames}
      />

      <EditCategoryModal
        visible={showEditModal}
        category={selectedCategory}
        onClose={() => setShowEditModal(false)}
        onCategoryUpdated={handleCategoryUpdated}
        existingNames={categoryNames}
      />
    </View>
  );
}
