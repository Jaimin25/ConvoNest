import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import Dashboard from '@/components/dashboard/dashboard';
import { ContactsProvider } from '@/components/providers/contacts-provider';
import { ProfilesProvider } from '@/components/providers/profiles-provider';
import { RequestsProvider } from '@/components/providers/requests-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { UserProvider } from '@/components/providers/user-provider';

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
              <ContactsProvider>
                <RequestsProvider>
                  <Dashboard>{children}</Dashboard>
                </RequestsProvider>
              </ContactsProvider>
            </UserProvider>
          </ProfilesProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
