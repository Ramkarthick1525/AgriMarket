// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase/config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
} from 'firebase/firestore';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        if (firebaseUser.email === 'tamilvaanan2004@gmail.com') {
          const adminUser = {
            name: 'Admin',
            email: firebaseUser.email,
            role: 'admin',
          };
          setUser(adminUser);
        } else {
          const docRef = doc(db, 'users', firebaseUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUser({ ...docSnap.data(), email: firebaseUser.email, role: 'user' });
          } else {
            setUser({ email: firebaseUser.email, role: 'user' });
          }
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    const res = await signInWithEmailAndPassword(auth, email, password);
if (res.user.email === 'tamilvaanan2004@gmail.com') {
  const adminUser = {
    name: 'Admin',
    email: res.user.email,
    role: 'admin',
  };
  setUser(adminUser);
  toast.success('Logged in as Admin');
  return adminUser;
}


    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const docRef = doc(db, 'users', res.user.uid);
      const docSnap = await getDoc(docRef);
      const userData = docSnap.exists() ? docSnap.data() : {};
      const loggedInUser = { ...userData, email: res.user.email, role: 'user' };
      setUser(loggedInUser);
      toast.success('Logged in successfully');
      return loggedInUser;
    } catch (err) {
      toast.error('Login failed: ' + err.message);
      throw err;
    }
  };

  const register = async (email, password, name) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = {
        name,
        email,
        role: 'user',
      };

      await setDoc(doc(db, 'users', res.user.uid), newUser);
      setUser(newUser);
      toast.success('Account created successfully');
      return newUser;
    } catch (err) {
      toast.error('Registration failed: ' + err.message);
      throw err;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    toast.success('Logged out');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAdmin: user?.role === 'admin',
    isUser: user?.role === 'user',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
