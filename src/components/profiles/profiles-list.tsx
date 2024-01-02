'use client';

import React from 'react';

import { useProfiles } from '../providers/profiles-provider';
import SkeletonProfile from '../skeletons/profile-skeleton';

import ProfileListItem from './profiles-list-item';

export default function ProfileList() {
  const { loading, users } = useProfiles();

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {loading ? (
        <SkeletonProfile />
      ) : (
        <div className="flex h-full flex-col overflow-y-auto">
          {users.map((user) => (
            <ProfileListItem
              key={user.id}
              id={user.id}
              name={user.name}
              createdAt={user.createdAt}
            />
          ))}
        </div>
      )}
    </div>
  );
}
