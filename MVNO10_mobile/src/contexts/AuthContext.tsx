import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi, setToken, userApi } from '../services/api';
import type { AuthUser } from '../types/api';

type AuthContextValue = {
  user?: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  reloadProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem('accessToken');
        if (saved) {
          await setToken(saved);
          // try loading profile via dashboard (includes numbers/balance)
          try {
            const dash = await userApi.getDashboard();
            setUser(dash.user);
          } catch {
            const me = await userApi.getProfile();
            setUser(me);
          }
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    await setToken(res.token);
    // load user
    const dash = await userApi.getDashboard();
    setUser(dash.user);
  };

  const register = async (email: string, username: string, password: string) => {
    await authApi.register(email, username, password);
    // After registration, immediately log in for convenience
    const loginRes = await authApi.login(email, password);
    await setToken(loginRes.token);
    const dash = await userApi.getDashboard();
    setUser(dash.user);
  };

  const logout = async () => {
    await setToken(undefined);
    setUser(null);
  };

  const reloadProfile = async () => {
    const dash = await userApi.getDashboard();
    setUser(dash.user);
  };

  const value = useMemo(() => ({ user, isLoading, login, register, logout, reloadProfile }), [user, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
