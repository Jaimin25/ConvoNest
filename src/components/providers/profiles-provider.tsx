'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

import { useSocket } from './socket-provider';

interface UsersProps {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ProfilesContextProps {
  users: UsersProps[];
  loading: boolean;
  onlineUsers: [];
}

const ProfilesContext = createContext<ProfilesContextProps>({
  users: [],
  loading: false,
  onlineUsers: []
});

export const useProfiles = () => {
  return useContext(ProfilesContext);
};

export function ProfilesProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<UsersProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [onlineUsers, setOnlineUsers] = useState<[]>([]);
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    setLoading(true);
    const fetchUsers = async () => {
      const res = await axios.get('/api/user/fetch-all');
      setUsers(res.data.users);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    socket?.on('online-users', (data) => {
      setOnlineUsers(data);
    });

    if (!isConnected) {
      setOnlineUsers([]);
    }

    () => {
      socket?.off('online-users');
    };
  }, [socket, setOnlineUsers, isConnected]);

  return (
    <ProfilesContext.Provider value={{ users, loading, onlineUsers }}>
      {children}
    </ProfilesContext.Provider>
  );
}
