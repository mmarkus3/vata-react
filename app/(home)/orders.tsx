import { getOrderListState } from '@/app/order/orderListState';
import { getOrderDetailsRoute } from '@/app/order/orderRoute';
import { themeColors } from '@/constants/colors';
import { useOrders } from '@/hooks/useOrders';
import { formatDate } from 'date-fns';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';

export default function OrdersScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { orders, isLoading, error } = useOrders();

  const state = getOrderListState({ isLoading, error, orders });

  const getOrderStatus = (status: string) => {
    return t('orders.statuses.' + status);
  }

  if (state === 'loading') {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color={themeColors.primary[600]} />
      </View>
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
      <FlatList
        className="px-4 py-3"
        data={orders}
        keyExtractor={(item) => item.id ?? `${item.status}-${item.company}`}
        renderItem={({ item }) => (
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
              <Text className="text-base font-semibold text-gray-900">#{item.id ?? '-'}</Text>
              <Text className="text-sm font-medium text-primary-600">{getOrderStatus(item.status)}</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="mt-2 text-sm text-gray-600">
                {t('orders.productCount', { count: item.products?.length ?? 0 })}
              </Text>
              <Text className="text-sm font-medium text-gray-600">{formatDate(item.created, 'd.M.yyyy HH:mm')}</Text>
            </View>
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
