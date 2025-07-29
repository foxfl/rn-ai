import { router } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, LayoutChangeEvent, TextInput, View } from 'react-native';
import { KeyboardGestureArea } from 'react-native-keyboard-controller';
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LLMChat } from '~/components/chat';
import { ChatInput } from '~/components/chat/chat-input';
import { Container } from '~/components/container';
import { Header } from '~/components/header';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { useKeyboardAnimation } from '~/hooks/useKeyboardAnimation';
import { useLLM } from '~/hooks/useLLM';
import { ModelState } from '~/types/model';

const TEXT_INPUT_HEIGHT = 50;
const TEXT_INPUT_PADDING = 5;

interface ChatScreenProps {
  selectedModel: ModelState | null;
  isInitialized: boolean;
}

export function ChatScreen({ selectedModel, isInitialized }: ChatScreenProps) {
  const { height, onScroll, inset, offset, progress, containerHeight, contentHeight } =
    useKeyboardAnimation(TEXT_INPUT_PADDING);
  const [inputHeight, setInputHeight] = useState(TEXT_INPUT_HEIGHT);

  const { lm, messages, isGenerating, isLoading, sendMessage } = useLLM(
    selectedModel?.fileInfo?.uri
  );

  const { t } = useTranslation();

  const { top, bottom } = useSafeAreaInsets();

  const onInputLayoutChanged = useCallback((e: LayoutChangeEvent) => {
    setInputHeight(e.nativeEvent.layout.height);
  }, []);

  const textInputStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      minHeight: TEXT_INPUT_HEIGHT,
      width: '100%',
      paddingTop: 5,
      paddingBottom: bottom,
      bottom: 0,
      left: 0,
      right: 0,
      transform: [
        {
          translateY: interpolate(
            height.value,
            [0, height.value],
            [0, -height.value + bottom - TEXT_INPUT_PADDING]
          ),
        },
      ],
    };
  });

  const textInputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (textInputRef.current && !isLoading && isInitialized && !!lm) {
      textInputRef.current.focus();
    }
  }, [isLoading, isInitialized, lm]);

  if (isLoading || !isInitialized) {
    return (
      <Container header={<Header title="LLM Chat" showMenu />}>
        <ActivityIndicator />
      </Container>
    );
  }

  if (!lm) {
    return (
      <Container header={<Header title="LLM Chat" showMenu />}>
        <View className="flex-1 items-center justify-center gap-10">
          <View className="rounded-lg bg-red-100 px-8 py-4 shadow-md">
            <Text className="text-center text-lg font-medium text-red-800">
              {t('chat.model-load-error')}
            </Text>
          </View>
          <Button onPress={() => router.push('/(app)/(modals)/model-manager')}>
            <Text className="">{t('chat.choose-model')}</Text>
          </Button>
        </View>
      </Container>
    );
  }
  return (
    <View style={{ flex: 1, paddingTop: top }}>
      <Header title="LLM Chat" showMenu />
      <KeyboardGestureArea
        interpolator={'ios'}
        offset={inputHeight}
        textInputNativeID="chat-input"
        style={{ flex: 1, justifyContent: 'flex-end' }}>
        <LLMChat
          messages={messages}
          animated={{
            inset,
            offset,
            inputHeight,
            onScroll,
            progress,
            containerHeight,
            contentHeight,
          }}
        />

        <Animated.View
          className="bg-background"
          style={textInputStyle}
          onLayout={onInputLayoutChanged}>
          <ChatInput sendMessage={sendMessage} isGenerating={isGenerating} ref={textInputRef} />
        </Animated.View>
      </KeyboardGestureArea>
    </View>
  );
}
