import React from 'react';
import { Info } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { joinTimeFormat } from '@/lib/joinTimeFormat';

import { ChatsProps } from '../providers/chats-provider';
import { useUser } from '../providers/user-provider';
import UserAvatar from '../user-avatar';

export default function ConvoInfoModal({ chat }: { chat: ChatsProps }) {
  const date = chat && new Date(chat.createdAt);
  const { user } = useUser();

  return (
    <Dialog>
      <DialogTrigger>
        <div>
          <Info className="mx-2 ml-auto h-10 w-10 rounded-full p-2 hover:cursor-pointer hover:bg-white/15" />
        </div>
      </DialogTrigger>
      <DialogContent className="border-0">
        <DialogHeader>
          <DialogTitle>Conversation Info</DialogTitle>
          <DialogDescription>
            <p className="">
              Created on{' '}
              {chat && date.toDateString() + ' at ' + date.toLocaleTimeString()}
            </p>
            <p className="text-xl font-semibold text-white">Members:</p>
            {chat &&
              chat.users.map((chatUser) => {
                const joinedAtTime = joinTimeFormat(chatUser.createdAt);

                return (
                  user.id !== chatUser.id && (
                    <div key={user.id}>
                      <div className="group flex items-center gap-x-4 rounded p-1 px-2 transition hover:cursor-pointer hover:bg-white/15">
                        <div className="flex h-full items-center justify-center">
                          <UserAvatar
                            className="m-3 h-11 w-11 rounded-md"
                            username={chatUser.name}
                          />
                        </div>
                        <div className="flex w-full flex-col items-start">
                          <p className="text-lg">{chatUser.name}</p>
                          <p className="text-xs text-stone-400">
                            Joined {joinedAtTime} ago
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                );
              })}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
