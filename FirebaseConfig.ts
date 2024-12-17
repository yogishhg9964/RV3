import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA3ysGTUgUrKSTS5XH8Nvb_NlstbSlPHE4",
  authDomain: "rv-visitor-management.firebaseapp.com",
  projectId: "rv-visitor-management",
  storageBucket: "rv-visitor-management.firebasestorage.app",
  messagingSenderId: "659878986292",
  appId: "1:659878986292:web:10e0f58c20029d16084061",
  measurementId: "G-34Y88G8X56"
};

// Initialize Firebase only if it hasn't been initialized already
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

export default app; 