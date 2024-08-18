'use client';

import React, { useEffect, useRef } from 'react';

import { ChatsProps } from '@/components/providers/chats-provider';
import {
  MessagesProps,
  useMessages
} from '@/components/providers/messages-provider';
import SkeletonMessage from '@/components/skeletons/message-skeleton';

import Message from './message';

export default function MessageList({
  message,
  chat
}: {
  message: MessagesProps;
  chat: ChatsProps;
}) {
  const { messages, loading } = useMessages();

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [message, messages]);

  return (
    <div className="mb-2 flex-1 space-y-2 overflow-y-scroll px-2" ref={ref}>
      {loading && chat ? (
        <SkeletonMessage />
      ) : (
        message &&
        chat &&
        message.messages.map((message) => (
          <Message message={message} chat={chat} key={message.id} />
        ))
      )}
    </div>
  );
}
