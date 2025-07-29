import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { FileBox } from '~/lib/icons';
import { Separator } from '../ui/separator';

export function DrawerContent(props: DrawerContentComponentProps) {
  const { t } = useTranslation();

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />

      <DrawerItem
        label={t('drawer.model-manager')}
        icon={() => <FileBox />}
        onPress={() => router.push('/(app)/(modals)/model-manager')}
        activeBackgroundColor="#00000010"
        activeTintColor="black"
        labelStyle={{
          fontSize: 15,
          fontWeight: '600',
          color: 'black',
        }}
      />

      <Separator className="my-4" />
    </DrawerContentScrollView>
  );
}
