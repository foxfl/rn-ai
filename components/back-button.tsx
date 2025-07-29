import { Href, router } from 'expo-router';
import { Platform } from 'react-native';
import { Button } from './ui/button';
import { cn } from '~/lib/utils';

import { ArrowLeft, ChevronLeft, X } from '~/lib/icons';

interface BackButtonProps {
  onPress?: () => void;
  className?: string;
  fallback?: Href;
  isModal?: boolean;
}

export function BackButton({
  onPress,
  className,
  fallback = '/',
  isModal = false,
}: BackButtonProps) {
  return (
    <Button
      variant="ghost"
      size={'icon'}
      className={cn(className)}
      onPress={() => {
        if (onPress) {
          onPress?.();
        } else {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace(fallback);
          }
        }
      }}>
      {isModal
        ? Platform.select({
            ios: <X className="h-6 w-6 text-primary" />,
            android: <ArrowLeft className="h-6 w-6 text-primary" />,
            web: <X className="h-6 w-6 text-primary" />,
          })
        : Platform.select({
            ios: <ChevronLeft className="h-6 w-6 text-primary" />,
            android: <ArrowLeft className="h-6 w-6 text-primary" />,
            web: <ArrowLeft className="h-6 w-6 text-primary" />,
          })}
    </Button>
  );
}
