
import React, { createContext, useContext, useState } from 'react';
import { User } from '../types';
import { db } from '../services/db';

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => any;
  verifyOTP: (userId: string, code: string) => any;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(db.getCurrentUser());

  const login = (email: string, pass: string) => {
    const res = db.login(email, pass);
    if (res.success && !res.requiresOTP) setUser(res.user!);
    return res;
  };

  const verifyOTP = (userId: string, code: string) => {
    // Fix: Updated call to verifyOTP as per MockDatabase definition in frontend/services/db.ts
    const res = db.verifyOTP(userId, code);
    if (res.success) setUser(res.user!);
    return res;
  };

  const logout = () => {
    db.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, verifyOTP, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
