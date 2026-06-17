
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Persistent mock user for the application
const MOCK_USER: UserProfile = {
  uid: 'default-admin-id',
  email: 'admin@compliance.copilot',
  displayName: 'Compliance Officer',
  role: 'admin',
  photoURL: `https://ui-avatars.com/api/?name=Compliance+Officer&background=0D8ABC&color=fff`
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user] = useState<UserProfile | null>(MOCK_USER);
  const [loading] = useState(false);

  // Authentication methods are now no-ops as auth is removed
  const signIn = async () => {};
  const signUp = async () => {};
  const signInWithGoogle = async () => {};
  const signOut = async () => {};
  const resetPassword = async () => {};

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signInWithGoogle, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
