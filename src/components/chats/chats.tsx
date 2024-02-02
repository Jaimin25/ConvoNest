'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';

import CreateChatModal from '../modals/create-chat-modal';
import { useMessages } from '../providers/messages-provider';
import { useSocket } from '../providers/socket-provider';
import { useUser } from '../providers/user-provider';

import ChatsList from './chats-list';

export default function Chats() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useUser();
  const { unreadMessages, clearUnreadMessages } = useMessages();
  const { socket } = useSocket();

  const totalUnreadMessages = unreadMessages.reduce(
    (count, msg) => count + msg.count,
    0
  );

  useEffect(() => {
    socket?.on(`chat:${user.id}:receive-delete-chat`, (chatId) => {
      const unreadMessages = localStorage.getItem('unread-messages');
      if (unreadMessages) {
        clearUnreadMessages(chatId);
      }
    });
    return () => {
      socket?.off(`chat:${user.id}:recieve-delete-chat`);
    };
  }, [socket, user, clearUnreadMessages]);

  const location = usePathname();

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <div className="hidden h-full w-1/3 items-center px-4 py-4 md:flex">
        <Card className="h-full w-full border-0 px-4 dark:bg-black/50">
          <CardHeader>
            <CardTitle>
              <div className="flex items-center">
                <p>Chats</p>
                <CreateChatModal />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-5/6 px-2 md:h-5/6">
            <ChatsList />
          </CardContent>
        </Card>
      </div>
      <Sheet open={isSidebarOpen} onOpenChange={toggleSidebar}>
        <SheetTrigger className="absolute m-8 md:hidden">
          <div className="relative">
            <Menu />
            {totalUnreadMessages > 0 && (
              <div className="absolute -right-1 -top-1 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-xs text-white" />
            )}
          </div>
        </SheetTrigger>
        <SheetContent side={'left'} className="border-none">
          <SheetHeader>
            <SheetTitle>
              <div className="flex items-center">
                <p>Chats</p>
                {totalUnreadMessages > 0 &&
                  (!(totalUnreadMessages > 100) ? (
                    <div className="ml-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 p-3 text-xs text-white">
                      {totalUnreadMessages}
                    </div>
                  ) : (
                    <div className="ml-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 p-3 text-xs text-white">
                      100+
                    </div>
                  ))}
                <CreateChatModal />
              </div>
            </SheetTitle>
          </SheetHeader>
          <ChatsList />
        </SheetContent>
      </Sheet>
    </>
  );
}
