import { View } from 'react-native';
import { Container } from '~/components/container';
import { Header } from '~/components/header';
import { Text } from '~/components/ui/text';

export default function Chat() {
  return (
    <Container header={<Header title="LLM Chat" showMenu />}>
      <View className="flex-1">
        <Text>Chat</Text>
      </View>
    </Container>
  );
}
