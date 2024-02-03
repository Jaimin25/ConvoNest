'use client';

import { useEffect } from 'react';

import NavigationSidebar from '../navigation/sidebar';
import { useMessages } from '../providers/messages-provider';
import { useSocket } from '../providers/socket-provider';
import { useUser } from '../providers/user-provider';

export default function Dashboard({ children }: { children: React.ReactNode }) {
  const { clearUnreadMessages } = useMessages();
  const { socket } = useSocket();
  const { user } = useUser();

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

  return (
    <div className="dashboard flex h-full w-full flex-col md:flex-row">
      <NavigationSidebar />
      {children}
    </div>
  );
}
