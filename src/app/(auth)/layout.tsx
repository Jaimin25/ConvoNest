import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Merienda } from 'next/font/google';
import { MessageCircleMore } from 'lucide-react';

import { ThemeProvider } from '@/components/providers/theme-provider';

import '../globals.css';

const merienda = Merienda({
  subsets: ['latin'],
  variable: '--font-merienda'
});

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ConvoNest',
  description: 'Place to have some fun conversations'
};

export default function AuthLayout({
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
          <div className="flex h-full w-full flex-col items-center justify-center gap-y-6">
            <div className="flex items-center justify-center gap-x-2">
              <p className={`${merienda.variable} font-merienda text-4xl`}>
                ConvoNest
              </p>
              <MessageCircleMore className="h-8 w-8 text-sky-500" />
            </div>
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
