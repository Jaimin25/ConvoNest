'use client';

import React from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useRequests } from '../providers/requests-provider';
import { useUser } from '../providers/user-provider';
import { Badge } from '../ui/badge';
import { Card, CardHeader, CardTitle } from '../ui/card';

import ReceivedRequests from './requests/receive-requests';
import SentRequests from './requests/sent-requests';

export default function FriendRequests() {
  const { requests } = useRequests();
  const { user } = useUser();
  return (
    <div className="flex h-[85%] w-full flex-1 flex-col items-center justify-center py-3 md:h-full">
      <Card className="h-[90%] w-11/12 flex-1 border-0 px-4 md:h-[95%] md:w-1/2 lg:w-1/3 dark:bg-black/50">
        <CardHeader>
          <CardTitle>Friend Requests</CardTitle>
        </CardHeader>
        <Tabs
          defaultValue="sent"
          className="flex h-5/6 w-full flex-col justify-center px-4"
        >
          <TabsList>
            <TabsTrigger value="sent" className="w-full">
              Sent
            </TabsTrigger>
            <TabsTrigger value="received" className="w-full gap-x-2">
              Received
              {requests.some((rq) => rq.receiverId === user.id) ? (
                <Badge className="bg-red-500" variant={'outline'}>
                  {requests.filter((rq) => rq.receiverId === user.id).length}
                </Badge>
              ) : null}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="sent" className="h-full overflow-y-auto">
            <SentRequests />
          </TabsContent>
          <TabsContent value="received" className="h-full overflow-y-auto">
            <ReceivedRequests />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
