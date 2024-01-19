'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';

import { ChatsProps } from '@/components/providers/chats-provider';
import {
  MessagesProps,
  useMessages
} from '@/components/providers/messages-provider';
import { useUser } from '@/components/providers/user-provider';
import SkeletonMessage from '@/components/skeletons/message-skeleton';
import UserAvatar from '@/components/user-avatar';
import { cn, isImageOrGif, isURL } from '@/lib/utils';

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
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [messages, message]);

  return (
    <div className="mb-2 flex-1 space-y-2 overflow-y-auto px-2" ref={ref}>
      {loading ? (
        <SkeletonMessage />
      ) : (
        message &&
        chat &&
        message.messages.map((message) => {
          const isImage = isURL(message.content)
            ? isImageOrGif(message.content)
            : false;

          const sentAt = new Date(message.createdAt);
          return (
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
                {!isImage ? (
                  <div
                    className={cn(
                      'flex items-end gap-x-1 rounded-3xl bg-slate-500 p-3',
                      message.userId === user.id
                        ? 'rounded-br-md'
                        : 'rounded-bl-md'
                    )}
                  >
                    <div>
                      <p className="text-lg font-semibold">
                        {chat.isGroup &&
                          (chat.users.find(
                            (u) => u.id !== user.id && u.id === message.userId
                          )?.name as string)}
                      </p>
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <p className="text-[10px] text-gray-800">
                      {sentAt.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                ) : (
                  <Image
                    width="100"
                    height="100"
                    src={message.content}
                    alt="image"
                    className="h-100 w-100 m-2 aspect-auto rounded-2xl object-contain"
                  />
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
