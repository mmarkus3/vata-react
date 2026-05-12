import { CATEGORY_VALIDATION } from '@/constants/category';
import { useAuth } from '@/hooks/useAuth';
import { createCategory } from '@/services/category';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface AddCategoryModalProps {
  visible: boolean;
  onClose: () => void;
  onCategoryCreated: () => void;
  existingNames?: string[];
}

const AddCategoryModal: FC<AddCategoryModalProps> = ({
  visible,
  onClose,
  onCategoryCreated,
  existingNames = [],
}) => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!visible) {
      resetForm();
    }
  }, [visible]);

  const resetForm = () => {
    setName('');
    setDescription('');
    setGeneralError(null);
    setFieldErrors({});
  };

  const handleClose = () => {
    if (isLoading) return;
    resetForm();
    onClose();
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!name.trim()) {
      errors.name = CATEGORY_VALIDATION.ERRORS.NAME_REQUIRED;
    } else if (existingNames.some((n) => n.toLowerCase() === name.trim().toLowerCase())) {
      errors.name = CATEGORY_VALIDATION.ERRORS.NAME_DUPLICATE;
    }

    if (name.trim().length > CATEGORY_VALIDATION.MAX_NAME_LENGTH) {
      errors.name = CATEGORY_VALIDATION.ERRORS.NAME_TOO_LONG;
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      return;
    }

    if (!user?.profile?.company) {
      setGeneralError('Yritystunnus puuttuu');
      return;
    }

    setIsLoading(true);
    setGeneralError(null);

    try {
      await createCategory(name.trim(), description.trim(), user.profile.company);
      resetForm();
      onCategoryCreated();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create category';
      setGeneralError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View className="flex-1 justify-end bg-black/40 px-4 py-6">
        <View className="rounded-3xl bg-white p-6 shadow-lg">
          <Text className="text-xl font-bold text-gray-900 mb-4">Lisää kategoria</Text>

          {generalError && (
            <View className="bg-red-100 border border-red-400 rounded-lg p-3 mb-4">
              <Text className="text-red-700 text-sm font-semibold">{generalError}</Text>
            </View>
          )}

          <Text className="text-sm font-semibold text-gray-700 mb-2">Nimi</Text>
          <TextInput
            className={`border rounded-lg px-3 py-2 mb-2 ${fieldErrors.name
              ? 'border-red-500 bg-red-50'
              : 'border-gray-300 bg-white'
              }`}
            placeholder="Kategorian nimi"
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
            editable={!isLoading}
            maxLength={255}
          />
          {fieldErrors.name && (
            <Text className="text-red-600 text-sm mb-4">{fieldErrors.name}</Text>
          )}

          <Text className="text-sm font-semibold text-gray-700 mb-2">Kuvaus</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-3 py-2 mb-6 bg-white"
            placeholder="Kategorian kuvaus (valinnainen)"
            placeholderTextColor="#999"
            value={description}
            onChangeText={setDescription}
            editable={!isLoading}
            multiline
            numberOfLines={3}
            maxLength={500}
          />

          <View className="mt-6 flex-row justify-end space-x-3">
            <TouchableOpacity
              className="rounded-2xl bg-gray-100 px-5 py-3"
              onPress={handleClose}
              disabled={isLoading}
            >
              <Text className="text-gray-700 font-semibold text-center">Peruuta</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="rounded-2xl bg-primary-600 px-5 py-3"
              onPress={handleSave}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-semibold text-center">Tallenna</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddCategoryModal;
