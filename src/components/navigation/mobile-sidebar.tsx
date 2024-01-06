import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { BellIcon, EnvelopeIcon, UsersIcon } from '@heroicons/react/24/outline';
import {
  BellIcon as BellIconSolid,
  EnvelopeIcon as EnvelopIconSolid,
  UsersIcon as UsersIconSolid
} from '@heroicons/react/24/solid';

import { useRequests } from '../providers/requests-provider';
import { useUser } from '../providers/user-provider';
import { Skeleton } from '../ui/skeleton';
import UserAvatar from '../user-avatar';

export default function MobileViewSidebar({
  className
}: {
  className?: string;
}) {
  const location = usePathname();
  const { username, user } = useUser();

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
              <EnvelopIconSolid className="h-6 w-6" />
            ) : (
              <EnvelopeIcon className="h-6 w-6" />
            )}
          </div>
        </Link>

        <Link href="/requests">
          <div className="flex w-full items-center justify-center gap-x-2 rounded-md p-2 transition">
            {location === '/requests' ? (
              <div className="relative">
                <BellIconSolid className="h-6 w-6" />
                {requests.some((rq) => rq.receiverId === user.id) ? (
                  <div className="absolute right-0 top-0 h-2 w-2 rounded-full bg-red-500" />
                ) : null}
              </div>
            ) : (
              <div className="relative">
                <BellIcon className="h-6 w-6" />
                {requests.some((rq) => rq.receiverId === user.id) ? (
                  <div className="absolute right-0 top-0 h-2 w-2 rounded-full bg-red-500" />
                ) : null}
              </div>
            )}
          </div>
        </Link>
        <Link href="/contacts">
          <div className="flex w-full items-center justify-center gap-x-2 rounded-md p-2 transition">
            {username ? (
              <UserAvatar
                username={username}
                className="h-6 w-6 rounded-full"
              />
            ) : (
              <Skeleton className="h-6 w-6 rounded-full" />
            )}
          </div>
        </Link>
      </div>
    </div>
  );
}
