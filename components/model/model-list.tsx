import { useCallback } from 'react';
import { FlatList } from 'react-native';
import { useModelStore } from '~/stores/model-store';
import { ModelState } from '~/types/model';
import { ModelListItem } from './model-list-item';

interface ModelListProps {
  ListHeaderComponent?: React.ReactElement;
  ListFooterComponent?: React.ReactElement;
  onDownloadChanged: () => void;
}
export function ModelList({
  ListHeaderComponent,
  ListFooterComponent,
  onDownloadChanged,
}: ModelListProps) {
  const models = useModelStore((state) => state.models);

  const renderItem = useCallback(
    ({ item }: { item: ModelState }) => {
      return <ModelListItem model={item.modelInfo} onDownloadChanged={onDownloadChanged} />;
    },
    [onDownloadChanged]
  );

  return (
    <FlatList
      contentContainerClassName="flex-grow gap-4"
      data={Object.values(models)}
      showsVerticalScrollIndicator={false}
      renderItem={renderItem}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}
    />
  );
}
