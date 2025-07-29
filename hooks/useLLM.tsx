import { CactusLM } from 'cactus-react-native';
import { useEffect, useState } from 'react';
import { Message } from '~/types/chat';

export function useLLM(url?: string) {
  const [lm, setLM] = useState<CactusLM | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    let newLM: CactusLM | null = null;
    async function initModel() {
      console.log('initModel', url);
      setIsLoading(true);
      const { lm, error } = await CactusLM.init({
        model: url || '',
        n_ctx: 2048,
      });
      newLM = lm;
      if (error) {
        console.log('error', error);
        // Alert.alert('Error', error.message);
      } else {
        setLM(newLM);
      }
      setIsLoading(false);
    }
    if (url) {
      initModel();
    }
    return () => {
      newLM?.release();
    };
  }, [url]);

  const sendMessage = async (input: string) => {
    if (!lm || !input.trim() || isGenerating) return;

    const userMessage: Message = { role: 'user', content: input.trim(), id: Date.now() };
    const assistantMessageId = Date.now() + 1;
    const assistantMessage: Message = { role: 'assistant', content: '', id: assistantMessageId };
    const newMessages = [...messages, userMessage, assistantMessage];
    setMessages([...newMessages]);
    setIsGenerating(true);

    try {
      let response = '';
      await lm.completion(
        newMessages,
        {
          n_predict: 200,
          temperature: 0.7,
          stop: ['</s>', '<|end|>'],
        },
        (token) => {
          response += token.token;
          setMessages((prev) => [
            ...prev.slice(0, -1),
            { role: 'assistant', content: response, id: assistantMessageId },
          ]);
        }
      );
    } catch (error) {
      console.error('Generation failed:', error);
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: 'assistant', content: 'Error generating response', id: assistantMessageId },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    lm,
    messages,
    isGenerating,
    isLoading,
    sendMessage,
  };
}
