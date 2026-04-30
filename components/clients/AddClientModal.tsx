import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/services/client';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface AddClientModalProps {
  visible: boolean;
  onClose: () => void;
  onClientCreated: () => void;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const finnishPhoneRegex = /^(\+358|00358|0)\d{5,12}$/;

const AddClientModal: FC<AddClientModalProps> = ({ visible, onClose, onClientCreated }) => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [company, setCompany] = useState(user?.profile?.company ?? '');
  const [street, setStreet] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setCompany(user?.profile?.company ?? '');
  }, [user?.profile?.company]);

  const resetForm = () => {
    setName('');
    setCompany(user?.profile?.company ?? '');
    setStreet('');
    setPostalCode('');
    setCity('');
    setPhone('');
    setEmail('');
    setGeneralError(null);
    setFieldErrors({});
  };

  const handleClose = () => {
    if (isLoading) return;
    resetForm();
    onClose();
  };

  const validate = () => {
    const errors: Record<string, string> = {};

    if (!name.trim()) {
      errors.name = 'Anna asiakkaan nimi';
    }

    if (!company.trim()) {
      errors.company = 'Anna yritys';
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
    if (!validate()) {
      return;
    }

    if (!user?.profile?.company && !company.trim()) {
      setGeneralError('Yritystunnus puuttuu');
      return;
    }

    setIsLoading(true);
    setGeneralError(null);

    try {
      await createClient({
        name: name.trim(),
        company: company.trim(),
        address: {
          street: street.trim(),
          postalCode: postalCode.trim(),
          city: city.trim(),
        },
        phone: phone.trim(),
        email: email.trim(),
      });
      resetForm();
      onClientCreated();
      onClose();
    } catch (error) {
      setGeneralError(error instanceof Error ? error.message : 'Asiakkaan tallennus epäonnistui');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={handleClose}>
      <View className="flex-1 justify-end bg-black/40 px-4 py-6">
        <View className="rounded-3xl bg-white p-6 shadow-lg">
          <Text className="text-xl font-semibold text-gray-900">Lisää asiakas</Text>
          <Text className="text-sm text-gray-500 mt-2">Täytä asiakkaan tiedot ja tallenna ne yhtiölle.</Text>

          <View className="mt-5 space-y-3">
            <View>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Asiakkaan nimi"
                className="rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-base text-gray-900"
                placeholderTextColor="#9ca3af"
              />
              {fieldErrors.name ? <Text className="text-sm text-secondary-600 mt-1">{fieldErrors.name}</Text> : null}
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
              {fieldErrors.email ? <Text className="text-sm text-secondary-600 mt-1">{fieldErrors.email}</Text> : null}
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
              {fieldErrors.phone ? <Text className="text-sm text-secondary-600 mt-1">{fieldErrors.phone}</Text> : null}
            </View>

            <View>
              <TextInput
                value={street}
                onChangeText={setStreet}
                placeholder="Katuosoite"
                className="rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-base text-gray-900"
                placeholderTextColor="#9ca3af"
              />
            </View>

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

          {generalError ? <Text className="text-sm text-secondary-600 mt-3">{generalError}</Text> : null}

          <View className="mt-6 flex-row justify-end space-x-3">
            <TouchableOpacity onPress={handleClose} disabled={isLoading} className="rounded-2xl bg-gray-100 px-5 py-3">
              <Text className="text-sm font-semibold text-gray-700">Peruuta</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave} disabled={isLoading} className="rounded-2xl bg-primary-600 px-5 py-3">
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text className="text-sm font-semibold text-white">Tallenna</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddClientModal;
