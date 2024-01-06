'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

import { type User } from '@prisma/client';

interface ChatsProps {
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
}

const ChatsContext = createContext<ChatsContextProps>({
  chats: [],
  loading: false,
  setUpdatedChats: () => {}
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

  return (
    <ChatsContext.Provider value={{ chats, loading, setUpdatedChats }}>
      {children}
    </ChatsContext.Provider>
  );
}
