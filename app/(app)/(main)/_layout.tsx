import { DrawerNavigationOptions } from '@react-navigation/drawer';
import { Drawer } from 'expo-router/drawer';
import { useTranslation } from 'react-i18next';
import { useWindowDimensions } from 'react-native';
import { DrawerContent } from '~/components/drawer/content';
import { MessageSquarePlus, MessageSquareText, Settings } from '~/lib/icons';

export const DEFAULT_OPTIONS: DrawerNavigationOptions = {
  drawerActiveBackgroundColor: '#00000010',
  drawerItemStyle: {
    borderRadius: 10,
  },
  drawerLabelStyle: {
    fontSize: 15,
    fontWeight: '600',
    color: 'black',
  },
};

export default function MainLayout() {
  const dimensions = useWindowDimensions();

  const { t } = useTranslation();

  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerType: dimensions.width >= 768 ? 'permanent' : 'slide',
        drawerStyle: {
          width: dimensions.width * 0.8,
        },
      }}
      drawerContent={DrawerContent}>
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: t('drawer.home'),
          title: 'overview',
          drawerIcon: () => <MessageSquarePlus />,
          ...DEFAULT_OPTIONS,
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          drawerLabel: t('drawer.settings'),
          title: 'settings',
          drawerIcon: () => <Settings />,
          ...DEFAULT_OPTIONS,
        }}
      />
      <Drawer.Screen
        name="[chatId]"
        options={{
          drawerLabel: 'Chat',
          title: 'overview',
          drawerIcon: () => <MessageSquareText />,
          drawerItemStyle: {
            display: 'none',
          },
        }}
      />
    </Drawer>
  );
}
