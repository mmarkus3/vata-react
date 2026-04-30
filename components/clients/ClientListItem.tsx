import type { Client } from '@/types/client';
import { FC } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface ClientListItemProps {
  client: Client;
}

const ClientListItem: FC<ClientListItemProps> = ({ client }) => {
  return (
    <TouchableOpacity
      className="bg-white rounded-2xl border border-gray-200 px-4 py-4 mb-3 shadow-sm"
      activeOpacity={0.8}
    >
      <View className="flex-row items-center justify-between">
        <Text className="text-base font-semibold text-gray-900">{client.name}</Text>
      </View>
      <View className="mt-3 space-y-2">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-sm text-gray-500">Puhelin</Text>
            <Text className="text-base font-medium text-gray-900">{client.phone}</Text>
          </View>
          <View>
            <Text className="text-sm text-gray-500">Sähköposti</Text>
            <Text className="text-base font-medium text-gray-900">{client.email}</Text>
          </View>
        </View>
        <View className="mt-2">
          <Text className="text-sm text-gray-500">Osoite</Text>
          <Text className="text-base font-medium text-gray-900">
            {client.address.street}, {client.address.postalCode} {client.address.city}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ClientListItem;