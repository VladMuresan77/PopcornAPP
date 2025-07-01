import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';

type UserData = {
  favorites: any[];
  watched: any[];
  planToWatch: any[];
};

type AuthContextType = {
  globalUser: User | null;
  userData: UserData;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserData: (field: keyof UserData, movies: any[]) => Promise<void>;
};

const defaultUserData: UserData = {
  favorites: [],
  watched: [],
  planToWatch: [],
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [globalUser, setGlobalUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData>(defaultUserData);

  const fetchUserData = async (uid: string) => {
    const docRef = doc(db, 'users', uid);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      setUserData(snap.data() as UserData);
    } else {
      await setDoc(docRef, defaultUserData);
      setUserData(defaultUserData);
    }
  };

  const login = async (email: string, password: string) => {
    const res = await signInWithEmailAndPassword(auth, email, password);
    setGlobalUser(res.user);
    await fetchUserData(res.user.uid);
  };

  const signup = async (email: string, password: string) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, 'users', res.user.uid), defaultUserData);
    setGlobalUser(res.user);
    setUserData(defaultUserData);
  };

  const logout = async () => {
    await signOut(auth);
    setGlobalUser(null);
    setUserData(defaultUserData);
  };

  const updateUserData = async (field: keyof UserData, movies: any[]) => {
    if (!globalUser) return;
    const docRef = doc(db, 'users', globalUser.uid);
    const updatedData = { ...userData, [field]: movies };
    await setDoc(docRef, updatedData);
    setUserData(updatedData);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setGlobalUser(user);
        fetchUserData(user.uid);
      } else {
        setGlobalUser(null);
        setUserData(defaultUserData);
      }
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{ globalUser, userData, login, signup, logout, updateUserData }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
