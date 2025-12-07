// Firebase Configuration
// Replace these values with your actual Firebase project configuration
// Get these from: Firebase Console > Project Settings > General > Your apps > Web app

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "your-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "kovan-25458.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "kovan-25458",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "kovan-25458.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "906369026902",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "your-app-id"
  // measurementId removed to prevent analytics warning
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
// Analytics disabled to prevent measurement ID warnings
export const analytics = null;

export default app;
