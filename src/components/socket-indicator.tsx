'use client';

import { useSocket } from '@/components/providers/socket-provider';

export const SocketIndicator = () => {
  const { isConnected } = useSocket();

  if (!isConnected) {
    return (
      <div className="absolute right-0 top-0 h-[10px] w-[10px] md:relative">
        <span className="relative flex h-3 w-3 items-center justify-center md:flex">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-200 opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-yellow-600"></span>
        </span>
      </div>
    );
  }

  return (
    <div className="absolute right-0 top-0 h-[10px] w-[10px] md:relative">
      <span className="relative flex h-3 w-3 items-center justify-center md:flex">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-200 opacity-75"></span>
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600"></span>
      </span>
    </div>
  );
};
