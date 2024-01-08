'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { ChatsProps, useChats } from '@/components/providers/chats-provider';
import { useMessages } from '@/components/providers/messages-provider';
import { useSocket } from '@/components/providers/socket-provider';
import { useUser } from '@/components/providers/user-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { FaceSmileIcon, GifIcon } from '@heroicons/react/24/outline';

export default function ChatInput({ chat }: { chat: ChatsProps }) {
  const [loading, setLoading] = useState<boolean>(false);
  const { updateMessages } = useMessages();
  const { setLastMessage } = useChats();
  const { user } = useUser();
  const [messageVal, setMessageVal] = useState<string>('');
  const { socket } = useSocket();

  useEffect(() => {
    socket?.on(`chat:${user.id}:receive-message`, (data) => {
      updateMessages(data.chatId, data);
      setLastMessage(data.chatId, data.content);
    });

    return () => {
      socket?.off(`chat:${user.id}:receive-message`);
    };
  }, [socket, user, updateMessages, setLastMessage]);

  const handleSendMessage = () => {
    if (!messageVal) return;
    setLoading(true);
    const sendMessage = async () => {
      const res = await axios.post('/api/user/message', {
        chatId: chat.id,
        content: messageVal,
        userId: user.id
      });

      if (res.data.statusCode === 200) {
        socket?.emit(`chat:${user.id}:send-message`, {
          message: res.data.message,
          userId: chat.users
            .filter((users) => users.id !== user.id)
            .map((user) => user.id)
        });
        updateMessages(chat.id, res.data.message);
        setLastMessage(chat.id, messageVal);
        setMessageVal('');
        setLoading(false);
      } else {
        setLoading(false);
      }
      setLoading(false);
    };
    sendMessage();
  };

  return (
    <div className="flex w-full items-center gap-x-2">
      <GifIcon className="h-8 w-8 cursor-pointer" />
      <Popover>
        <PopoverTrigger>
          <FaceSmileIcon className="h-8 w-8 cursor-pointer" />
        </PopoverTrigger>
        <PopoverContent>
          {' '}
          <Picker
            data={data}
            onEmojiSelect={(emoji: data.Skin) => {
              setMessageVal(messageVal + emoji.native);
            }}
          />
        </PopoverContent>
      </Popover>

      <Input
        value={messageVal}
        className="outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
        onChange={(e) => setMessageVal(e.target.value)}
      />
      <Button
        disabled={loading}
        type="submit"
        variant={'ghost'}
        className="rounded-md bg-sky-500 p-3"
        onClick={handleSendMessage}
      >
        Send
      </Button>
    </div>
  );
}
