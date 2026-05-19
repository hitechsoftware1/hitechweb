'use client';

import React, { useMemo } from 'react';
import { initializeFirebase } from './index';
import { FirebaseProvider } from './provider';

export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Initialize Firebase only once on the client with error boundaries
  const firebase = useMemo(() => {
    try {
      return initializeFirebase();
    } catch (error) {
      console.error("HITECH Neural Core: Critical failure during Firebase initialization.", error);
      return null;
    }
  }, []);

  if (!firebase) {
    return <>{children}</>;
  }

  return (
    <FirebaseProvider 
      firebaseApp={firebase.firebaseApp} 
      firestore={firebase.firestore} 
      auth={firebase.auth}
    >
      {children}
    </FirebaseProvider>
  );
}
