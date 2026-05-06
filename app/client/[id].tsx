import AddFullfilmentModal from '@/components/clients/AddFullfilmentModal';
import SegmentControl from '@/components/common/SegmentControl';
import { themeColors } from '@/constants/colors';
import { getClientById } from '@/services/client';
import { getClientFullfilments } from '@/services/fullfliment';
import type { Client } from '@/types/client';
import { groupFullfilmentsByMonth, groupFullfilmentsByProduct, type FullfilmentByMonth, type FullfilmentByProduct } from '@/utils/fullfilmentGrouping';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';

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
        <Text className="text-red-600 font-bold text-lg mb-4">Virhe</Text>
        <Text className="text-red-700 text-center mb-6">{clientError}</Text>
        <TouchableOpacity
          className="bg-primary-600 rounded-lg px-4 py-3"
          onPress={handleBackPress}
        >
          <Text className="text-white font-semibold text-center">Takaisin</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!client) {
    return (
      <View className="flex-1 items-center justify-center bg-white p-4">
        <Text className="text-gray-600">Asiakasta ei löytynyt</Text>
        <TouchableOpacity
          className="mt-4 bg-primary-600 rounded-lg px-4 py-3"
          onPress={handleBackPress}
        >
          <Text className="text-white font-semibold text-center">Takaisin</Text>
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
        {/* Client Information Section */}
        <View className="rounded-3xl bg-white p-6 shadow-sm">
          <Text className="text-2xl font-bold text-gray-900 mb-4">{client.name}</Text>

          {client.phone && (
            <View className="mb-3">
              <Text className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Puhelin</Text>
              <Text className="text-gray-900">{client.phone}</Text>
            </View>
          )}

          {client.email && (
            <View className="mb-3">
              <Text className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Sähköposti</Text>
              <Text className="text-gray-900">{client.email}</Text>
            </View>
          )}

          {client.address && (
            <View className="mb-3">
              <Text className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Osoite</Text>
              <Text className="text-gray-900">
                {client.address.street}, {client.address.postalCode} {client.address.city}
              </Text>
            </View>
          )}
        </View>

        {/* Fullfilments Section with Segment Control */}
        <View className="mt-6 rounded-3xl bg-white p-6 shadow-sm">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-xl font-bold text-gray-900">Täytöt</Text>
            <TouchableOpacity
              onPress={() => setIsAddModalVisible(true)}
              className="rounded-2xl bg-primary-600 px-4 py-2"
            >
              <Text className="text-sm font-semibold text-white">Lisää täyttö</Text>
            </TouchableOpacity>
          </View>

          <SegmentControl
            options={['Kuukausittain', 'Tuotteittain']}
            selectedIndex={activeTab}
            onSelectionChange={setActiveTab}
          />

          {activeTab === 0 ? (
            /* Fullfilments by Month Section */
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
                      <View key={fullfilment.id} className="mb-2 ml-4 rounded-lg bg-gray-50 p-3">
                        <View className="flex-row justify-between">
                          <Text className="flex-1 text-gray-900">
                            {new Date(fullfilment.date).toLocaleDateString('fi-FI')}
                          </Text>
                          <Text className="text-gray-600">{fullfilment.amount || 0} kpl</Text>
                        </View>
                        <Text className="mt-1 text-sm text-gray-600">
                          {fullfilment.products.map((p) => p.product.name).join(', ')}
                        </Text>
                      </View>
                    ))}
                  </View>
                ))
              )}
            </>
          ) : (
            /* Fullfilments by Product Section */
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

      <AddFullfilmentModal
        visible={isAddModalVisible}
        client={client}
        onClose={() => setIsAddModalVisible(false)}
        onCreated={handleFullfilmentCreated}
      />
    </View>
  );
}
