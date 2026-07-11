import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Nav from '@/components/Nav';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Webster House — Vacation Rental',
  description: 'Your home away from home. Two beautiful units available in the heart of the city.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-stone-50 text-stone-800`}>
        <Nav />
        <main className="min-h-screen pt-16">{children}</main>
        <footer className="bg-stone-800 text-stone-400 text-center py-6 text-sm mt-16">
          <p>© {new Date().getFullYear()} Webster House &nbsp;|&nbsp; Portland, OR</p>
        </footer>
      </body>
    </html>
  );
}
