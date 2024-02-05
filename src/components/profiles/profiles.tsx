import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import ProfileList from './profiles-list';

export default function Profiles() {
  return (
    <div className="flex h-[85%] w-full flex-1 flex-col items-center justify-center py-3 md:h-full">
      <Card className="h-[90%] w-11/12 flex-1 border-0 px-4 md:h-[95%] md:w-1/2 lg:w-1/3 dark:bg-black/50">
        <CardHeader>
          <CardTitle>Profiles</CardTitle>
        </CardHeader>
        <CardContent className="h-5/6 px-2 md:h-5/6">
          <ProfileList />
        </CardContent>
      </Card>
    </div>
  );
}
