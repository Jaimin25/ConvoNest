'use client';

import { useEffect, useState } from 'react';
import { Braces } from 'lucide-react';

import { User } from '@prisma/client';

import { useContacts } from '../providers/contacts-provider';
import UserDialogSkeleton from '../skeletons/user-dialog-skeleton';

import UsersListItem from './user-list-item';

export default function UserList({
  setUsers
}: {
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}) {
  const { loading, contacts } = useContacts();

  const [user, setUser] = useState<User>();

  useEffect(() => {
    if (user) {
      setUsers((prevUsers) => {
        if (prevUsers.length > 0) {
          const userExists = prevUsers.some(
            (existingUser) => existingUser.id === user.id
          );

          if (userExists) {
            return prevUsers.filter(
              (existingUser) => existingUser.id !== user.id
            );
          } else {
            return [...prevUsers, user];
          }
        } else {
          return [...prevUsers, user];
        }
      });
    }
  }, [user, setUsers]);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* <div className="flex gap-x-2">
        <Search className="m-auto h-5 w-5 text-gray-500" />
        <Input
          placeholder="Search your contacts"
          className="flex-1 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div> */}
      {loading ? (
        <UserDialogSkeleton />
      ) : (
        <div className="flex h-[300px] flex-col overflow-y-auto">
          {contacts.length > 0 ? (
            contacts.map((user) => (
              <UsersListItem
                key={user.id}
                id={user.user2Id}
                name={user.username}
                createdAt={user.createdAt}
                updatedAt={user.updatedAt}
                setUser={setUser}
              />
            ))
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-y-1">
              <Braces className="h-5 w-5 text-gray-500" />
              <p>No Contacts</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
