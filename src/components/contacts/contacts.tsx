import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import ProfileList from './contacts-list';

export default function Profiles() {
  return (
    <div className="flex h-[85%] w-full flex-1 items-center justify-center sm:h-full">
      <Card className="h-[90%] w-10/12 border-0 px-4 sm:h-5/6 sm:w-1/2 lg:w-1/3 dark:bg-black/50">
        <CardHeader>
          <CardTitle>Contacts</CardTitle>
        </CardHeader>
        <CardContent className="h-5/6 sm:h-5/6">
          <ProfileList />
        </CardContent>
      </Card>
    </div>
  );
}
