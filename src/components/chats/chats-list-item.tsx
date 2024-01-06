import React from 'react';
import Link from 'next/link';

import { joinTimeFormat } from '@/lib/joinTimeFormat';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import { User } from '@prisma/client';

import { useUser } from '../providers/user-provider';
import UserAvatar from '../user-avatar';

export default function ChatsListItem({
  id,
  name,
  isGroup,
  adminId,
  lastMessage,
  users,
  createdAt,
  updatedAt
}: {
  id: string;
  name: string | null;
  isGroup: boolean;
  adminId: string | null;
  lastMessage?: string;
  users: User[];
  createdAt: Date;
  updatedAt: Date;
}) {
  const { user } = useUser();
  const updatedAtTime = joinTimeFormat(updatedAt);

  const receiver = users[0].id !== user.id ? users[0] : users[1];

  return (
    <Link
      href={`/chats/c/${id}`}
      className="m-1 flex items-center gap-x-4 rounded p-1 px-2 transition hover:cursor-pointer hover:bg-white/15"
    >
      <div className="flex h-full items-center justify-center">
        {isGroup ? (
          <UserGroupIcon className="h-8 w-11 rounded-md" />
        ) : (
          <UserAvatar
            className="m-2 h-11 w-11 rounded-md"
            username={receiver.name}
          />
        )}
      </div>
      <div className="flex w-full flex-col items-start py-1">
        {isGroup ? (
          <p className="text-lg">{name}</p>
        ) : (
          <p className="text-lg">{receiver.name}</p>
        )}
        {lastMessage ? (
          <p className="text-sm text-stone-400">
            {lastMessage} • {updatedAtTime}
          </p>
        ) : (
          <p className="text-xs text-stone-400">{updatedAtTime}</p>
        )}
      </div>
    </Link>
  );
}
