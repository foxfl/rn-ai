import * as FileSystem from 'expo-file-system';
import { ModelFileInfo, ModelInformation } from '~/types/model';

export const MODEL_FOLDER = FileSystem.documentDirectory + 'models/';

export const constructModelURI = (modelInfo: ModelInformation) => {
  const modelName = modelInfo.downloadUrl.split('/').pop();
  return `${MODEL_FOLDER}${modelName}`;
};
export const checkModelExists = async (
  modelInfo: ModelInformation
): Promise<ModelFileInfo | null> => {
  try {
    const modelURI = constructModelURI(modelInfo);
    const fileInfo = await FileSystem.getInfoAsync(modelURI);

    if (fileInfo.exists) {
      return {
        uri: fileInfo.uri,
        size: (fileInfo as any).size || modelInfo.size,
        exists: fileInfo.exists,
        modificationTime: (fileInfo as any).modificationTime,
      };
    }
  } catch (error) {
    console.error('Error checking model file:', error);
  }
  return null;
};



export const getModelId = (modelInfo: ModelInformation): string => {
    return `${modelInfo.name}-${modelInfo.params}-${modelInfo.size}`;
  };
  