import { create } from 'zustand';
import { subscribeWithSelector, persist, createJSONStorage } from 'zustand/middleware';
import { getModelId } from '~/lib/model/helpers';
import { ModelFileInfo, ModelState } from '../types/model';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ModelStore {
  // State
  models: Record<string, ModelState>;
  selectedModelId: string | null;
  isInitialized: boolean;

  // Actions
  initializeStore: (models: ModelState[]) => Promise<void>;
  selectModel: (modelId: string) => void;

  removeModel: (modelId: string) => void;
  updateModelFileInfo: (modelId: string, fileInfo: ModelFileInfo) => void;
  // Queries
  getModel: (modelId: string) => ModelState | undefined;
  getSelectedModel: () => (ModelState & { id: string }) | null;
}

// Check if a model file exists and get its info

export const useModelStore = create<ModelStore>()(
  persist(
    subscribeWithSelector((set, get) => ({
      // State
      models: {},
      selectedModelId: null,
      isInitialized: false,

      // Actions
      initializeStore: async (providedModels: ModelState[]) => {
        const models: Record<string, ModelState> = {};

        for (const model of providedModels) {
          const modelId = getModelId(model.modelInfo);
          const fileInfo = model.fileInfo;

          models[modelId] = {
            modelInfo: model.modelInfo,
            fileInfo: fileInfo || undefined,
          };
        }

        set((state) => ({
          ...state,
          models,
          isInitialized: true,
        }));
      },

      selectModel: (modelId: string) => {
        if (!get().models[modelId]) {
          return;
        }
        set({ selectedModelId: modelId });
      },

      removeModel: (modelId: string) => {
        set((state) => ({
          ...state,
          models: {
            ...state.models,
            [modelId]: {
              ...state.models[modelId],
              fileInfo: undefined,
            },
          },
        }));
      },

      updateModelFileInfo: (modelId: string, fileInfo: ModelFileInfo) => {
        set((state) => ({
          ...state,
          models: {
            ...state.models,
            [modelId]: {
              ...state.models[modelId],
              fileInfo,
            },
          },
        }));
      },

      // Queries
      getModel: (modelId: string) => {
        return get().models[modelId];
      },
      getSelectedModel: () => {
        const { selectedModelId, models } = get();
        if (!selectedModelId || !models[selectedModelId]) {
          return null;
        }
        return {
          modelInfo: models[selectedModelId].modelInfo,
          fileInfo: models[selectedModelId].fileInfo,
          id: selectedModelId,
        };
      },
    })),
    {
      name: 'model-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ selectedModelId: state.selectedModelId }),
    }
  )
);
// Selectors for better performance
export const useModelSelector = <T>(selector: (state: ModelStore) => T) => {
  return useModelStore(selector);
};

export const useModel = (modelId: string) => {
  return useModelStore((state) => state.models[modelId]);
};
