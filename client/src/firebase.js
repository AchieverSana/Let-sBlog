import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'mern-auth-1c4ae.firebaseapp.com',
  projectId: 'mern-auth-1c4ae',
  storageBucket: 'mern-auth-1c4ae.appspot.com',
  messagingSenderId: '277641423672',
  appId: '1:277641423672:web:2de25252aae022d51aafcd',
};

const app = initializeApp(firebaseConfig);

// Export both default (for OAuth.jsx) and named (for CreatePost/UpdatePost)
export { app };
export default app;
