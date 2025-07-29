import { Text, View } from 'react-native';
import { BackButton } from './back-button';
import { MenuButton } from './menu-button';

interface HeaderProps {
  backButton?: boolean;
  showMenu?: boolean;
  isModal?: boolean;
  title?: string;
}

export const Header = ({  backButton, isModal, title, showMenu }: HeaderProps) => (
  <View className="flex-row items-center justify-between border-b border-gray-100 p-4">
    <View className="flex-1" >
      {backButton && <BackButton isModal={isModal} />}
      {showMenu && <MenuButton />}
    </View>
    <View className="flex-row items-center justify-center">
      <Text className="text-center text-lg font-medium text-foreground">{title}</Text>
    </View>
    <View className="flex-1" />
  </View>
);
