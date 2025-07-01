import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { User } from 'firebase/auth';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';

import { auth, db } from '../../firebase';

type Movie = {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
};

type UserData = {
  favorites: Movie[];
  watched: Movie[];
  planToWatch: Movie[];
};

type AuthContextType = {
  globalUser: User | null;
  userData: UserData;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserData: (field: keyof UserData, movies: Movie[]) => Promise<void>;
  authLoading: boolean;
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
  const [authLoading, setAuthLoading] = useState(true);

  const fetchUserData = async (uid: string) => {
    try {
      const docRef = doc(db, 'users', uid);
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        setUserData(snap.data() as UserData);
      } else {
        await setDoc(docRef, defaultUserData);
        setUserData(defaultUserData);
      }
    } catch (error) {
      console.error('Eroare la preluarea datelor utilizatorului:', error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      setGlobalUser(res.user);
      await fetchUserData(res.user.uid);
    } catch (error) {
      console.error('Eroare la autentificare:', error);
      throw error;
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', res.user.uid), defaultUserData);
      setGlobalUser(res.user);
      setUserData(defaultUserData);
    } catch (error) {
      console.error('Eroare la înregistrare:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setGlobalUser(null);
      setUserData(defaultUserData);
    } catch (error) {
      console.error('Eroare la deconectare:', error);
      throw error;
    }
  };

  const updateUserData = async (field: keyof UserData, movies: Movie[]) => {
    if (!globalUser) return;
    try {
      const docRef = doc(db, 'users', globalUser.uid);
      await updateDoc(docRef, { [field]: movies });
      setUserData((prev) => ({ ...prev, [field]: movies }));
    } catch (error) {
      console.error('Eroare la actualizarea datelor utilizatorului:', error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setGlobalUser(user);
        fetchUserData(user.uid).finally(() => setAuthLoading(false));
      } else {
        setGlobalUser(null);
        setUserData(defaultUserData);
        setAuthLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{ globalUser, userData, login, signup, logout, updateUserData, authLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth trebuie folosit doar în interiorul unui AuthProvider');
  }
  return context;
};
