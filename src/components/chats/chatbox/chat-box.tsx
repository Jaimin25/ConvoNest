import React from 'react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import UserAvatar from '@/components/user-avatar';
import { FaceSmileIcon, GifIcon } from '@heroicons/react/24/outline';

export default function ChatBox() {
  return (
    <div className="mx-4 w-full flex-1 py-4 md:mr-4">
      <Card className="h-full w-full border-0 dark:bg-black/50">
        <CardHeader>
          <CardTitle>Andrew</CardTitle>
        </CardHeader>
        <CardContent className="h-[85%] flex-1">
          <div className="flex h-full w-full flex-col justify-center">
            <div className="mb-2 flex-1 space-y-2 overflow-y-auto px-2">
              <div className="w-full">
                <div className="flex w-1/2 gap-x-2">
                  <UserAvatar
                    username="Andrew"
                    className="mt-auto h-8 w-8 rounded-full"
                  />
                  <p className="rounded-3xl rounded-bl-md bg-stone-500 p-3">
                    Hi
                  </p>
                </div>
              </div>
              <div className="flex w-full place-content-end">
                <div className="flex w-1/2 place-content-end gap-x-2">
                  <UserAvatar
                    username="demo"
                    className="order-2 mt-auto h-8 w-8 rounded-full"
                  />
                  <p className="rounded-3xl bg-gray-500">
                    <Image
                      src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZHJ3eXJndWlsYXpnZTl0NTlmMWdoN2E3dWd0NXRwMnU1NjZrdG9oMiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/EK24OWrJSy1GkkNu0y/giphy.gif"
                      width={250}
                      height={250}
                      alt="gif"
                      className="rounded-xl"
                    />
                  </p>
                </div>
              </div>
              <div className="w-full">
                <div className="flex w-1/2 gap-x-2">
                  <UserAvatar
                    username="Andrew"
                    className="mt-auto h-8 w-8 rounded-full"
                  />
                  <p className="rounded-3xl rounded-bl-md bg-gray-500 p-3">
                    Nice
                  </p>
                </div>
              </div>
              <div className="flex w-full place-content-end">
                <div className="flex w-1/2 place-content-end gap-x-2">
                  <UserAvatar
                    username="demo"
                    className="order-2 mt-auto h-8 w-8 rounded-full"
                  />
                  <p className="rounded-3xl rounded-br-md bg-gray-500 p-3">
                    😀😃😄😁
                  </p>
                </div>
              </div>
            </div>

            <div className="flex w-full items-center gap-x-2">
              <GifIcon className="h-8 w-8 cursor-pointer" />
              <FaceSmileIcon className="h-8 w-8 cursor-pointer" />
              <Input className="outline-none focus-visible:ring-0 focus-visible:ring-offset-0" />
              <Button variant={'ghost'} className="rounded-md bg-sky-500 p-3">
                Send
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
