import React from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Card, CardHeader, CardTitle } from '../ui/card';

import ReceivedRequests from './requests/receive-requests';
import SentRequests from './requests/sent-requests';

export default function FriendRequests() {
  return (
    <div className="flex w-full items-center justify-center">
      <Card className="h-5/6 w-10/12 border-0 px-4 sm:h-5/6 sm:w-1/2 lg:w-1/3 dark:bg-black/50">
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
            <TabsTrigger value="received" className="w-full">
              Received
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
