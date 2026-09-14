"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import apiClient from '@/lib/api-client';

type Role = 'admin' | 'property_owner' | 'regular_user';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: Role;
}

interface AuthContextProps {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; name: string; role: Role; adminCode?: string }) => Promise<void>;
  logout: () => void;
}

const getStoredToken = () => {
  if (typeof window === 'undefined') return null;
  return Cookies.get('access_token') || null;
};

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const decodeToken = (token: string): AuthUser | null => {
  try {
    const [, payload] = token.split('.');
    if (!payload) return null;

    const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
    const paddedPayload = normalizedPayload.padEnd(
      normalizedPayload.length + ((4 - (normalizedPayload.length % 4)) % 4),
      '=',
    );
    const decodedPayload = JSON.parse(atob(paddedPayload)) as {
      sub: string;
      email: string;
      name?: string;
      role: Role;
    };

    return {
      id: decodedPayload.sub,
      email: decodedPayload.email,
      name: decodedPayload.name || decodedPayload.email,
      role: decodedPayload.role as Role,
    };
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const storedToken = getStoredToken();
  const [user, setUser] = useState<AuthUser | null>(() => (storedToken ? decodeToken(storedToken) : null));
  const [token, setToken] = useState<string | null>(storedToken);
  const router = useRouter();

  const login = async (email: string, password: string) => {
    const res = await apiClient.post('/auth/login', { email, password });
    Cookies.set('access_token', res.data.accessToken, {
      path: '/',
      expires: 7,
      sameSite: 'lax',
    });
    setToken(res.data.accessToken);
    setUser(res.data.user);
    router.push('/dashboard');
  };

  const register = async (data: { email: string; password: string; name: string; role: Role; adminCode?: string }) => {
    const res = await apiClient.post('/auth/register', data);
    Cookies.set('access_token', res.data.accessToken, {
      path: '/',
      expires: 7,
      sameSite: 'lax',
    });
    setToken(res.data.accessToken);
    setUser(res.data.user);
    router.push('/dashboard');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    Cookies.remove('access_token');
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading: false, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const useRequireRole = (allowedRoles: Role[]) => {
  const { user } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!user) {
      router.push('/');
    } else if (!allowedRoles.includes(user.role)) {
      router.push('/');
    }
  }, [allowedRoles, router, user]);
};
