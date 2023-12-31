import React from "react";
import type { Metadata } from "next";
import "../globals.css";

import { Inter } from "next/font/google";
import { MessageCircleMore } from "lucide-react";
import { Merienda } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";

const merienda = Merienda({
  subsets: ["latin"],
  variable: "--font-merienda",
});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ConvoNest",
  description: "Place to have some fun conversations",
};

export default function AuthLayout({
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
          <div className="flex flex-col h-full w-full items-center justify-center gap-y-6">
            <div className="flex justify-center items-center gap-x-2">
              <p className={`${merienda.variable} font-merienda text-4xl`}>
                ConvoNest
              </p>
              <MessageCircleMore className="w-8 h-8 text-sky-500" />
            </div>
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
