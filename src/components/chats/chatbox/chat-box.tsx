'use client';

import React from 'react';

import ConvoInfoModal from '@/components/modals/conversation-info-modal';
import { ChatsProps, useChats } from '@/components/providers/chats-provider';
import { useContacts } from '@/components/providers/contacts-provider';
import {
  MessagesProps,
  useMessages
} from '@/components/providers/messages-provider';
import { useUser } from '@/components/providers/user-provider';
import { SocketIndicator } from '@/components/socket-indicator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import ChatInput from './chat-input';
import MessageList from './message-list';

export default function ChatBox({ chatId }: { chatId: string }) {
  const { user } = useUser();
  const { chats } = useChats();
  const { messages, error } = useMessages();

  const chat = chats.find((chat) => chat.id === chatId) as ChatsProps;

  const message =
    chat &&
    (messages.find((message) => message.chatId === chat.id) as MessagesProps);

  const receiver = user
    ? chat?.isGroup
      ? chat?.name
      : chat?.users[0].id === user.id
        ? chat?.users[1].name
        : chat?.users[0].name
    : null;

  const { contacts } = useContacts();

  const checkContact = chat?.isGroup
    ? true
    : contacts.find(
        (contact) =>
          (contact.user1Id === chat?.users[0].id &&
            contact.user2Id === chat?.users[1].id) ||
          (contact.user1Id === chat?.users[1].id &&
            contact.user2Id === chat?.users[0].id)
      );

  if (error) {
    return (
      <div className="w-full flex-1 px-4 py-4 md:mr-4 md:px-0">
        <Card className="h-full w-full flex-1 border-0 pb-16 md:pb-20 dark:bg-black/50">
          <CardContent className="h-full flex-1 px-2 md:px-6">
            <div className="flex h-full flex-1 items-center justify-center text-lg text-red-500">
              {error}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full flex-1 px-4 py-4 md:mr-4 md:px-0">
      <Card className="h-full w-full flex-1 border-0 pb-16 md:pb-20 dark:bg-black/50">
        <CardHeader className="flex-1 pt-2 md:p-4 md:px-6 md:pt-6">
          <CardTitle className="ml-8 flex items-center md:ml-0">
            {receiver}
            <div className="relative mr-2 flex flex-1 items-center justify-end p-1">
              <SocketIndicator />
            </div>
            <ConvoInfoModal chat={chat} />
          </CardTitle>
        </CardHeader>
        <CardContent className="h-full flex-1 px-2 md:px-6">
          <div className="flex h-full w-full flex-1 flex-col justify-center">
            <MessageList message={message} chat={chat} />

            <ChatInput chat={chat} disabled={!!checkContact} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
