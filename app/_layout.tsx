import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { cssInterop } from 'nativewind';

// root provider
import { useInitModels } from '~/hooks/models/useInitModels';
import { RootProvider } from '../components/root-provider';
import { KeyboardStickyView } from 'react-native-keyboard-controller';

cssInterop(Image, { className: 'style' });
cssInterop(BlurView, { className: 'style' });
cssInterop(KeyboardStickyView, { className: 'style' });

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useInitModels();

  return (
    <RootProvider>
      <Slot />
    </RootProvider>
  );
}
