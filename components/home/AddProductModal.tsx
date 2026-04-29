import { useAuth } from '@/hooks/useAuth';
import { createProduct } from '@/services/product';
import type { FC } from 'react';
import { useState } from 'react';
import { ActivityIndicator, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface AddProductModalProps {
  visible: boolean;
  onClose: () => void;
  onProductCreated: () => void;
}

const AddProductModal: FC<AddProductModalProps> = ({ visible, onClose, onProductCreated }) => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('0');
  const [price, setPrice] = useState('0');
  const [barcode, setBarcode] = useState('');
  const [ean, setEan] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    setError(null);

    if (!name.trim()) {
      setError('Anna tuotteen nimi');
      return;
    }

    const amountValue = Number(amount);
    const priceValue = Number(price);

    if (Number.isNaN(amountValue) || amountValue < 0) {
      setError('Anna kelvollinen määrä');
      return;
    }

    if (Number.isNaN(priceValue) || priceValue < 0) {
      setError('Anna kelvollinen hinta');
      return;
    }

    if (!user?.profile?.company) {
      setError('Käyttäjällä ei ole yritystä liitettynä');
      return;
    }

    try {
      setIsLoading(true);
      await createProduct({
        name: name.trim(),
        amount: amountValue,
        price: priceValue,
        barcode: barcode.trim(),
        ean: ean.trim(),
        company: user.profile.company,
      });
      setName('');
      setAmount('0');
      setPrice('0');
      setBarcode('');
      setEan('');
      onProductCreated();
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Tuotteen tallennus epäonnistui';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/40 px-4 py-6">
        <View className="rounded-3xl bg-white p-6 shadow-lg">
          <Text className="text-xl font-semibold text-gray-900">Lisää tuote</Text>
          <Text className="text-sm text-gray-500 mt-2">Täytä tuotteen tiedot ja tallenna varastoon.</Text>

          <View className="mt-5 space-y-3">
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Tuotteen nimi"
              className="rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-base text-gray-900"
              placeholderTextColor="#9ca3af"
            />
            <TextInput
              value={amount}
              onChangeText={setAmount}
              placeholder="Määrä"
              keyboardType="numeric"
              className="rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-base text-gray-900"
              placeholderTextColor="#9ca3af"
            />
            <TextInput
              value={price}
              onChangeText={setPrice}
              placeholder="Hinta"
              keyboardType="numeric"
              className="rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-base text-gray-900"
              placeholderTextColor="#9ca3af"
            />
            <TextInput
              value={barcode}
              onChangeText={setBarcode}
              placeholder="Viivakoodi"
              className="rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-base text-gray-900"
              placeholderTextColor="#9ca3af"
            />
            <TextInput
              value={ean}
              onChangeText={setEan}
              placeholder="EAN"
              className="rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-base text-gray-900"
              placeholderTextColor="#9ca3af"
            />
          </View>

          {error ? <Text className="text-sm text-secondary-600 mt-3">{error}</Text> : null}

          <View className="mt-6 flex-row justify-end space-x-3">
            <TouchableOpacity onPress={onClose} className="rounded-2xl bg-gray-100 px-5 py-3">
              <Text className="text-sm font-semibold text-gray-700">Peruuta</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCreate} className="rounded-2xl bg-primary-600 px-5 py-3">
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

export default AddProductModal;
