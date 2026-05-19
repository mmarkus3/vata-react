import { hasOrderProductLines } from '@/app/order/orderDetailProductsState';
import Back from '@/components/ui/back';
import { themeColors } from '@/constants/colors';
import { getOrderById } from '@/services/order';
import type { Order } from '@/types/order';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Text, View } from 'react-native';

export default function OrderDetailPage() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      if (!id) {
        setError(t('orders.detail.errors.notSelected'));
        setIsLoading(false);
        return;
      }

      try {
        const result = await getOrderById(id);
        if (!isMounted) return;
        setOrder(result);
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : t('orders.detail.errors.loadFailed'));
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
  }, [id, t]);

  const getOrderStatus = (status: string) => {
    return t('orders.statuses.' + status);
  }

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
        <Back />
        <View className="rounded-2xl border border-red-300 bg-red-50 p-4">
          <Text className="text-base text-secondary-600">{error}</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50 px-6 py-6">
      <Back />
      <Stack.Screen options={{ title: order?.id ? `Order #${order.id}` : 'Tilaus' }} />
      <View className="rounded-2xl bg-white p-4">
        <Text className="text-base font-semibold text-gray-900">{t('orders.detail.title', { id: order?.id ?? '-' })}</Text>
        <Text className="mt-2 text-sm text-gray-600">{order?.status && getOrderStatus(order.status)}</Text>
        <Text className="mt-3 text-sm font-semibold text-gray-800">{t('orders.detail.productsSection')}</Text>
        {hasOrderProductLines(order?.products) ? (
          <View className="mt-2 space-y-2">
            {order?.products.map((product) => (
              <View key={`${product.id}-${product.name}`} className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
                <Text className="text-sm font-medium text-gray-900">{product.name || '-'}</Text>
                <Text className="mt-1 text-sm text-gray-600">{t('orders.detail.productAmount', { amount: product.amount ?? 0 })}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text className="mt-2 text-sm text-gray-500">{t('orders.detail.emptyProducts')}</Text>
        )}
      </View>
    </View>
  );
}
