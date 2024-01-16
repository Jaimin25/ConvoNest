import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isURL(str: string) {
  const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;

  return urlPattern.test(str);
}

export function isImageOrGif(url: string) {
  const regex = /(https?:)\/\/(.+?)\.(?:jpe?g|png|gif)(?=\?|$)/i;

  return regex.test(url);
}
