import React from 'react';

import { generateAvatar } from '@/lib/generateAvatar';
// import { generateAvatar } from '@/lib/generateAvatar';
import { joinTimeFormat } from '@/lib/joinTimeFormat';

import RemoveFriendModal from '../modals/remove-friend-modal';
import UserAvatar from '../user-avatar';

export default function ContactsListItem({
  id,
  name,
  createdAt
}: {
  id: string;
  name: string;
  createdAt: Date;
}) {
  const avatar = generateAvatar(name);

  const joinedAtTime = joinTimeFormat(createdAt);

  return (
    <RemoveFriendModal id={id} name={name} avatar={avatar}>
      <div className="m-1 flex gap-x-4 rounded p-1 px-2 transition hover:cursor-pointer hover:bg-white/15">
        <div className="flex h-full items-center justify-center">
          <UserAvatar className="m-2 h-11 w-11 rounded-md" username={name} />
        </div>
        <div className="flex w-full flex-col items-start py-1">
          <p className="text-lg">{name}</p>
          <p className="text-xs text-stone-400">Friends since {joinedAtTime}</p>
        </div>
      </div>
    </RemoveFriendModal>
  );
}
