'use client';

import { ReactNode } from 'react';
import { AdminAuthProvider } from '@/contexts/AuthContext';

export default function LoginAdminLayout({ children }: { children: ReactNode }) {
  return <AdminAuthProvider>{children}</AdminAuthProvider>;
}
