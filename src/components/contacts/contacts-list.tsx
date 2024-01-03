'use client';

import React from 'react';
import { Braces } from 'lucide-react';

import { useContacts } from '../providers/contacts-provider';
import SkeletonProfile from '../skeletons/profile-skeleton';

import ContactsListItem from './contacts-list-item';

export default function ContactsList() {
  const { loading, contacts } = useContacts();

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {loading ? (
        <SkeletonProfile />
      ) : (
        <div className="flex h-full flex-col overflow-y-auto">
          {contacts.length > 0 ? (
            contacts.map((user) => (
              <ContactsListItem
                key={user.id}
                id={user.id}
                name={user.username}
                createdAt={user.createdAt}
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
