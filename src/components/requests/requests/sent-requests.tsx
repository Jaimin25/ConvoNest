'use client';

import React, { useEffect, useState } from 'react';
import { Braces } from 'lucide-react';

import {
  ModifiedFriendRequests,
  useRequests
} from '@/components/providers/requests-provider';
import { useUser } from '@/components/providers/user-provider';
import SkeletonProfile from '@/components/skeletons/profile-skeleton';

import SentRequestsList from './requests-list';

export default function SentRequests() {
  const { loading, requests } = useRequests();
  const { user } = useUser();

  const [sentRequests, setSentRequests] = useState<ModifiedFriendRequests[]>(
    []
  );

  useEffect(() => {
    const sentRequests = requests.filter(
      (request) => request.senderId === user.id
    );
    setSentRequests(sentRequests);
  }, [user, requests]);

  return (
    <div className="flex h-full flex-col space-y-1 overflow-y-auto">
      {!loading ? (
        sentRequests.length > 0 ? (
          <>
            {sentRequests.map((request) => (
              <div
                className=" flex items-center gap-x-4 rounded px-2 py-1 transition hover:cursor-pointer hover:bg-white/15"
                key={request.id}
              >
                <SentRequestsList requestsList={request} type="sent-request" />
              </div>
            ))}
          </>
        ) : sentRequests.length === 0 ? (
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
