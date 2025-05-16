
'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  // createUserWithEmailAndPassword as firebaseCreateUserWithEmailAndPassword // Optional: if you add sign up
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<User | null>;
  signInWithEmail: (email: string, password: string) => Promise<User | null>;
  // createUserWithEmail: (email: string, password: string) => Promise<User | null>; 
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Ensure NEXT_PUBLIC_ADMIN_UID is defined and accessible
        if (typeof process.env.NEXT_PUBLIC_ADMIN_UID === 'string') {
          setIsAdmin(currentUser.uid === process.env.NEXT_PUBLIC_ADMIN_UID);
        } else {
          console.warn("NEXT_PUBLIC_ADMIN_UID is not defined. Admin check will fail.");
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error; // Re-throw the error to be caught by the caller
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const result = await firebaseSignInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error) {
      console.error("Error signing in with email:", error);
      throw error; // Re-throw the error to be caught by the caller
    }
  };

  // const createUserWithEmail = async (email: string, password: string) => {
  //   try {
  //     const result = await firebaseCreateUserWithEmailAndPassword(auth, email, password);
  //     return result.user;
  //   } catch (error) {
  //     console.error("Error creating user with email:", error);
  //     throw error; 
  //   }
  // };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
      // Optionally re-throw or handle as needed
    }
  };


  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, signInWithGoogle, signInWithEmail, signOut }}>
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
