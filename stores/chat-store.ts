import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware';
import { Chat, Message } from '~/types/chat-types';

interface ChatStore {
  // State
  chats: Record<string, Chat>;
  // Chat Actions
  createChat: (title?: string) => string;
  deleteChat: (chatId: string) => void;
  updateChatTitle: (chatId: string, title: string) => void;

  // Message Actions
  addMessage: (chatId: string, message: Omit<Message, 'id' | 'timestamp'>) => void;
  updateMessage: (chatId: string, messageId: string, updates: Partial<Message>) => void;
  deleteMessage: (chatId: string, messageId: string) => void;
  clearMessages: (chatId: string) => void;

  // Queries
  getChat: (chatId: string) => Chat | undefined;
  getAllChats: () => Chat[];
  getChatMessages: (chatId: string) => Message[];
  getChatCount: () => number;
}

// Helper function to generate unique IDs
const generateId = () => {
  return uuidv4();
};

export const useChatStore = create<ChatStore>()(
  persist(
    subscribeWithSelector((set, get) => ({
      // State
      chats: {},

      // Chat Actions
      createChat: (title?: string) => {
        const chatId = generateId();
        const now = new Date();

        const newChat: Chat = {
          id: chatId,
          title,
          createdAt: now,
          updatedAt: now,
          messages: [],
        };

        set((state) => ({
          ...state,
          chats: {
            ...state.chats,
            [chatId]: newChat,
          },
        }));

        return chatId;
      },

      deleteChat: (chatId: string) => {
        set((state) => {
          const { [chatId]: deletedChat, ...remainingChats } = state.chats;
          return {
            ...state,
            chats: remainingChats,
          };
        });
      },

      updateChatTitle: (chatId: string, title: string) => {
        set((state) => {
          const chat = state.chats[chatId];
          if (!chat) return state;

          return {
            ...state,
            chats: {
              ...state.chats,
              [chatId]: {
                ...chat,
                title,
                updatedAt: new Date(),
              },
            },
          };
        });
      },

      // Message Actions
      addMessage: (chatId: string, messageData: Omit<Message, 'id' | 'timestamp'>) => {
        const chat = get().chats[chatId];
        if (!chat) return;

        const message: Message = {
          ...messageData,
          id: generateId(),
          timestamp: new Date(),
        };

        set((state) => ({
          ...state,
          chats: {
            ...state.chats,
            [chatId]: {
              ...chat,
              messages: [...chat.messages, message],
              updatedAt: new Date(),
            },
          },
        }));
      },

      updateMessage: (chatId: string, messageId: string, updates: Partial<Message>) => {
        set((state) => {
          const chat = state.chats[chatId];
          if (!chat) return state;

          const messageIndex = chat.messages.findIndex((msg) => msg.id === messageId);
          if (messageIndex === -1) return state;

          const updatedMessages = [...chat.messages];
          updatedMessages[messageIndex] = {
            ...updatedMessages[messageIndex],
            ...updates,
          };

          return {
            ...state,
            chats: {
              ...state.chats,
              [chatId]: {
                ...chat,
                messages: updatedMessages,
                updatedAt: new Date(),
              },
            },
          };
        });
      },

      deleteMessage: (chatId: string, messageId: string) => {
        set((state) => {
          const chat = state.chats[chatId];
          if (!chat) return state;

          const filteredMessages = chat.messages.filter((msg) => msg.id !== messageId);

          return {
            ...state,
            chats: {
              ...state.chats,
              [chatId]: {
                ...chat,
                messages: filteredMessages,
                updatedAt: new Date(),
              },
            },
          };
        });
      },

      clearMessages: (chatId: string) => {
        set((state) => {
          const chat = state.chats[chatId];
          if (!chat) return state;

          return {
            ...state,
            chats: {
              ...state.chats,
              [chatId]: {
                ...chat,
                messages: [],
                updatedAt: new Date(),
              },
            },
          };
        });
      },

      // Queries
      getChat: (chatId: string) => {
        return get().chats[chatId];
      },

      getAllChats: () => {
        const chats = get().chats;
        return Object.values(chats).sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      },

      getChatMessages: (chatId: string) => {
        const chat = get().chats[chatId];
        return chat ? chat.messages : [];
      },

      getChatCount: () => {
        return Object.keys(get().chats).length;
      },
    })),
    {
      name: 'chat-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Selectors for better performance
export const useChatSelector = <T>(selector: (state: ChatStore) => T) => {
  return useChatStore(selector);
};

// Convenience hooks
export const useAllChats = () => {
  return useChatStore((state) => state.getAllChats());
};

export const useChat = (chatId: string) => {
  return useChatStore((state) => state.chats[chatId]);
};

export const useChatMessages = (chatId: string) => {
  return useChatStore((state) => state.getChatMessages(chatId));
};
