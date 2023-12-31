'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Bell,
  Contact,
  Loader2,
  LogOut,
  MessageSquareText,
  Users
} from 'lucide-react';

import useSupabase from '@/hooks/useSupabase';
import { cn } from '@/lib/utils';

import { useUser } from '../providers/user-provider';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Skeleton } from '../ui/skeleton';
import UserAvatar from '../user-avatar';

export default function NavigationSidebar() {
  const { username } = useUser();
  const location = usePathname();

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const { supabase } = useSupabase();

  const handleLogout = () => {
    setLoading(true);
    const logout = async () => {
      const data = await supabase.auth.signOut();
      setLoading(false);
      if (!data.error) {
        router.refresh();
      }
    };
    logout();
  };

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
      {username ? (
        <Popover>
          <PopoverTrigger>
            <UserAvatar className="h-10 w-10 rounded-md" username={username} />
          </PopoverTrigger>
          <PopoverContent
            className="flex items-center gap-x-2  hover:cursor-pointer"
            onClick={handleLogout}
          >
            {loading ? (
              <>
                <p>Logging out...</p>
                <Loader2 className="h-4 w-4 animate-spin" />
              </>
            ) : (
              <>
                <span className="text-red-500">Logout</span>
                <LogOut className="h-5 w-5 text-red-500" />
              </>
            )}
          </PopoverContent>
        </Popover>
      ) : (
        <Skeleton className="h-8 w-8 rounded-md" />
      )}
    </div>
  );
}
