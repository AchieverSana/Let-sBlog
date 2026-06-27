// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration.
// Each value falls back to this project's real config so the live site
// keeps working even if these extra env vars aren't set on Vercel —
// but anyone cloning this repo can override every field via .env.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    'mern-auth-1c4ae.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'mern-auth-1c4ae',
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    'mern-auth-1c4ae.appspot.com',
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '277641423672',
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    '1:277641423672:web:2de25252aae022d51aafcd',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
