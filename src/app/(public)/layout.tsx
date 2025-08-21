import Navbar from '@/components/Navbar';
import '@/app/globals.css';
import { ReactNode } from 'react';
import { UserAuthProvider } from '@/contexts/AuthContext';

export const metadata = {
  title: 'Wordle of Dreams',
  description: 'Adivinhe personagens incríveis com base em suas características!',
};

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <UserAuthProvider>
      <Navbar />
      <div aria-hidden className="h-16" />
      <main className="px-5 max-w-10xl mx-auto w-full">{children}</main>
    </UserAuthProvider>
  );
}
