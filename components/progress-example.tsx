import * as React from 'react';
import { View, Text } from 'react-native';
import { Progress } from './progress';
import { Button } from './ui/button';

export function DownloadProgressExample() {
  const [downloadProgress, setDownloadProgress] = React.useState(0);
  const [isDownloading, setIsDownloading] = React.useState(false);
  const [downloadStatus, setDownloadStatus] = React.useState<'idle' | 'downloading' | 'completed' | 'error'>('idle');

  const simulateDownload = () => {
    setIsDownloading(true);
    setDownloadStatus('downloading');
    setDownloadProgress(0);

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        const newProgress = prev + Math.random() * 15;
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsDownloading(false);
          setDownloadStatus('completed');
          return 100;
        }
        
        return newProgress;
      });
    }, 200);
  };

  const getStatusColor = () => {
    switch (downloadStatus) {
      case 'completed':
        return 'success';
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = () => {
    switch (downloadStatus) {
      case 'completed':
        return 'Download completed!';
      case 'error':
        return 'Download failed';
      case 'downloading':
        return 'Downloading...';
      default:
        return 'Ready to download';
    }
  };

  return (
    <View className="p-4 space-y-4">
      <Text className="text-xl font-bold text-foreground">
        File Download Progress
      </Text>

      {/* Status Display */}
      <View className="bg-secondary p-3 rounded-lg">
        <Text className="text-sm text-muted-foreground mb-1">Status</Text>
        <Text className="text-base font-medium text-foreground">
          {getStatusText()}
        </Text>
      </View>

      {/* Progress Bar */}
      <View className="space-y-2">
        <View className="flex-row justify-between items-center">
          <Text className="text-sm text-muted-foreground">Download Progress</Text>
          <Text className="text-sm font-medium text-foreground">
            {Math.round(downloadProgress)}%
          </Text>
        </View>
        
        <Progress 
          value={downloadProgress} 
          max={100}
          variant={getStatusColor()}
          showLabel
          labelPosition="inside"
          animationDuration={200}
        />
      </View>

      {/* File Info */}
      <View className="bg-secondary p-3 rounded-lg space-y-2">
        <Text className="text-sm text-muted-foreground">File Information</Text>
        <View className="flex-row justify-between">
          <Text className="text-sm text-foreground">Filename:</Text>
          <Text className="text-sm font-medium text-foreground">example-file.zip</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-sm text-foreground">Size:</Text>
          <Text className="text-sm font-medium text-foreground">15.2 MB</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-sm text-foreground">Speed:</Text>
          <Text className="text-sm font-medium text-foreground">
            {isDownloading ? '2.1 MB/s' : '--'}
          </Text>
        </View>
      </View>

      {/* Control Buttons */}
      <View className="space-y-2">
        <Button 
          onPress={simulateDownload} 
          disabled={isDownloading}
          className="w-full"
        >
          {isDownloading ? 'Downloading...' : 'Start Download'}
        </Button>

        <Button 
          onPress={() => {
            setDownloadProgress(0);
            setDownloadStatus('idle');
            setIsDownloading(false);
          }} 
          variant="outline"
          className="w-full"
        >
          Reset
        </Button>
      </View>

      {/* Error Simulation */}
      <Button 
        onPress={() => {
          setDownloadStatus('error');
          setIsDownloading(false);
        }} 
        variant="destructive"
        className="w-full"
      >
        Simulate Error
      </Button>
    </View>
  );
} 