
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize Auth State (Simulate Firebase onAuthStateChanged)
  useEffect(() => {
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    // Simulate Network Request
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (email.includes('@') && password.length >= 6) {
          const newUser: UserProfile = {
            uid: 'firebase-uid-' + Date.now(),
            email,
            displayName: email.split('@')[0],
            role: 'admin',
            photoURL: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=0D8ABC&color=fff`
          };
          setUser(newUser);
          localStorage.setItem('auth_user', JSON.stringify(newUser));
          resolve();
        } else {
          reject(new Error('Invalid email or password.'));
        }
      }, 1000);
    });
  };

  const signUp = async (email: string, password: string) => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (email.includes('@') && password.length >= 6) {
           const newUser: UserProfile = {
            uid: 'firebase-uid-' + Date.now(),
            email,
            displayName: email.split('@')[0],
            role: 'auditor'
          };
          setUser(newUser);
          localStorage.setItem('auth_user', JSON.stringify(newUser));
          resolve();
        } else {
          reject(new Error('Failed to create account. Password too weak?'));
        }
      }, 1500);
    });
  };

  const signInWithGoogle = async () => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const newUser: UserProfile = {
          uid: 'google-uid-' + Date.now(),
          email: 'google.user@demo.com',
          displayName: 'Google User',
          role: 'admin',
          photoURL: 'https://lh3.googleusercontent.com/a/default-user=s96-c' // Simulated Google Avatar
        };
        setUser(newUser);
        localStorage.setItem('auth_user', JSON.stringify(newUser));
        resolve();
      }, 1500);
    });
  };

  const signOut = async () => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setUser(null);
        localStorage.removeItem('auth_user');
        resolve();
      }, 500);
    });
  };

  const resetPassword = async (email: string) => {
     return new Promise<void>((resolve, reject) => {
         setTimeout(() => {
             if(email.includes('@')) {
                 resolve();
             } else {
                 reject(new Error("Invalid email address"));
             }
         }, 1000);
     });
  };

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
