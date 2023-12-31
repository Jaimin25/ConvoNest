"use client";

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

interface UsersProps {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ProfilesContextProps {
  users: { id: string; name: string; createdAt: Date; updatedAt: Date }[];
  loading: boolean;
}

const ProfilesContext = createContext<ProfilesContextProps>({
  users: [],
  loading: false,
});

export const useProfiles = () => {
  return useContext(ProfilesContext);
};

export function ProfilesProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<UsersProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    const fetchUsers = async () => {
      const res = await axios.get("/api/user/fetch-all");
      console.log(res.data.users);
      setUsers(res.data.users);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  return (
    <ProfilesContext.Provider value={{ users, loading }}>
      {children}
    </ProfilesContext.Provider>
  );
}
