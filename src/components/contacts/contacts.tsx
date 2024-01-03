'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, LogOut } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import useSupabase from '@/hooks/useSupabase';

import { useUser } from '../providers/user-provider';
import { Button } from '../ui/button';

import ContactsList from './contacts-list';

export default function Contacts() {
  const { username } = useUser();

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const { supabase } = useSupabase();

  const handleLogout = () => {
    setLoading(true);
    const logout = async () => {
      const data = await supabase.auth.signOut();
      setLoading(false);
      if (!data.error) {
        router.refresh();
      }
    };
    logout();
  };
  return (
    <div className="flex h-[85%] w-full flex-1 flex-col items-center justify-center gap-y-2 py-4 sm:h-full">
      {username ? (
        <Card className="block w-10/12 border-0 px-4 sm:hidden sm:h-5/6 sm:w-1/2 lg:w-1/3 dark:bg-black/50">
          <CardHeader>
            <CardTitle>
              <div className="flex items-center">
                <p className="flex-1">Account </p>
                <Button
                  className="flex gap-x-2 bg-red-500"
                  variant="ghost"
                  onClick={handleLogout}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin text-white" />
                    </>
                  ) : (
                    <>
                      <LogOut className="h-4 w-4 text-white" />
                    </>
                  )}
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-5/6 px-2 sm:h-5/6">
            <div className="flex flex-col gap-y-1">
              <p>
                Username: <span className="text-lg font-bold">{username}</span>
              </p>
            </div>
          </CardContent>
        </Card>
      ) : null}
      <Card className="h-1/2 w-10/12 flex-1 border-0 px-4 sm:h-5/6 sm:w-1/2 lg:w-1/3 dark:bg-black/50">
        <CardHeader>
          <CardTitle>Contacts</CardTitle>
        </CardHeader>
        <CardContent className="h-5/6 px-2 sm:h-5/6">
          <ContactsList />
        </CardContent>
      </Card>
    </div>
  );
}
