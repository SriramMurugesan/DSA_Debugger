import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiClient, getAuthRedirectUrl } from '../utils/api';

interface User {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => void;
  loginWithGithub: () => void;
  loginWithDev: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await apiClient.get('/auth/me', {
          withCredentials: true // Important for sending HttpOnly cookies
        });
        setUser(data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await apiClient.post('/auth/login', { email, password }, { withCredentials: true });
    setUser(data);
  };

  const register = async (email: string, password: string, name: string) => {
    const { data } = await apiClient.post('/auth/register', { email, password, name }, { withCredentials: true });
    setUser(data);
  };

  const loginWithGoogle = () => {
    window.location.href = getAuthRedirectUrl('google/login');
  };

  const loginWithGithub = () => {
    window.location.href = getAuthRedirectUrl('github/login');
  };

  const loginWithDev = () => {
    window.location.href = getAuthRedirectUrl('dev-login');
  };

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout', {}, { withCredentials: true });
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      setUser(null);
      window.location.href = '/';
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, loginWithGithub, loginWithDev, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
