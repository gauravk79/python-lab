import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  browserLocalPersistence,
  type AuthError,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '@/lib/firebase';

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  isConfigured: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const firebaseAuth = auth;

    let cancelled = false;
    let unsubscribe = () => {};

    const initializeAuth = async () => {
      try {
        await setPersistence(firebaseAuth, browserLocalPersistence);
      } catch (error) {
        console.error('Firebase auth initialization failed', error);
      }

      if (cancelled) {
        return;
      }

      unsubscribe = onAuthStateChanged(firebaseAuth, (nextUser) => {
        setUser(nextUser);
        setLoading(false);
      });
    };

    void initializeAuth();

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    if (!auth) {
      throw new Error('Firebase is not configured yet. Add the VITE_FIREBASE_* environment variables first.');
    }

    try {
      await setPersistence(auth, browserLocalPersistence);
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      const authError = error as AuthError;

      // Closing the popup is an expected user action, not an app error.
      if (
        authError?.code === 'auth/popup-closed-by-user' ||
        authError?.code === 'auth/cancelled-popup-request'
      ) {
        return;
      }

      throw error;
    }
  };

  const signOutUser = async () => {
    if (!auth) {
      return;
    }

    await signOut(auth);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isConfigured: isFirebaseConfigured,
      signInWithGoogle,
      signOutUser,
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}