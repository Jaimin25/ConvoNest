import React from 'react';

import { Card, CardContent } from '@/components/ui/card';

export default function ChatsPage() {
  return (
    <div className="mr-4 h-full w-full flex-1 py-4 pl-4">
      <Card className="h-full w-full border-0 px-4 dark:bg-black/50">
        <CardContent className="h-full">
          <div className="flex h-full w-full flex-col items-center justify-center text-center">
            <p className="text-2xl">Your Messages</p>
            <p className="text-sm text-gray-400">
              Start chatting in existing chats or create a new one
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
