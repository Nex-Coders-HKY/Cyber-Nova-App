// Usage: node scripts/set-admin.mjs admin@example.com
// Run once per admin, locally. The admin must already exist in Firebase Authentication.
// Needs service-account.json in the project root (gitignored) or FIREBASE_SERVICE_ACCOUNT_PATH.
import { readFileSync } from 'node:fs';
import { cert, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const email = process.argv[2]?.trim().toLowerCase();
if (!email) {
  console.error('Usage: node scripts/set-admin.mjs admin@example.com');
  process.exit(1);
}

const saPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || 'service-account.json';
const app = initializeApp({ credential: cert(JSON.parse(readFileSync(saPath, 'utf8'))) });
const auth = getAuth(app);

const user = await auth.getUserByEmail(email);
await auth.setCustomUserClaims(user.uid, { role: 'admin' });
console.log(`${email} is now an admin. They must log out and log in again.`);
process.exit(0);
