import React from 'react';

import { generateAvatar } from '@/lib/generateAvatar';
import { joinTimeFormat } from '@/lib/joinTimeFormat';

import AddFriendModal from '../modals/add-friend-modal';
import UserAvatar from '../user-avatar';

export default function ProfilesListItem({
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
    <AddFriendModal id={id} name={name} avatar={avatar}>
      <div className="m-1 flex gap-x-4 rounded p-1 px-2 transition hover:cursor-pointer hover:bg-white/15">
        <div className="flex h-full items-center justify-center">
          <UserAvatar className="m-2 h-11 w-11 rounded-md" username={name} />
        </div>
        <div className="flex w-full flex-col items-start">
          <p className="text-lg">{name}</p>
          <p className="text-xs text-stone-400">Joined {joinedAtTime} ago</p>
        </div>
      </div>
    </AddFriendModal>
  );
}
