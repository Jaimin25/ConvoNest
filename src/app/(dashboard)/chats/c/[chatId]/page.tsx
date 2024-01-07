'use client';

import React, { useEffect } from 'react';

import ChatBox from '@/components/chats/chatbox/chat-box';
import { useMessages } from '@/components/providers/messages-provider';

export default function ChatBoxPage({
  params
}: {
  params: { chatId: string };
}) {
  const { addMessages } = useMessages();
  useEffect(() => {
    addMessages(params.chatId);
  }, [params.chatId, addMessages]);
  return <ChatBox chatId={params.chatId} />;
}
