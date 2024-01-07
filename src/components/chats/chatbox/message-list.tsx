'use client';

import React, { useEffect, useRef } from 'react';

import { ChatsProps } from '@/components/providers/chats-provider';
import {
  MessagesProps,
  useMessages
} from '@/components/providers/messages-provider';
import { useUser } from '@/components/providers/user-provider';
import SkeletonMessage from '@/components/skeletons/message-skeleton';
import UserAvatar from '@/components/user-avatar';
import { cn } from '@/lib/utils';

export default function MessageList({
  message,
  chat
}: {
  message: MessagesProps;
  chat: ChatsProps;
}) {
  const { user } = useUser();
  const { messages, loading } = useMessages();

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('work');
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [messages, message]);

  return (
    <div
      className="mb-2 flex-1 space-y-2 overflow-y-auto scroll-smooth px-2"
      ref={ref}
    >
      {loading ? (
        <SkeletonMessage />
      ) : (
        message &&
        chat &&
        message.messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'w-full',
              message.userId === user.id && ' flex place-content-end '
            )}
          >
            <div
              className={cn(
                'flex w-4/5 gap-x-2 sm:w-1/2',
                message.userId === user.id && ' place-content-end '
              )}
            >
              <UserAvatar
                username={
                  chat.users.find((u) => u.id === message.userId)
                    ?.name as string
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
        ))
      )}
    </div>
  );
}
