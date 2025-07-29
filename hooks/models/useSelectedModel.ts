import { useMemo } from 'react';
import { useModelStore } from '~/stores/model-store';

export function useSelectedModel() {
  const selectedModelId = useModelStore((state) => state.selectedModelId);
  const getModel = useModelStore((state) => state.getModel);
  const isInitialized = useModelStore((state) => state.isInitialized);
  const selectedModel = useMemo(() => {
    if (!selectedModelId || !isInitialized) {
      return null;
    }
    const selectedModel = getModel(selectedModelId);

    return selectedModel;
  }, [selectedModelId, getModel, isInitialized]);

  return {
    selectedModel,
    isInitialized,
  };
}
