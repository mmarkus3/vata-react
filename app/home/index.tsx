import { Text, View } from 'react-native';

export default function StorageScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold text-gray-900">Varasto</Text>
      <Text className="text-gray-600 mt-2">Manage your files here</Text>
    </View>
  );
}
