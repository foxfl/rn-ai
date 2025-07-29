import { TextInput } from 'react-native';
import { cn } from '~/lib/utils';

interface Props {
  ref?: React.Ref<TextInput>;
  className?: string;
}

export function NativeTextField({ ref, className }: Props) {
  return (
    <TextInput
      editable={false}
      textAlignVertical="center"
      style={{
        paddingTop: 0,paddingBottom: 0
      }}
      ref={ref}
      className={cn('text-base text-foreground web:select-text', className)}
    />
  );
}
