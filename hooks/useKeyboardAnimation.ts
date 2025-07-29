import { useKeyboardHandler } from 'react-native-keyboard-controller';
import {
  useAnimatedReaction,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useKeyboardAnimation = (textInputPadding: number) => {
  const progress = useSharedValue(0);
  const height = useSharedValue(0);
  const inset = useSharedValue(0);
  const offset = useSharedValue(0);
  const scroll = useSharedValue(0);
  const shouldUseOnMoveHandler = useSharedValue(false);
  const containerHeight = useSharedValue(0);
  const contentHeight = useSharedValue(0);
  const maxPossibleScroll = useSharedValue(0);
  const { bottom } = useSafeAreaInsets();
  const isAnimating = useSharedValue(false);

  useAnimatedReaction(
    () => [containerHeight.value, contentHeight.value],
    ([containerHeight, contentHeight]) => {
      const maxScroll = Math.max(0, contentHeight - containerHeight);
      maxPossibleScroll.value = maxScroll;
    }
  );

  useKeyboardHandler(
    {
      onStart: (e) => {
        'worklet';

        // i. e. the keyboard was under interactive gesture, and will be showed
        // again. Since iOS will not schedule layout animation for that we can't
        // simply update `height` to destination and we need to listen to `onMove`
        // handler to have a smooth animation
        if (progress.value !== 1 && progress.value !== 0 && e.height !== 0) {
          shouldUseOnMoveHandler.value = true;

          return;
        }

        progress.value = e.progress;
        height.value = e.height;
        inset.value = e.height;
        // Math.max is needed to prevent overscroll when keyboard hides (and user scrolled to the top, for example)
        if (isAnimating.value) {
          return;
        }
        offset.value = Math.max(
          -maxPossibleScroll.value,
          e.height +
            scroll.value -
            // The textinput is transforming when the keyboard is open, we need to maintain the scroll correctly
            (e.progress === 1 ? bottom - textInputPadding : -bottom + textInputPadding)
        );
        isAnimating.value = true;
      },
      onInteractive: (e) => {
        'worklet';
        progress.value = e.progress;
        height.value = e.height;
      },
      onMove: (e) => {
        'worklet';
        if (shouldUseOnMoveHandler.value) {
          progress.value = e.progress;
          height.value = e.height;
        }
      },
      onEnd: (e) => {
        'worklet';

        progress.value = e.progress;
        shouldUseOnMoveHandler.value = false;
        isAnimating.value = false;
      },
    },
    []
  );

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      scroll.value = -e.contentOffset.y - inset.value;
    },
  });

  return { height, progress, onScroll, inset, offset, containerHeight, contentHeight };
};
