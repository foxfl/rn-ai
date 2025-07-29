import { router } from 'expo-router';
import { View } from 'react-native';
import { ChatScreen } from '~/components/chat/chat-screen';
import { Container } from '~/components/container';
import { Header } from '~/components/header';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { useSelectedModel } from '~/hooks/models/useSelectedModel';

export default function App() {
  const { selectedModel, isInitialized } = useSelectedModel();

  if (!selectedModel || !selectedModel.fileInfo) {
    return (
      <>
        <Container header={<Header title="LLM Chat" showMenu />}>
          <View className="flex-1 items-center justify-center gap-10">
            <View className="rounded-lg bg-orange-100 px-8 py-4 shadow-md">
              <Text className="text-center text-lg font-medium text-orange-800">
                Seems like you did not select any model - download one now to start your local LLM
              </Text>
            </View>
            <Button onPress={() => router.push('/(app)/(modals)/model-manager')}>
              <Text className="">Download Model</Text>
            </Button>
          </View>
        </Container>
      </>
    );
  }

  return <ChatScreen selectedModel={selectedModel} isInitialized={isInitialized} />;
}
