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
  DialogTitle
} from '@/components/ui/dialog';
import { DialogTrigger } from '@radix-ui/react-dialog';

import { useContacts } from '../providers/contacts-provider';
import { useRequests } from '../providers/requests-provider';
import { useSocket } from '../providers/socket-provider';
import { useUser } from '../providers/user-provider';
import { Button } from '../ui/button';
import UserAvatar from '../user-avatar';

interface AddFriendModalProps {
  children: React.ReactNode;
  id: string;
  name: string;
  avatar: string;
}

export default function AddFriendModal({
  children,
  id,
  name
}: AddFriendModalProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { user, username } = useUser();

  const { contacts } = useContacts();

  const { socket } = useSocket();

  const { requests, setUpdatedRequests } = useRequests();

  const handleRequest = () => {
    setLoading(true);
    const sendRequest = async () => {
      const res = await axios.post('/api/user/request', {
        senderId: user.id,
        receiverId: id
      });
      if (res.data.statusCode === 200) {
        const sentRequest = res.data.body.data;
        sentRequest.username = name;
        setUpdatedRequests(sentRequest);
        toast.success('Friend Request Sent');
        setIsOpen(false);
        setLoading(false);
        socket?.emit(`user:${user.id}:send-request`, {
          data: { sentRequest, username }
        });
      } else {
        setIsOpen(false);
        setLoading(false);
      }
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
              Send this user a friend request.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            {requests.some(
              (rq) => rq.receiverId === id || rq.senderId === id
            ) ? (
              <Button
                className="space-x-2 bg-green-600"
                variant={'ghost'}
                onClick={handleRequest}
                disabled={true}
              >
                Pending Friend Request
              </Button>
            ) : contacts.some(
                (cnt) => cnt.user1Id === id || cnt.user2Id === id
              ) ? (
              <Button
                className="space-x-2 bg-green-600"
                variant={'ghost'}
                onClick={handleRequest}
                disabled={true}
              >
                Already Friends
              </Button>
            ) : (
              <Button
                className="space-x-2 bg-green-600"
                variant={'ghost'}
                onClick={handleRequest}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <p>Sending...</p>{' '}
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </>
                ) : (
                  <>
                    <p className="text-base">Send Request</p>
                    <MailPlus className="h-5 w-5" />
                  </>
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
