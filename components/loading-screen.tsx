import { Text, View } from 'react-native';

export const LoadingScreen = ({ progress }: { progress: number }) => (
  <View className="flex-1 justify-center items-center p-5">
    <Text className="text-lg mb-5 text-center">Initializing VLM...</Text>
    <Text className="text-base mb-2.5">{(progress * 100).toFixed(1)}%</Text>
  </View>
);
