import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Container } from '~/components/container';
import { Header } from '~/components/header';
import { Text } from '~/components/ui/text';

export default function Settings() {
  const { t } = useTranslation();
  return (
    <Container header={<Header title={t('settings.header')} showMenu />}>
      <View className="flex-1">
        <Text>Settings</Text>
      </View>
    </Container>
  );
}
