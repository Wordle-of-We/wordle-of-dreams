'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
} from 'react';
import type { User } from '../interfaces/User';
import { authAdmin } from '../services/authAdmin';
import { authUser } from '../services/authUser';

type AuthKind = 'admin' | 'user';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register?: (payload: { email: string; password: string; username: string }) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

interface AuthProviderProps {
  kind: AuthKind;
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ kind, children }) => {
  const svc = useMemo(() => (kind === 'admin' ? authAdmin : authUser), [kind]);

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProfile = async () => {
    try {
      const u = await svc.getProfile();
      setUser(u);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      setIsLoading(true);

      const tokenKey = kind === 'admin' ? 'adminToken' : 'userToken';
      const hasToken =
        typeof window !== 'undefined' && !!localStorage.getItem(tokenKey);

      if (!hasToken) {
        if (mounted) {
          setUser(null);
          setIsLoading(false);
        }
        return;
      }

      try {
        const u = await svc.getProfile();
        if (mounted) setUser(u);
      } catch {
        if (mounted) setUser(null);
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [svc, kind]);

  const login = async (email: string, password: string) => {
    const { user: u } = await svc.login(email, password);
    setUser(u);
  };

  const logout = () => {
    svc.logout();
    setUser(null);
  };

  const register =
    kind === 'user'
      ? async (payload: { email: string; password: string; username: string }) => {
        await authUser.register(payload);
      }
      : undefined;

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, logout, register, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const AdminAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => (
  <AuthProvider kind="admin">{children}</AuthProvider>
);

export const UserAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => (
  <AuthProvider kind="user">{children}</AuthProvider>
);
