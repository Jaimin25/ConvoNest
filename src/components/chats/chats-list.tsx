'use client';

import React from 'react';
import { Braces } from 'lucide-react';

import { useChats } from '../providers/chats-provider';
import SkeletonProfile from '../skeletons/profile-skeleton';

import ChatsListItem from './chats-list-item';

export default function ChatsList() {
  const { loading, chats } = useChats();

  return (
    <div className="flex h-full w-full flex-col overflow-hidden pb-4">
      {loading ? (
        <SkeletonProfile />
      ) : (
        <div className="flex h-full flex-col overflow-y-auto">
          {chats.length > 0 ? (
            chats.map((chat) => (
              <ChatsListItem
                key={chat.id}
                id={chat.id}
                isGroup={chat.isGroup}
                adminId={chat.adminId}
                users={chat.users}
                name={chat.name}
                lastMessage={chat.lastMessage}
                createdAt={chat.createdAt}
                updatedAt={chat.updatedAt}
              />
            ))
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-y-1">
              <Braces className="h-5 w-5 text-gray-500" />
              <p>No Chats</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
