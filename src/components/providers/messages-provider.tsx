'use client';

import { createContext, useContext, useState } from 'react';
import axios from 'axios';

import { Messages } from '@prisma/client';

interface MessagesContextProps {
  messages: { chatId: string; messages: Messages[] }[];
  addMessages: (chatId: string) => void;
  updateMessages: (chatId: string, data: Messages) => void;
}

export interface MessagesProps {
  chatId: string;
  messages: Messages[];
}

const MessagesContext = createContext<MessagesContextProps>({
  messages: [],
  addMessages: () => {},
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

  const addMessages = (chatId: string) => {
    const fetchMessages = async () => {
      console.log('this is called');
      const res = await axios.get('/api/user/message', {
        params: {
          chatId
        }
      });
      if (res.data.statusCode === 200) {
        setMessages((messages) => [
          ...messages,
          {
            chatId: chatId,
            messages: res.data.messages
          }
        ]);
      } else if (res.data.statusCode === 403) {
        // console.log(res.data);
      }
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

  return (
    <MessagesContext.Provider value={{ messages, addMessages, updateMessages }}>
      {children}
    </MessagesContext.Provider>
  );
}
