import { getVisibleOrderCountry } from '@/app/order/orderCountryState';
import {
  getCustomerAddressLine,
  getCustomerFullName,
  hasOrderCustomer,
} from '@/app/order/orderDetailCustomerState';
import {
  getSelectedPointState
} from '@/app/order/orderDetailDeliveryState';
import { hasOrderProductLines } from '@/app/order/orderDetailProductsState';
import Back from '@/components/ui/back';
import Loading from '@/components/ui/loading';
import { getOrderById, getSelectedPointInfo, resolveOrderPointId, type SelectedPointInfo } from '@/services/order';
import type { Order } from '@/types/order';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

export default function OrderDetailPage() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedPoint, setSelectedPoint] = useState<SelectedPointInfo | null>(null);
  const [isLoadingPoint, setIsLoadingPoint] = useState(false);
  const [pointError, setPointError] = useState<string | null>(null);

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

  const pointId = useMemo(() => resolveOrderPointId(order), [order]);

  useEffect(() => {
    let isMounted = true;

    const loadPoint = async () => {
      setSelectedPoint(null);
      setPointError(null);

      if (!order?.company || !pointId) {
        return;
      }

      try {
        setIsLoadingPoint(true);
        const result = await getSelectedPointInfo(order.company, pointId);
        if (!isMounted) return;
        setSelectedPoint(result);
      } catch (err) {
        if (!isMounted) return;
        setPointError(err instanceof Error ? err.message : t('orders.detail.pointLoadFailed'));
      } finally {
        if (isMounted) {
          setIsLoadingPoint(false);
        }
      }
    };

    loadPoint();

    return () => {
      isMounted = false;
    };
  }, [order?.company, pointId, t]);

  const getOrderStatus = (status: string) => {
    return t('orders.statuses.' + status);
  }

  const customerName = getCustomerFullName(order?.customer);
  const customerAddress = getCustomerAddressLine(order?.customer);

  const selectedPointState = getSelectedPointState({
    isLoading: isLoadingPoint,
    error: pointError,
    point: selectedPoint,
    hasPointId: Boolean(pointId),
  });
  const visibleCountry = getVisibleOrderCountry(order?.country);

  if (isLoading) {
    return (
      <Loading />
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
        {visibleCountry ? (
          <Text className="mt-1 text-sm text-gray-600">
            {t('orders.country', { country: visibleCountry, defaultValue: `Country: ${visibleCountry}` })}
          </Text>
        ) : null}

        <Text className="mt-4 text-sm font-semibold text-gray-800">{t('orders.detail.deliveryMethodSection')}</Text>
        <Text className="mt-3 text-sm font-semibold text-gray-800">{t('orders.detail.selectedPointSection')}</Text>
        {selectedPointState === 'loading' ? (
          <Text className="mt-1 text-sm text-gray-600">{t('orders.detail.pointLoading')}</Text>
        ) : selectedPointState === 'error' ? (
          <Text className="mt-1 text-sm text-gray-500">{t('orders.detail.pointLoadFailed')}</Text>
        ) : selectedPointState === 'success' ? (
          <View className="mt-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
            <Text className="text-sm text-gray-900">{selectedPoint?.name || t('orders.detail.customerMissingField')}</Text>
            <Text className="mt-1 text-sm text-gray-600">{selectedPoint?.address || t('orders.detail.customerMissingField')}</Text>
            <Text className="mt-1 text-sm text-gray-600">
              {[selectedPoint?.postalCode, selectedPoint?.city].filter(Boolean).join(' ') || t('orders.detail.customerMissingField')}
            </Text>
          </View>
        ) : (
          <Text className="mt-1 text-sm text-gray-500">{t('orders.detail.pointNotSelected')}</Text>
        )}

        <Text className="mt-4 text-sm font-semibold text-gray-800">{t('orders.detail.customerSection')}</Text>
        {hasOrderCustomer(order?.customer) ? (
          <View className="mt-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
            <Text className="text-sm text-gray-600">
              {t('orders.detail.customerName', { value: customerName ?? t('orders.detail.customerMissingField') })}
            </Text>
            <Text className="mt-1 text-sm text-gray-600">
              {t('orders.detail.customerEmail', {
                value: order?.customer?.email?.trim() || t('orders.detail.customerMissingField'),
              })}
            </Text>
            <Text className="mt-1 text-sm text-gray-600">
              {t('orders.detail.customerPhone', {
                value: order?.customer?.phone?.trim() || t('orders.detail.customerMissingField'),
              })}
            </Text>
            <Text className="mt-1 text-sm text-gray-600">
              {t('orders.detail.customerAddress', { value: customerAddress ?? t('orders.detail.customerMissingField') })}
            </Text>
          </View>
        ) : (
          <Text className="mt-2 text-sm text-gray-500">{t('orders.detail.emptyCustomer')}</Text>
        )}

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
