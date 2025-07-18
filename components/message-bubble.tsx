import { Text, View } from 'react-native';
import { Message } from 'react-native-executorch';

export const MessageBubble = ({ message }: { message: Message }) => (
  <View
    className={`max-w-4/5 mb-2 rounded-lg p-3 ${
      message.role === 'user' ? 'ml-auto mr-2 bg-blue-500' : 'ml-2 mr-auto bg-gray-200'
    }`}>
    <Text className={`text-base ${message.role === 'user' ? 'text-white' : 'text-black'}`}>
      {message.content?.toString() || ''}
    </Text>
  </View>
);
