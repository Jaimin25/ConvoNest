'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { Check, Loader2, X } from 'lucide-react';

import { useContacts } from '@/components/providers/contacts-provider';
import {
  FriendRequestsProps,
  useRequests
} from '@/components/providers/requests-provider';
import UserAvatar from '@/components/user-avatar';

export default function RequestsList({
  requestsList,
  type
}: {
  requestsList: FriendRequestsProps;
  type: string;
}) {
  const [declineLoading, setdeclineLoading] = useState<boolean>(false);
  const [acceptLoading, setAcceptLoading] = useState<boolean>(false);
  const { deleteRequest } = useRequests();

  const { setUpdatedContacts } = useContacts();

  const handleCancelRequest = (reqId: string) => {
    setdeclineLoading(true);
    const cancelRequest = async () => {
      await axios
        .delete('/api/user/request', {
          data: { sentRequstId: reqId }
        })
        .then((res) => {
          if (res.data.statusCode === 200 || res.data.statusCode === 404) {
            deleteRequest(reqId);
          } else {
            setdeclineLoading(false);
          }
        });
      setdeclineLoading(false);
    };
    cancelRequest();
  };

  const handleAcceptRequest = (reqId: string) => {
    setAcceptLoading(true);
    const acceptRequest = async () => {
      const res = await axios.post('/api/user/contact', {
        requestId: reqId,
        senderId: requestsList.senderId,
        receiverId: requestsList.receiverId
      });
      if (res.data.statusCode === 200) {
        const contact = res.data.body.data;
        contact.username = requestsList.username;
        setUpdatedContacts(contact);
        deleteRequest(reqId);
      } else {
        setAcceptLoading(false);
      }
      setAcceptLoading(false);
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
            disabled={declineLoading || acceptLoading}
            onClick={() => handleAcceptRequest(requestsList.id)}
          >
            {acceptLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-stone-400" />
            ) : (
              <Check className="h-5 w-5 text-stone-400 transition group-hover:text-green-500 " />
            )}
          </button>
          <button
            disabled={declineLoading || acceptLoading}
            className="group rounded-full bg-black p-2 transition hover:bg-white/15 "
            onClick={() => handleCancelRequest(requestsList.id)}
          >
            {declineLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-stone-400" />
            ) : (
              <X className="h-5 w-5 text-stone-400 transition group-hover:text-red-500 " />
            )}
          </button>
        </div>
      ) : (
        <button
          disabled={declineLoading || acceptLoading}
          className="group rounded-full bg-black p-2 transition hover:bg-white/15"
          onClick={() => handleCancelRequest(requestsList.id)}
        >
          {declineLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-stone-400" />
          ) : (
            <X className="h-5 w-5 text-stone-400 transition group-hover:text-red-500 " />
          )}
        </button>
      )}
    </>
  );
}
