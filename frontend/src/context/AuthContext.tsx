import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface UserSession {
  _id: string;
  username: string;
  email: string;
  token: string;
}

interface AuthContextType {
  user: UserSession | null;
  login: (userData: UserSession) => void;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user credentials already exist in local browser cache
    const storedUser = localStorage.getItem('taskplanet_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('taskplanet_user');
      }
    }
    setLoading(false);
  } , []);

  const login = (userData: UserSession) => {
    localStorage.setItem('taskplanet_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('taskplanet_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};