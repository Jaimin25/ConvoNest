import React from 'react';

import { generateAvatar } from '@/lib/generateAvatar';
// import { generateAvatar } from '@/lib/generateAvatar';
import { joinTimeFormat } from '@/lib/joinTimeFormat';
import { UserMinusIcon } from '@heroicons/react/24/outline';

import RemoveFriendModal from '../modals/remove-friend-modal';
import UserAvatar from '../user-avatar';

export default function ContactsListItem({
  id,
  name,
  contactId,
  createdAt
}: {
  id: string;
  name: string;
  contactId: string;
  createdAt: Date;
}) {
  const avatar = generateAvatar(name);

  const joinedAtTime = joinTimeFormat(createdAt);

  return (
    <div className="my-1 flex items-center gap-x-2 rounded p-1 px-2 transition hover:cursor-pointer hover:bg-white/15">
      <div className="flex h-full items-center justify-center">
        <UserAvatar className="m-2 h-11 w-11 rounded-md" username={name} />
      </div>
      <div className="flex flex-1 flex-col items-start">
        <p className="text-lg">{name}</p>
        <p className="text-xs text-stone-400">Friends since {joinedAtTime}</p>
      </div>
      <RemoveFriendModal
        id={id}
        name={name}
        avatar={avatar}
        contactId={contactId}
      >
        <UserMinusIcon className="h-9 w-9 rounded-full bg-white/10 p-2 transition hover:text-red-500 md:bg-none md:group-hover:block md:group-hover:bg-black" />
      </RemoveFriendModal>
    </div>
  );
}
