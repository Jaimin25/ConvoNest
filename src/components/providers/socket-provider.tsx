'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

import { useUser } from './user-provider';

interface SocketContextProps {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextProps>({ socket: null });

export const useSocket = () => {
  return useContext(SocketContext);
};

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { user } = useUser();
  useEffect(() => {
    const URL =
      process.env.NODE_ENV === 'production'
        ? 'https://convonest-backend.onrender.com'
        : 'https://convonest-backend.onrender.com';
    if (user && user.id) {
      const newSocket = io(URL as string, {
        query: {
          userId: user.id
        }
      });
      setSocket(newSocket);
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}
