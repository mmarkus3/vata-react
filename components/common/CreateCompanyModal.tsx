import { useAuth } from '@/hooks/useAuth';
import { createCompany } from '@/services/company';
import { FC, useState } from 'react';
import { ActivityIndicator, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface CreateCompanyModalProps {
  visible: boolean;
  onClose: () => void;
  onCompanyCreated: (companyId: string, companyName: string) => void;
}

export const CreateCompanyModal: FC<CreateCompanyModalProps> = ({
  visible,
  onClose,
  onCompanyCreated,
}) => {
  const { user } = useAuth();
  const [companyName, setCompanyName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateCompany = async () => {
    if (!companyName.trim()) {
      setError('Company name is required');
      return;
    }

    if (!user) {
      setError('User not authenticated');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const companyId = await createCompany(companyName.trim(), user.uid);
      onCompanyCreated(companyId, companyName.trim());
      setCompanyName('');
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create company';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setCompanyName('');
    setError(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View className="flex-1 bg-white px-6 py-8">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-2xl font-bold text-gray-900 mb-2">Luo uusi yritys</Text>
          <Text className="text-gray-600">
            Tililläsi ei ole liitetty yritystä. Perusta uusi yritys antamalla yrityksen nimi.
          </Text>
        </View>

        {/* Error Message */}
        {error && (
          <View className="bg-secondary-100 border border-secondary-400 rounded-lg p-4 mb-6">
            <Text className="text-secondary-700 text-sm font-semibold">{error}</Text>
          </View>
        )}

        {/* Company Name Input */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-gray-700 mb-2">Yrityksen nimi</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 text-base text-gray-900 bg-white"
            placeholder="Syötä nimi"
            placeholderTextColor="#999"
            value={companyName}
            onChangeText={setCompanyName}
            editable={!isLoading}
            autoCapitalize="words"
          />
        </View>

        {/* Buttons */}
        <View className="flex-row gap-4">
          <TouchableOpacity
            className={`flex-1 rounded-lg py-3 active:bg-primary-700 ${isLoading ? 'bg-primary-400' : 'bg-primary-600'
              }`}
            onPress={handleCreateCompany}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text className="text-white font-semibold text-center">Luo yritys</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
