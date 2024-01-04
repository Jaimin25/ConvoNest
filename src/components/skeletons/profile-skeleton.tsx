import React from 'react';

import { Skeleton } from '@/components/ui/skeleton';

export default function SkeletonProfile() {
  return (
    <div className="m-2 flex h-full flex-col space-y-4 overflow-y-auto">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-md" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-auto" />
          <Skeleton className="h-4 w-3/5" />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-md" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-auto" />
          <Skeleton className="h-4 w-3/5" />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-md" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-auto" />
          <Skeleton className="h-4 w-3/5" />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-md" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-auto" />
          <Skeleton className="h-4 w-3/5" />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-md" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-auto" />
          <Skeleton className="h-4 w-3/5" />
        </div>
      </div>
      <div className="hidden items-center space-x-4 sm:flex">
        <Skeleton className="h-12 w-12 rounded-md" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-auto" />
          <Skeleton className="h-4 w-3/5" />
        </div>
      </div>
      <div className="hidden items-center space-x-4 sm:flex">
        <Skeleton className="h-12 w-12 rounded-md" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-auto" />
          <Skeleton className="h-4 w-3/5" />
        </div>
      </div>
    </div>
  );
}
