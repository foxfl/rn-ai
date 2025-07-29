import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';
import { Check, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, ScrollView, Text, View } from 'react-native';
import Animated, { Extrapolation, interpolate } from 'react-native-reanimated';
import { cn } from '~/lib/utils';
import { Button } from '../ui/button';
export interface Metering {
  position: number;
  key: number;
  db: number;
}
interface AudioRecorderProps {
  onCancel?: () => void;
  onDone?: (uri: string, duration: number) => void;
  maxDuration?: number; // in milliseconds
  className?: string;
  text?: string;
}

export const METERING_MIN_POWER = Platform.select({ default: -50, android: -100 });
export const METERING_MAX_POWER = 0;

export function AudioRecorder({
  onCancel,
  onDone,
  maxDuration = 300000, // 5 minutes default
  className,
  text,
}: AudioRecorderProps) {
  const [hasPermission, setHasPermission] = useState(false);
  const { t } = useTranslation();
  // Create audio recorder
  const audioRecorder = useAudioRecorder({
    ...RecordingPresets.HIGH_QUALITY,
    isMeteringEnabled: true,
  });
  const recorderState = useAudioRecorderState(audioRecorder, 100);

  const [isRecording, setIsRecording] = useState(false);

  const [meterings, setMeterings] = useState<Metering[]>([]);

  // Start recording immediately when component mounts
  useEffect(() => {
    const initializeRecording = async () => {
      const permissionGranted = await requestPermissionsAndSetup();
      if (permissionGranted) {
        await startRecording();
      }
    };

    initializeRecording();
  }, []);

  useEffect(() => {
    if (recorderState.isRecording && recorderState.durationMillis > 0) {
      if (recorderState.durationMillis > maxDuration) {
        return;
      }

      setMeterings((prev) => {
        return [
          {
            position: recorderState.durationMillis,
            key: recorderState.durationMillis + prev.length,
            db: recorderState.metering ?? METERING_MIN_POWER,
          },
          ...prev,
        ];
      });
    }
  }, [recorderState, maxDuration]);

  const requestPermissionsAndSetup = async () => {
    try {
      console.log('Requesting permissions..');
      const { status } = await AudioModule.requestRecordingPermissionsAsync();

      if (status !== 'granted') {
        console.log('Permission to access microphone denied');
        return false;
      }

      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });

      setHasPermission(true);
      return true;
    } catch (err) {
      console.error('Failed to request permissions', err);
      return false;
    }
  };

  const startRecording = async () => {
    try {
      setMeterings([]);
      setIsRecording(true);
      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });
      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const cancelRecording = async () => {
    if (isRecording) {
      await audioRecorder.stop();
      await setAudioModeAsync({ allowsRecording: false });
    }

    onCancel?.();
  };

  if (!hasPermission) {
    return (
      <View
        className={cn(
          'flex-row items-center justify-center',
          'h-12 px-3 py-2',
          'rounded-lg border border-input bg-background',
          'shadow-sm',
          className
        )}>
        <Text className="text-sm text-muted-foreground">Requesting microphone permission...</Text>
      </View>
    );
  }

  return (
    <View className="h-12 w-full flex-row justify-between">
      <Button variant="ghost" size="icon" className="native:min-h-12" onPress={cancelRecording}>
        <X className="size-6 text-muted-foreground" />
      </Button>
      <View className="h-12 flex-1 flex-row  items-center justify-center gap-4 px-8">
        <View className="rounded-2xl border border-input" style={{ flex: 2 }}>
          <ScrollView
            horizontal
            style={{ transform: [{ scaleX: -1 }] }}
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-1 items-center justify-end px-2"
            scrollEnabled={false}>
            {meterings.map((meter) => (
              <Animated.View
                key={meter.key}
                className="w-0.5 bg-gray-500"
                style={{
                  height: interpolate(
                    meter.db,
                    [METERING_MIN_POWER, METERING_MAX_POWER],
                    [1, 30],
                    Extrapolation.CLAMP
                  ),
                }}
              />
            ))}
          </ScrollView>
        </View>
        <View className="flex-1 items-start justify-center">
          <Text className="text-sm text-muted-foreground">{t('recording.listening')}</Text>
        </View>
      </View>
      <Button variant="ghost" size="icon" className="native:min-h-12" onPress={startRecording}>
        <Check className="size-6 text-muted-foreground" />
      </Button>
    </View>
  );
}
