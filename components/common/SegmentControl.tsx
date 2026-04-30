import { FC } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface SegmentControlProps {
  options: string[];
  selectedIndex: number;
  onSelectionChange: (index: number) => void;
}

const SegmentControl: FC<SegmentControlProps> = ({ options, selectedIndex, onSelectionChange }) => {
  return (
    <View className="flex-row bg-gray-100 rounded-lg p-1 mb-4">
      {options.map((option, index) => (
        <TouchableOpacity
          key={option}
          className={`flex-1 py-2 px-4 rounded-md ${selectedIndex === index ? 'bg-white shadow-sm' : 'bg-transparent'
            }`}
          onPress={() => onSelectionChange(index)}
          activeOpacity={0.7}
        >
          <Text
            className={`text-center font-medium ${selectedIndex === index ? 'text-gray-900' : 'text-gray-600'
              }`}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default SegmentControl;