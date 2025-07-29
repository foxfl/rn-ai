import * as FileSystem from 'expo-file-system';
import { useEffect } from 'react';
import { PREDEFINED_MODELS } from '~/lib/constants';
import { checkModelExists, MODEL_FOLDER } from '~/lib/model/helpers';
import { useModelStore } from '~/stores/model-store';
import { ModelState } from '~/types/model';

// Initialize model folder and check existing models
const initializeModelFolder = async () => {
  try {
    await FileSystem.makeDirectoryAsync(MODEL_FOLDER, { intermediates: true });
  } catch (error) {
    console.error('Failed to create model folder:', error);
  }
};

export function useInitModels() {
  const initializeStore = useModelStore((state) => state.initializeStore);
  const isInitialized = useModelStore((state) => state.isInitialized);

  useEffect(() => {
    if (isInitialized) return;
    initializeModelFolder().then(async () =>
      Promise.all(
        PREDEFINED_MODELS.map<Promise<ModelState>>(async (model) => {
          const fileInfo = await checkModelExists(model);

          return {
            modelInfo: model,
            fileInfo: fileInfo,
          };
        })
      ).then((models) => {
        initializeStore(models);
      })
    );
  }, [initializeStore, isInitialized]);
}
