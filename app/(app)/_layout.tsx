import { SplashScreen, Stack } from 'expo-router';
import { useEffect } from 'react';
import { useModelStore } from '~/stores/model-store';

export default function AppLayout() {

  const isInitialized = useModelStore((state) => state.isInitialized);

  useEffect(() => {
    if (isInitialized) {
      SplashScreen.hideAsync();
    }
  }, [isInitialized]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(main)" />
      <Stack.Screen name="(modals)/model-manager" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
