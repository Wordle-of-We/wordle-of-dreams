import type { ReactNode } from 'react'
import AdminShell from './AdminShell'

export const metadata = {
  title: 'Painel de Administração',
  description: 'Área restrita a administradores',
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>
}
