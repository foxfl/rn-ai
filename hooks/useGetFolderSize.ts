import * as FileSystem from 'expo-file-system';
import { useCallback, useEffect, useState } from 'react';
import { MODEL_FOLDER } from '~/lib/model/helpers';

interface UseGetFolderSizeParams {
  options?: {
    path: string;
    includeSubfolders?: boolean;
  };
}

export function useGetFolderSize(params?: UseGetFolderSizeParams) {
  const [size, setSize] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const getFolderSize = useCallback(async () => {
    setLoading(true);
    FileSystem.getInfoAsync(MODEL_FOLDER)
      .then((info) => {
        if (info.exists) {
          if (info.isDirectory) {
            setSize(info.size);
          } else {
            setError(new Error('Path is not a directory'));
          }
        } else {
          setError(new Error('Path does not exist'));
        }
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    getFolderSize();
  }, [getFolderSize]);

  return { size, loading, error, refreshSize: getFolderSize };
}
