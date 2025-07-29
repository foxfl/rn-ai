import { useCallback, useRef } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import Animated, {
  ScrollHandlerProcessed,
  SharedValue,
  useAnimatedProps,
} from 'react-native-reanimated';
import { Message } from '../../types/chat';
import { ChatBubble } from './chat-bubble';

export function LLMChat({
  messages,
  animated,
}: {
  messages: Message[];
  animated: {
    inset: SharedValue<number>;
    offset: SharedValue<number>;
    inputHeight: number;
    onScroll: ScrollHandlerProcessed;
    progress: SharedValue<number>;
    containerHeight: SharedValue<number>;
    contentHeight: SharedValue<number>;
  };
}) {
  const ref = useRef<FlatList>(null);
  const { inset, offset, onScroll, inputHeight, containerHeight, contentHeight } = animated;
  const renderItem: ListRenderItem<Message> = useCallback(({ item }) => {
    return <ChatBubble message={item} />;
  }, []);

  const props = useAnimatedProps(() => ({
    contentInset: {
      top: inset.value,
    },
    contentOffset: {
      x: 0,
      y: -offset.value ,
    },
  }));

  const keyExtractor = useCallback((item: Message) => item.id.toString(), []);

  // const scrollToBottom = useCallback(() => {
  //   ref.current?.scrollToEnd({ animated: false });
  // }, []);
  return (
    <Animated.FlatList<Message>
      ref={ref}
      animatedProps={props}
      inverted
      onContentSizeChange={(w, h) => {
        contentHeight.value = h;
      }}
      onLayout={(event) => {
        const { height } = event.nativeEvent.layout;
        containerHeight.value = height;
      }}
      data={[...messages].reverse()}
      automaticallyAdjustContentInsets={false}
      contentInsetAdjustmentBehavior="never"
      keyboardDismissMode="interactive"
      keyboardShouldPersistTaps="handled"
      contentContainerClassName={'px-2'}
      contentContainerStyle={{
        paddingTop: inputHeight,
      }}
      //   onContentSizeChange={scrollToBottom}
      onScroll={onScroll}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
    />
  );
}
