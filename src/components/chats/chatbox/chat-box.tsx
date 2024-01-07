import React from 'react';
import { Info } from 'lucide-react';

import { ChatsProps, useChats } from '@/components/providers/chats-provider';
import {
  MessagesProps,
  useMessages
} from '@/components/providers/messages-provider';
import { useUser } from '@/components/providers/user-provider';
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
      <Card className="h-full w-full flex-1 border-0 dark:bg-black/50">
        <CardHeader className="mb-3 pt-4 md:mb-0 md:p-6">
          <CardTitle className="ml-8 flex md:ml-0">
            {receiver}
            <Info className="ml-auto h-5 w-5" />
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[87%] flex-1">
          <div className="flex h-full w-full flex-col justify-center">
            <MessageList message={message} chat={chat} />

            <ChatInput chatId={chatId} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
