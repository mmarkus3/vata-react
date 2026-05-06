import { updateClient } from '@/services/client';
import type { Client } from '@/types/client';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface EditClientModalProps {
  visible: boolean;
  client: Client;
  onClose: () => void;
  onClientUpdated: (updatedClient: Client) => void;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const finnishPhoneRegex = /^(\+358|00358|0)\d{5,12}$/;

const EditClientModal: FC<EditClientModalProps> = ({ visible, client, onClose, onClientUpdated }) => {
  const [name, setName] = useState(client.name);
  const [street, setStreet] = useState(client.address?.street ?? '');
  const [postalCode, setPostalCode] = useState(client.address?.postalCode ?? '');
  const [city, setCity] = useState(client.address?.city ?? '');
  const [phone, setPhone] = useState(client.phone ?? '');
  const [email, setEmail] = useState(client.email ?? '');
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setName(client.name);
    setStreet(client.address?.street ?? '');
    setPostalCode(client.address?.postalCode ?? '');
    setCity(client.address?.city ?? '');
    setPhone(client.phone ?? '');
    setEmail(client.email ?? '');
    setGeneralError(null);
    setFieldErrors({});
  }, [client, visible]);

  const validate = () => {
    const errors: Record<string, string> = {};

    if (!name.trim()) {
      errors.name = 'Anna asiakkaan nimi';
    }

    if (!email.trim()) {
      errors.email = 'Anna sähköposti';
    } else if (!emailRegex.test(email.trim())) {
      errors.email = 'Virheellinen sähköpostiosoite';
    }

    if (phone.trim() && !finnishPhoneRegex.test(phone.trim())) {
      errors.phone = 'Virheellinen puhelinnumero';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!client.id || !validate()) {
      return;
    }

    setIsLoading(true);
    setGeneralError(null);

    const updatedClient: Client = {
      ...client,
      name: name.trim(),
      address: {
        street: street.trim(),
        postalCode: postalCode.trim(),
        city: city.trim(),
      },
      phone: phone.trim(),
      email: email.trim(),
    };

    try {
      await updateClient(client.id, {
        name: updatedClient.name,
        address: updatedClient.address,
        phone: updatedClient.phone,
        email: updatedClient.email,
      });
      onClientUpdated(updatedClient);
      onClose();
    } catch (error) {
      setGeneralError(error instanceof Error ? error.message : 'Asiakkaan päivitys epäonnistui');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/40 px-4 py-6">
        <View className="rounded-3xl bg-white p-6 shadow-lg">
          <Text className="text-xl font-semibold text-gray-900">Muokkaa asiakasta</Text>

          <View className="mt-5 space-y-3">
            <View>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Asiakkaan nimi"
                className="rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-base text-gray-900"
                placeholderTextColor="#9ca3af"
              />
              {fieldErrors.name ? <Text className="mt-1 text-sm text-secondary-600">{fieldErrors.name}</Text> : null}
            </View>

            <View>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Sähköposti"
                keyboardType="email-address"
                autoCapitalize="none"
                className="rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-base text-gray-900"
                placeholderTextColor="#9ca3af"
              />
              {fieldErrors.email ? <Text className="mt-1 text-sm text-secondary-600">{fieldErrors.email}</Text> : null}
            </View>

            <View>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="Puhelinnumero"
                keyboardType="phone-pad"
                className="rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-base text-gray-900"
                placeholderTextColor="#9ca3af"
              />
              {fieldErrors.phone ? <Text className="mt-1 text-sm text-secondary-600">{fieldErrors.phone}</Text> : null}
            </View>

            <TextInput
              value={street}
              onChangeText={setStreet}
              placeholder="Katuosoite"
              className="rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-base text-gray-900"
              placeholderTextColor="#9ca3af"
            />

            <View className="flex-row gap-3">
              <TextInput
                value={postalCode}
                onChangeText={setPostalCode}
                placeholder="Postinumero"
                className="flex-1 rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-base text-gray-900"
                placeholderTextColor="#9ca3af"
              />
              <TextInput
                value={city}
                onChangeText={setCity}
                placeholder="Kaupunki"
                className="flex-1 rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-base text-gray-900"
                placeholderTextColor="#9ca3af"
              />
            </View>
          </View>

          {generalError ? <Text className="mt-3 text-sm text-secondary-600">{generalError}</Text> : null}

          <View className="mt-6 flex-row justify-end space-x-3">
            <TouchableOpacity onPress={onClose} disabled={isLoading} className="rounded-2xl bg-gray-100 px-5 py-3">
              <Text className="text-sm font-semibold text-gray-700">Peruuta</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave} disabled={isLoading} className="rounded-2xl bg-primary-600 px-5 py-3">
              {isLoading ? <ActivityIndicator size="small" color="#fff" /> : <Text className="text-sm font-semibold text-white">Tallenna</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default EditClientModal;
