import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import Dashboard from '@/components/dashboard/dashboard';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import { ChatsProvider } from '@/components/providers/chats-provider';
import { ContactsProvider } from '@/components/providers/contacts-provider';
import MessagesProvider from '@/components/providers/messages-provider';
import { ProfilesProvider } from '@/components/providers/profiles-provider';
import { RequestsProvider } from '@/components/providers/requests-provider';
import { SocketProvider } from '@/components/providers/socket-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { UserProvider } from '@/components/providers/user-provider';
import { Toaster } from '@/components/ui/sonner';
import { Analytics } from '@vercel/analytics/react';

import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ConvoNest',
  description: 'Place to have some fun conversations',
  openGraph: {
    title: 'ConvoNest',
    description:
      'ConvoNest is a realtime web application for chatting, where you can add friends and chat with them individually or in a group.',
    images: [
      {
        url: `https://raw.githubusercontent.com/Jaimin25/ConvoNest/refs/heads/main/public/Link%20Preview%20-%20ConvoNest.png`,
        width: 1200,
        height: 630,
        alt: 'DayDonezo'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    site: '@jaimin_chovatia',
    creator: '@jaimin_chovatia',
    title: 'ConvoNest - Chat App',
    description:
      'ConvoNest is a realtime web application for chatting, where you can add friends and chat with them individually or in a group.',
    images: [
      {
        url: 'https://raw.githubusercontent.com/Jaimin25/ConvoNest/refs/heads/main/public/Link%20Preview%20-%20ConvoNest.png',
        width: 1200,
        height: 630,
        alt: 'ConvoNest'
      }
    ]
  }
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
          <UserProvider>
            <SocketProvider>
              <ProfilesProvider>
                <ChatsProvider>
                  <ContactsProvider>
                    <RequestsProvider>
                      <MessagesProvider>
                        <Dashboard>
                          {children}
                          <Toaster duration={1500} position="top-right" />
                          <Analytics />
                          {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS ? (
                            <GoogleAnalytics
                              ga_id={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}
                            />
                          ) : null}
                        </Dashboard>
                      </MessagesProvider>
                    </RequestsProvider>
                  </ContactsProvider>
                </ChatsProvider>
              </ProfilesProvider>
            </SocketProvider>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
