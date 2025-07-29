import { useState } from 'react';
import { TextInput, View } from 'react-native';
import { Mic, Plus, Send } from '~/lib/icons';
import { AudioRecorder } from '../audio/recorder';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

interface ChatInputProps {
  sendMessage: (message: string) => void | Promise<void>;
  isGenerating: boolean;
  ref?: React.Ref<TextInput>;
}

export function ChatInput({ sendMessage, isGenerating, ref }: ChatInputProps) {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleTextChange = (textContent: string) => {
    setText(textContent);
  };

  const _handleSendMessage = () => {
    const message = text;
    setText('');
    sendMessage(message);
  };

  if (isRecording) {
    return (
      <View className="flex-row items-end justify-end bg-background px-4 ">
        <Input style={{ display: 'none' }} nativeID="chat-input" />
        <AudioRecorder
          onCancel={() => setIsRecording(false)}
          onDone={() => setIsRecording(false)}
        />
      </View>
    );
  }

  return (
    <View className="flex-row items-end justify-end bg-background px-4">
      <Button variant="ghost" size="icon" className="native:min-h-12" disabled={isGenerating}>
        <Plus className="size-6 text-muted-foreground" />
      </Button>
      <Textarea
        ref={ref}
        placeholder="Ask me anything..."
        multiline
        nativeID="chat-input"
        numberOfLines={4}
        className="flex-1 rounded-xl"
        textAlignVertical="top"
        enablesReturnKeyAutomatically
        value={text}
        onChangeText={handleTextChange}
      />
      <View className="flex-row items-center ">
        {text.length > 0 ? (
          <Button
            variant="ghost"
            className="native:min-h-12"
            size="icon"
            onPress={_handleSendMessage}
            disabled={isGenerating}>
            <Send className="size-6 text-primary" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="native:min-h-12"
            disabled={isGenerating}
            onPress={() => {
              setIsRecording(true);
            }}>
            <Mic className="size-6 text-muted-foreground" />
          </Button>
        )}
      </View>
    </View>
  );
}
