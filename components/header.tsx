import { View, Text, TouchableOpacity } from 'react-native';

export const Header = ({ onClearConversation }: { 
    onClearConversation?: () => void;
  }) => (
    <View className="bg-blue-500 p-4 flex-row justify-between items-center">
      <Text className="text-white text-lg font-bold">
        RN Chat Test
      </Text>
      {onClearConversation && (
        <TouchableOpacity
          onPress={onClearConversation}
          className="bg-white/20 px-3 py-1.5 rounded-md"
        >
          <Text className="text-white text-xs font-semibold">
            Clear
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );