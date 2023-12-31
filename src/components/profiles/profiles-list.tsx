"use client";

import React from "react";
import { Skeleton } from "../ui/skeleton";
import ProfileListItem from "./profiles-list-item";
import { useProfiles } from "../providers/profiles-provider";

export default function ProfileList() {
  const { loading, users } = useProfiles();

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {loading ? (
        <div className="space-y-4 flex flex-col overflow-y-auto h-full">
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
        <div className="space-y-1 flex flex-col overflow-y-auto h-full">
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
