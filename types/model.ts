export type ModelInformation = {
  name: string;
  size: number;
  params: string;
  memory: number;
  downloadUrl: string;
  description: string;
};

export interface DownloadProgress {
  isDownloading: boolean;
  error: string | null;
}

export interface ModelFileInfo {
  uri: string;
  size: number;
  exists: boolean;
  modificationTime?: number;
}

export interface ModelState {
  modelInfo: ModelInformation;
  fileInfo?: ModelFileInfo | null;
}
