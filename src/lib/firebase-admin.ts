import { getApps, initializeApp, cert, type App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

let adminApp: App | undefined;

/**
 * Server-only Firebase Admin singleton. Requires FIREBASE_PROJECT_ID,
 * FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY (from a Firebase service
 * account key) to be set in the environment — these are separate from the
 * NEXT_PUBLIC_FIREBASE_* client config and must never be exposed to the
 * browser.
 */
export function getFirebaseAdmin() {
  if (!adminApp) {
    if (getApps().length > 0) {
      adminApp = getApps()[0];
    } else {
      const projectId = process.env.FIREBASE_PROJECT_ID;
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
      const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

      if (!projectId || !clientEmail || !privateKey) {
        throw new Error(
          'Firebase Admin is not configured. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY (from a Firebase service account key) in the environment.'
        );
      }

      adminApp = initializeApp({
        credential: cert({ projectId, clientEmail, privateKey }),
      });
    }
  }

  return {
    app: adminApp,
    auth: getAuth(adminApp),
    firestore: getFirestore(adminApp),
  };
}
