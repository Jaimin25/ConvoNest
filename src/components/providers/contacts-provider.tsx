'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

import { Friends } from '@prisma/client';

import { useProfiles } from './profiles-provider';
import { useUser } from './user-provider';

interface ContactsProps {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  user1Id: string;
  user2Id: string;
  username: string;
}

interface ContactsContextProps {
  contacts: ContactsProps[];
  setUpdatedContacts: (data: ContactsProps) => void;
  loading: boolean;
}

const ContactsContext = createContext<ContactsContextProps>({
  contacts: [],
  setUpdatedContacts: () => {},
  loading: false
});

export const useContacts = () => {
  return useContext(ContactsContext);
};

export function ContactsProvider({ children }: { children: React.ReactNode }) {
  const [contacts, setContacts] = useState<ContactsProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { user } = useUser();
  const { users } = useProfiles();

  useEffect(() => {
    setLoading(true);
    const fetchContacts = async () => {
      const res = await axios.get('/api/user/contact');
      const contacts = res.data.contacts;

      if (users.length > 0) {
        const updatedList: ContactsProps[] = contacts.map(
          (contact: Friends) => {
            const matchingUser = users.find(
              (user) => user.id === contact.user2Id
            );
            return {
              ...contact,
              username: matchingUser ? matchingUser.name : null
            };
          }
        );
        setContacts(updatedList);
        setLoading(false);
      }
    };
    fetchContacts();
  }, [user, users]);

  const setUpdatedContacts = (data: ContactsProps) => {
    setContacts([...contacts, data]);
  };

  return (
    <ContactsContext.Provider value={{ contacts, loading, setUpdatedContacts }}>
      {children}
    </ContactsContext.Provider>
  );
}
