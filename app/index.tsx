import { Header } from 'components/header';
import { LoadingScreen } from 'components/loading-screen';
import { MessageBubble } from 'components/message-bubble';
import { MessageField } from 'components/message-field';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useLLM } from 'react-native-executorch';
import '../global.css';
import { SafeAreaView } from 'react-native-safe-area-context';

const MODEL_URL =
  'https://huggingface.co/software-mansion/react-native-executorch-llama-3.2/resolve/main/llama-3.2-1B/QLoRA/llama3_2_qat_lora.pte';

export default function App() {
  const [message, setMessage] = useState('');
  const llama = useLLM({
    modelSource: MODEL_URL,
    tokenizerSource: require('../assets/tokenizer.json'),
    tokenizerConfigSource: require('../assets/tokenizer_config.json'),
  });

  const handleClearConversation = () => {
    Alert.alert('Clear Conversation', 'Are you sure you want to clear the conversation history?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: () => {
          llama.deleteMessage(0);
          console.log('Conversation cleared');
        },
      },
    ]);
  };

  if (!llama.isReady) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <Header />
        <LoadingScreen progress={llama.downloadProgress} />
      </SafeAreaView>
    );
  }
  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <Header onClearConversation={handleClearConversation} />
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView
            style={{ flex: 1, padding: 16 }}
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}>
            {llama.messageHistory.map((msg, index) => (
              <MessageBubble key={index} message={msg} />
            ))}
            {llama.isGenerating && (
              <View style={{ padding: 16, alignItems: 'center' }}>
                <Text style={{ color: '#666' }}>Generating response...</Text>
              </View>
            )}
          </ScrollView>

          <MessageField
            message={message}
            setMessage={setMessage}
            onSendMessage={() => llama.sendMessage(message)}
            isGenerating={llama.isGenerating}
            attachedImages={[]}
            onAttachImage={() => {}}
            onRemoveImage={() => {}}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}
