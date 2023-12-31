'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

import useSupabase from '@/hooks/useSupabase';
import { generateAvatar } from '@/lib/generateAvatar';
import { type User } from '@supabase/supabase-js';

interface UserContextProps {
  user: User;
  username: string;
  avatar: string;
}

const UserContext = createContext<UserContextProps>({
  user: {} as User,
  username: '',
  avatar: ''
});

export const useUser = () => {
  return useContext(UserContext);
};

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>({} as User);
  const [userAvatar, setUserAvatar] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const { session } = useSupabase();

  useEffect(() => {
    const fetchUserFromDb = async () => {
      const res = await axios.get('/api/user');
      setUsername(res.data.user.name);
      setUserAvatar(generateAvatar(res.data.user.name));
    };

    setUser(session?.user as User);
    fetchUserFromDb();
  }, [session]);

  return (
    <UserContext.Provider value={{ user, username, avatar: userAvatar }}>
      {children}
    </UserContext.Provider>
  );
}
