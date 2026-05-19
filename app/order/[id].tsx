import { themeColors } from '@/constants/colors';
import { getOrderById } from '@/services/order';
import type { Order } from '@/types/order';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

export default function OrderDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      if (!id) {
        setError('Order not selected');
        setIsLoading(false);
        return;
      }

      try {
        const result = await getOrderById(id);
        if (!isMounted) return;
        setOrder(result);
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Order load failed');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color={themeColors.primary[600]} />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-slate-50 px-6 py-6">
        <TouchableOpacity onPress={() => router.back()} className="mb-4 rounded-full bg-white px-4 py-3 shadow-sm">
          <Text className="text-sm font-semibold text-primary-600">← Palaa</Text>
        </TouchableOpacity>
        <View className="rounded-2xl border border-red-300 bg-red-50 p-4">
          <Text className="text-base text-secondary-600">{error}</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50 px-6 py-6">
      <TouchableOpacity onPress={() => router.back()} className="mb-4 rounded-full bg-white px-4 py-3 shadow-sm">
        <Text className="text-sm font-semibold text-primary-600">← Palaa</Text>
      </TouchableOpacity>
      <Stack.Screen options={{ title: order?.id ? `Order #${order.id}` : 'Tilaus' }} />
      <View className="rounded-2xl bg-white p-4">
        <Text className="text-base font-semibold text-gray-900">Tilaus #{order?.id ?? '-'}</Text>
        <Text className="mt-2 text-sm text-gray-600">Status: {order?.status ?? '-'}</Text>
        <Text className="mt-2 text-sm text-gray-600">Tuotteet: {order?.products?.length ?? 0}</Text>
      </View>
    </View>
  );
}
