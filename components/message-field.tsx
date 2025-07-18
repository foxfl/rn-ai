import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';

export const MessageField = ({
  message,
  setMessage,
  onSendMessage,
  isGenerating,
  attachedImages,
  onAttachImage,
  onRemoveImage,
}: {
  message: string;
  setMessage: (text: string) => void;
  onSendMessage: () => void;
  isGenerating: boolean;
  attachedImages: string[];
  onAttachImage: () => void;
  onRemoveImage: (index: number) => void;
}) => (
  <View className="bg-white p-4">
    {/* Attached Images Preview */}
    {attachedImages.length > 0 && (
      <ScrollView horizontal className="mb-3" showsHorizontalScrollIndicator={false}>
        {attachedImages.map((imageUri, index) => (
          <View key={index} className="relative mr-2">
            <Image
              source={{ uri: imageUri }}
              className="w-15 h-15 rounded-lg bg-gray-100"
              resizeMode="cover"
            />
            <TouchableOpacity
              onPress={() => onRemoveImage(index)}
              className="absolute -right-2 -top-2 h-6 w-6 items-center justify-center rounded-xl bg-red-500">
              <Text className="text-base font-bold text-white">×</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    )}

    {/* Input Row */}
    <View className="flex-row items-end gap-2">
      {/* Camera Button */}
      <TouchableOpacity
        onPress={onAttachImage}
        className="items-center justify-center rounded-lg bg-blue-500 p-3">
        <Text className="text-base text-white">📷</Text>
      </TouchableOpacity>

      {/* Text Input */}
      <TextInput
        className="max-h-25 flex-1 rounded-lg border border-gray-300 p-3 text-base"
        value={message}
        onChangeText={setMessage}
        placeholder="Type a message or attach an image..."
        multiline
        editable={!isGenerating}
      />

      {/* Send Button */}
      <TouchableOpacity
        onPress={onSendMessage}
        disabled={isGenerating || (!message.trim() && attachedImages.length === 0)}
        className={`min-w-12 items-center justify-center rounded-lg p-3 ${
          isGenerating || (!message.trim() && attachedImages.length === 0)
            ? 'bg-gray-400'
            : 'bg-blue-500'
        }`}>
        <Text className="text-base font-bold text-white">{isGenerating ? '...' : '➤'}</Text>
      </TouchableOpacity>
    </View>
  </View>
);
