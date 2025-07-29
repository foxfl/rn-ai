import * as FileSystem from 'expo-file-system';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { constructModelURI, getModelId } from '~/lib/model/helpers';
import { DownloadProgress, ModelState } from '~/types/model';

type Download = DownloadProgress & {
  downloadResumable: FileSystem.DownloadResumable | null;
};

interface ModelDownloadManagerContextType {
  downloads: Record<string, Download>;
  updateDownloads: (modelId: string, download: Download) => void;
}

export const ModelDownloadManagerContext = createContext<ModelDownloadManagerContextType | null>(
  null
);

export function ModelDownloadManagerProvider({ children }: { children: React.ReactNode }) {
  const [downloads, setDownloads] = useState<Record<string, Download>>({});

  const updateDownloads = useCallback((modelId: string, download: Download) => {
    setDownloads((prev) => ({
      ...prev,
      [modelId]: download,
    }));
  }, []);

  return (
    <ModelDownloadManagerContext.Provider
      value={{
        downloads,
        updateDownloads,
      }}>
      {children}
    </ModelDownloadManagerContext.Provider>
  );
}

export function useModelDownloadManager(args: {
  model?: ModelState;
  onModelDownloaded: (file: FileSystem.FileInfo) => void;
  progressCallback: (downloadProgress: FileSystem.DownloadProgressData) => void;
  onRemoveModel: () => void;
}) {
  const context = useContext(ModelDownloadManagerContext);
  if (!context) {
    throw new Error('useModelDownloadManager must be used within a ModelDownloadManagerProvider');
  }
  const { model, onModelDownloaded, progressCallback, onRemoveModel } = args;
  const { downloads, updateDownloads } = context;

  const modelId = useMemo(() => {
    return model ? getModelId(model.modelInfo) : undefined;
  }, [model]);

  const startDownload = useCallback(async () => {
    if (!modelId || !model) {
      return;
    }
    const { modelInfo } = model;

    // Create download resumable
    const downloadResumable = FileSystem.createDownloadResumable(
      modelInfo.downloadUrl,
      constructModelURI(modelInfo),
      {},
      progressCallback
    );

    // Update state with download resumable
    updateDownloads(modelId, {
      downloadResumable,
      isDownloading: true,
      error: null,
    });

    try {
      const result = await downloadResumable.downloadAsync();
      if (result?.uri) {
        const fileInfo = await FileSystem.getInfoAsync(result.uri);
        updateDownloads(modelId, {
          downloadResumable,
          isDownloading: false,
          error: null,
        });
        onModelDownloaded(fileInfo);
      }
    } catch (error) {
      console.error('Download error:', error);
      updateDownloads(modelId, {
        downloadResumable,
        isDownloading: false,
        error: error instanceof Error ? error.message : 'Download failed',
      });
    }
  }, [updateDownloads, modelId, progressCallback, onModelDownloaded, model]);

  const pauseDownload = useCallback(() => {
    if (!modelId) {
      return;
    }
    const downloadResumable = downloads[modelId]?.downloadResumable;
    if (!downloadResumable) {
      return;
    }

    updateDownloads(modelId, {
      downloadResumable,
      isDownloading: false,
      error: null,
    });
  }, [updateDownloads, modelId, downloads]);

  const resumeDownload = useCallback(async () => {
    if (!modelId) {
      return;
    }
    const downloadResumable = downloads[modelId]?.downloadResumable;
    if (!modelId) {
      return;
    }

    if (downloadResumable) {
      // Resume existing download
      updateDownloads(modelId, {
        downloadResumable,
        isDownloading: true,
        error: null,
      });

      try {
        const result = await downloadResumable.resumeAsync();
        if (result?.uri) {
          const fileInfo = await FileSystem.getInfoAsync(result.uri);
          updateDownloads(modelId, {
            downloadResumable,
            isDownloading: false,
            error: null,
          });
          onModelDownloaded(fileInfo);
        }
      } catch (error) {
        console.error('Resume download error:', error);
        updateDownloads(modelId, {
          downloadResumable,
          isDownloading: false,
          error: error instanceof Error ? error.message : 'Resume failed',
        });
      }
    } else {
      // Start new download if no resumable exists
      await startDownload();
    }
  }, [updateDownloads, startDownload, downloads, modelId, onModelDownloaded]);

  const cancelDownload = useCallback(() => {
    if (!modelId) {
      return;
    }
    const downloadResumable = downloads[modelId]?.downloadResumable;
    if (!downloadResumable) {
      return;
    }

    downloadResumable.cancelAsync().then(() => {
      updateDownloads(modelId, {
        downloadResumable,
        isDownloading: false,
        error: null,
      });
    });
  }, [updateDownloads, downloads, modelId]);

  const removeModel = useCallback(async () => {
    try {
      if (!modelId || !model) {
        return;
      }
      await FileSystem.deleteAsync(constructModelURI(model.modelInfo), {
        idempotent: true,
      });
      updateDownloads(modelId, {
        downloadResumable: null,
        isDownloading: false,
        error: null,
      });
      onRemoveModel();
    } catch (error) {
      console.error('Error removing model:', error);
    }
  }, [updateDownloads, modelId, model, onRemoveModel]);

  return {
    startDownload,
    pauseDownload,
    resumeDownload,
    cancelDownload,
    removeModel,
    state: downloads[modelId ?? ''] || {
      isDownloading: false,
      error: null,
    },
  };
}
