import * as FileSystem from 'expo-file-system';
import { useCallback } from 'react';
import { TextInput } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { useModelDownloadManager } from '~/contexts/model-download-manager';
import { formatSize } from '~/lib/utils';
import { useModelStore } from '../../stores/model-store';
import { toast } from '~/components/ui/sonner';
import { useTranslation } from 'react-i18next';

interface UseModelDownloadActionProps {
  modelId: string;
  progressRef: React.RefObject<TextInput | null>;
  onDownloadChanged: () => void;
}

export const useModelDownloadActions = ({
  modelId,
  progressRef,
  onDownloadChanged,
}: UseModelDownloadActionProps) => {
  const getModel = useModelStore((state) => state.getModel);
  const updateModelFileInfo = useModelStore((state) => state.updateModelFileInfo);
  const removeModelContext = useModelStore((state) => state.removeModel);

  const model = getModel(modelId);
  const { t } = useTranslation();

  const progressAnimation = useSharedValue(0);

  const progressCallback = useCallback(
    (downloadProgress: FileSystem.DownloadProgressData) => {
      const progress =
        downloadProgress.totalBytesExpectedToWrite > 0
          ? (downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite) * 100
          : 0;

      progressAnimation.value = progress;

      if (progressRef && progressRef.current) {
        progressRef.current.setNativeProps({
          text:
            formatSize(downloadProgress.totalBytesWritten) +
            ' / ' +
            formatSize(downloadProgress.totalBytesExpectedToWrite),
        });
      }
    },
    [modelId]
  );

  const onModelDownloaded = useCallback(
    (file: FileSystem.FileInfo) => {
      updateModelFileInfo(modelId, {
        uri: file.uri,
        size: file.exists ? (file as any).size || model?.modelInfo.size : model?.modelInfo.size,
        exists: file.exists,
        modificationTime: file.exists ? (file as any).modificationTime : undefined,
      });
      toast.success(t('model-manager.model-download-success'));
      onDownloadChanged();
    },
    [modelId, model, updateModelFileInfo, onDownloadChanged]
  );

  const onRemoveModel = useCallback(() => {
    removeModelContext(modelId);
    onDownloadChanged();
  }, [modelId, removeModelContext, onDownloadChanged]);

  const {
    startDownload: startDownloadManager,
    pauseDownload: pauseDownloadManager,
    resumeDownload: resumeDownloadManager,
    cancelDownload: cancelDownloadManager,
    removeModel: removeModelManager,
    state,
  } = useModelDownloadManager({ model, onModelDownloaded, progressCallback, onRemoveModel });

  const startDownload = useCallback(async () => {
    startDownloadManager();
  }, [startDownloadManager]);

  const pauseDownload = useCallback(() => {
    pauseDownloadManager();
  }, [pauseDownloadManager]);

  const resumeDownload = useCallback(async () => {
    await resumeDownloadManager();
  }, [resumeDownloadManager]);

  const cancelDownload = useCallback(() => {
    cancelDownloadManager();
  }, [cancelDownloadManager]);

  const removeModel = useCallback(async () => {
    removeModelManager();
    toast.info(t('model-manager.model-download-removed'));
  }, [removeModelManager]);

  return {
    startDownload,
    pauseDownload,
    resumeDownload,
    cancelDownload,
    removeModel,
    progressAnimation,
    state,
  };
};
