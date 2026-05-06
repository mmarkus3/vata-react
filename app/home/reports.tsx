import SegmentControl from '@/components/common/SegmentControl';
import { SelectMonth } from '@/components/date/selectMonth';
import { themeColors } from '@/constants/colors';
import { useAuth } from '@/hooks/useAuth';
import { getCompanyFullfilments } from '@/services/fullfliment';
import { Fullfilment } from '@/types/fullfilment';
import { FullfilmentByProduct, groupFullfilmentsByProduct, sortByDate } from '@/utils/fullfilmentGrouping';
import { endOfMonth, parse, startOfMonth } from 'date-fns';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';

export default function ReportsScreen() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [companyError, setCompanyError] = useState<string | null>(null);
  const [fullfilmentsError, setFullfilmentsError] = useState<string | null>(null);
  const [month, setMonth] = useState<Date>(new Date());
  const [fullfilments, setFullfilments] = useState<Fullfilment[]>([]);
  const [fullfilmentsByProduct, setFullfilmentsByProduct] = useState<FullfilmentByProduct[]>([]);
  const [activeTab, setActiveTab] = useState(0); // 0 for product, 1 for fullfilment

  useEffect(() => {
    const loadFullfillments = async () => {
      if (user == null || user?.profile == null || user?.profile?.company == null) {
        setCompanyError('Sinulla ei ole yritystä');
        return;
      }

      try {
        const result = await getCompanyFullfilments(user.profile.company, startOfMonth(month), endOfMonth(month));
        setFullfilments(result.sort(sortByDate));
        setFullfilmentsByProduct(groupFullfilmentsByProduct(result));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Täyttöjen haku epäonnistui';
        setFullfilmentsError(message);
        console.error('Fullfilments load error:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadFullfillments();
  }, [user, month]);

  function handleMonthChange(value: string) {
    const start = parse(value, 'yyyy-MM', new Date());
    setMonth(start);
  }

  if (companyError) {
    return (
      <View className="flex-1 items-center justify-center bg-white p-4">
        <Text className="text-red-600 font-bold text-lg mb-4">Virhe</Text>
        <Text className="text-red-700 text-center mb-6">{companyError}</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color={themeColors.primary[600]} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white px-6 py-8">
      <SegmentControl
        options={['Tuotteittain', 'Täyttökohtaisesti']}
        selectedIndex={activeTab}
        onSelectionChange={setActiveTab}
      />
      <div className="flex justify-center">
        <SelectMonth date={new Date()} onChange={handleMonthChange} />
      </div>
      <ScrollView className="mt-5" contentContainerStyle={{ paddingBottom: 8 }}>
        {activeTab === 0 ? (
          <>
            {fullfilmentsError ? (
              <View className="bg-red-50 border border-red-200 rounded-lg p-4">
                <Text className="text-red-700">{fullfilmentsError}</Text>
              </View>
            ) : fullfilmentsByProduct.length === 0 ? (
              <Text className="text-gray-500 italic">Ei täyttöjä</Text>
            ) : (
              fullfilmentsByProduct.map((productGroup) => (
                <View key={productGroup.productName} className="mb-2">
                  <View className="ml-4 p-3 bg-gray-50 rounded-lg">
                    <Text className="text-lg font-semibold text-gray-900">{productGroup.productName}</Text>
                    <Text className="text-sm text-gray-600">Yhteensä: {productGroup.totalAmount}</Text>
                  </View>
                </View>
              ))
            )}
            {fullfilmentsByProduct.length > 0 &&
              <View className="p-3">
                <Text className="text-gray-600 flex justify-end">Yhteensä: {fullfilmentsByProduct.reduce((prev, curr) => prev + curr.totalAmount, 0)}</Text>
              </View>
            }
          </>
        )
          : (
            <>
              {fullfilmentsError ? (
                <View className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <Text className="text-red-700">{fullfilmentsError}</Text>
                </View>
              ) : fullfilmentsByProduct.length === 0 ? (
                <Text className="text-gray-500 italic">Ei täyttöjä</Text>
              ) : (
                fullfilments.map((fullfilment) => (
                  <View key={fullfilment.id} className="ml-4 mb-2 p-3 bg-gray-50 rounded-lg">
                    <View className="flex-row justify-between">
                      <Text className="text-gray-900 flex-1">
                        {new Date(fullfilment.date).toLocaleDateString('fi-FI')} - {fullfilment.client.name}
                      </Text>
                      <Text className="text-gray-600">{fullfilment.amount || 0} kpl</Text>
                    </View>
                    {fullfilment.products.map((p) => (
                      <View key={p.product.guid}>
                        <Text className="text-lg font-semibold text-gray-900">{p.product.name}</Text>
                        <Text className="text-sm text-gray-600">Määrä: {p.amount}</Text>
                      </View>
                    ))}
                  </View>
                ))
              )}
              {fullfilments.length > 0 &&
                <View className="p-3">
                  <Text className="text-gray-600 flex justify-end">Yhteensä: {fullfilments.reduce((prev, curr) => prev + (curr.amount ?? 0), 0)}</Text>
                </View>
              }
            </>
          )
        }
      </ScrollView>
    </View>
  )
}