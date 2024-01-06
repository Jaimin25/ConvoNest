'use client';

import React, { useState } from 'react';

import { Checkbox } from '@/components/ui/checkbox';
import { joinTimeFormat } from '@/lib/joinTimeFormat';
import { User } from '@prisma/client';

import UserAvatar from '../user-avatar';

export default function UsersListItem({
  id,
  name,
  createdAt,
  updatedAt,
  setUser
}: {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
}) {
  const [checked, setChecked] = useState(false);

  const handleClick = () => {
    setChecked(!checked);
    setUser({ id, name, createdAt, updatedAt });
  };

  const joinedAtTime = joinTimeFormat(createdAt);

  return (
    <div
      className="bg-red m-1 flex items-center gap-x-4 rounded p-1 px-2 transition hover:cursor-pointer hover:bg-white/15"
      onClick={handleClick}
    >
      <Checkbox checked={checked} className="dark:border-white/50" />
      <div className="flex h-full items-center justify-center">
        <UserAvatar className="m-2 h-11 w-11 rounded-md" username={name} />
      </div>
      <div className="flex w-full flex-col items-start py-1">
        <p className="text-lg">{name}</p>
        <p className="text-xs text-stone-400">Friends since {joinedAtTime}</p>
      </div>
    </div>
  );
}
