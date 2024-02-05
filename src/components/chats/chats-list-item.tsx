import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { joinTimeFormat } from '@/lib/joinTimeFormat';
import { cn } from '@/lib/utils';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import { User } from '@prisma/client';

import { useMessages } from '../providers/messages-provider';
import { useUser } from '../providers/user-provider';
import { Badge } from '../ui/badge';
import UserAvatar from '../user-avatar';

export default function ChatsListItem({
  id,
  name,
  isGroup,
  // adminId,
  lastMessage,
  users,
  // createdAt,
  updatedAt
}: {
  id: string;
  name: string | null;
  isGroup: boolean;
  adminId: string | null;
  lastMessage?: string | null;
  users: User[];
  createdAt: Date;
  updatedAt: Date;
}) {
  const location = usePathname();

  const { user } = useUser();
  const updatedAtTime = joinTimeFormat(updatedAt);

  const receiver = users[0].id !== user.id ? users[0] : users[1];

  const { unreadMessages } = useMessages();

  return (
    <Link
      href={`/chats/c/${id}`}
      className={cn(
        'm-1 flex items-center gap-x-2 rounded p-1 px-2 transition hover:cursor-pointer hover:bg-white/15',
        location.substring(location.indexOf('/chats/c/'), location.length) ===
          `/chats/c/${id}`
          ? 'bg-white/10'
          : 'bg-none'
      )}
    >
      <div className="flex h-full items-center justify-center">
        {isGroup ? (
          <UserGroupIcon className="m-2 h-8 w-11 rounded-md" />
        ) : (
          <UserAvatar
            className="m-2 h-11 w-11 rounded-md"
            username={receiver.name}
          />
        )}
      </div>
      <div className="flex flex-1 flex-col items-start py-1">
        <div className="flex w-full">
          {isGroup ? (
            <p className="text-lg">{name} </p>
          ) : (
            <p className="text-lg">{receiver.name} </p>
          )}
          {unreadMessages
            ? unreadMessages.map(
                (msg, index) =>
                  msg.chatId === id && (
                    <Badge
                      className="ml-auto bg-red-500"
                      variant={'outline'}
                      key={index}
                    >
                      {msg.count}
                    </Badge>
                  )
              )
            : null}
        </div>

        {lastMessage ? (
          <p className="text-sm text-stone-400">
            {lastMessage.length > 5
              ? lastMessage.substring(0, 4) + '... • ' + updatedAtTime
              : lastMessage + ' • ' + updatedAtTime}
          </p>
        ) : (
          <p className="text-xs text-stone-400">{updatedAtTime}</p>
        )}
      </div>
    </Link>
  );
}
