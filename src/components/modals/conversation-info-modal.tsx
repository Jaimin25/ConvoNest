'use client';

import React, { useState } from 'react';
import { Info, ShieldAlert } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { joinTimeFormat } from '@/lib/joinTimeFormat';
import { TrashIcon } from '@heroicons/react/24/outline';

import { ChatsProps } from '../providers/chats-provider';
import { useUser } from '../providers/user-provider';
import { Button } from '../ui/button';
import UserAvatar from '../user-avatar';

export default function ConvoInfoModal({ chat }: { chat: ChatsProps }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const date = chat && new Date(chat.createdAt);
  const { user } = useUser();

  return (
    <Dialog>
      <DialogTrigger className="mx-2 ml-auto rounded-full p-2 hover:cursor-pointer hover:bg-white/15">
        <div>
          <Info className="h-6 w-6" />
        </div>
      </DialogTrigger>
      <DialogContent className="border-0">
        <DialogHeader className="text-left">
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
                          <p className="flex items-center gap-x-1 text-lg">
                            {chatUser.name}
                            {chatUser.id === chat.adminId && (
                              <ShieldAlert className="h-5 w-5 text-indigo-500" />
                            )}
                          </p>
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
        <DialogFooter>
          {!confirmDelete ? (
            <Button
              variant={'ghost'}
              className="space-x-1 bg-red-500"
              onClick={() => setConfirmDelete(true)}
            >
              <TrashIcon className="h-5 w-5" />
              <p>Delete</p>
            </Button>
          ) : (
            <>
              <Button
                onClick={() => setConfirmDelete(false)}
                variant={'secondary'}
                className="mt-2"
              >
                Cancel
              </Button>
              <Button variant={'destructive'} className="bg-green-500">
                <p>Confirm</p>
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
