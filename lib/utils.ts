import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatSize = (sizeInBytes: number) => {
  if (sizeInBytes < 1024) {
    return `${sizeInBytes} B`;
  }
  if (sizeInBytes < 1024 * 1024) {
    return `${Math.floor(sizeInBytes / 1024)} KB`;
  }
  if (sizeInBytes < 1024 * 1024 * 1024) {
    return `${Math.floor(sizeInBytes / 1024 / 1024)} MB`;
  }
  return `${(sizeInBytes / 1024 / 1024 / 1024).toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })} GB`;
};

export const formatAsGB = (sizeInBytes: number) => {
  return `${(sizeInBytes / 1024 / 1024 / 1024).toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })}`;
};