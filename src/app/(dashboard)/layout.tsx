import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import Dashboard from '@/components/dashboard/dashboard';
import { ChatsProvider } from '@/components/providers/chats-provider';
import { ContactsProvider } from '@/components/providers/contacts-provider';
import MessagesProvider from '@/components/providers/messages-provider';
import { ProfilesProvider } from '@/components/providers/profiles-provider';
import { RequestsProvider } from '@/components/providers/requests-provider';
import { SocketProvider } from '@/components/providers/socket-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { UserProvider } from '@/components/providers/user-provider';
import { Toaster } from '@/components/ui/sonner';

import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ConvoNest',
  description: 'Place to have some fun conversations'
};
export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <ProfilesProvider>
            <UserProvider>
              <SocketProvider>
                <ChatsProvider>
                  <ContactsProvider>
                    <RequestsProvider>
                      <MessagesProvider>
                        <Dashboard>
                          {children}
                          <Toaster duration={1500} position="top-right" />
                        </Dashboard>
                      </MessagesProvider>
                    </RequestsProvider>
                  </ContactsProvider>
                </ChatsProvider>
              </SocketProvider>
            </UserProvider>
          </ProfilesProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
