import { useNavigation } from 'expo-router';
import { Button } from './ui/button';
import { Menu } from '~/lib/icons';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { ParamListBase } from '@react-navigation/native';

export function MenuButton() {
  const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();
  return (
    <Button variant="ghost" size="icon" onPress={() => navigation.openDrawer()}>
      <Menu />
    </Button>
  );
}
