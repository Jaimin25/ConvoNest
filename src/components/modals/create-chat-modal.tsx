'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { Loader2, MailPlus } from 'lucide-react';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { User } from '@prisma/client';

import UserList from '../new-message/user-list';
import { useChats } from '../providers/chats-provider';
import { useUser } from '../providers/user-provider';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export default function CreateChatModal() {
  const { user } = useUser();
  const { setUpdatedChats } = useChats();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [chatName, setChatName] = useState<string>('');

  const [openNameModal, setOpenNameModal] = useState<boolean>(false);

  const handleOpen = () => {
    setChatName('');
    setIsOpen(!isOpen);
    setOpenNameModal(false);
    setUsers([]);
  };

  const createChat = async () => {
    const res = await axios.post('/api/user/chat', {
      isGroup: users.length > 1,
      adminId: users.length > 1 ? user.id : null,
      name: chatName ? chatName : null,
      userIds: [...users.map((user) => user.id), user.id]
    });
    const data = res.data;

    if (res.data.statusCode === 200) {
      setUpdatedChats(data.body.chat);
      setLoading(false);
    } else if (res.data.statusCode === 403) {
      toast.error(res.data.body.message);
      setLoading(false);
    }
    setOpenNameModal(false);
    setIsOpen(false);
    setLoading(false);
  };

  const handleCreateChat = () => {
    if (users.length === 1) {
      setLoading(true);
      createChat();
    } else if (users.length > 1 && chatName.length >= 3) {
      setLoading(true);
      createChat();
    } else {
      setOpenNameModal(true);
    }
  };

  return (
    <Dialog onOpenChange={handleOpen} open={isOpen}>
      {!openNameModal ? (
        <>
          <DialogTrigger className="ml-auto rounded-md p-3 transition-colors hover:bg-white/15">
            <MailPlus className="h-5 w-5" />
          </DialogTrigger>
          <DialogContent className="border-none">
            <DialogHeader>
              <DialogTitle>New message</DialogTitle>
              <DialogDescription>
                <UserList setUsers={setUsers} />
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                disabled={users.length < 1 || loading}
                onClick={handleCreateChat}
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : users.length > 1 ? (
                  'Proceed'
                ) : (
                  'Create'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </>
      ) : (
        <>
          <DialogContent className="border-none">
            <DialogHeader>
              <DialogTitle>Enter name</DialogTitle>
              <DialogDescription>
                Enter a name for your group chat.
                <Input
                  className="mt-2"
                  placeholder="Group name"
                  onChange={(e) => {
                    setChatName(e.target.value);
                  }}
                />
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                disabled={chatName.length < 3 || loading}
                onClick={handleCreateChat}
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  'Create'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </>
      )}
    </Dialog>
  );
}
