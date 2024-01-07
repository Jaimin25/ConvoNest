import React from 'react';

import { Skeleton } from '@/components/ui/skeleton';

export default function SkeletonMessage() {
  return (
    <div className="m-2 flex h-full flex-col space-y-4 overflow-y-auto">
      <div className="flex items-center space-x-2">
        <Skeleton className="mt-auto h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-12 w-4/5 rounded-3xl rounded-bl-md sm:w-1/3" />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <div className="flex flex-1 place-content-end space-y-2">
          <Skeleton className="h-12 w-4/5 place-self-end rounded-3xl rounded-br-md sm:w-1/3" />
        </div>
        <Skeleton className="mt-auto h-10 w-10 rounded-full" />
      </div>
      <div className="flex items-center space-x-2">
        <Skeleton className="mt-auto h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-12 w-4/5 rounded-3xl rounded-bl-md sm:w-1/3" />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <div className="flex flex-1 place-content-end space-y-2">
          <Skeleton className="h-12 w-4/5 place-self-end rounded-3xl rounded-br-md sm:w-1/3" />
        </div>
        <Skeleton className="mt-auto h-10 w-10 rounded-full" />
      </div>
      <div className="flex items-center space-x-2">
        <Skeleton className="mt-auto h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-12 w-4/5 rounded-3xl rounded-bl-md sm:w-1/3" />
        </div>
      </div>
    </div>
  );
}
