import { cert, getApp, getApps, initializeApp, type App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Server only. Set FIREBASE_SERVICE_ACCOUNT_JSON in the server environment.
// Never prefix it with NEXT_PUBLIC_ and never import this file from a client component.
export function getAdmin() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON is not set');
  const app: App = getApps().length ? getApp() : initializeApp({ credential: cert(JSON.parse(raw)) });
  return { adminAuth: getAuth(app), adminDb: getFirestore(app) };
}
