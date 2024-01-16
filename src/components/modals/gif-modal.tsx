'use client';

import { useContext } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Grid,
  SearchBar,
  SearchContext,
  SearchContextManager
} from '@giphy/react-components';

const SearchExperience = () => (
  <SearchContextManager
    apiKey={process.env.NEXT_PUBLIC_GIPHY_API_KEY as string}
  >
    <Components />
  </SearchContextManager>
);

const Components = () => {
  const { fetchGifs, searchKey } = useContext(SearchContext);
  return (
    <div className="flex h-[400px] w-full flex-col items-center justify-center">
      <SearchBar className="w-full" />

      <div className="overflow-y-auto">
        <Grid
          key={searchKey}
          columns={3}
          hideAttribution={true}
          width={470}
          fetchGifs={fetchGifs}
          className="h-[350px]"
        />
      </div>
    </div>
  );
};

export function GifModal({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogDescription>
            <SearchExperience />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
