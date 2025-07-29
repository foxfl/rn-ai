import * as FileSystem from 'expo-file-system';
import { useCallback, useEffect, useState } from 'react';

export function useGetDiskSpace() {
  const [diskSpace, setDiskSpace] = useState<number>(0);
  const [totalDiskCapacity, setTotalDiskCapacity] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const getDiskSpace = useCallback(async () => {
    setLoading(true);
    return Promise.all([
      FileSystem.getFreeDiskStorageAsync().then((freeDiskSpace) => {
        setDiskSpace(freeDiskSpace);
      }),

      FileSystem.getTotalDiskCapacityAsync().then((totalDiskCapacity) => {
        setTotalDiskCapacity(totalDiskCapacity);
      }),
    ]).finally(() => {
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    getDiskSpace();
  }, [getDiskSpace]);

  return { diskSpace, loading, totalDiskCapacity, refreshDiskSpace: getDiskSpace };
}
