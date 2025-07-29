import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, TextInput, View } from 'react-native';
import { useModelDownloadActions } from '~/hooks/models/useModelDownloadActions';
import { Check, Download, HardDriveDownload, MemoryStick, Square, Variable } from '~/lib/icons';
import { getModelId } from '~/lib/model/helpers';
import { cn } from '~/lib/utils';
import { useModel, useModelStore } from '~/stores/model-store';
import { ModelInformation } from '~/types/model';
import { MODEL_MANAGER_MODAL_NAME } from '.';
import { NativeTextField } from '../native-text-field';
import { Progress } from '../progress';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Text } from '../ui/text';

interface ModelListItemProps {
  model: ModelInformation;
  onDownloadChanged: () => void;
}

export function ModelListItem({ model, onDownloadChanged }: ModelListItemProps) {
  const { t } = useTranslation();
  const { fileInfo } = useModel(getModelId(model));
  const selectedModelId = useModelStore((state) => state.selectedModelId);
  const selectModel = useModelStore((state) => state.selectModel);
  const progressRef = useRef<TextInput>(null);

  const { startDownload, cancelDownload, removeModel, progressAnimation, state } =
    useModelDownloadActions({
      modelId: getModelId(model),
      progressRef,
      onDownloadChanged,
    });
  const [isOpen, setIsOpen] = useState(false);

  const isSelected = useMemo(() => selectedModelId === getModelId(model), [selectedModelId, model]);

  const handlePress = () => {
    if (fileInfo) {
      selectModel(getModelId(model));
    } else {
      startDownload();
    }
  };

  const handleButtonPress = () => {
    if (state.isDownloading) {
      cancelDownload();
    } else if (fileInfo) {
      setIsOpen(true);
    } else {
      startDownload();
    }
  };

  return (
    <Pressable
      className="bg-background active:bg-accent web:hover:bg-accent web:hover:text-accent-foreground"
      onPress={handlePress}>
      <View className="flex-row gap-8 rounded-lg border border-gray-200  p-4 pb-8">
        <View className="flex-1 flex-col justify-between gap-4">
          <Text className="text-lg font-medium text-primary">{model.name}</Text>
          <Text numberOfLines={2} ellipsizeMode="tail" className="text-sm text-muted-foreground">
            {model.description}
          </Text>

          <View className="flex-row gap-2">
            <Badge className="flex-row gap-2">
              <Variable className="h-4 w-4 text-primary-foreground" />
              <Text className="text-xs text-primary-foreground">{model.params}</Text>
            </Badge>

            <Badge className="flex-row gap-2">
              <MemoryStick className="h-4 w-4 text-primary-foreground" />
              <Text className="text-xs text-primary-foreground">{Math.ceil(model.memory)} GB</Text>
            </Badge>
            <Badge className="flex-row gap-2">
              <HardDriveDownload className="h-4 w-4 text-primary-foreground" />
              <Text className="text-xs text-primary-foreground">{Math.ceil(model.size)} GB</Text>
            </Badge>
          </View>
          {!fileInfo && state.isDownloading && (
            <View>
              <Progress variant={'success'} animatedValue={progressAnimation} showLabel={false} />
              <NativeTextField ref={progressRef} className="text-xs text-muted-foreground" />
            </View>
          )}
        </View>

        <View className="items-center justify-center">
          <Button
            variant="outline"
            size={'icon'}
            onPress={handleButtonPress}
            className={cn('flex-row gap-2 rounded-full', {
              'bg-green-100': isSelected,
              'border-green-100': isSelected,
            })}>
            {fileInfo ? (
              <Check
                className={cn('h-4 w-4 text-primary', {
                  'text-green-700': isSelected,
                })}
              />
            ) : state.isDownloading ? (
              <Square className="h-4 w-4 text-primary" />
            ) : (
              <Download className="h-4 w-4 text-primary" />
            )}
          </Button>
          <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogContent portalHost={MODEL_MANAGER_MODAL_NAME}>
              <AlertDialogHeader>
                <AlertDialogTitle>{t('model-manager.delete-model')}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t('model-manager.delete-model-description')}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  <Text>{t('buttons.cancel')}</Text>
                </AlertDialogCancel>
                <AlertDialogAction
                  onPress={() => {
                    removeModel();
                    setIsOpen(false);
                  }}>
                  <Text>{t('buttons.delete')}</Text>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </View>
      </View>
    </Pressable>
  );
}
