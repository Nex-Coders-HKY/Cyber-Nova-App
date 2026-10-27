'use client';

import React, { useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { ShieldCheck, ShieldX } from 'lucide-react';

type CertResult = { holderName: string; courseTitle: string; issuedOn: string; status: string };

export default function VerifyPage() {
  const [certId, setCertId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CertResult | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [lastChecked, setLastChecked] = useState(0);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setNotFound(false);
    const id = certId.trim();
    if (!id) {
      setError('Please enter a certificate ID.');
      return;
    }
    // Client-side cooldown only. Real rate limiting needs Firebase App Check.
    if (Date.now() - lastChecked < 3000) {
      setError('Please wait a few seconds before checking again.');
      return;
    }
    setLastChecked(Date.now());
    setLoading(true);
    try {
      // Exact match: the certificate ID is the Firestore document ID.
      const snap = await getDoc(doc(db, 'certificates', id));
      if (!snap.exists()) setNotFound(true);
      else setResult(snap.data() as CertResult);
    } catch (err) {
      console.error(err);
      setError('We could not complete the check. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-xl mx-auto min-h-[70vh]">
        <h1 className="font-syne text-3xl font-extrabold text-white mb-2">Verify Certificate</h1>
        <p className="text-sm text-[#888899] mb-6">Enter the exact certificate ID printed on your certificate.</p>

        <form onSubmit={handleVerify} className="flex flex-col gap-3" noValidate>
          <label htmlFor="cert-id" className="text-xs text-[#888899]">Certificate ID</label>
          <input
            id="cert-id"
            value={certId}
            onChange={(e) => setCertId(e.target.value)}
            placeholder="e.g. CNA-2026-003"
            autoComplete="off"
            className="w-full px-4 py-3 rounded-xl bg-[#1a1a26] border border-[#2a2a3a] text-white font-mono"
          />
          <button type="submit" disabled={loading} className="py-3 rounded-xl bg-[#6c63ff] text-white font-bold disabled:opacity-60">
            {loading ? 'Checking…' : 'Verify'}
          </button>
        </form>

        <div role="status" aria-live="polite" className="mt-6">
          {error && <p className="text-sm text-red-400">{error}</p>}
          {notFound && (
            <div className="p-4 rounded-xl border border-red-500/40 text-red-300 flex gap-2">
              <ShieldX className="w-5 h-5 shrink-0" />
              <span>No genuine certificate matches this ID.</span>
            </div>
          )}
          {result && (
            <div className="p-5 rounded-xl border border-[#43e97b]/40 bg-[#111118] text-white space-y-1">
              <div className={`flex items-center gap-2 font-bold ${result.status === 'valid' ? 'text-[#02fd88]' : 'text-red-300'}`}>
                {result.status === 'valid' ? <ShieldCheck className="w-5 h-5" /> : <ShieldX className="w-5 h-5" />}
                <span>{result.status === 'valid' ? 'Certificate verified' : `This certificate is ${result.status}`}</span>
              </div>
              <p><span className="text-[#888899]">Holder:</span> {result.holderName}</p>
              <p><span className="text-[#888899]">Course:</span> {result.courseTitle}</p>
              <p><span className="text-[#888899]">Issued:</span> {result.issuedOn}</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
