import React from 'react';

import { ChatsProps } from '@/components/providers/chats-provider';
import { MessagesProps } from '@/components/providers/messages-provider';
import { useUser } from '@/components/providers/user-provider';
import UserAvatar from '@/components/user-avatar';
import { cn } from '@/lib/utils';

export default function MessageList({
  messages,
  chat
}: {
  messages: MessagesProps;
  chat: ChatsProps;
}) {
  const { user } = useUser();

  return (
    <div className="mb-2 flex-1 space-y-2 overflow-y-auto px-2">
      {messages &&
        chat &&
        messages.messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'w-full',
              message.userId === user.id && ' flex place-content-end '
            )}
          >
            <div
              className={cn(
                'flex w-1/2 gap-x-2',
                message.userId === user.id && ' place-content-end '
              )}
            >
              <UserAvatar
                username={
                  chat.users[0].id === message.userId
                    ? chat.users[0].name
                    : chat.users[1].name
                }
                className={cn(
                  'mt-auto h-8 w-8 rounded-full',
                  message.userId === user.id && 'order-2'
                )}
              />
              <p
                className={cn(
                  'rounded-3xl bg-gray-500 p-3',
                  message.userId === user.id ? 'rounded-br-md' : 'rounded-bl-md'
                )}
              >
                {message.content}
              </p>
            </div>
          </div>
        ))}
    </div>
  );
}
