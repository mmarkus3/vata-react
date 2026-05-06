import { useAuth } from '@/hooks/useAuth';
import { updateFullfilment, updateFullfilmentWithProducts } from '@/services/fullfliment';
import { createMail } from '@/services/mail';
import { getProductsByCompany } from '@/services/product';
import type { Client } from '@/types/client';
import type { Fullfilment } from '@/types/fullfilment';
import { Mail } from '@/types/mail';
import type { Product } from '@/types/product';
import { mapSelectedLinesToFullfilmentProducts, parseLinePrice, type SelectedFullfilmentLine } from '@/utils/fullfilmentLinePrice';
import { Ionicons } from '@expo/vector-icons';
import { Timestamp } from 'firebase/firestore';
import type { FC } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface EditFullfilmentModalProps {
  visible: boolean;
  client: Client;
  fullfilment: Fullfilment | null;
  onClose: () => void;
  onSaved: () => void;
}

const EditFullfilmentModal: FC<EditFullfilmentModalProps> = ({ visible, client, fullfilment, onClose, onSaved }) => {
  const [date, setDate] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedAmount, setSelectedAmount] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');
  const [lines, setLines] = useState<SelectedFullfilmentLine[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [emailSent, setEmailSent] = useState(fullfilment?.mail);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { user, company } = useAuth();

  const selectedProduct = useMemo(() => products.find((p) => p.id === selectedProductId), [products, selectedProductId]);

  useEffect(() => {
    if (!visible || !fullfilment) return;

    const d = new Date(fullfilment.date);
    setDate(d.toLocaleDateString('fi-FI'));
    setEmailSent(fullfilment.mail);
    setLines(
      fullfilment.products.map((item) => ({
        amount: String(item.amount),
        price: String(item.product.price),
        product: {
          id: item.product.guid,
          name: item.product.name,
          ean: item.product.ean,
          amount: 0,
          company: client.company,
          barcode: '',
          price: item.product.price,
        },
      }))
    );

    setIsLoadingProducts(true);
    setGeneralError(null);
    const unsub = getProductsByCompany(client.company, (res) => {
      setProducts(res);
      setIsLoadingProducts(false);
    });

    return () => {
      if (unsub) unsub();
    };
  }, [client.company, fullfilment, visible]);

  useEffect(() => {
    if (selectedProduct) setSelectedPrice(String(selectedProduct.price ?? 0));
  }, [selectedProduct]);

  const addLine = () => {
    const errors: Record<string, string> = {};
    if (!selectedProduct) errors.product = 'Valitse tuote';

    const amount = Number(selectedAmount);
    if (!selectedAmount.trim() || Number.isNaN(amount) || amount <= 0 || !Number.isInteger(amount)) {
      errors.amount = 'Anna kelvollinen määrä (kokonaisluku > 0)';
    }

    if (parseLinePrice(selectedPrice) == null) {
      errors.price = 'Anna kelvollinen hinta (>= 0)';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors((prev) => ({ ...prev, ...errors }));
      return;
    }

    setLines((prev) => [...prev, { product: selectedProduct!, amount: selectedAmount.trim(), price: selectedPrice.trim() }]);
    setSelectedProductId('');
    setSelectedAmount('');
    setSelectedPrice('');
    setFieldErrors((prev) => ({ ...prev, product: '', amount: '', price: '' }));
  };

  const removeLine = (index: number) => {
    setLines((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!fullfilment?.id) return;

    const errors: Record<string, string> = {};
    if (lines.length === 0) errors.products = 'Lisää vähintään yksi tuote';
    if (lines.some((l) => Number(l.amount) <= 0 || !Number.isInteger(Number(l.amount)))) errors.products = 'Tuotemäärät virheellisiä';
    if (lines.some((l) => parseLinePrice(l.price) == null)) errors.products = 'Tuotehinta virheellinen';

    const [day, month, year] = date.split('.').map((v) => Number(v));
    const parsedDate = new Date(year, month - 1, day);
    if (!Number.isInteger(day) || !Number.isInteger(month) || !Number.isInteger(year) || Number.isNaN(parsedDate.getTime())) {
      errors.date = 'Anna päivämäärä muodossa pp.kk.vvvv';
    }

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSaving(true);
    setGeneralError(null);

    try {
      await updateFullfilmentWithProducts(
        fullfilment.id,
        fullfilment,
        {
          client: fullfilment.client,
          company: fullfilment.company,
          date: parsedDate.toISOString(),
          products: mapSelectedLinesToFullfilmentProducts(lines),
        }
      );
      onSaved();
      onClose();
    } catch (error) {
      setGeneralError(error instanceof Error ? error.message : 'Täytön päivitys epäonnistui');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendEmail = async () => {
    if (!fullfilment?.id) return;
    if (!client.email) return;

    setIsSending(true);
    setGeneralError(null);

    const mail: Mail = {
      email: client.email,
      fullfilment: fullfilment?.id!,
      created: Timestamp.now(),
      from: { email: user?.email!, name: company?.name! },
    }

    try {
      const emailId = await createMail(mail);
      const fullfilmentEmailSent = { guid: emailId, sent: mail.created };
      await updateFullfilment(fullfilment.id, { mail: fullfilmentEmailSent });
      setEmailSent(fullfilmentEmailSent);
    } catch (error) {
      setGeneralError(error instanceof Error ? error.message : 'Sähköpostin lähetys epäonnistui');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/40 px-4 py-6">
        <View className="max-h-[90%] rounded-3xl bg-white p-6 shadow-lg">
          <Text className="text-xl font-semibold text-gray-900">Muokkaa täyttöä</Text>
          <ScrollView className="mt-4" contentContainerStyle={{ paddingBottom: 8 }}>
            <TextInput value={date} onChangeText={setDate} placeholder="pp.kk.vvvv" className="rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-base text-gray-900" />
            {fieldErrors.date ? <Text className="mt-1 text-sm text-secondary-600">{fieldErrors.date}</Text> : null}

            <View className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-3">
              {isLoadingProducts ? (
                <View className="flex-row items-center py-2"><ActivityIndicator size="small" color="#1d4ed8" /><Text className="ml-2 text-sm text-gray-600">Ladataan tuotteita...</Text></View>
              ) : (
                <>
                  <View className="rounded-xl border border-gray-300 bg-white">
                    {products.map((item) => (
                      <TouchableOpacity key={item.id} onPress={() => setSelectedProductId(item.id ?? '')} className={`px-4 py-3 ${selectedProductId === item.id ? 'bg-primary-50' : ''}`}>
                        <Text className={`${selectedProductId === item.id ? 'text-primary-700' : 'text-gray-900'}`}>{item.name} ({item.ean})</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <TextInput value={selectedAmount} onChangeText={setSelectedAmount} placeholder="Määrä" keyboardType="number-pad" className="mt-3 rounded-2xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900" />
                  <TextInput value={selectedPrice} onChangeText={setSelectedPrice} placeholder="Hinta" keyboardType="decimal-pad" className="mt-3 rounded-2xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900" />
                  {fieldErrors.amount ? <Text className="mt-1 text-sm text-secondary-600">{fieldErrors.amount}</Text> : null}
                  {fieldErrors.price ? <Text className="mt-1 text-sm text-secondary-600">{fieldErrors.price}</Text> : null}
                  <TouchableOpacity onPress={addLine} className="mt-3 rounded-2xl bg-primary-600 px-4 py-3"><Text className="text-center text-sm font-semibold text-white">Lisää tuote</Text></TouchableOpacity>
                </>
              )}
            </View>

            <View className="mt-4">
              {lines.map((line, i) => (
                <View key={`${line.product.id}-${i}`} className="mb-2 flex-row items-center justify-between rounded-xl bg-gray-100 px-3 py-2">
                  <Text className="flex-1 text-gray-900">{line.product.name} ({line.product.ean}) - {line.amount} kpl - {line.price} EUR</Text>
                  <TouchableOpacity onPress={() => removeLine(i)} className="ml-2 rounded-lg bg-red-100 px-3 py-1"><Text className="text-red-700">Poista</Text></TouchableOpacity>
                </View>
              ))}
              {fieldErrors.products ? <Text className="mt-1 text-sm text-secondary-600">{fieldErrors.products}</Text> : null}
            </View>

            {generalError ? <Text className="mt-3 text-sm text-secondary-600">{generalError}</Text> : null}
          </ScrollView>

          <View className="mt-4 flex-row justify-between space-x-3">
            {client.email && (
              <TouchableOpacity onPress={handleSendEmail} disabled={isSending} className="rounded-2xl bg-primary-600 px-5 py-3">{isSending ? <ActivityIndicator size="small" color="#fff" /> : <Text className="text-sm font-semibold text-white">Lähetä <Ionicons name="mail-outline" size={16}></Ionicons></Text>}</TouchableOpacity>
            )}
            <div className="flex space-x-3">
              <TouchableOpacity onPress={onClose} disabled={isSaving} className="rounded-2xl bg-gray-100 px-5 py-3"><Text className="text-sm font-semibold text-gray-700">Peruuta</Text></TouchableOpacity>
              <TouchableOpacity onPress={handleSave} disabled={isSaving} className="rounded-2xl bg-primary-600 px-5 py-3">{isSaving ? <ActivityIndicator size="small" color="#fff" /> : <Text className="text-sm font-semibold text-white">Tallenna</Text>}</TouchableOpacity>
            </div>
          </View>
          {emailSent && (
            <View className="mt-2">
              <Text className="text-xs text-gray-500">Sähköposti lähetetty {emailSent.sent.toDate().toLocaleDateString('fi')}</Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default EditFullfilmentModal;
