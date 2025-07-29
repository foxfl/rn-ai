import { Keyboard, Platform, Pressable, View } from 'react-native';

export function DismissKeyboardView({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  if (Platform.OS === 'web') {
    return <View className={className}>{children}</View>;
  }
  return (
    <Pressable onPress={() => Keyboard.dismiss()} className={className}>
      {children}
    </Pressable>
  );
}
