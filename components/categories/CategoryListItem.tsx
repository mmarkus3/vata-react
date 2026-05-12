import type { Category } from '@/types/category';
import type { FC } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface CategoryListItemProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

const CategoryListItem: FC<CategoryListItemProps> = ({
  category,
  onEdit,
  onDelete,
}) => {
  return (
    <TouchableOpacity
      className="bg-white rounded-2xl border border-gray-200 px-4 py-4 mb-3 shadow-sm"
      activeOpacity={0.8}
    >
      <View className="flex-row items-center justify-between">
        <View className="mt-3 space-y-2">
          <Text className="text-lg font-semibold text-gray-900 mb-1">
            {category.name}
          </Text>
          <Text className="text-sm text-gray-600" numberOfLines={2}>
            {category.description || '-'}
          </Text>
        </View>

        <View className="flex-row gap-3 ml-4">
          <TouchableOpacity
            className="p-2 rounded-lg bg-primary-100 active:bg-primary-200"
            onPress={() => onEdit(category)}
          >
            <Text className="text-primary-600 font-semibold">Muokkaa</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="p-2 rounded-lg bg-secondary-100 active:bg-secondary-200"
            onPress={() => onDelete(category)}
          >
            <Text className="bg-secondary-100 font-semibold">Poista</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CategoryListItem;
