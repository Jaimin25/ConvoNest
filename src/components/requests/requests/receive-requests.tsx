'use client';

import React, { useEffect, useState } from 'react';
import { Braces } from 'lucide-react';

import {
  ModifiedFriendRequests,
  useRequests
} from '@/components/providers/requests-provider';
import { useUser } from '@/components/providers/user-provider';
import SkeletonProfile from '@/components/skeletons/profile-skeleton';

import RequestsList from './requests-list';

export default function ReceivedRequests() {
  const { loading, requests } = useRequests();
  const { user } = useUser();

  const [receivedRequests, setReceivedRequests] = useState<
    ModifiedFriendRequests[]
  >([]);

  useEffect(() => {
    const receivedRequests = requests.filter(
      (request) => request.receiverId === user.id
    );
    setReceivedRequests(receivedRequests);
  }, [user, requests]);

  return (
    <div className="flex h-full flex-col space-y-1 overflow-y-auto">
      {!loading ? (
        receivedRequests.length > 0 ? (
          <>
            {receivedRequests.map((request) => (
              <div
                className="flex items-center gap-x-4 rounded px-2 py-1 transition hover:cursor-pointer hover:bg-white/15"
                key={request.id}
              >
                <RequestsList requestsList={request} type="received-request" />
              </div>
            ))}
          </>
        ) : receivedRequests.length === 0 ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-y-1">
            <Braces className="h-5 w-5 text-gray-500" />
            <p>No Requests</p>
          </div>
        ) : null
      ) : (
        <SkeletonProfile />
      )}
    </div>
  );
}
