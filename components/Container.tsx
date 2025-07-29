import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cn } from '~/lib/utils';

export const Container = ({
  children,
  className,
  ignore,
  header,
}: {
  children: React.ReactNode;
  className?: string;
  ignore?: {
    top?: boolean;
    bottom?: boolean;
    left?: boolean;
    right?: boolean;
  };
  header?: React.ReactNode;
}) => {
  const { top, bottom, left, right } = useSafeAreaInsets();
  return (
    <View
      className={cn('flex flex-1 ', className)}
      style={{
        paddingTop: ignore?.top ? 0 : top,
        paddingBottom: ignore?.bottom ? 0 : bottom,
        paddingLeft: ignore?.left ? 0 : left,
        paddingRight: ignore?.right ? 0 : right,
      }}>
      {header}
      <View className={cn(styles.container, styles.web)}>
        <View className={cn('flex-1 web:w-full web:max-w-screen-2xl')}>{children}</View>
      </View>
    </View>
  );
};

const styles = {
  container: 'flex flex-1 px-4 py-2',
  web: 'web:justify-center web:items-center',
};
