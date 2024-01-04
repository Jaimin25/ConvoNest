import React from 'react';
import { Plus } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import ContactsList from '../contacts/contacts-list';
import { Button } from '../ui/button';

export default function Chats() {
  return (
    <div className="hidden h-full w-1/3 items-center px-4 py-4 md:flex">
      <Card className="h-full w-full border-0 px-4 dark:bg-black/50">
        <CardHeader>
          <CardTitle>
            <div className="flex items-center">
              <p>Chats</p>
              <Button
                className="ml-auto rounded-md p-2 transition-colors hover:bg-white/10"
                variant={'ghost'}
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ContactsList />
        </CardContent>
      </Card>
    </div>
  );
}
