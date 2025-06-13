import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser ? 'User logged in' : 'User logged out');
      
      if (firebaseUser) {
        try {
          // Get user role from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          const userData = userDoc.data();
          console.log('User data from Firestore:', userData);
          
          setUser(firebaseUser);
          setUserRole(userData?.role || 'user');
        } catch (error) {
          console.error('Error fetching user data:', error);
          // If Firestore fails, still set the user but with default role
          setUser(firebaseUser);
          setUserRole('user');
        }
      } else {
        setUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [10]);

  const login = async (email, password) => {
    try {
      setLoading(true);
      console.log('Attempting login for:', email);
      
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful:', result.user.uid);
      
      // Get user role after login
      try {
        const userDoc = await getDoc(doc(db, 'users', result.user.uid));
        const userData = userDoc.data();
        console.log('User role data:', userData);
        setUserRole(userData?.role || 'user');
      } catch (firestoreError) {
        console.warn('Could not fetch user role from Firestore:', firestoreError);
        setUserRole('user'); // Default to user role
      }
      
      toast.success('Successfully logged in!');
      return result;
    } catch (error) {
      console.error('Login error:', error);
      
      // Provide specific error messages
      let errorMessage = 'Login failed. Please try again.';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email address.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password. Please try again.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address format.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your internet connection.';
          break;
        case 'auth/invalid-credential':
          errorMessage = 'Invalid email or password. Please check your credentials.';
          break;
        default:
          errorMessage = error.message || 'An unexpected error occurred.';
      }
      
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, name, role = 'user') => {
    try {
      setLoading(true);
      console.log('Attempting registration for:', email);
      
      const result = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Registration successful:', result.user.uid);
      
      // Update profile
      await updateProfile(result.user, { displayName: name });
      
      // Store user data in Firestore
      try {
        await setDoc(doc(db, 'users', result.user.uid), {
          name,
          email,
          role,
          createdAt: new Date().toISOString()
        });
        console.log('User data saved to Firestore');
      } catch (firestoreError) {
        console.warn('Could not save user data to Firestore:', firestoreError);
        // Continue with registration even if Firestore fails
      }
      
      setUserRole(role);
      toast.success('Account created successfully!');
      return result;
    } catch (error) {
      console.error('Registration error:', error);
      
      let errorMessage = 'Registration failed. Please try again.';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'An account with this email already exists.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address format.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak. Please use at least 6 characters.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your internet connection.';
          break;
        default:
          errorMessage = error.message || 'An unexpected error occurred.';
      }
      
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserRole(null);
      toast.success('Successfully logged out!');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error logging out. Please try again.');
      throw error;
    }
  };

  const value = {
    user,
    userRole,
    loading,
    login,
    register,
    logout,
    isAdmin: userRole === 'admin',
    isUser: userRole === 'user'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};