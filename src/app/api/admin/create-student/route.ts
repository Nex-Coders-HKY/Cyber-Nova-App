import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { FieldValue } from 'firebase-admin/firestore';
import { getAdmin } from '@/lib/firebase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: Request) {
  const header = req.headers.get('authorization') || '';
  const idToken = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!idToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let admin: ReturnType<typeof getAdmin>;
  let adminUid: string;
  try {
    admin = getAdmin();
    const decoded = await admin.adminAuth.verifyIdToken(idToken, true);
    if (decoded.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    adminUid = decoded.uid;
  } catch (err) {
    console.error('Admin auth check failed:', err);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const email = String(body.email ?? '').trim().toLowerCase();
    const name = String(body.name ?? '').trim().slice(0, 80);
    const phone = String(body.phone ?? '').trim().slice(0, 25);
    if (!EMAIL_RE.test(email)) return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
    if (name.length < 2) return NextResponse.json({ error: 'Enter the student name.' }, { status: 400 });

    // Random password the admin never sees. The student sets their own via a reset email.
    const user = await admin.adminAuth.createUser({
      email,
      displayName: name,
      password: randomBytes(24).toString('base64url'),
    });
    await admin.adminAuth.setCustomUserClaims(user.uid, { role: 'student' });
    await admin.adminDb.collection('students').doc(user.uid).set({
      name, email, phone, createdAt: FieldValue.serverTimestamp(), createdBy: adminUid,
    });
    return NextResponse.json({ uid: user.uid }, { status: 201 });
  } catch (err: any) {
    if (err?.code === 'auth/email-already-exists') {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
    }
    if (err?.code === 'auth/invalid-email') {
      return NextResponse.json({ error: 'Invalid email format.' }, { status: 400 });
    }
    console.error('Create student failed:', err);
    return NextResponse.json({ error: 'Could not create the student account.' }, { status: 500 });
  }
}
