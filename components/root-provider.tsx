import { PortalHost } from '@rn-primitives/portal';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { Toaster } from 'sonner-native';
import { ModelDownloadManagerProvider } from '~/contexts/model-download-manager';
import '../lib/i18n';
import { ThemeProvider } from './theme-provider';

export function RootProvider({ children }: { children: React.ReactNode }) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
        <ThemeProvider>
          <ModelDownloadManagerProvider>{children}</ModelDownloadManagerProvider>
          <PortalHost />

          <Toaster />
        </ThemeProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}
