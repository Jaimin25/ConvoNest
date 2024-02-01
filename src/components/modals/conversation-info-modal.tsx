'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Info, Loader2, ShieldAlert } from 'lucide-react';

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

import { ChatsProps, useChats } from '../providers/chats-provider';
import { useSocket } from '../providers/socket-provider';
import { useUser } from '../providers/user-provider';
import { Button } from '../ui/button';
import UserAvatar from '../user-avatar';

export default function ConvoInfoModal({ chat }: { chat: ChatsProps }) {
  const { user } = useUser();
  const { removeChat } = useChats();
  const { socket } = useSocket();

  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const date = chat && new Date(chat.createdAt);
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const handleDelete = () => {
    setLoading(true);

    const deleteChat = async () => {
      const res = await axios.delete('/api/user/chat', {
        data: { chatId: chat.id }
      });

      if (res.data.statusCode === 200) {
        socket?.emit(`chat:${user.id}:send-delete-chat`, {
          users: chat.users.filter((chatUser) => chatUser.id !== user.id),
          chatId: chat.id
        });
        removeChat(chat.id);
        router.push('/chats');
        setLoading(false);
      } else {
        setLoading(false);
      }
    };
    deleteChat();
  };

  return (
    <Dialog onOpenChange={() => setConfirmDelete(false)}>
      <DialogTrigger className="mx-2 ml-auto rounded-full p-2 hover:cursor-pointer hover:bg-white/15">
        <div>
          <Info className="h-6 w-6" />
        </div>
      </DialogTrigger>
      <DialogContent className="border-0">
        <DialogHeader className="text-left">
          <DialogTitle>
            {!confirmDelete ? 'Details' : 'Delete Chat'}
          </DialogTitle>
          <DialogDescription>
            {!confirmDelete ? (
              <>
                <p className="">
                  Created on{' '}
                  {chat &&
                    date.toDateString() + ' at ' + date.toLocaleTimeString()}
                </p>
                <p className="text-xl font-semibold text-white">Members:</p>
                {chat &&
                  chat.users.map((chatUser) => {
                    const joinedAtTime = joinTimeFormat(chatUser.createdAt);

                    return (
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
                              {user.id === chatUser.id && '(You) '}
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
                    );
                  })}{' '}
              </>
            ) : (
              <p>
                Are you sure, you want to delete this chat? This action will
                also delete chat for the participants in it.
              </p>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          {chat &&
            (chat.isGroup && chat.adminId === user.id ? (
              confirmDelete ? (
                <>
                  <Button
                    onClick={() => setConfirmDelete(false)}
                    variant={'secondary'}
                    className="mt-2 sm:mt-0"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant={'destructive'}
                    onClick={() => handleDelete()}
                  >
                    {!loading ? (
                      'Confirm'
                    ) : (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    )}
                  </Button>
                </>
              ) : (
                <Button
                  variant={'ghost'}
                  className="space-x-1 bg-red-500"
                  onClick={() => {
                    setConfirmDelete(true);
                    handleDelete();
                  }}
                >
                  <TrashIcon className="h-5 w-5" />
                  <p>Delete</p>
                </Button>
              )
            ) : (
              !chat.isGroup &&
              (confirmDelete ? (
                <>
                  <Button
                    onClick={() => setConfirmDelete(false)}
                    variant={'secondary'}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant={'destructive'}
                    onClick={() => handleDelete()}
                  >
                    {!loading ? (
                      'Confirm'
                    ) : (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    )}
                  </Button>
                </>
              ) : (
                <Button
                  variant={'ghost'}
                  className="space-x-1 bg-red-500"
                  onClick={() => {
                    setConfirmDelete(true);
                  }}
                >
                  <TrashIcon className="h-5 w-5" />
                  <p>Delete</p>
                </Button>
              ))
            ))}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
