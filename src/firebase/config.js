// src/firebase/config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBFIJJQNt5hcIM61K-6FePp5N9Yg3zRgBU",
  authDomain: "agrimart-8a0cc.firebaseapp.com",
  projectId: "agrimart-8a0cc",
  storageBucket: "agrimart-8a0cc.appspot.com", // ✅ fixed here
  messagingSenderId: "478288068444",
  appId: "1:478288068444:web:9af7c0184b6be885ac8b99",
  measurementId: "G-8V28PSZYZ9"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // optional
export default app;
