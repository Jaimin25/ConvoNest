import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import {
  BellIcon,
  ChatBubbleLeftRightIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import {
  BellIcon as BellIconSolid,
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid,
  UsersIcon as UsersIconSolid
} from '@heroicons/react/24/solid';

import { useMessages } from '../providers/messages-provider';
import { useRequests } from '../providers/requests-provider';
import { useUser } from '../providers/user-provider';
import { SocketIndicator } from '../socket-indicator';
import { Skeleton } from '../ui/skeleton';
import UserAvatar from '../user-avatar';

export default function MobileViewSidebar({
  className
}: {
  className?: string;
}) {
  const location = usePathname();

  const { username, user } = useUser();
  const { unreadMessages } = useMessages();
  const { requests } = useRequests();

  return (
    <div
      className={cn(
        'order-2 flex w-full items-center justify-center py-2 sm:flex dark:bg-black/50',
        className
      )}
    >
      <div className="flex w-full items-center justify-center gap-y-2 px-2 *:w-full *:cursor-pointer *:self-center">
        <Link href="/users">
          <div className="flex w-full items-center justify-center gap-x-2 rounded-md p-2 transition">
            {location === '/users' ? (
              <UsersIconSolid className="h-6 w-6" />
            ) : (
              <UsersIcon className="h-6 w-6" />
            )}
          </div>
        </Link>
        <Link href="/chats">
          <div className="flex w-full items-center justify-center gap-x-2 rounded-md p-2 transition">
            {location === '/chats' || location.includes('/chats/c/') ? (
              <div className="relative">
                <ChatBubbleLeftRightIconSolid className="h-6 w-6" />
                {unreadMessages && unreadMessages.length > 0 && (
                  <div className="absolute -right-1 top-0 h-[10px] w-[10px] rounded-full bg-red-500" />
                )}
              </div>
            ) : (
              <div className="relative">
                <ChatBubbleLeftRightIcon className="h-6 w-6" />
                {unreadMessages && unreadMessages.length > 0 && (
                  <div className="absolute -right-1 top-0 h-[10px] w-[10px] rounded-full bg-red-500" />
                )}
              </div>
            )}
          </div>
        </Link>

        <Link href="/requests">
          <div className="flex w-full items-center justify-center gap-x-2 rounded-md p-2 transition">
            {location === '/requests' ? (
              <div className="relative">
                <BellIconSolid className="h-6 w-6" />
                {requests.some((rq) => rq.receiverId === user.id) && (
                  <div className="absolute right-0 top-0 h-[10px] w-[10px] rounded-full bg-red-500" />
                )}
              </div>
            ) : (
              <div className="relative">
                <BellIcon className="h-6 w-6" />
                {requests.some((rq) => rq.receiverId === user.id) && (
                  <div className="absolute right-0 top-0 h-[10px] w-[10px] rounded-full bg-red-500" />
                )}
              </div>
            )}
          </div>
        </Link>
        <Link href="/contacts">
          <div className="flex w-full items-center justify-center gap-x-2 rounded-md p-2 transition">
            {username ? (
              <div className="relative">
                <UserAvatar
                  username={username}
                  className="m-1 h-6 w-6 rounded-full"
                />
                <SocketIndicator />
              </div>
            ) : (
              <Skeleton className="m-1 h-6 w-6 rounded-full" />
            )}
          </div>
        </Link>
      </div>
    </div>
  );
}
