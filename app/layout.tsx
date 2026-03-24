import type { Metadata } from "next";
import { Roboto_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/queryProvider";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "@/components/ui/sonner";

const roboto = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Jira Clone",
  description: "This is an jira clone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${roboto.className} antialiased`}>
        <NuqsAdapter>
          <QueryProvider>
            <Toaster />
            {children}
          </QueryProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
