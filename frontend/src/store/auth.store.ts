import { create } from 'zustand';
import Cookies from 'js-cookie';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'property_owner' | 'regular_user';
}

export interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  getToken: () => string | null;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  
  setUser: (user: User | null) => {
    set({ 
      user, 
      isAuthenticated: !!user 
    });
  },
  
  setToken: (token: string | null) => {
    if (token) {
      Cookies.set('access_token', token, { 
        path: '/',
        expires: 7,
        sameSite: 'lax',
      });
    } else {
      Cookies.remove('access_token');
    }
  },
  
  getToken: () => {
    return Cookies.get('access_token') || null;
  },
  
  logout: () => {
    Cookies.remove('access_token');
    set({ user: null, isAuthenticated: false });
  },
  
  hydrate: () => {
    const token = Cookies.get('access_token');
    if (token) {
      set({ isAuthenticated: true });
    }
  },
}));
