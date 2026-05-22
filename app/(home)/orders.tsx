import { getVisibleOrderCountry } from '@/app/order/orderCountryState';
import { getFilteredSegmentedOrders, getOrderListState, type OrderSegment } from '@/app/order/orderListState';
import { getOrderDetailsRoute } from '@/app/order/orderRoute';
import Loading from '@/components/ui/loading';
import { useOrders } from '@/hooks/useOrders';
import { formatDate } from 'date-fns';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function OrdersScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { orders, isLoading, error } = useOrders();
  const [segment, setSegment] = useState<OrderSegment>('placed');
  const [query, setQuery] = useState('');

  const state = getOrderListState({ isLoading, error, orders });
  const segmentedOrders = useMemo(() => getFilteredSegmentedOrders(orders, segment, query), [orders, query, segment]);

  const getOrderStatus = (status: string) => {
    return t('orders.statuses.' + status);
  }

  if (state === 'loading') {
    return (
      <Loading />
    );
  }

  if (state === 'error') {
    return (
      <View className="flex-1 bg-slate-50">
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-lg font-semibold text-secondary-600">{t('orders.errorTitle')}</Text>
          <Text className="text-sm text-gray-600 mt-2 text-center">{error}</Text>
        </View>
      </View>
    );
  }

  if (state === 'empty') {
    return (
      <View className="flex-1 items-center justify-center px-6 py-10 bg-slate-50">
        <Text className="text-lg font-semibold text-gray-900">{t('orders.emptyTitle')}</Text>
        <Text className="text-sm text-gray-500 mt-2 text-center">{t('orders.emptyDescription')}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      <View className="flex-row gap-2 px-4 pt-3">
        {(['paid', 'placed', 'sent'] as const).map((value) => {
          const isActive = segment === value;
          return (
            <TouchableOpacity
              key={value}
              onPress={() => setSegment(value)}
              className={`rounded-2xl border px-3 py-2 ${isActive ? 'border-primary-600 bg-primary-50' : 'border-gray-300 bg-white'}`}
            >
              <Text className={`text-sm ${isActive ? 'text-primary-700' : 'text-gray-700'}`}>
                {t(`orders.statuses.${value}`)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View className="px-4 pt-3">
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={t('orders.filterPlaceholder')}
          className="rounded-2xl border border-gray-300 bg-white px-3 py-3 text-sm text-gray-900"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
      <FlatList
        className="px-4 py-3"
        data={segmentedOrders}
        keyExtractor={(item) => item.id ?? `${item.status}-${item.company}`}
        renderItem={({ item }) => {
          const visibleCountry = getVisibleOrderCountry(item.country);
          return (
            <TouchableOpacity
              onPress={() => {
                if (item.id) {
                  router.push(getOrderDetailsRoute(item.id));
                }
              }}
              className="bg-white rounded-2xl border border-gray-200 px-4 py-4 mb-3 shadow-sm"
              activeOpacity={0.8}
            >
              <View className="flex-row items-center justify-between">
                <Text className="text-base font-semibold text-gray-900">#{item.id ?? '-'} - {item.customer?.email ?? '-'}</Text>
                <Text className="text-sm font-medium text-primary-600">{getOrderStatus(item.status)}</Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="mt-2 text-sm text-gray-600">
                  {t('orders.productCount', { count: item.products?.length ?? 0 })}
                </Text>
                <Text className="text-sm font-medium text-gray-600">{formatDate(item.created, 'd.M.yyyy HH:mm')}</Text>
              </View>
              {visibleCountry ? (
                <Text className="mt-1 text-sm text-gray-600">
                  {t('orders.country', { country: visibleCountry, defaultValue: `Country: ${visibleCountry}` })}
                </Text>
              ) : null}
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={(
          <View className="rounded-2xl border border-gray-200 bg-white px-4 py-6">
            <Text className="text-center text-sm text-gray-500">
              {query.trim() ? t('orders.emptyFilteredDescription') : t('orders.emptyDescription')}
            </Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
