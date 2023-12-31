'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Contact, MessageSquareText, Users } from 'lucide-react';

import useUser from '@/hooks/useUser';
import { generateAvatar } from '@/lib/generate-avatar';
import { cn } from '@/lib/utils';

import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Skeleton } from '../ui/skeleton';

export default function NavigationSidebar() {
  const { user } = useUser();
  const avatar = generateAvatar(user?.name as string);
  const location = usePathname();

  return (
    <div className="flex h-full w-14 flex-col items-center py-4 dark:bg-black/50">
      <div className="flex flex-1 flex-col gap-y-2 *:cursor-pointer *:self-center">
        <Link href="/users">
          <div className="rounded-md  p-2 transition hover:bg-white/15 ">
            <Users
              className={cn(
                'h-6 w-6',
                location === '/users' ? ' stroke-teal-500' : 'fill-none'
              )}
            />
          </div>
        </Link>
        <Link href="/chats">
          <div className="rounded-md  p-2 transition hover:bg-white/15 ">
            <MessageSquareText
              className={cn(
                'h-6 w-6',
                location === '/chats' ? ' stroke-sky-500' : 'fill-none'
              )}
            />
          </div>
        </Link>

        <Link href="/notifications">
          <div className="rounded-md  p-2 transition hover:bg-white/15">
            <Bell
              className={cn(
                'h-6 w-6',
                location === '/notifications' ? ' stroke-rose-500' : 'fill-none'
              )}
            />
          </div>
        </Link>
        <Link href="/contacts">
          <div className="rounded-md  p-2 transition hover:bg-white/15">
            <Contact
              className={cn(
                'h-6 w-6',
                location === '/contacts' ? ' stroke-amber-500' : 'fill-none'
              )}
            />
          </div>
        </Link>
      </div>
      {user ? (
        <Popover>
          <PopoverTrigger>
            <div
              dangerouslySetInnerHTML={{ __html: avatar }}
              className="h-8 w-8"
            ></div>
          </PopoverTrigger>
          <PopoverContent>Logout</PopoverContent>
        </Popover>
      ) : (
        <Skeleton className="h-8 w-8 rounded-md" />
      )}
    </div>
  );
}
