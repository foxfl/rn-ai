import type { CactusOAICompatibleMessage } from 'cactus-react-native';

export type Message = CactusOAICompatibleMessage & {
  images?: string[];
  id: number;
}