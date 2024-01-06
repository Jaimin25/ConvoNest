import React from 'react';
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

import ChatsList from './chats-list';

export default function Chats() {
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
      <Sheet>
        <SheetTrigger className="absolute m-5 md:hidden">
          <Menu />
        </SheetTrigger>
        <SheetContent side={'left'} className="border-none">
          <SheetHeader>
            <SheetTitle>
              <div className="flex items-center">
                <p>Chats</p>
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
