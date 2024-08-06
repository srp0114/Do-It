'use client';

import { QueryClient, QueryClientProvider } from 'react-query';
import { Inter } from 'next/font/google';
import './globals.css';
import GNB from '@/app/components/GNB';

const inter = Inter({ subsets: ['latin'] });

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
          <GNB />
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
