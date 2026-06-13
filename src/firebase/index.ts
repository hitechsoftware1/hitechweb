import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';

let app: FirebaseApp | undefined;
let db: Firestore | undefined;
let authInstance: Auth | undefined;

export function initializeFirebase() {
  // Ensure we have a valid config before initializing
  if (!firebaseConfig.apiKey || firebaseConfig.apiKey.includes('mock-key')) {
    console.warn("HITECH Core: Using fallback Firebase configuration. Authentication features may be limited until environment variables are set.");
  }

  if (!app) {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    db = getFirestore(app);
    authInstance = getAuth(app);
  }

  return { 
    firebaseApp: app, 
    firestore: db as Firestore, 
    auth: authInstance as Auth 
  };
}

export * from './provider';
export * from './client-provider';
export * from './auth/use-user';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './error-emitter';
export * from './errors';
