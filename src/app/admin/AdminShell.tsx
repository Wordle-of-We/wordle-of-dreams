'use client'

import { ReactNode, useState } from 'react'
import { AuthProvider } from '@/contexts/AuthContext'
import { Sidebar } from '@/components/Sidebar'

export default function AdminShell({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false)

  return (
    <AuthProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={() => setSidebarOpen((o) => !o)}
        />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
          {children}
        </main>
      </div>
    </AuthProvider>
  )
}
