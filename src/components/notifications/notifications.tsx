import React from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Card } from '../ui/card';

import ReceivedRequestsNotification from './requests/received';
import SentRequestsNotification from './requests/sent';

export default function Notifications() {
  return (
    <div className="flex w-full items-center justify-center">
      <Card className="h-5/6 w-10/12 border-0 p-4 sm:h-5/6 sm:w-1/2 lg:w-1/3 dark:bg-black/50">
        <Tabs
          defaultValue="sent"
          className="flex h-full w-full flex-col justify-center"
        >
          <TabsList>
            <TabsTrigger value="sent" className="w-full">
              Sent
            </TabsTrigger>
            <TabsTrigger value="received" className="w-full">
              Received
            </TabsTrigger>
          </TabsList>
          <TabsContent value="sent" className="h-full">
            <SentRequestsNotification />
          </TabsContent>
          <TabsContent value="received" className="h-full">
            <ReceivedRequestsNotification />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
