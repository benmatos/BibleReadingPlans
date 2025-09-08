// src/lib/firebase.ts
// To show how Firebase can be configured, as requested.
// This app uses localStorage for progress tracking for simplicity.
// To use Firebase, you would typically use Firebase Authentication for users
// and Firestore or Realtime Database to store their progress.

import { initializeApp, getApps, getApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
// import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:123456789abcdef",
  measurementId: "G-XXXXXXXXXX"
};

// Initialize Firebase
let app;
if (typeof window !== 'undefined') {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
}
// const db = getFirestore(app);
// const auth = getAuth(app);

// export { app, db, auth };
export { app };
