import Navbar from '@/components/Navbar'
import '@/app/globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'Wordle of Dreams',
  description: 'Adivinhe personagens incríveis com base em suas características!',
}

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="pt-25 px-5 w-max mx-auto">{children}</main>
    </>
  )
}
