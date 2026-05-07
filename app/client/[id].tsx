import AddFullfilmentModal from '@/components/clients/AddFullfilmentModal';
import EditClientModal from '@/components/clients/EditClientModal';
import EditFullfilmentModal from '@/components/clients/EditFullfilmentModal';
import SegmentControl from '@/components/common/SegmentControl';
import { themeColors } from '@/constants/colors';
import { deleteClient, getClientById } from '@/services/client';
import { getClientFullfilments } from '@/services/fullfliment';
import type { Client } from '@/types/client';
import type { Fullfilment } from '@/types/fullfilment';
import { groupFullfilmentsByMonth, groupFullfilmentsByProduct, type FullfilmentByMonth, type FullfilmentByProduct } from '@/utils/fullfilmentGrouping';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function ClientDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const clientId = typeof id === 'string' ? id : undefined;

  const [client, setClient] = useState<Client | null>(null);
  const [fullfilmentsByMonth, setFullfilmentsByMonth] = useState<FullfilmentByMonth[]>([]);
  const [fullfilmentsByProduct, setFullfilmentsByProduct] = useState<FullfilmentByProduct[]>([]);
  const [isLoadingClient, setIsLoadingClient] = useState(true);
  const [isLoadingFullfilments, setIsLoadingFullfilments] = useState(true);
  const [clientError, setClientError] = useState<string | null>(null);
  const [fullfilmentsError, setFullfilmentsError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0); // 0 for monthly, 1 for product
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isEditFullfilmentVisible, setIsEditFullfilmentVisible] = useState(false);
  const [selectedFullfilment, setSelectedFullfilment] = useState<Fullfilment | null>(null);

  const loadFullfilments = useCallback(async () => {
    if (!clientId || !client?.company) {
      setIsLoadingFullfilments(false);
      return;
    }

    setIsLoadingFullfilments(true);
    setFullfilmentsError(null);

    try {
      const result = await getClientFullfilments(clientId, client.company);
      setFullfilmentsByMonth(groupFullfilmentsByMonth(result));
      setFullfilmentsByProduct(groupFullfilmentsByProduct(result));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Täyttöjen haku epäonnistui';
      setFullfilmentsError(message);
      console.error('Fullfilments load error:', err);
    } finally {
      setIsLoadingFullfilments(false);
    }
  }, [client?.company, clientId]);

  useEffect(() => {
    const loadClient = async () => {
      if (!clientId) {
        setClientError('Asiakasta ei ole valittu.');
        setIsLoadingClient(false);
        return;
      }

      setIsLoadingClient(true);
      setClientError(null);

      try {
        const result = await getClientById(clientId);
        if (!result) {
          setClientError('Asiakasta ei löytynyt.');
        } else {
          setClient(result);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Asiakkaan haku epäonnistui';
        setClientError(message);
        console.error('Client load error:', err);
      } finally {
        setIsLoadingClient(false);
      }
    };

    loadClient();
  }, [clientId]);

  useEffect(() => {
    loadFullfilments();
  }, [loadFullfilments]);

  const handleBackPress = () => {
    router.back();
  };

  const handleFullfilmentCreated = async () => {
    await loadFullfilments();
    setIsAddModalVisible(false);
  };

  const handleOpenEditFullfilment = (fullfilment: Fullfilment) => {
    setSelectedFullfilment(fullfilment);
    setIsEditFullfilmentVisible(true);
  };

  const handleFullfilmentUpdated = async () => {
    await loadFullfilments();
    setIsEditFullfilmentVisible(false);
    setSelectedFullfilment(null);
  };

  const handleClientUpdated = (updatedClient: Client) => {
    setClient(updatedClient);
    setActionError(null);
    setIsEditModalVisible(false);
  };

  const handleDeleteClient = async () => {
    if (!client?.id) return;

    setIsDeleting(true);
    setActionError(null);

    try {
      await deleteClient(client.id);
      setIsDeleteModalVisible(false);
      router.replace('/(home)/clients');
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Asiakkaan poisto epäonnistui');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoadingClient) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color={themeColors.primary[600]} />
        <Text className="mt-4 text-gray-600">Ladataan asiakasta...</Text>
      </View>
    );
  }

  if (clientError) {
    return (
      <View className="flex-1 items-center justify-center bg-white p-4">
        <Text className="mb-4 text-lg font-bold text-red-600">Virhe</Text>
        <Text className="mb-6 text-center text-red-700">{clientError}</Text>
        <TouchableOpacity className="rounded-lg bg-primary-600 px-4 py-3" onPress={handleBackPress}>
          <Text className="text-center font-semibold text-white">Takaisin</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!client) {
    return (
      <View className="flex-1 items-center justify-center bg-white p-4">
        <Text className="text-gray-600">Asiakasta ei löytynyt</Text>
        <TouchableOpacity className="mt-4 rounded-lg bg-primary-600 px-4 py-3" onPress={handleBackPress}>
          <Text className="text-center font-semibold text-white">Takaisin</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      <Stack.Screen options={{ title: client.name }} />
      <ScrollView className="px-6 py-6">
        <TouchableOpacity onPress={handleBackPress} className="mb-4 rounded-full bg-white px-4 py-3 shadow-sm">
          <Text className="text-sm font-semibold text-primary-600">← Palaa</Text>
        </TouchableOpacity>

        <View className="rounded-3xl bg-white p-6 shadow-sm">
          <View className="mb-4 flex-row items-start justify-between gap-3">
            <Text className="flex-1 text-2xl font-bold text-gray-900">{client.name}</Text>
            <View className="flex-row gap-2">
              <TouchableOpacity onPress={() => setIsEditModalVisible(true)} className="rounded-xl bg-gray-100 px-3 py-2">
                <Text className="text-sm font-semibold text-gray-700">Muokkaa</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsDeleteModalVisible(true)} className="rounded-xl bg-red-100 px-3 py-2">
                <Text className="text-sm font-semibold text-red-700">Poista</Text>
              </TouchableOpacity>
            </View>
          </View>

          {client.phone && (
            <View className="mb-3">
              <Text className="text-sm font-semibold uppercase tracking-wide text-gray-500">Puhelin</Text>
              <Text className="text-gray-900">{client.phone}</Text>
            </View>
          )}

          {client.email && (
            <View className="mb-3">
              <Text className="text-sm font-semibold uppercase tracking-wide text-gray-500">Sähköposti</Text>
              <Text className="text-gray-900">{client.email}</Text>
            </View>
          )}

          {client.address?.street && (
            <View className="mb-3">
              <Text className="text-sm font-semibold uppercase tracking-wide text-gray-500">Osoite</Text>
              <Text className="text-gray-900">
                {client.address.street}, {client.address.postalCode} {client.address.city}
              </Text>
            </View>
          )}

          {actionError ? <Text className="mt-2 text-sm text-secondary-600">{actionError}</Text> : null}
        </View>

        <View className="mt-6 rounded-3xl bg-white p-6 shadow-sm">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-xl font-bold text-gray-900">Täytöt</Text>
            <TouchableOpacity onPress={() => setIsAddModalVisible(true)} className="rounded-2xl bg-primary-600 px-4 py-2">
              <Text className="text-sm font-semibold text-white">Lisää täyttö</Text>
            </TouchableOpacity>
          </View>

          <SegmentControl options={['Kuukausittain', 'Tuotteittain']} selectedIndex={activeTab} onSelectionChange={setActiveTab} />

          {activeTab === 0 ? (
            <>
              {isLoadingFullfilments ? (
                <View className="items-center py-8">
                  <ActivityIndicator size="small" color={themeColors.primary[600]} />
                  <Text className="mt-2 text-gray-600">Ladataan täyttöjä...</Text>
                </View>
              ) : fullfilmentsError ? (
                <View className="rounded-lg border border-red-200 bg-red-50 p-4">
                  <Text className="text-red-700">{fullfilmentsError}</Text>
                </View>
              ) : fullfilmentsByMonth.length === 0 ? (
                <Text className="italic text-gray-500">Ei täyttöjä</Text>
              ) : (
                fullfilmentsByMonth.map((monthGroup) => (
                  <View key={monthGroup.month} className="mb-4">
                    <View className="mb-2 flex-row items-center justify-between">
                      <Text className="text-lg font-semibold text-gray-900">{monthGroup.month}</Text>
                      <Text className="text-sm text-gray-600">Yhteensä: {monthGroup.totalAmount}</Text>
                    </View>
                    {monthGroup.fullfilments.map((fullfilment) => (
                      <TouchableOpacity
                        key={fullfilment.id}
                        onPress={() => handleOpenEditFullfilment(fullfilment)}
                        className="mb-2 ml-4 rounded-lg bg-gray-50 p-3"
                      >
                        <View className="flex-row justify-between">
                          <Text className="flex-1 text-gray-900">{new Date(fullfilment.date).toLocaleDateString('fi-FI')}</Text>
                          <Text className="text-gray-600">{fullfilment.amount || 0} kpl</Text>
                        </View>
                        <Text className="mt-1 text-sm text-gray-600">{fullfilment.products.map((p) => p.product.name).join(', ')}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ))
              )}
            </>
          ) : (
            <>
              {isLoadingFullfilments ? (
                <View className="items-center py-8">
                  <ActivityIndicator size="small" color={themeColors.primary[600]} />
                  <Text className="mt-2 text-gray-600">Ladataan täyttöjä...</Text>
                </View>
              ) : fullfilmentsError ? (
                <View className="rounded-lg border border-red-200 bg-red-50 p-4">
                  <Text className="text-red-700">{fullfilmentsError}</Text>
                </View>
              ) : fullfilmentsByProduct.length === 0 ? (
                <Text className="italic text-gray-500">Ei täyttöjä</Text>
              ) : (
                fullfilmentsByProduct.map((productGroup) => (
                  <View key={productGroup.productName} className="mb-4">
                    <View className="mb-2 flex-row items-center justify-between">
                      <Text className="text-lg font-semibold text-gray-900">{productGroup.productName}</Text>
                      <Text className="text-sm text-gray-600">Yhteensä: {productGroup.totalAmount}</Text>
                    </View>
                    {productGroup.months.map((month) => (
                      <View key={month.month} className="mb-2 ml-4 rounded-lg bg-gray-50 p-3">
                        <View className="flex-row justify-between">
                          <Text className="text-gray-900">{month.month}</Text>
                          <Text className="text-gray-600">{month.totalAmount} kpl</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                ))
              )}
            </>
          )}
        </View>
      </ScrollView>

      <AddFullfilmentModal visible={isAddModalVisible} client={client} onClose={() => setIsAddModalVisible(false)} onCreated={handleFullfilmentCreated} />
      <EditFullfilmentModal
        visible={isEditFullfilmentVisible}
        client={client}
        fullfilment={selectedFullfilment}
        onClose={() => {
          setIsEditFullfilmentVisible(false);
          setSelectedFullfilment(null);
        }}
        onSaved={handleFullfilmentUpdated}
      />

      <EditClientModal
        visible={isEditModalVisible}
        client={client}
        onClose={() => setIsEditModalVisible(false)}
        onClientUpdated={handleClientUpdated}
      />

      <Modal animationType="fade" transparent visible={isDeleteModalVisible} onRequestClose={() => setIsDeleteModalVisible(false)}>
        <View className="flex-1 items-center justify-center bg-black/40 px-6">
          <View className="w-full rounded-2xl bg-white p-6">
            <Text className="text-lg font-bold text-gray-900">Poista asiakas</Text>
            <Text className="mt-2 text-gray-600">Haluatko varmasti poistaa asiakkaan {client.name}? Tätä toimintoa ei voi perua.</Text>

            <View className="mt-6 flex-row justify-end gap-3">
              <TouchableOpacity
                onPress={() => setIsDeleteModalVisible(false)}
                disabled={isDeleting}
                className="rounded-xl bg-gray-100 px-4 py-3"
              >
                <Text className="font-semibold text-gray-700">Peruuta</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDeleteClient} disabled={isDeleting} className="rounded-xl bg-red-600 px-4 py-3">
                {isDeleting ? <ActivityIndicator size="small" color="#fff" /> : <Text className="font-semibold text-white">Poista</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
