import { createAvatar } from "@dicebear/core";
import { adventurerNeutral } from "@dicebear/collection";

export function generateAvatar(value: string) {
  const avatar = createAvatar(adventurerNeutral, {
    seed: value,
    radius: 20,
  });

  const svg = avatar.toString();
  return svg;
}
