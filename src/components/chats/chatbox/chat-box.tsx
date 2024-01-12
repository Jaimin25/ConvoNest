'use client';

import React from 'react';

import ConvoInfoModal from '@/components/modals/conversation-info-modal';
import { ChatsProps, useChats } from '@/components/providers/chats-provider';
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
  const { messages } = useMessages();

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

  return (
    <div className="w-full flex-1 px-4 py-4 md:mr-4 md:px-0">
      <Card className="h-full w-full flex-1 border-0 pb-16 md:pb-20 dark:bg-black/50">
        <CardHeader className="flex-1 pt-2 md:p-4 md:px-6 md:pt-6">
          <CardTitle className="ml-8 flex items-center md:ml-0">
            {receiver}
            <div className="mr-2 flex w-full items-center justify-end">
              <SocketIndicator />
            </div>
            <ConvoInfoModal chat={chat} />
          </CardTitle>
        </CardHeader>
        <CardContent className="h-full flex-1 px-2 md:px-6">
          <div className="flex h-full w-full flex-1 flex-col justify-center">
            <MessageList message={message} chat={chat} />

            <ChatInput chat={chat} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
