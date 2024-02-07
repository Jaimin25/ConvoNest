import React from 'react';
import { Menu } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';

export default function ChatsPage() {
  return (
    <div className="mr-4 h-full w-full flex-1 py-3 pl-4 md:pl-0">
      <Card className="h-full w-full border-0 px-3 dark:bg-black/50">
        <CardContent className="h-full">
          <div className="flex h-full w-full flex-col items-center justify-center gap-y-2 text-center">
            <p className="text-2xl">Your Messages</p>
            <p className="text-sm text-gray-400">
              Start chatting in existing chats or create a new one{' '}
            </p>
            <p className="flex justify-center gap-x-1 text-sm text-gray-400 md:hidden">
              Click on <Menu className="h-5 w-5 text-white" /> to access your
              chats
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
