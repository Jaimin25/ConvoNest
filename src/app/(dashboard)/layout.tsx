import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Dashboard from "@/components/dashboard/dashboard";
import { ProfilesProvider } from "@/components/providers/profiles-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";

import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ConvoNest",
  description: "Place to have some fun conversations",
};
export default function RootLayout({
  children,
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
            <Dashboard>{children}</Dashboard>
          </ProfilesProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
