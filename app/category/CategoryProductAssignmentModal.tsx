import { filterProductsByName, getAssignableProducts } from '@/app/category/categoryAssignment';
import { getAssignmentCandidatesState, isAssignmentSubmitDisabled } from '@/app/category/categoryProductAssignmentModalState';
import { themeColors } from '@/constants/colors';
import { useAuth } from '@/hooks/useAuth';
import { getProductsByCompany, updateProduct } from '@/services/product';
import type { Product } from '@/types/product';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface CategoryProductAssignmentModalProps {
  visible: boolean;
  categoryName: string;
  onClose: () => void;
  onAssigned: () => void;
}

export default function CategoryProductAssignmentModal({
  visible,
  categoryName,
  onClose,
  onAssigned,
}: CategoryProductAssignmentModalProps) {
  const { user } = useAuth();

  const [isLoadingCandidates, setIsLoadingCandidates] = useState(false);
  const [isAssigningProducts, setIsAssigningProducts] = useState(false);
  const [assignmentError, setAssignmentError] = useState<string | null>(null);
  const [candidateProducts, setCandidateProducts] = useState<Product[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!visible || !user?.profile?.company) {
      return;
    }

    setIsLoadingCandidates(true);
    setAssignmentError(null);

    const unsubscribe = getProductsByCompany(user.profile.company, (results) => {
      setCandidateProducts(results);
      setIsLoadingCandidates(false);
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [visible, user?.profile?.company]);

  const assignableProducts = useMemo(
    () => getAssignableProducts(candidateProducts, categoryName),
    [candidateProducts, categoryName]
  );
  const filteredProducts = useMemo(
    () => filterProductsByName(assignableProducts, searchTerm),
    [assignableProducts, searchTerm]
  );
  const candidatesState = getAssignmentCandidatesState({
    isLoadingCandidates,
    filteredProducts,
  });

  const toggleProductSelection = (productId: string) => {
    setAssignmentError(null);
    setSelectedProductIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleClose = () => {
    if (isAssigningProducts) {
      return;
    }

    setSelectedProductIds([]);
    setAssignmentError(null);
    setSearchTerm('');
    onClose();
  };

  const handleAssignProducts = async () => {
    if (!categoryName || selectedProductIds.length === 0 || isAssigningProducts) {
      return;
    }

    setIsAssigningProducts(true);
    setAssignmentError(null);

    try {
      for (const productId of selectedProductIds) {
        await updateProduct(productId, { category: categoryName });
      }

      setSelectedProductIds([]);
      setSearchTerm('');
      onAssigned();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Tuotteiden lisääminen kategoriaan epäonnistui';
      setAssignmentError(message);
    } finally {
      setIsAssigningProducts(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View className="flex-1 justify-end bg-black/40 px-4 py-6">
        <View className="max-h-[80%] rounded-3xl bg-white p-6 shadow-lg">
          <Text className="text-xl font-bold text-gray-900">Lisää tuotteita</Text>
          <Text className="mt-2 text-sm text-gray-600">Valitse tuotteet, jotka lisätään kategoriaan {categoryName}.</Text>

          {assignmentError ? (
            <View className="mt-4 rounded-2xl border border-red-300 bg-red-50 px-4 py-3">
              <Text className="text-sm text-red-700">{assignmentError}</Text>
            </View>
          ) : null}

          <TextInput
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholder="Suodata tuotteita nimellä"
            className="mt-4 rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-base text-gray-900"
            placeholderTextColor="#9ca3af"
            editable={!isAssigningProducts}
          />

          <View className="mt-4">
            {candidatesState === 'loading' ? (
              <View className="flex-row items-center">
                <ActivityIndicator size="small" color={themeColors.primary[600]} />
                <Text className="ml-2 text-sm text-gray-600">Ladataan tuotteita...</Text>
              </View>
            ) : candidatesState === 'empty' ? (
              <View className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
                <Text className="text-sm text-gray-600">Ei lisättäviä tuotteita.</Text>
              </View>
            ) : (
              <ScrollView className="max-h-80">
                <View className="space-y-2">
                  {filteredProducts.map((product) => {
                    const isSelected = !!product.id && selectedProductIds.includes(product.id);
                    return (
                      <TouchableOpacity
                        key={product.id}
                        onPress={() => product.id && toggleProductSelection(product.id)}
                        className={`rounded-2xl border px-4 py-3 ${isSelected ? 'border-primary-600 bg-primary-50' : 'border-gray-200 bg-gray-50'}`}
                      >
                        <Text className={`text-sm font-semibold ${isSelected ? 'text-primary-700' : 'text-gray-900'}`}>{product.name}</Text>
                        <Text className="mt-1 text-xs text-gray-600">{product.amount} kpl</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>
            )}
          </View>

          <View className="mt-6 flex-row gap-3">
            <TouchableOpacity
              onPress={handleClose}
              disabled={isAssigningProducts}
              className="flex-1 rounded-2xl bg-gray-100 px-4 py-3"
            >
              <Text className="text-center text-sm font-semibold text-gray-700">Peruuta</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleAssignProducts}
              disabled={isAssignmentSubmitDisabled({ selectedCount: selectedProductIds.length, isAssigningProducts })}
              className={`flex-1 rounded-2xl px-4 py-3 ${isAssignmentSubmitDisabled({ selectedCount: selectedProductIds.length, isAssigningProducts }) ? 'bg-primary-300' : 'bg-primary-600'}`}
            >
              {isAssigningProducts ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text className="text-center text-sm font-semibold text-white">Lisää valitut</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
