import { useAuth } from '@/hooks/useAuth';
import { createInvite } from '@/services/invite';
import { FC, useState } from 'react';
import { ActivityIndicator, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface InviteUserModalProps {
  visible: boolean;
  onClose: () => void;
  onInvited: () => void;
}

const InviteUserModal: FC<InviteUserModalProps> = ({ visible, onClose, onInvited }) => {
  const { user, company } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInvite = async () => {
    setError(null);

    // Validation
    if (!email) {
      setError('Anna sähköposti');
      return;
    }

    if (!email.includes('@')) {
      setError('Tarkista sähköposti');
      return;
    }

    if (!user) {
      setError('Käyttäjä puuttuu');
      return;
    }

    if (!company) {
      setError('Yritys puuttuu');
      return;
    }

    try {
      setIsLoading(true);
      await createInvite(email, company.id!, company.name, user.uid);
      setEmail('');
      onInvited();
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Kutsuminen epäonnistui';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/40 px-4 py-6">
        <View className="rounded-3xl bg-white p-6 shadow-lg">
          <Text className="text-xl font-semibold text-gray-900">Kutsu käyttäjä</Text>
          <Text className="text-sm text-gray-500 mt-2">Käyttäjä lisätään yritykseen {company?.name}.</Text>

          <View className="mt-5 space-y-3">
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Kutsuttava"
              keyboardType="email-address"
              autoCapitalize="none"
              className="rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-base text-gray-900"
              placeholderTextColor="#9ca3af"
            />
          </View>

          {error ? <Text className="text-sm text-secondary-600 mt-3">{error}</Text> : null}

          <View className="mt-6 flex-row justify-end space-x-3">
            <TouchableOpacity onPress={onClose} className="rounded-2xl bg-gray-100 px-5 py-3">
              <Text className="text-sm font-semibold text-gray-700">Peruuta</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleInvite} className="rounded-2xl bg-primary-600 px-5 py-3">
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text className="text-sm font-semibold text-white">Kutsu</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default InviteUserModal;