import { useMemo } from 'react';
import Image from 'next/image';

import { adventurerNeutral } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';

function UserAvatar({
  username,
  className
}: {
  username: string;
  className?: string;
}) {
  const avatar = useMemo(() => {
    return createAvatar(adventurerNeutral, {
      size: 128,
      seed: username
    }).toDataUriSync();
  }, [username]);

  return (
    <Image
      className={className}
      width={48}
      height={48}
      src={avatar}
      alt="Avatar"
    />
  );
}

export default UserAvatar;
