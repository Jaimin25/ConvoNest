import React from 'react';

import Chats from '@/components/chats/chats';

export default function ChatPage({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-[85%] w-full flex-1 md:h-full">
      <Chats />
      {children}
    </div>
  );
}
