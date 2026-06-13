/**
 * @fileOverview Firebase Configuration.
 * Using environment variables to support multiple deployment environments (Vercel/GitHub).
 */

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBRyC8po23tjOvrGrvT6FxQa9nPUl_ui4w",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "studio-5459364483-a76ee.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "studio-5459364483-a76ee",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "studio-5459364483-a76ee.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "710506944518",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:710506944518:web:83b3f48c17c8f425584b87"
};
