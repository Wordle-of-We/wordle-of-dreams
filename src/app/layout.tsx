import Navbar from './components/Navbar';
import './globals.css';
import { ReactNode } from 'react';


export const metadata = {
  title: 'Wordle of Dreams',
  description: 'Adivinhe personagens incríveis com base em suas características!',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="text-gray-900 min-h-screen">
        <Navbar />
        <main className="pt-25 px-5 w-max mx-auto">{children}</main>
      </body>
    </html>
  );
}
