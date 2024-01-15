'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

import { type FriendRequests } from '@prisma/client';

import { useProfiles } from './profiles-provider';
import { useSocket } from './socket-provider';
import { useUser } from './user-provider';

export type FriendRequestsProps = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  senderId: string;
  receiverId: string;
  username: string;
};

interface RequestsContextProps {
  loading?: boolean;
  requests: FriendRequestsProps[];
  setUpdatedRequests: (data: FriendRequestsProps) => void;
  deleteRequest: (id: string) => void;
}

const RequestsContext = createContext<RequestsContextProps>({
  requests: [],
  setUpdatedRequests: () => {},
  deleteRequest: () => {}
});

export const useRequests = () => {
  return useContext(RequestsContext);
};

export function RequestsProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState<boolean>(true);
  const [requests, setRequests] = useState<FriendRequestsProps[]>([]);

  const { user } = useUser();
  const { users } = useProfiles();

  const { socket } = useSocket();

  useEffect(() => {
    console.log(socket);
    socket?.on(`user:${user.id}:receive-request`, (data) => {
      toast.info(`${data.username} sent you a friend request`);
      setRequests([...requests, data]);
    });

    socket?.on(`user:${user.id}:cancel-request`, (data) => {
      const index = requests.findIndex((request) => request.id === data);

      requests.splice(index, 1);
      setRequests([...requests]);
    });

    socket?.on(`user:${user.id}:receive-accept-request`, (data) => {
      const index = requests.findIndex((request) => request.id === data.id);
      requests.splice(index, 1);
      setRequests([...requests]);
    });

    () => {
      socket?.off(`user:${user.id}:receive-request`);
    };
  }, [socket, user, setRequests]);

  useEffect(() => {
    setLoading(true);
    const fetchRequests = async () => {
      const res = await axios.get('/api/user/request');
      const requests = res.data.requests;

      if (users.length > 0) {
        const updatedList: FriendRequestsProps[] = requests.map(
          (request: FriendRequests) => {
            const matchingUser = users.find(
              (user) =>
                user.id === request.receiverId || user.id === request.senderId
            );
            return {
              ...request,
              username: matchingUser ? matchingUser.name : null
            };
          }
        );
        setRequests(updatedList);
        setLoading(false);
      }
    };
    fetchRequests();
  }, [user, users]);

  const setUpdatedRequests = (data: FriendRequestsProps) => {
    setRequests([...requests, data]);
  };

  const deleteRequest = (id: string) => {
    const index = requests.findIndex((request) => request.id === id);

    requests.splice(index, 1);
    setRequests([...requests]);
  };

  return (
    <RequestsContext.Provider
      value={{ loading, requests, setUpdatedRequests, deleteRequest }}
    >
      {children}
    </RequestsContext.Provider>
  );
}
