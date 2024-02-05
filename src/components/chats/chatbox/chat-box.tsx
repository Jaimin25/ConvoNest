'use client';

import React, { useEffect, useState } from 'react';

import ConvoInfoModal from '@/components/modals/conversation-info-modal';
import { ChatsProps, useChats } from '@/components/providers/chats-provider';
import { useContacts } from '@/components/providers/contacts-provider';
import {
  MessagesProps,
  useMessages
} from '@/components/providers/messages-provider';
import { useProfiles } from '@/components/providers/profiles-provider';
import { useSocket } from '@/components/providers/socket-provider';
import { useUser } from '@/components/providers/user-provider';
import { SocketIndicator } from '@/components/socket-indicator';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import ChatInput from './chat-input';
import MessageList from './message-list';

export default function ChatBox({ chatId }: { chatId: string }) {
  const { socket } = useSocket();
  const { user } = useUser();
  const { chats } = useChats();
  const { messages, error } = useMessages();
  const { onlineUsers } = useProfiles();
  const [userIsTyping, setUserIsTyping] = useState<boolean>(false);
  const [userTyping, setUserTyping] = useState<string>('');
  const [currentChatIdTyping, setCurrentChatIdTyping] = useState<string>('');
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

  useEffect(() => {
    socket?.on(
      `chat:${user.id}:receive-typing`,
      (userId, typingState, chatId) => {
        setUserIsTyping(typingState);
        setCurrentChatIdTyping(chatId);
        setUserTyping(
          chat?.users.find((user) => user.id === userId)?.name as string
        );
      }
    );

    socket?.on(
      `chat:${user.id}:receive-stop-typing`,
      (userId, typingState, chatId) => {
        setUserIsTyping(typingState);
        setCurrentChatIdTyping(chatId);
        console.log(userId, typingState);
      }
    );
    () => {
      socket?.off(`chat:${user.id}:receive-typing`);
      socket?.off(`chat:${user.id}:receive-stop-typing`);
    };
  }, [socket, chat]);

  if (error) {
    return (
      <div className="w-full flex-1 px-3 py-3 md:mr-4 md:px-0" id="chat-box">
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
    <div className="w-full flex-1 px-3 py-3 md:mr-4 md:px-0" id="chat-box">
      <Card className="h-full w-full flex-1 border-0 pb-16 md:pb-20 dark:bg-black/50">
        <CardHeader className="flex-1 pb-2 pr-2 pt-2 md:p-4 md:px-6 md:pt-6">
          <CardTitle className="ml-8 flex items-center md:ml-0">
            <div className={'flex flex-col items-start gap-x-2'}>
              <div className="flex items-center gap-x-1">
                {receiver}

                {chat && chat ? (
                  !chat.isGroup ? (
                    onlineUsers.some(
                      (userId) =>
                        userId !== user.id &&
                        (chat?.users[0].id === userId ||
                          chat?.users[1].id === userId)
                    ) ? (
                      <Badge
                        variant={'outline'}
                        className="flex  h-5 justify-center bg-emerald-500 text-xs"
                      >
                        online
                      </Badge>
                    ) : (
                      <Badge
                        variant={'outline'}
                        className="flex bg-red-500 text-xs"
                      >
                        offline
                      </Badge>
                    )
                  ) : (
                    <span className="text-xs text-gray-500">
                      •{' '}
                      {
                        onlineUsers.filter(
                          (userId) =>
                            chat?.users.some((user) => user.id === userId)
                        ).length
                      }{' '}
                      online
                    </span>
                  )
                ) : null}
              </div>
              {chat ? (
                chat.id === currentChatIdTyping ? (
                  chat.isGroup ? (
                    userIsTyping ? (
                      <span className="text-xs text-gray-500">
                        {userTyping + ' is typing...'}
                      </span>
                    ) : null
                  ) : (
                    userIsTyping && (
                      <span className="text-xs text-gray-500">
                        {' typing...'}
                      </span>
                    )
                  )
                ) : null
              ) : null}
            </div>

            <div className="relative mr-2 flex flex-1 items-center justify-end p-1">
              <SocketIndicator />
            </div>
            <ConvoInfoModal chat={chat} />
          </CardTitle>
        </CardHeader>
        <div className="px-5">
          <Separator className="px-5" />
        </div>
        <CardContent className="h-full flex-1 px-2 pt-2 md:px-6">
          <div className="flex h-full w-full flex-1 flex-col justify-center">
            <MessageList message={message} chat={chat} />

            <ChatInput chat={chat} disabled={!!checkContact} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
