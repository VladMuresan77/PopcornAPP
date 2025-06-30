import { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from "../../firebase"

const AuthContext = createContext(null);

export const AuthProvider = ({ children }: any) => {
  const [globalUser, setGlobalUser] = useState(null);
  const [userData, setUserData] = useState({ favorites: [], watched: [], planToWatch: [] });

  const fetchUserData = async (uid: string) => {
    const docRef = doc(db, 'users', uid);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      setUserData(snap.data());
    } else {
      await setDoc(docRef, { favorites: [], watched: [], planToWatch: [] });
      setUserData({ favorites: [], watched: [], planToWatch: [] });
    }
  };

  const login = async (email: string, password: string) => {
    const res = await signInWithEmailAndPassword(auth, email, password);
    await fetchUserData(res.user.uid);
    setGlobalUser(res.user);
  };

  const signup = async (email: string, password: string) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, 'users', res.user.uid), {
      favorites: [],
      watched: [],
      planToWatch: [],
    });
    setGlobalUser(res.user);
    setUserData({ favorites: [], watched: [], planToWatch: [] });
  };

  const logout = () => {
    signOut(auth);
    setGlobalUser(null);
    setUserData({ favorites: [], watched: [], planToWatch: [] });
  };

  const updateUserData = async (field: string, movies: any[]) => {
    if (!globalUser) return;
    await setDoc(doc(db, 'users', globalUser.uid), { ...userData, [field]: movies });
    setUserData((prev) => ({ ...prev, [field]: movies }));
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setGlobalUser(user);
        fetchUserData(user.uid);
      } else {
        setGlobalUser(null);
        setUserData({ favorites: [], watched: [], planToWatch: [] });
      }
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ globalUser, userData, login, signup, logout, updateUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
