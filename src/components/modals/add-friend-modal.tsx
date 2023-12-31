'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { Loader2, MailPlus } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { DialogTrigger } from '@radix-ui/react-dialog';

import { useRequests } from '../providers/requests-provider';
import { useUser } from '../providers/user-provider';
import { Badge } from '../ui/badge';
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

  const { user } = useUser();

  const { requests } = useRequests();

  const handleRequest = () => {
    setLoading(true);
    const sendRequest = async () => {
      const res = await axios.post('/api/user/request', {
        senderId: user.id,
        receiverId: id
      });
      setLoading(false);
      console.log(res.data);
      if (res.data.statusCode === 200) {
        setIsOpen(false);
      }
    };
    sendRequest();
  };

  const handleChange = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="w-full">
      <Dialog open={isOpen} onOpenChange={handleChange}>
        <DialogTrigger className="w-full">{children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <div className="flex items-center gap-x-3">
                <UserAvatar username={name} className="h-11 w-11 rounded-md" />
                {name}
                {requests.some(
                  (rq) =>
                    (rq.receiverId === id && rq.status === 'pending') ||
                    (rq.senderId === id && rq.status === 'pending')
                ) && (
                  <Badge
                    className="bg-orange-500 font-medium"
                    variant={'outline'}
                  >
                    Pending
                  </Badge>
                )}
              </div>
            </DialogTitle>
            <DialogDescription className="py-4 text-lg">
              Send this user a friend request.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            {!requests.some(
              (rq) =>
                (rq.receiverId === id && rq.status === 'pending') ||
                (rq.senderId === id && rq.status === 'pending')
            ) && (
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
