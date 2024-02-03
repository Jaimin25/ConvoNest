'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import axios from 'axios';

import { ChatsProps } from '@/components/providers/chats-provider';
import {
  MessagesProps,
  useMessages
} from '@/components/providers/messages-provider';
import { useSocket } from '@/components/providers/socket-provider';
import { useUser } from '@/components/providers/user-provider';
import SkeletonMessage from '@/components/skeletons/message-skeleton';
import UserAvatar from '@/components/user-avatar';
import { cn, isImageOrGif, isURL } from '@/lib/utils';
import { TrashIcon } from '@heroicons/react/24/solid';

export default function MessageList({
  message,
  chat
}: {
  message: MessagesProps;
  chat: ChatsProps;
}) {
  const { user } = useUser();
  const { messages, loading, removeMessage } = useMessages();
  const { socket } = useSocket();

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [message, messages]);

  const handleDeleteMessage = (id: number) => {
    const deleteMessage = async () => {
      const res = await axios.delete('/api/user/message', {
        data: {
          messageId: id,
          chatId: message.chatId
        }
      });

      if (res.data.statusCode === 200) {
        socket?.emit(`chat:${user.id}:send-delete-message`, {
          chatId: message.chatId,
          messageId: id,
          users: chat.users.filter((chatUser) => chatUser.id !== user.id)
        });
        removeMessage(message.chatId, id);
      }
    };
    deleteMessage();
  };

  return (
    <div className="mb-2 flex-1 space-y-2 overflow-y-scroll px-2" ref={ref}>
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
                message.userId === user.id &&
                  'group flex place-content-end hover:cursor-pointer '
              )}
            >
              <div
                className={cn(
                  'flex w-4/5 gap-x-2  sm:w-1/2',
                  message.userId === user.id && '  place-content-end'
                )}
              >
                {message.userId === user.id && (
                  <div
                    className="hidden self-center group-hover:block"
                    onClick={() => handleDeleteMessage(message.id)}
                  >
                    <TrashIcon className="h-5 w-5 text-rose-500" />
                  </div>
                )}

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
                    width="175"
                    height="100"
                    src={message.content}
                    alt="image"
                    className="m-2 aspect-auto rounded-2xl object-contain"
                    priority
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
