'use client';

import { useContext, useState } from 'react';
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
import {
  Grid,
  SearchBar,
  SearchContext,
  SearchContextManager
} from '@giphy/react-components';

const SearchExperience = ({ width }: { width: number }) => (
  <SearchContextManager
    apiKey={process.env.NEXT_PUBLIC_GIPHY_API_KEY as string}
    options={{ sort: 'relevant' }}
  >
    <Components width={width} />
  </SearchContextManager>
);

const Components = ({ width }: { width: number }) => {
  const { fetchGifs, searchKey } = useContext(SearchContext);
  return (
    <div className="flex h-[400px] w-full flex-col items-center justify-center pt-3">
      <SearchBar className="w-full" />
      <div className="flex flex-col overflow-y-auto py-1">
        <Grid
          key={searchKey}
          columns={2}
          hideAttribution={true}
          fetchGifs={fetchGifs}
          width={width}
          className="gif-modal h-[350px] sm:w-[250px]"
        />
      </div>
    </div>
  );
};

export function GifModal({ children }: { children: React.ReactNode }) {
  const [width, setWidth] = useState(200);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  if (isDesktop) {
    return (
      <>
        <ResizeObserver
          onResize={({ width }) => {
            setWidth(width / 2);
            window && setIsDesktop(window.innerWidth >= 1024);
          }}
        />

        <Popover>
          <PopoverTrigger>{children}</PopoverTrigger>
          <PopoverContent className="w-auto">
            <SearchExperience width={width} />
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
          window && setIsDesktop(window.innerWidth >= 1024);
        }}
      />
      <Dialog>
        <DialogTrigger>{children}</DialogTrigger>
        <DialogContent>
          <DialogDescription>
            <div>
              <SearchExperience width={width} />
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  );
}
