'use client';

import { useSocket } from '@/components/providers/socket-provider';
import { Badge } from '@/components/ui/badge';

export const SocketIndicator = () => {
  const { isConnected } = useSocket();

  if (!isConnected) {
    return (
      <Badge
        variant="outline"
        className="space-x-1 border-none bg-yellow-600 text-white"
      >
        <p>Connecting</p>

        <span className="relative flex h-2 w-2 items-center justify-center">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex h-[6px] w-[6px] rounded-full bg-white"></span>
        </span>
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="border-none bg-emerald-600 text-white">
      Live
    </Badge>
  );
};
