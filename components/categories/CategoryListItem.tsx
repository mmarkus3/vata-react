import type { Category } from '@/types/category';
import type { FC } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export const hasInlineCategoryActions = false;

export const getCategoryDescription = (category: Category): string => category.description || '-';

interface CategoryListItemProps {
  category: Category;
  onPress: (category: Category) => void;
}

const CategoryListItem: FC<CategoryListItemProps> = ({
  category,
  onPress,
}) => {
  return (
    <TouchableOpacity
      className="bg-white rounded-2xl border border-gray-200 px-4 py-4 mb-3 shadow-sm"
      activeOpacity={0.8}
      onPress={() => onPress(category)}
    >
      <View className="flex-row items-center justify-between">
        <View className="mt-3 space-y-2">
          <Text className="text-lg font-semibold text-gray-900 mb-1">
            {category.name}
          </Text>
          <Text className="text-sm text-gray-600" numberOfLines={2}>
            {getCategoryDescription(category)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CategoryListItem;
