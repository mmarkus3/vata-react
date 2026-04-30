import AddClientModal from '@/components/clients/AddClientModal';
import ClientListItem from '@/components/clients/ClientListItem';
import { themeColors } from '@/constants/colors';
import { useClients } from '@/hooks/useClients';
import { useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';

export default function ClientsScreen() {
  const { clients, isLoading, error } = useClients();
  const [showAddClientModal, setShowAddClientModal] = useState(false);

  const handleClientCreated = () => {
    setShowAddClientModal(false);
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color={themeColors.primary[600]} />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-slate-50">
        <View className="px-6 pt-8 pb-4 bg-white border-b border-gray-200">
          <Text className="text-2xl font-bold text-gray-900">Asiakkaat</Text>
        </View>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-lg font-semibold text-secondary-600">Asiakkaiden haku epäonnistui</Text>
          <Text className="text-sm text-gray-600 mt-2 text-center">{error}</Text>
          <TouchableOpacity
            onPress={() => window.location.reload()}
            className="mt-4 rounded-2xl bg-primary-600 px-4 py-2"
          >
            <Text className="text-sm font-semibold text-white">Yritä uudelleen</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      <AddClientModal
        visible={showAddClientModal}
        onClose={() => setShowAddClientModal(false)}
        onClientCreated={handleClientCreated}
      />
      <View className="px-6 pt-8 pb-4 bg-white border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold text-gray-900">Asiakkaat</Text>
            <Text className="text-gray-600 mt-1">
              {clients.length} asiakasta
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowAddClientModal(true)}
            className="rounded-2xl bg-primary-600 px-4 py-2"
          >
            <Text className="text-sm font-semibold text-white">Lisää asiakas</Text>
          </TouchableOpacity>
        </View>
      </View>
      {clients.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6 py-10">
          <Text className="text-lg font-semibold text-gray-900">Ei vielä asiakkaita</Text>
          <Text className="text-sm text-gray-500 mt-2 text-center">
            Asiakkaat näkyvät täällä kun niitä on lisätty järjestelmään.
          </Text>
        </View>
      ) : (
        <FlatList
          className="px-4 py-3"
          data={clients}
          keyExtractor={(item) => item.id ?? `${item.name}-${item.email}`}
          renderItem={({ item }) => <ClientListItem client={item} />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}