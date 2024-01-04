import React from 'react';

import Chats from '@/components/chats/chats';

export default function ChatPage({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full w-full">
      <Chats />
      {children}
    </div>
  );
}
