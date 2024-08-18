import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';

import { ChatsProps } from '@/components/providers/chats-provider';
import { useMessages } from '@/components/providers/messages-provider';
import { useSocket } from '@/components/providers/socket-provider';
import { useUser } from '@/components/providers/user-provider';
import UserAvatar from '@/components/user-avatar';
import {
  cn,
  containsUrlRegex,
  isImageOrGif,
  isURL,
  msgContainsUrl
} from '@/lib/utils';
import { Messages } from '@prisma/client';

interface PreviewData {
  title: string;
  description: string;
  image: string;
  domain: string;
}

export default function Message({
  message,
  chat
}: {
  message: Messages;

  chat: ChatsProps;
}) {
  const { user } = useUser();
  const { socket } = useSocket();
  const { removeMessage } = useMessages();
  const [previews, setPreviews] = useState<Record<string, PreviewData | null>>(
    {}
  );

  const isImage = isURL(message.content)
    ? isImageOrGif(message.content)
    : false;

  const sentAt = new Date(message.createdAt);

  useEffect(() => {
    const getPreview = async (url: string) => {
      if (!url) {
        return;
      }

      if (!/^https?:\/\//i.test(url)) {
        return;
      }
      const parser = new DOMParser();
      const response = await fetch(url);
      const data = await response.text();
      const document = parser.parseFromString(data, 'text/html');

      const titleMatch =
        document.querySelector('meta[name="og:title"]') ||
        document.querySelector('meta[property="og:title"]') ||
        document.querySelector('meta[name="twitter:title"]') ||
        document.querySelector('meta[property="twitter:title"]');

      const descriptionMatch =
        document.querySelector('meta[name="og:description"]') ||
        document.querySelector('meta[property="og:description"]') ||
        document.querySelector('meta[name="twitter:description"]') ||
        document.querySelector('meta[property="twitter:description"]');

      const imageMatch =
        document.querySelector('meta[name="og:image"]') ||
        document.querySelector('meta[property="og:image"]') ||
        document.querySelector('meta[name="twitter:image"]') ||
        document.querySelector('meta[name="twitter:image:src"]') ||
        document.querySelector('meta[property="twitter:image"]') ||
        document.querySelector('meta[property="twitter:image:src"]');

      const title = titleMatch ? titleMatch.getAttribute('content') : '';
      const description = descriptionMatch
        ? descriptionMatch.getAttribute('content')
        : '';
      const image = imageMatch ? imageMatch.getAttribute('content') : '';
      const domain = new URL(msgContainsUrl(message.content) as string)
        .hostname;

      setPreviews((prev) => ({
        ...prev,
        [message.id]: { title, description, image, domain }
      }));
    };

    if (msgContainsUrl(message.content)) {
      console.log(msgContainsUrl(message.content));
      getPreview(msgContainsUrl(message.content) as string);
    }
  }, [message.content]);

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
          'flex w-[90%] gap-x-2',
          message.userId === user.id && '  place-content-end'
        )}
      >
        <UserAvatar
          username={
            chat.users.find((u) => u.id === message.userId)?.name as string
          }
          className={cn(
            'mt-auto h-8 w-8 rounded-full',
            message.userId === user.id && 'order-2'
          )}
        />
        {!isImage ? (
          <div>
            <div
              className={cn(
                'items-end gap-x-1 rounded-3xl bg-slate-500 p-3',
                message.userId === user.id ? 'rounded-br-md' : 'rounded-bl-md'
              )}
            >
              <div>
                <p className="text-lg font-semibold">
                  {chat.isGroup &&
                    (chat.users.find(
                      (u) => u.id !== user.id && u.id === message.userId
                    )?.name as string)}
                </p>
                {isURL(message.content) ? (
                  <a
                    href={
                      message.content.startsWith('http')
                        ? message.content
                        : `http://${message.content}`
                    }
                    target="_blank"
                    className="text-blue-500 underline hover:no-underline"
                  >
                    {message.content}
                  </a>
                ) : msgContainsUrl(message.content) ? (
                  <div>
                    {message.content
                      .split(containsUrlRegex)
                      .filter(
                        (item, index, array) =>
                          item && array.indexOf(item) === index
                      )
                      .map((part, index) =>
                        containsUrlRegex.test(part) ? (
                          <a
                            key={index}
                            href={
                              part.startsWith('http') ? part : `http://${part}`
                            }
                            target="_blank"
                            className="text-blue-500 underline hover:no-underline"
                          >
                            {part}
                          </a>
                        ) : (
                          part
                        )
                      )}
                  </div>
                ) : (
                  <p className="break-all text-sm">{message.content}</p>
                )}
                {previews[message.id] &&
                  previews[message.id]!.image !== '' &&
                  previews[message.id]!.title && (
                    <div key={message.id} className="preview-container">
                      <div className="relative">
                        <img
                          src={previews[message.id]!.image}
                          width={400}
                          className="aspect-video w-full rounded-lg object-fill"
                          alt={previews[message.id]!.title}
                        />
                        <div className="absolute bottom-4 left-4 flex justify-between rounded-md bg-black bg-opacity-60 p-2 text-white">
                          <strong className="max-w-[70%] truncate text-sm md:max-w-max">
                            {previews[message.id]!.title}
                          </strong>
                        </div>
                      </div>
                    </div>
                  )}
              </div>
              <div className="flex place-content-end">
                <p className="text-[10px] text-gray-800">
                  {sentAt.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>

            {message.userId === user.id && (
              <div
                className="hidden justify-end self-center group-hover:flex"
                onClick={() => handleDeleteMessage(message.id)}
              >
                <p className="text-rose-500 underline hover:no-underline">
                  delete
                </p>
              </div>
            )}
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
}
