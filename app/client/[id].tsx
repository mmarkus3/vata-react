import { themeColors } from '@/constants/colors';
import { getClientById } from '@/services/client';
import { getClientFullfilments } from '@/services/fullfliment';
import type { Client } from '@/types/client';
import type { Fullfilment } from '@/types/fullfilment';
import { groupFullfilmentsByMonth, groupFullfilmentsByProduct, type FullfilmentByMonth, type FullfilmentByProduct } from '@/utils/fullfilmentGrouping';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function ClientDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const clientId = typeof id === 'string' ? id : undefined;

  const [client, setClient] = useState<Client | null>(null);
  const [fullfilments, setFullfilments] = useState<Fullfilment[]>([]);
  const [fullfilmentsByMonth, setFullfilmentsByMonth] = useState<FullfilmentByMonth[]>([]);
  const [fullfilmentsByProduct, setFullfilmentsByProduct] = useState<FullfilmentByProduct[]>([]);
  const [isLoadingClient, setIsLoadingClient] = useState(true);
  const [isLoadingFullfilments, setIsLoadingFullfilments] = useState(true);
  const [clientError, setClientError] = useState<string | null>(null);
  const [fullfilmentsError, setFullfilmentsError] = useState<string | null>(null);

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

    const loadFullfilments = async () => {
      if (!clientId) {
        setIsLoadingFullfilments(false);
        return;
      }

      if (!client?.company) {
        setIsLoadingFullfilments(false);
        return;
      }

      setIsLoadingFullfilments(true);
      setFullfilmentsError(null);

      try {
        const result = await getClientFullfilments(clientId, client.company);
        setFullfilments(result);
        setFullfilmentsByMonth(groupFullfilmentsByMonth(result));
        setFullfilmentsByProduct(groupFullfilmentsByProduct(result));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Täyttöjen haku epäonnistui';
        setFullfilmentsError(message);
        console.error('Fullfilments load error:', err);
      } finally {
        setIsLoadingFullfilments(false);
      }
    };

    loadClient();
    loadFullfilments();
  }, [client?.company, clientId]);

  const handleBackPress = () => {
    router.back();
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

        {/* Fullfilments by Month Section */}
        <View className="rounded-3xl bg-white p-6 mt-6 shadow-sm">
          <Text className="text-xl font-bold text-gray-900 mb-4">Täytöt kuukausittain</Text>

          {isLoadingFullfilments ? (
            <View className="items-center py-8">
              <ActivityIndicator size="small" color={themeColors.primary[600]} />
              <Text className="mt-2 text-gray-600">Ladataan täyttöjä...</Text>
            </View>
          ) : fullfilmentsError ? (
            <View className="bg-red-50 border border-red-200 rounded-lg p-4">
              <Text className="text-red-700">{fullfilmentsError}</Text>
            </View>
          ) : fullfilmentsByMonth.length === 0 ? (
            <Text className="text-gray-500 italic">Ei täyttöjä</Text>
          ) : (
            fullfilmentsByMonth.map((monthGroup) => (
              <View key={monthGroup.month} className="mb-4">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-lg font-semibold text-gray-900">{monthGroup.month}</Text>
                  <Text className="text-sm text-gray-600">Yhteensä: {monthGroup.totalAmount}</Text>
                </View>
                {monthGroup.fullfilments.map((fullfilment) => (
                  <View key={fullfilment.id} className="ml-4 mb-2 p-3 bg-gray-50 rounded-lg">
                    <View className="flex-row justify-between">
                      <Text className="text-gray-900 flex-1">
                        {new Date(fullfilment.date).toLocaleDateString('fi-FI')}
                      </Text>
                      <Text className="text-gray-600">{fullfilment.amount || 0} kpl</Text>
                    </View>
                    <Text className="text-sm text-gray-600 mt-1">
                      {fullfilment.products.map(p => p.product.name).join(', ')}
                    </Text>
                  </View>
                ))}
              </View>
            ))
          )}
        </View>

        {/* Fullfilments by Product Section */}
        <View className="rounded-3xl bg-white p-6 mt-6 shadow-sm">
          <Text className="text-xl font-bold text-gray-900 mb-4">Täytöt tuotteittain</Text>

          {isLoadingFullfilments ? (
            <View className="items-center py-8">
              <ActivityIndicator size="small" color={themeColors.primary[600]} />
              <Text className="mt-2 text-gray-600">Ladataan täyttöjä...</Text>
            </View>
          ) : fullfilmentsError ? (
            <View className="bg-red-50 border border-red-200 rounded-lg p-4">
              <Text className="text-red-700">{fullfilmentsError}</Text>
            </View>
          ) : fullfilmentsByProduct.length === 0 ? (
            <Text className="text-gray-500 italic">Ei täyttöjä</Text>
          ) : (
            fullfilmentsByProduct.map((productGroup) => (
              <View key={productGroup.productName} className="mb-4">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-lg font-semibold text-gray-900">{productGroup.productName}</Text>
                  <Text className="text-sm text-gray-600">Yhteensä: {productGroup.totalAmount}</Text>
                </View>
                {productGroup.months.map((month) => (
                  <View key={month.month} className="ml-4 mb-2 p-3 bg-gray-50 rounded-lg">
                    <View className="flex-row justify-between">
                      <Text className="text-gray-900">{month.month}</Text>
                      <Text className="text-gray-600">{month.totalAmount} kpl</Text>
                    </View>
                  </View>
                ))}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}