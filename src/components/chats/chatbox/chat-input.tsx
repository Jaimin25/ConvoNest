'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { X } from 'lucide-react';
import { toast } from 'sonner';

import { GifModal } from '@/components/modals/gif-modal';
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

export default function ChatInput({
  chat,
  disabled
}: {
  chat: ChatsProps;
  disabled?: boolean;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [messageVal, setMessageVal] = useState<string>('');
  const [gifUrl, setGifUrl] = useState<string>('');

  const { updateMessages } = useMessages();
  const { setLastMessage } = useChats();
  const { user } = useUser();
  const { socket } = useSocket();

  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isTyping) {
        if (!chat) return;

        socket?.emit(
          `chat:${user.id}:send-typing`,
          chat?.users
            .filter((users) => users.id !== user.id)
            .map((user) => user.id),
          chat?.id
        );
      } else {
        if (!chat) return;
        socket?.emit(
          `chat:${user.id}:send-stop-typing`,
          chat?.users
            .filter((users) => users.id !== user.id)
            .map((user) => user.id),
          chat?.id
        );
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [isTyping, socket]);

  const sendMessage = async (content: string) => {
    const res = await axios.post('/api/user/message', {
      chatId: chat.id,
      content: content,
      userId: user.id
    });

    if (res.data.statusCode === 200) {
      socket?.emit(`chat:${user.id}:send-message`, {
        chat: chat,
        message: res.data.message,
        userId: chat.users
          .filter((users) => users.id !== user.id)
          .map((user) => user.id)
      });
      updateMessages(chat.id, res.data.message);
      setLastMessage(chat.id, content);
      setMessageVal('');
      setGifUrl('');
      setLoading(false);
    } else {
      toast.error(res.data.error);
      setMessageVal('');
      setGifUrl('');
      setLoading(false);
    }
    setLoading(false);
  };

  const handleSendMessage = () => {
    if (!messageVal && !gifUrl) return;
    setIsTyping(false);
    setLoading(true);
    if (messageVal && gifUrl) {
      sendMessage(gifUrl);
      setTimeout(() => sendMessage(messageVal), 200);
    } else if (messageVal) {
      sendMessage(messageVal);
    } else if (gifUrl) {
      sendMessage(gifUrl);
    }
  };

  if (!disabled || !chat)
    return (
      <div className="flex w-full cursor-not-allowed items-center gap-x-2">
        <Input
          value={'This user is not in your contact list'}
          className="outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
          disabled={true}
          onChange={(e) => setMessageVal(e.target.value)}
        />
      </div>
    );

  return (
    <div className="flex w-full flex-col gap-x-2">
      {gifUrl && (
        <div className="flex">
          <div className="relative">
            <Image
              src={gifUrl}
              alt="gif"
              width={200}
              height={200}
              className="m-2 aspect-video rounded-xl object-contain"
              priority
            />
            <Button
              className="absolute right-0 top-0 h-6 w-6 rounded-full p-0"
              onClick={() => setGifUrl('')}
            >
              <X className="h-4 w-5" />
            </Button>
          </div>
        </div>
      )}
      <div className="flex w-full items-center justify-center gap-x-1 md:gap-x-2">
        <GifModal setGifUrl={setGifUrl}>
          <GifIcon className="h-6 w-6 cursor-pointer" />
        </GifModal>
        <Popover>
          <PopoverTrigger>
            <FaceSmileIcon className="hidden h-6 w-6 cursor-pointer md:block" />
          </PopoverTrigger>
          <PopoverContent className="w-auto rounded-xl p-0">
            <Picker
              data={data}
              onEmojiSelect={(emoji: data.Skin) => {
                setMessageVal(messageVal + emoji.native);
              }}
            />
          </PopoverContent>
        </Popover>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex w-full gap-x-2"
        >
          <Input
            autoComplete="off"
            id="input"
            value={messageVal}
            className="flex-1 outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            onSubmit={() => {
              handleSendMessage();
            }}
            onChange={(e) => {
              setMessageVal(e.target.value);
              setIsTyping(true);
              setTimeout(() => setIsTyping(false), 3000);
            }}
          />
          {chat && (
            <Button
              disabled={loading}
              type="submit"
              variant={'ghost'}
              className="rounded-md bg-sky-500 p-3"
              onClick={handleSendMessage}
            >
              Send
            </Button>
          )}
        </form>
      </div>
    </div>
  );
}
