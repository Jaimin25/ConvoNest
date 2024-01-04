'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Contact,
  Loader2,
  LogOut
} from 'lucide-react';

import useSupabase from '@/hooks/useSupabase';
import { cn } from '@/lib/utils';
import { BellIcon, EnvelopeIcon, UsersIcon } from '@heroicons/react/24/outline';

import { useUser } from '../providers/user-provider';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Skeleton } from '../ui/skeleton';
import UserAvatar from '../user-avatar';

import MobileViewSidebar from './mobile-sidebar';

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
    <>
      <div className="hidden h-full w-1/5 flex-col items-center justify-center py-4 sm:flex dark:bg-black/50">
        <div className="flex w-full flex-1 flex-col gap-y-2 px-2 *:w-full *:cursor-pointer *:self-center">
          <Link href="/users">
            <div
              className={cn(
                'flex w-full items-center gap-x-2 rounded-md p-2 transition hover:bg-white/15',
                location === '/users' ? 'bg-white/5' : 'bg-none'
              )}
            >
              <UsersIcon className='w-7 h-7'/>
              Users
            </div>
          </Link>
          <Link href="/chats">
            <div
              className={cn(
                'flex w-full items-center gap-x-2 rounded-md p-2 transition hover:bg-white/15',
                location === '/chats' ? 'bg-white/5' : 'bg-none'
              )}
            >
              <EnvelopeIcon className="h-7 w-7" />
              Chats
            </div>
          </Link>

          <Link href="/requests">
            <div
              className={cn(
                'flex w-full items-center gap-x-2 rounded-md p-2 transition hover:bg-white/15',
                location === '/requests' ? 'bg-white/5' : 'bg-none'
              )}
            >
              <BellIcon className="h-7 w-7" />
              Requests
            </div>
          </Link>
          <Link href="/contacts">
            <div
              className={cn(
                'flex w-full items-center gap-x-2 rounded-md p-2 transition hover:bg-white/15',
                location === '/contacts' ? 'bg-white/5' : 'bg-none'
              )}
            >
              <Contact className="h-7 w-7" />
              Contacts
            </div>
          </Link>
        </div>
        {username ? (
          <div className="flex w-full flex-col px-4">
            <Popover>
              <PopoverTrigger className="flex w-full items-center gap-x-2 rounded-md p-2 transition hover:bg-white/15">
                <UserAvatar
                  className="h-10 w-10 rounded-md"
                  username={username}
                />
                <p className="text-lg font-semibold">{username}</p>
              </PopoverTrigger>
              <PopoverContent
                className="flex items-center gap-x-2  hover:cursor-pointer"
                onClick={handleLogout}
              >
                {loading ? (
                  <>
                    <p>Logging out...</p>
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </>
                ) : (
                  <>
                    <span className="text-red-500">Logout</span>
                    <LogOut className="h-5 w-5 text-red-500" />
                  </>
                )}
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <div className="flex w-full flex-col px-4">
            <div className="flex w-full items-center gap-x-2 rounded-md p-2">
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </div>
        )}
      </div>
      <MobileViewSidebar className="block sm:hidden" />
    </>
  );
}
