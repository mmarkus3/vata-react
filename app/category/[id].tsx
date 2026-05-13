import { getCategoryDetailProductsState } from '@/app/category/categoryDetailState';
import EditCategoryModal from '@/components/categories/EditCategoryModal';
import { themeColors } from '@/constants/colors';
import { useAuth } from '@/hooks/useAuth';
import { useCategories } from '@/hooks/useCategories';
import { getCategoryById } from '@/services/category';
import { getProductsByCompanyAndCategory } from '@/services/product';
import type { Category } from '@/types/category';
import type { Product } from '@/types/product';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function CategoryDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { categories, deleteCategory } = useCategories();

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingCategory, setIsLoadingCategory] = useState(true);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const categoryId = typeof id === 'string' ? id : undefined;

  const loadCategory = useCallback(async () => {
    if (!categoryId) {
      setError('Category ID is missing');
      setIsLoadingCategory(false);
      return;
    }

    setIsLoadingCategory(true);
    setError(null);

    try {
      const result = await getCategoryById(categoryId);
      if (!result) {
        setError('Kategoriaa ei löytynyt');
        setCategory(null);
      } else {
        setCategory(result);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Kategorian lataus epäonnistui';
      setError(message);
      setCategory(null);
    } finally {
      setIsLoadingCategory(false);
    }
  }, [categoryId]);

  useEffect(() => {
    loadCategory();
  }, [loadCategory]);

  useEffect(() => {
    if (!user?.profile?.company || !category?.name) {
      setProducts([]);
      setIsLoadingProducts(false);
      return;
    }

    setIsLoadingProducts(true);

    const unsubscribe = getProductsByCompanyAndCategory(user.profile.company, category.name, (results) => {
      setProducts(results);
      setIsLoadingProducts(false);
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [user?.profile?.company, category?.name]);

  const handleDelete = () => {
    if (!category?.id) {
      return;
    }

    Alert.alert('Poista kategoria', 'Haluatko varmasti poistaa kategorian?', [
      {
        text: 'Peruuta',
        style: 'cancel',
      },
      {
        text: 'Poista',
        style: 'destructive',
        onPress: async () => {
          setIsDeleting(true);
          try {
            await deleteCategory(category.id!);
            router.replace('/(home)/categories');
          } catch (err) {
            const message = err instanceof Error ? err.message : 'Kategorian poisto epäonnistui';
            setError(message);
          } finally {
            setIsDeleting(false);
          }
        },
      },
    ]);
  };

  const categoryNames = useMemo(() => categories.map((entry) => entry.name), [categories]);
  const productsState = getCategoryDetailProductsState({ isLoadingProducts, error, products });

  if (isLoadingCategory) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color={themeColors.primary[600]} />
      </View>
    );
  }

  if (error && !category) {
    return (
      <View className="flex-1 bg-slate-50 px-6 py-6">
        <TouchableOpacity onPress={() => router.back()} className="mb-4 rounded-full bg-white px-4 py-3 shadow-sm">
          <Text className="text-sm font-semibold text-primary-600">← Palaa</Text>
        </TouchableOpacity>
        <View className="rounded-2xl border border-red-300 bg-red-50 p-4">
          <Text className="text-sm font-semibold text-red-700">{error}</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      <Stack.Screen options={{ title: category?.name ?? 'Kategoria' }} />
      <ScrollView className="px-6 py-6">
        <TouchableOpacity onPress={() => router.back()} className="mb-4 rounded-full bg-white px-4 py-3 shadow-sm">
          <Text className="text-sm font-semibold text-primary-600">← Palaa</Text>
        </TouchableOpacity>

        <View className="rounded-3xl bg-white p-6 shadow-sm">
          <Text className="text-2xl font-bold text-gray-900">{category?.name}</Text>
          <Text className="mt-2 text-sm text-gray-600">{category?.description || '-'}</Text>

          <View className="mt-8">
            <Text className="text-lg font-semibold text-gray-900">Tuotteet kategoriassa</Text>

            {productsState === 'loading' ? (
              <View className="mt-4 flex-row items-center">
                <ActivityIndicator size="small" color={themeColors.primary[600]} />
                <Text className="ml-2 text-sm text-gray-600">Ladataan tuotteita...</Text>
              </View>
            ) : productsState === 'error' ? (
              <View className="mt-4 rounded-2xl border border-red-300 bg-red-50 px-4 py-3">
                <Text className="text-sm text-red-700">{error}</Text>
              </View>
            ) : productsState === 'empty' ? (
              <View className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
                <Text className="text-sm text-gray-600">Tässä kategoriassa ei ole tuotteita.</Text>
              </View>
            ) : (
              <View className="mt-4 space-y-3">
                {products.map((product) => (
                  <TouchableOpacity
                    key={product.id}
                    className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3"
                    onPress={() => product.id && router.push(`/product/${product.id}`)}
                  >
                    <Text className="text-base font-semibold text-gray-900">{product.name}</Text>
                    <Text className="mt-1 text-sm text-gray-600">{product.amount} kpl</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {error ? <Text className="mt-3 text-sm text-secondary-600">{error}</Text> : null}

          <View className="mt-6 space-y-3">
            <TouchableOpacity onPress={() => setShowEditModal(true)} className="rounded-2xl bg-primary-600 px-4 py-3">
              <Text className="text-center text-sm font-semibold text-white">Muokkaa kategoriaa</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete} className="rounded-2xl bg-secondary-600 px-4 py-3" disabled={isDeleting}>
              <Text className="text-center text-sm font-semibold text-white">{isDeleting ? 'Poistetaan...' : 'Poista kategoria'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <EditCategoryModal
        visible={showEditModal}
        category={category}
        onClose={() => setShowEditModal(false)}
        onCategoryUpdated={async () => {
          setShowEditModal(false);
          await loadCategory();
        }}
        existingNames={categoryNames}
      />
    </View>
  );
}
