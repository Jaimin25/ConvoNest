'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import axios from 'axios';
import { toast } from 'sonner';

import { Friends } from '@prisma/client';

import { useProfiles } from './profiles-provider';
import { useSocket } from './socket-provider';
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
  removeContact: (id: string) => void;
  loading: boolean;
}

const ContactsContext = createContext<ContactsContextProps>({
  contacts: [],
  setUpdatedContacts: () => {},
  removeContact: () => {},
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

  const { socket } = useSocket();

  const prevContacts = useRef(contacts);

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

  const setUpdatedContacts = useCallback(
    (data: ContactsProps) => {
      contacts.unshift(data);
      setContacts([...contacts]);
    },
    [contacts, setContacts]
  );

  const removeContact = useCallback(
    (id: string) => {
      const index = contacts.findIndex((contact) => contact.id === id);
      contacts.splice(index, 1);
      setContacts([...contacts]);
    },
    [contacts, setContacts]
  );

  useEffect(() => {
    socket?.on(`user:${user.id}:receive-accept-request`, (data) => {
      if (data.user2Id === user.id) {
        data.user2Id = data.user1Id;
        data.user1Id = user.id;
      }
      setUpdatedContacts(data);
      if (prevContacts.current.length === contacts.length) {
        toast.success(`${data.username} accepted your request`);
      }
    });

    socket?.on(`user:${user.id}:receive-remove-friend`, (data) => {
      removeContact(data.contactId);
    });

    () => {
      socket?.off(`user:${user.id}:receive-accept-request`);
      socket?.off(`user:${user.id}:receive-remove-request`);
    };
  }, [socket, user, removeContact, setUpdatedContacts, contacts]);

  return (
    <ContactsContext.Provider
      value={{ contacts, loading, setUpdatedContacts, removeContact }}
    >
      {children}
    </ContactsContext.Provider>
  );
}
