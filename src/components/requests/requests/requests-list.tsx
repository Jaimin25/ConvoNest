'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { Check, X } from 'lucide-react';

import {
  ModifiedFriendRequests,
  useRequests
} from '@/components/providers/requests-provider';
import UserAvatar from '@/components/user-avatar';

export default function RequestsList({
  requestsList,
  type
}: {
  requestsList: ModifiedFriendRequests;
  type: string;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const { deleteRequest } = useRequests();

  const handleCancelRequest = (reqId: string) => {
    setLoading(true);
    const cancelRequest = async () => {
      const res = await axios.delete('/api/user/request', {
        data: { sentRequstId: reqId }
      });

      if (res.data.statusCode === 200) {
        deleteRequest(reqId);
      } else {
        setLoading(false);
      }
      setLoading(false);
    };
    cancelRequest();
  };

  const handleAcceptRequest = (reqId: string) => {
    setLoading(true);
    const acceptRequest = async () => {
      const res = await axios.post('/api/user/contact', {
        requestId: reqId,
        senderId: requestsList.senderId,
        receiverId: requestsList.receiverId
      });
      if (res.data.statusCode === 200) {
        deleteRequest(reqId);
      } else {
        setLoading(false);
      }
      setLoading(false);
    };
    acceptRequest();
  };

  return (
    <>
      {' '}
      <div className="flex h-full items-center justify-center">
        <UserAvatar
          className="m-3 h-10 w-10 rounded-md"
          username={requestsList.username}
        />
      </div>
      <div className="flex w-full flex-col items-start">
        <p className="text-lg">{requestsList.username}</p>
      </div>
      {type === 'received-request' ? (
        <div className="flex flex-col gap-y-2">
          {' '}
          <button
            className="group rounded-full bg-black p-2 transition hover:bg-white/15 "
            disabled={loading}
            onClick={() => handleAcceptRequest(requestsList.id)}
          >
            <Check className="h-5 w-5 text-stone-400 transition group-hover:text-green-500 " />
          </button>
          <button
            disabled={loading}
            className="group rounded-full bg-black p-2 transition hover:bg-white/15 "
            onClick={() => handleCancelRequest(requestsList.id)}
          >
            <X className="h-5 w-5 text-stone-400 transition group-hover:text-red-500 " />
          </button>
        </div>
      ) : (
        <button
          disabled={loading}
          className="group rounded-full bg-black p-2 transition hover:bg-white/15"
          onClick={() => handleCancelRequest(requestsList.id)}
        >
          <X className="h-5 w-5 text-stone-400 transition group-hover:text-red-500 " />
        </button>
      )}
    </>
  );
}
