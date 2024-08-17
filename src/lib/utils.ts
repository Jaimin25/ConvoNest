import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isURL(str: string) {
  const urlPattern = /^(https?:\/\/[^\s/$.?#].[^\s]*|www\.[^\s/$.?#].[^\s]*)$/i;

  return urlPattern.test(str);
}

export function isImageOrGif(url: string) {
  const regex = /(https?:)\/\/(.+?)\.(?:jpe?g|png|gif)(?=\?|$)/i;

  return regex.test(url);
}

export const containsUrlRegex =
  /((https?:\/\/[^\s/$.?#].[^\s]*)|(www\.[^\s/$.?#].[^\s]*))/gi;

export function msgContainsUrl(str: string) {
  return containsUrlRegex.test(str) ? str.match(containsUrlRegex)![0] : false;
}
