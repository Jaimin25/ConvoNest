'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import { type FriendRequests } from '@prisma/client';

import { useProfiles } from './profiles-provider';
import { useUser } from './user-provider';

export type UpdatedFriendRequests = {
  id: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  senderId: string;
  receiverId: string;
  receiverName: string;
  senderName: string;
};

interface RequestsContextProps {
  requests: UpdatedFriendRequests[];
}

const RequestsContext = createContext<RequestsContextProps>({ requests: [] });

export const useRequests = () => {
  return useContext(RequestsContext);
};

export function RequestsProvider({ children }: { children: React.ReactNode }) {
  const [requests, setRequests] = useState<UpdatedFriendRequests[]>([]);

  const { user } = useUser();

  const { users } = useProfiles();

  useEffect(() => {
    const fetchRequests = async () => {
      const res = await fetch('/api/user/request');
      const requests = await res.json();
      if (users.length > 0) {
        const updatedList: UpdatedFriendRequests[] = requests.allRequests.map(
          (request: FriendRequests) => {
            const matchingUser = users.find(
              (user) =>
                user.id === request.receiverId || user.id === request.senderId
            );
            return {
              ...request,
              receiverName: matchingUser ? matchingUser.name : null,
              senderName: matchingUser ? matchingUser.name : null
            };
          }
        );
        setRequests(updatedList);
      }
    };

    fetchRequests();
  }, [user, users]);

  return (
    <RequestsContext.Provider value={{ requests }}>
      {children}
    </RequestsContext.Provider>
  );
}
