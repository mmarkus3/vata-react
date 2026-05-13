import type { FC, ReactNode } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface AccordionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
}

const Accordion: FC<AccordionProps> = ({ title, isOpen, onToggle, children }) => {
  return (
    <View className="rounded-2xl border border-gray-200 bg-white">
      <TouchableOpacity
        onPress={onToggle}
        className="flex-row items-center justify-between px-4 py-3"
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen }}
      >
        <Text className="text-sm font-semibold text-gray-800">{title}</Text>
        <Text className="text-sm font-semibold text-gray-500">{isOpen ? '−' : '+'}</Text>
      </TouchableOpacity>
      {isOpen ? <View className="border-t border-gray-100 px-4 py-3">{children}</View> : null}
    </View>
  );
};

export default Accordion;
