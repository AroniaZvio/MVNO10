import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, LoginRequest, RegisterRequest } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        // Здесь будет вызов API для получения текущего пользователя
        // Пока используем моковые данные
        const mockUser: User = {
          id: '1',
          email: 'user@example.com',
          firstName: 'Иван',
          lastName: 'Иванов',
          phoneNumber: '+995 555 123 456',
          role: 'USER' as any,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setUser(mockUser);
      }
    } catch (error) {
      console.error('Error getting current user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginRequest) => {
    try {
      setIsLoading(true);
      // Здесь будет вызов API для входа
      // Пока используем моковые данные
      const mockUser: User = {
        id: '1',
        email: credentials.email,
        firstName: 'Иван',
        lastName: 'Иванов',
        phoneNumber: '+995 555 123 456',
        role: 'USER' as any,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const mockToken = 'mock-jwt-token';
      await AsyncStorage.setItem('authToken', mockToken);
      setUser(mockUser);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest) => {
    try {
      setIsLoading(true);
      // Здесь будет вызов API для регистрации
      // Пока используем моковые данные
      const mockUser: User = {
        id: '1',
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNumber: userData.phoneNumber,
        role: 'USER' as any,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const mockToken = 'mock-jwt-token';
      await AsyncStorage.setItem('authToken', mockToken);
      setUser(mockUser);
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    getCurrentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
