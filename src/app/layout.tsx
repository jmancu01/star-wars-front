// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navigation from '@/app/components/navigation';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Star Wars Hub',
  description: 'Explore the Star Wars universe',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {    
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}