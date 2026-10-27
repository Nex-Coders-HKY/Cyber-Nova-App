'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onIdTokenChanged, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

export type Role = 'admin' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onIdTokenChanged also fires when a token is refreshed, so new role claims are picked up.
    const unsub = onIdTokenChanged(auth, async (fbUser) => {
      if (!fbUser) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        // The role is a custom claim set by the server. The browser cannot change it.
        const token = await fbUser.getIdTokenResult();
        const claim = token.claims.role;
        if (claim === 'admin' || claim === 'student') {
          setUser({
            id: fbUser.uid,
            name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
            email: fbUser.email ?? '',
            role: claim,
          });
        } else {
          setUser(null);
        }
      } catch (e) {
        console.error('Failed to read auth claims:', e);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin: user?.role === 'admin', loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
