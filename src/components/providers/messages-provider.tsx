'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';

import { Messages } from '@prisma/client';

import { useChats } from './chats-provider';
import { useSocket } from './socket-provider';
import { useUser } from './user-provider';
export interface MessagesProps {
  chatId: string;
  messages: Messages[];
}

export interface UnreadMessages {
  chatId: string;
  count: number;
}

interface MessagesContextProps {
  messages: { chatId: string; messages: Messages[] }[];
  loading: boolean;
  unreadMessages: UnreadMessages[];
  addMessages: (chatId: string) => void;
  clearUnreadMessages: (chatId: string) => void;
  updateMessages: (chatId: string, data: Messages) => void;
}

const MessagesContext = createContext<MessagesContextProps>({
  messages: [],
  loading: false,
  unreadMessages: [],
  addMessages: () => {},
  clearUnreadMessages: () => {},
  updateMessages: () => {}
});

export const useMessages = () => {
  return useContext(MessagesContext);
};

export default function MessagesProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [messages, setMessages] = useState<MessagesProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [unreadMessages, setUnreadMessages] = useState<UnreadMessages[]>([]);

  const { user } = useUser();
  const { socket } = useSocket();
  const { setLastMessage, chats } = useChats();

  const location = usePathname();

  useEffect(() => {
    const unreadMessages = localStorage.getItem('unread-messages');
    if (unreadMessages) {
      setUnreadMessages(JSON.parse(unreadMessages));
    }
  }, []);

  useEffect(() => {
    socket?.on(`chat:${user.id}:receive-message`, (data) => {
      const currentChatId = location
        .substring(location.indexOf('/c/') + 3, location.length)
        .toString();
      const message = messages.find(
        (message) => message.chatId === data.chatId
      );
      if (message) {
        message.messages.push(data);
        setMessages([...messages, message]);
      } else {
        const loadMessages = async () => {
          const msgs = await fetchMessages(data.chatId);
          if (msgs) {
            msgs.push(data);
          }
          setMessages([
            ...messages,
            {
              chatId: data.chatId,
              messages: msgs
            }
          ]);
        };
        loadMessages();
      }

      if (currentChatId !== data.chatId) {
        const chat = chats.find((chat) => chat.id === data.chatId);
        const toast_msg = chat?.isGroup
          ? 'Message in ' + chat?.name
          : chat?.users.find((us) => us.id !== user.id)?.name +
            ' sent you a message';
        toast.info(`${toast_msg}`);
      }

      if (data.chatId !== currentChatId) {
        const unreadChat = unreadMessages.find(
          (messages) => messages.chatId === data.chatId
        );

        if (unreadChat) {
          unreadChat.count += 1;
          setUnreadMessages((prevMessages) =>
            prevMessages.map((item) =>
              item.chatId === data.chatId ? unreadChat : item
            )
          );
          localStorage.setItem(
            'unread-messages',
            JSON.stringify(unreadMessages)
          );
        } else {
          setUnreadMessages([
            ...unreadMessages,
            { chatId: data.chatId, count: 1 }
          ]);
          localStorage.setItem(
            'unread-messages',
            JSON.stringify([
              ...unreadMessages,
              { chatId: data.chatId, count: 1 }
            ])
          );
        }
      }
      setLastMessage(data.chatId, data.content);
    });

    return () => {
      socket?.off(`chat:${user.id}:receive-message`);
    };
  }, [socket, user, messages, setLastMessage, location, unreadMessages, chats]);

  const fetchMessages = async (chatId: string) => {
    const res = await axios.get('/api/user/message', {
      params: {
        chatId
      }
    });
    if (res.data.statusCode === 200) {
      return await res.data.messages;
    } else {
      setLoading(false);
    }
  };

  const addMessages = (chatId: string) => {
    const fetchMessages = async () => {
      setLoading(true);
      const res = await axios.get('/api/user/message', {
        params: {
          chatId
        }
      });
      if (res.data.statusCode === 200) {
        setLoading(false);
        setMessages((messages) => [
          ...messages,
          {
            chatId: chatId,
            messages: res.data.messages
          }
        ]);
      } else if (res.data.statusCode === 403) {
        setLoading(false);
      }
      setLoading(false);
    };

    if (!messages.some((message) => message.chatId === chatId)) {
      fetchMessages();
    } else {
      // console.log(messages);
    }
  };

  const updateMessages = (chatId: string, data: Messages) => {
    const message = messages.find((message) => message.chatId === chatId);
    if (message) {
      message.messages.push(data);
      setMessages([...messages, message]);
    }
  };

  const clearUnreadMessages = (chatId: string) => {
    const index = unreadMessages.findIndex((msgs) => msgs.chatId === chatId);

    if (index === -1) return;
    unreadMessages.splice(index, 1);
    setUnreadMessages([...unreadMessages]);
    localStorage.setItem('unread-messages', JSON.stringify(unreadMessages));
  };

  return (
    <MessagesContext.Provider
      value={{
        messages,
        loading,
        addMessages,
        updateMessages,
        unreadMessages,
        clearUnreadMessages
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
}