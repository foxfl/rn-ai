import { PortalHost } from '@rn-primitives/portal';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Platform, TextInput, View } from 'react-native';
import { FullWindowOverlay } from 'react-native-screens';
import { Container } from '~/components/container';
import { Header } from '~/components/header';
import { MODEL_MANAGER_MODAL_NAME } from '~/components/model';
import { ModelList } from '~/components/model/model-list';
import { NativeTextField } from '~/components/native-text-field';
import { Progress } from '~/components/progress';
import { Text } from '~/components/ui/text';
import { useGetDiskSpace } from '~/hooks/useGetDiskSpace';
import { useGetFolderSize } from '~/hooks/useGetFolderSize';
import { formatAsGB } from '~/lib/utils';

const WindowOverlay = Platform.OS === 'ios' ? FullWindowOverlay : React.Fragment;

export default function ModelManager() {
  const { diskSpace, totalDiskCapacity, loading, refreshDiskSpace } = useGetDiskSpace();
  const { size, refreshSize } = useGetFolderSize();
  const progress = useMemo(() => {
    if (loading) return 0;
    return 100 - (diskSpace / totalDiskCapacity) * 100;
  }, [diskSpace, totalDiskCapacity, loading]);

  const spaceRef = useRef<TextInput>(null);
  const sizeRef = useRef<TextInput>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (loading) {
      return;
    }
    if (spaceRef.current) {
      spaceRef.current.setNativeProps({
        text: t('model-manager.available-disk-space', {
          space: Math.floor(diskSpace / 1024 / 1024 / 1024).toString(),
        }),
      });
    }
  }, [diskSpace, loading]);

  useEffect(() => {
    if (sizeRef.current) {
      sizeRef.current.setNativeProps({
        text: t('model-manager.downloaded-models', {
          size: formatAsGB(size),
        }),
      });
    }
  }, [size]);

  const onDownloadChanged = useCallback(() => {
    refreshDiskSpace();
    refreshSize();
  }, [refreshDiskSpace, refreshSize]);

  return (
    <Container header={<Header backButton isModal title="Model Manager" />} ignore={{ top: true }}>
      <View className="flex-col gap-8">
        <ModelList
          onDownloadChanged={onDownloadChanged}
          ListHeaderComponent={
            <View className="flex-col gap-2">
              {loading ? (
                <View className="flex-row items-center gap-2">
                  <ActivityIndicator size="small" color="gray" />
                  <Text className="text-sm text-muted-foreground">
                    {t('model-manager.determining-disk-space')}
                  </Text>
                </View>
              ) : (
                <>
                  <Progress value={progress} showLabel={false} animationDuration={1000} />
                  <View className="flex-row items-center gap-2">
                    <NativeTextField
                      ref={spaceRef}
                      className=" -mt-1.5 items-center justify-center border-0 text-center text-sm  text-muted-foreground"
                    />
                  </View>
                </>
              )}
            </View>
          }
          ListFooterComponent={
            <View className="flex-col items-center justify-center gap-2">
              <NativeTextField
                ref={sizeRef}
                className="h-7 w-full text-center text-sm text-muted-foreground"
              />
            </View>
          }
        />
      </View>
      <WindowOverlay>
        <PortalHost name={MODEL_MANAGER_MODAL_NAME} />
      </WindowOverlay>
    </Container>
  );
}
