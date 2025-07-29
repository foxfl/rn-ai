import { View } from 'react-native';
import { Message } from '~/types/chat';
import { Text } from '../ui/text';

interface ChatBubbleProps {
  message: Message;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === 'user';
  
  if (isUser) {
    // User message - right aligned with background and rounded corners
    return (
      <View className="flex-row justify-end mb-4">
        <View className="max-w-[80%] bg-primary rounded-2xl rounded-br-md px-4 py-3">
          <Text className="text-primary-foreground text-base leading-6">
            {message.content}
          </Text>
        </View>
      </View>
    );
  } else {
    // Assistant message - left aligned, no background, border, or rounding
    return (
      <View className="flex-row justify-start mb-4">
        <View className="max-w-[80%] px-4 py-3">
          <Text className="text-foreground text-base leading-6">
            {message.content}
          </Text>
        </View>
      </View>
    );
  }
}
