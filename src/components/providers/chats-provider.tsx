'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

import { type User } from '@prisma/client';

export interface ChatsProps {
  id: string;
  isGroup: boolean;
  name: string | null;
  adminId: string | null;
  lastMessage: string | null;
  createdAt: Date;
  updatedAt: Date;
  users: User[];
}

interface ChatsContextProps {
  chats: ChatsProps[];
  loading: boolean;
  setUpdatedChats: (data: ChatsProps) => void;
  setLastMessage: (chatId: string, message: string) => void;
}

const ChatsContext = createContext<ChatsContextProps>({
  chats: [],
  loading: false,
  setUpdatedChats: () => {},
  setLastMessage: () => {}
});

export const useChats = () => {
  return useContext(ChatsContext);
};

export function ChatsProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState<boolean>(true);
  const [chats, setChats] = useState<ChatsProps[]>([]);

  useEffect(() => {
    setLoading(true);
    const fetchChats = async () => {
      const res = await axios.get('/api/user/chat');
      const chats = res.data.chats;

      setChats(chats);
      setLoading(false);
    };
    fetchChats();
  }, []);

  const setUpdatedChats = (data: ChatsProps) => {
    setChats([...chats, data]);
  };

  const setLastMessage = (chatId: string, message: string) => {
    const newChats = chats.map((chat) => {
      if (chat.id === chatId) {
        return {
          ...chat,
          lastMessage: message,
          updatedAt: new Date()
        };
      } else {
        return chat;
      }
    });
    newChats.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
    console.log(newChats);
    setChats(newChats);
  };

  return (
    <ChatsContext.Provider
      value={{ chats, loading, setUpdatedChats, setLastMessage }}
    >
      {children}
    </ChatsContext.Provider>
  );
}
