'use client';

import React, { useEffect, useState } from 'react';
import { Braces } from 'lucide-react';

import {
  UpdatedFriendRequests,
  useRequests
} from '@/components/providers/requests-provider';
import { useUser } from '@/components/providers/user-provider';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import UserAvatar from '@/components/user-avatar';

export default function ReceivedRequestsNotification() {
  const { requests } = useRequests();
  const { user } = useUser();
  console.log(requests);

  const [receivedRequests, setReceivedRequests] = useState<
    UpdatedFriendRequests[]
  >([]);

  useEffect(() => {
    const receivedRequests = requests.filter(
      (request) => request.receiverId === user.id
    );
    console.log(receivedRequests);
    setReceivedRequests(receivedRequests);
  }, [user, requests]);

  return (
    <div className="flex h-full flex-col space-y-1 overflow-y-auto">
      {receivedRequests.length > 0 ? (
        <>
          {receivedRequests.map((request) => (
            <div
              className="m-1 flex gap-x-4 rounded p-2 transition hover:cursor-pointer hover:bg-white/10"
              key={request.id}
            >
              <div className="flex h-full items-center justify-center">
                <UserAvatar
                  className="m-2 h-11 w-11 rounded-md"
                  username={request.receiverName}
                />
              </div>
              <div className="flex w-full flex-col items-start">
                <p className="text-lg">{request.receiverName}</p>
                <Badge
                  className="h-4 bg-orange-600 text-[10px] font-medium"
                  variant={'outline'}
                >
                  Pending
                </Badge>
              </div>
            </div>
          ))}
        </>
      ) : <div className="flex h-full flex-col space-y-4 overflow-y-auto">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-md" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-md" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-md" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-md" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-md" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        </div> ? (
        receivedRequests.length === 0 ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-y-1">
            <Braces className="h-5 w-5 text-gray-500" />
            <p>No Requests</p>
          </div>
        ) : null
      ) : null}
    </div>
  );
}
