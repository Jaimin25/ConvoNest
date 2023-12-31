import { adventurerNeutral } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';

export function generateAvatar(value: string) {
  const avatar = createAvatar(adventurerNeutral, {
    seed: value,
    radius: 20
  });

  const svg = avatar.toString();
  return svg;
}
