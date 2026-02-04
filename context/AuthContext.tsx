
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { db } from '../services/db';

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => any;
  verifyOTP: (userId: string, code: string) => any;
  logout: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(db.getCurrentUser());

  const login = (email: string, pass: string) => {
    const res = db.login(email, pass);
    if (res.success && !res.requiresOTP) {
      setUser(res.user!);
    }
    return res;
  };

  const verifyOTP = (userId: string, code: string) => {
    const res = db.verifyLoginOTP(userId, code);
    if (res.success) {
      setUser(res.user!);
    }
    return res;
  };

  const logout = () => {
    db.logout();
    setUser(null);
  };

  const refreshUser = () => {
    setUser(db.getCurrentUser());
  };

  return (
    <AuthContext.Provider value={{ user, login, verifyOTP, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
