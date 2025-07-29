import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { View } from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { cn } from '~/lib/utils';

const progressVariants = cva('relative w-full overflow-hidden rounded-full bg-secondary', {
  variants: {
    size: {
      default: 'h-2',
      sm: 'h-1',
      lg: 'h-3',
      xl: 'h-4',
    },
    variant: {
      default: 'bg-secondary',
      success: 'bg-green-100',
      warning: 'bg-yellow-100',
      error: 'bg-red-100',
    },
  },
  defaultVariants: {
    size: 'default',
    variant: 'default',
  },
});

const progressIndicatorVariants = cva('h-full rounded-full transition-all duration-300', {
  variants: {
    variant: {
      default: 'bg-primary',
      success: 'bg-green-500',
      warning: 'bg-yellow-500',
      error: 'bg-red-500',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface ProgressProps
  extends React.ComponentProps<typeof View>,
    VariantProps<typeof progressVariants> {
  value?: number;
  animatedValue?: SharedValue<number>;
  max?: number;
  animationDuration?: number;
  showLabel?: boolean;
  labelPosition?: 'top' | 'bottom' | 'inside';
}

const Progress = React.forwardRef<React.ElementRef<typeof View>, ProgressProps>(
  (
    {
      className,
      size,
      variant,
      value = 0,
      animatedValue,
      max = 100,
      showLabel = false,
      labelPosition = 'top',
      ...props
    },
    ref
  ) => {
    const animatedWidth = useSharedValue(0);

    // Animate progress when value changes
    React.useEffect(() => {
      if (value) animatedWidth.value = withSpring(Math.min(Math.max((value / max) * 100, 0), 100));
    }, [value, max]);

    useAnimatedReaction(
      () => {
        return animatedValue?.value ?? 0;
      },
      (value) => {
        if (value) {
          animatedWidth.value = withSpring(Math.min(Math.max((value / max) * 100, 0), 100));
        }
      }
    );

    // Animated styles for the progress indicator
    const animatedProgressStyle = useAnimatedStyle(() => {
      return {
        width: `${animatedWidth.value}%`,
      };
    });

    return (
      <View ref={ref} className={cn(progressVariants({ size, variant, className }))} {...props}>
        {/* Progress indicator */}
        <Animated.View
          className={cn(progressIndicatorVariants({ variant }))}
          style={animatedProgressStyle}
        />
      </View>
    );
  }
);

Progress.displayName = 'Progress';

export { Progress, progressIndicatorVariants, progressVariants };
