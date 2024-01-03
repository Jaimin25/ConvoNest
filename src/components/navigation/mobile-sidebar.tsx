import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Contact, Mail, Users } from 'lucide-react';

import { cn } from '@/lib/utils';

export default function MobileViewSidebar({
  className
}: {
  className?: string;
}) {
  const location = usePathname();

  return (
    <div
      className={cn(
        'order-2 flex w-full items-center justify-center py-4 sm:flex dark:bg-black/50',
        className
      )}
    >
      <div className="flex w-full items-center justify-center gap-y-2 px-2 *:w-full *:cursor-pointer *:self-center">
        <Link href="/users">
          <div className="flex w-full items-center justify-center gap-x-2 rounded-md p-2 transition">
            <Users
              className={cn(
                'h-7 w-7',
                location === '/users' ? 'fill-white' : 'fill-none'
              )}
            />
          </div>
        </Link>
        <Link href="/chats">
          <div className="flex w-full items-center justify-center gap-x-2 rounded-md p-2 transition">
            <Mail
              className={cn(
                'h-7 w-7',
                location === '/chats' ? 'fill-white' : 'fill-none'
              )}
            />
          </div>
        </Link>

        <Link href="/requests">
          <div className="flex w-full items-center justify-center gap-x-2 rounded-md p-2 transition">
            <Bell
              className={cn(
                'h-7 w-7',
                location === '/requests' ? 'fill-white' : 'fill-none'
              )}
            />
          </div>
        </Link>
        <Link href="/contacts">
          <div className="flex w-full items-center justify-center gap-x-2 rounded-md p-2 transition">
            <Contact
              className={cn(
                'h-7 w-7',
                location === '/contacts' ? 'fill-white' : 'fill-none'
              )}
            />
          </div>
        </Link>
      </div>
    </div>
  );
}
