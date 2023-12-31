'use client';

import React from 'react';

import { useProfiles } from '../providers/profiles-provider';
import { Skeleton } from '../ui/skeleton';

import ProfileListItem from './profiles-list-item';

export default function ProfileList() {
  const { loading, users } = useProfiles();

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {loading ? (
        <div className="flex h-full flex-col space-y-4 overflow-y-auto">
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
        </div>
      ) : (
        <div className="flex h-full flex-col space-y-1 overflow-y-auto">
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
