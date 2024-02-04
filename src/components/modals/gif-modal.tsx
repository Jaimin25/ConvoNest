'use client';

import { useEffect, useState } from 'react';
import GifPicker, { Theme } from 'gif-picker-react';
import ResizeObserver from 'react-resize-observer';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';

export function GifModal({
  children,
  setGifUrl
}: {
  children: React.ReactNode;
  setGifUrl: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [open, setIsOpen] = useState<boolean>(false);
  const [width, setWidth] = useState(200);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768);
  }, []);

  if (isDesktop) {
    return (
      <>
        <ResizeObserver
          onResize={({ width }) => {
            setWidth(width / 2);
            setIsDesktop(window.innerWidth >= 768);
          }}
        />

        <Popover onOpenChange={setIsOpen} open={open}>
          <PopoverTrigger>{children}</PopoverTrigger>
          <PopoverContent className="w-auto rounded-xl p-0">
            <GifPicker
              theme={Theme.AUTO}
              onGifClick={(gif) => {
                setGifUrl(gif.url);
                setIsOpen(false);
              }}
              tenorApiKey={process.env.TENOR_API_KEY as string}
            />
          </PopoverContent>
        </Popover>
      </>
    );
  }

  return (
    <>
      <ResizeObserver
        onResize={({ width }) => {
          if (width > 425) {
            setWidth(450);
          } else {
            setWidth(width);
          }
          setIsDesktop(window.innerWidth >= 768);
        }}
      />
      <Dialog onOpenChange={setIsOpen} open={open}>
        <DialogTrigger>{children}</DialogTrigger>
        <DialogContent>
          <DialogDescription className="pt-4">
            <GifPicker
              theme={Theme.AUTO}
              width={width}
              onGifClick={(gif) => {
                setGifUrl(gif.url);
                setIsOpen(false);
              }}
              tenorApiKey={process.env.TENOR_API_KEY as string}
            />
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  );
}
