'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

import useSupabase from '@/hooks/useSupabase';

import { useUser } from './user-provider';

interface SocketContextProps {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextProps>({
  socket: null,
  isConnected: false
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const { user } = useUser();
  const { session } = useSupabase();

  useEffect(() => {
    let newSocket: Socket;
    const URL =
      process.env.NODE_ENV === 'production'
        ? 'https://convonest-backend.onrender.com'
        : 'http://localhost:4000';
    if (user && user.id) {
      newSocket = io(URL as string, {
        query: {
          userId: user.id,
          token: session?.access_token
        }
      });
      newSocket.on('connect', () => {
        setIsConnected(true);
        newSocket.emit('get-online-users');
      });

      newSocket.on('disconnect', () => {
        setIsConnected(false);
        newSocket.emit('get-online-users');
      });
      setSocket(newSocket);
    }

    () => {
      newSocket.disconnect();
    };
  }, [user, session]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}
