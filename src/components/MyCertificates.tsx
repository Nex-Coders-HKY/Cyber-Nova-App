'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { Award, ShieldCheck, ShieldX } from 'lucide-react';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

type Cert = { id: string; holderName: string; courseTitle: string; issuedOn: string; status: string };

// Live list: when an admin edits a certificate, the student sees the change immediately.
export default function MyCertificates() {
  const { user } = useAuth();
  const [certs, setCerts] = useState<Cert[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'certificates'), where('studentUid', '==', user.id));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setCerts(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Cert, 'id'>) })));
        setLoaded(true);
      },
      (err) => {
        console.error(err);
        setError('Could not load your certificates. Please refresh the page.');
        setLoaded(true);
      }
    );
    return () => unsub();
  }, [user?.id]);

  return (
    <section className="bg-[#13131e] border border-[#2a2a3a] rounded-3xl p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-[#43e97b]/15 text-[#02fd88] flex items-center justify-center border border-[#43e97b]/30">
          <Award className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-syne font-bold text-white text-lg">My Certificates</h3>
          <p className="text-xs text-[#888899]">Certificates issued to your account by the academy.</p>
        </div>
      </div>

      {!loaded && <p className="text-sm text-[#888899]">Loading…</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}
      {loaded && !error && certs.length === 0 && (
        <p className="text-sm text-[#888899]">No certificates yet. They will appear here once the academy issues them.</p>
      )}

      <div className="space-y-3">
        {certs.map((c) => {
          const valid = c.status === 'valid';
          return (
            <div key={c.id} className="p-4 rounded-xl border border-[#2a2a3a] bg-[#0b0b12]">
              <div className={`flex items-center gap-2 text-sm font-bold ${valid ? 'text-[#02fd88]' : 'text-red-300'}`}>
                {valid ? <ShieldCheck className="w-4 h-4" /> : <ShieldX className="w-4 h-4" />}
                <span>{valid ? 'Valid certificate' : `Status: ${c.status}`}</span>
              </div>
              <p className="text-white mt-2">{c.courseTitle}</p>
              <p className="text-xs text-[#888899]">Holder: {c.holderName} · Issued: {c.issuedOn} · ID: <span className="font-mono">{c.id}</span></p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
