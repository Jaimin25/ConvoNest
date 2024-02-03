'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';

import { type User } from '@prisma/client';

import { useSocket } from './socket-provider';
import { useUser } from './user-provider';

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
  removeChat: (chatId: string) => void;
}

const ChatsContext = createContext<ChatsContextProps>({
  chats: [],
  loading: false,
  setUpdatedChats: () => {},
  setLastMessage: () => {},
  removeChat: () => {}
});

export const useChats = () => {
  return useContext(ChatsContext);
};

export function ChatsProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState<boolean>(true);
  const [chats, setChats] = useState<ChatsProps[]>([]);
  const router = useRouter();

  const { socket } = useSocket();
  const { user } = useUser();

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
    chats.unshift(data);
    setChats([...chats]);
  };

  const removeChat = useCallback(
    (chatId: string) => {
      const index = chats.findIndex((chat) => chat.id === chatId);
      if (index === -1) return;
      chats.splice(index, 1);
      setChats([...chats]);
    },
    [setChats, chats]
  );

  const prevChat = useRef(chats);

  useEffect(() => {
    socket?.on(`chat:${user.id}:receive-delete-chat`, (chatId) => {
      removeChat(chatId);
      if (window.location.pathname.includes('/chats/c')) {
        router.push('/chats');
      }
      if (prevChat.current.length === chats.length) {
        if (window.location.pathname === `/chats/c/${chatId}`) {
          toast.info('Chat has been deleted');
        }
      }
    });

    return () => {
      socket?.off(`chat:${user.id}:recieve-delete-chat`);
    };
  }, [socket, user, removeChat, prevChat, chats]);

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
    setChats(newChats);
  };

  return (
    <ChatsContext.Provider
      value={{ chats, loading, setUpdatedChats, setLastMessage, removeChat }}
    >
      {children}
    </ChatsContext.Provider>
  );
}
