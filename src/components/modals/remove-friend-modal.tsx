'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { Loader2, MailMinus } from 'lucide-react';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { DialogTrigger } from '@radix-ui/react-dialog';

import { useContacts } from '../providers/contacts-provider';
import { useSocket } from '../providers/socket-provider';
import { useUser } from '../providers/user-provider';
import { Button } from '../ui/button';
import UserAvatar from '../user-avatar';

interface RemoveFriendModalProps {
  children: React.ReactNode;
  id: string;
  name: string;
  avatar: string;
}

export default function RemoveFriendModal({
  children,
  id,
  name
}: RemoveFriendModalProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { user } = useUser();
  const { socket } = useSocket();
  const { removeContact } = useContacts();

  const handleRequest = () => {
    setLoading(true);
    const sendRequest = async () => {
      const res = await axios.delete('/api/user/contact', {
        data: {
          senderId: user.id,
          receiverId: id
        }
      });

      if (res.data.statusCode === 200) {
        const receiverId = res.data.body.data;
        removeContact(receiverId);
        console.log(receiverId);
        toast.success('Removed Friend');
        socket?.emit(`user:${user.id}:send-remove-friend`, {
          receiverId
        });
      } else if (res.data.statusCode === 404) {
        // removeContact(id);
      }
      setLoading(false);
      setIsOpen(false);
    };
    sendRequest();
  };

  const handleChange = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={handleChange}>
        <DialogTrigger className="flex h-9 w-9 items-center justify-center">
          {children}
        </DialogTrigger>
        <DialogContent className="border-none">
          <DialogHeader>
            <DialogTitle>
              <div className="flex items-center gap-x-3">
                <UserAvatar username={name} className="h-11 w-11 rounded-md" />
                {name}
              </div>
            </DialogTitle>
            <DialogDescription className="py-4 text-lg">
              Are you sure you want to remove this user from friends? You will
              not be able to chat with them.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-y-2">
            <Button variant={'secondary'}>Cancel</Button>
            <Button
              className="space-x-2 bg-red-600"
              variant={'ghost'}
              onClick={handleRequest}
              disabled={loading}
            >
              {loading ? (
                <>
                  <p>Sending...</p> <Loader2 className="h-5 w-5 animate-spin" />
                </>
              ) : (
                <>
                  <p className="text-base">Remove</p>
                  <MailMinus className="h-5 w-5" />
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
