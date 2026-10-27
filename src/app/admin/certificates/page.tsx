'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { collection, deleteDoc, doc, getDoc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useAuth } from '../../../context/AuthContext';

type Cert = { id: string; holderName: string; courseTitle: string; issuedOn: string; status: string; studentUid: string | null };
type Student = { id: string; name: string; email: string };

const empty = { id: '', holderName: '', courseTitle: '', issuedOn: '', status: 'valid', studentUid: '' };
const ID_RE = /^[A-Za-z0-9-]{4,60}$/;

export default function AdminCertificatesPage() {
  const { isAdmin, loading } = useAuth();
  const [certs, setCerts] = useState<Cert[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isAdmin) return;
    const u1 = onSnapshot(collection(db, 'certificates'), (snap) =>
      setCerts(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Cert, 'id'>) })).sort((a, b) => a.id.localeCompare(b.id)))
    );
    const u2 = onSnapshot(collection(db, 'students'), (snap) =>
      setStudents(snap.docs.map((d) => ({ id: d.id, name: d.data().name, email: d.data().email })))
    );
    return () => { u1(); u2(); };
  }, [isAdmin]);

  const studentName = useMemo(() => {
    const m = new Map(students.map((s) => [s.id, `${s.name} (${s.email})`]));
    return (uid: string | null) => (uid && m.get(uid)) || 'Not assigned';
  }, [students]);

  const set = (k: keyof typeof empty, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const startEdit = (c: Cert) => {
    setEditingId(c.id);
    setForm({ id: c.id, holderName: c.holderName, courseTitle: c.courseTitle, issuedOn: c.issuedOn, status: c.status, studentUid: c.studentUid ?? '' });
    setMessage(null);
  };

  const reset = () => { setEditingId(null); setForm(empty); };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const id = form.id.trim();
    if (!ID_RE.test(id)) return setMessage({ type: 'err', text: 'Certificate ID: 4 to 60 letters, numbers or dashes.' });
    if (!form.holderName.trim() || !form.courseTitle.trim() || !form.issuedOn.trim()) {
      return setMessage({ type: 'err', text: 'Holder name, course and issue date are required.' });
    }
    const data = {
      holderName: form.holderName.trim(),
      courseTitle: form.courseTitle.trim(),
      issuedOn: form.issuedOn.trim(),
      status: form.status,
      studentUid: form.studentUid || null,
    };
    try {
      setBusy(true);
      if (editingId) {
        await updateDoc(doc(db, 'certificates', editingId), data);
        setMessage({ type: 'ok', text: 'Certificate updated. The student sees it live.' });
      } else {
        const existing = await getDoc(doc(db, 'certificates', id));
        if (existing.exists()) return setMessage({ type: 'err', text: 'A certificate with this ID already exists. Edit it from the list.' });
        await setDoc(doc(db, 'certificates', id), data);
        setMessage({ type: 'ok', text: 'Certificate created.' });
      }
      reset();
    } catch (err: any) {
      console.error(err);
      setMessage({ type: 'err', text: 'Save failed: ' + (err.message || 'unknown error') });
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm(`Delete certificate ${id}? This cannot be undone.`)) return;
    try {
      await deleteDoc(doc(db, 'certificates', id));
      if (editingId === id) reset();
      setMessage({ type: 'ok', text: 'Certificate deleted.' });
    } catch (err: any) {
      setMessage({ type: 'err', text: 'Delete failed: ' + (err.message || 'unknown error') });
    }
  };

  if (loading) return <div className="pt-32 text-center text-[#888899]">Checking access…</div>;
  if (!isAdmin) {
    return (
      <div className="pt-32 pb-24 text-center">
        <p className="text-white mb-4">Admin access required.</p>
        <Link href="/login?redirect=/admin/certificates" className="px-6 py-3 rounded-xl bg-[#6c63ff] text-white font-bold">Admin login</Link>
      </div>
    );
  }

  const input = 'w-full px-3 py-2 rounded-lg bg-[#0b0b12] border border-[#2a2a3a] text-white text-sm';

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <h1 className="font-syne text-2xl font-extrabold text-white mb-6">Certificate Manager</h1>

      <form onSubmit={save} className="bg-[#13131e] border border-[#2a2a3a] rounded-2xl p-5 grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
        <input className={input} placeholder="Certificate ID (e.g. CNA-2026-018)" value={form.id} disabled={!!editingId} onChange={(e) => set('id', e.target.value)} />
        <input className={input} placeholder="Holder name" value={form.holderName} onChange={(e) => set('holderName', e.target.value)} />
        <input className={input} placeholder="Course title" value={form.courseTitle} onChange={(e) => set('courseTitle', e.target.value)} />
        <input className={input} placeholder="Issue date (e.g. October 18, 2026)" value={form.issuedOn} onChange={(e) => set('issuedOn', e.target.value)} />
        <select className={input} value={form.status} onChange={(e) => set('status', e.target.value)}>
          <option value="valid">valid</option>
          <option value="revoked">revoked</option>
        </select>
        <select className={input} value={form.studentUid} onChange={(e) => set('studentUid', e.target.value)}>
          <option value="">Not assigned to a student</option>
          {students.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.email})</option>)}
        </select>
        <div className="md:col-span-2 flex gap-3 items-center">
          <button type="submit" disabled={busy} className="px-5 py-2 rounded-xl bg-[#6c63ff] text-white font-bold text-sm disabled:opacity-60">
            {editingId ? 'Save changes' : 'Create certificate'}
          </button>
          {editingId && <button type="button" onClick={reset} className="px-5 py-2 rounded-xl border border-[#2a2a3a] text-white text-sm">Cancel</button>}
          {message && <span className={`text-sm ${message.type === 'ok' ? 'text-[#02fd88]' : 'text-red-400'}`}>{message.text}</span>}
        </div>
      </form>

      <div className="overflow-x-auto bg-[#13131e] border border-[#2a2a3a] rounded-2xl">
        <table className="w-full text-sm text-left">
          <thead className="text-[#888899] text-xs uppercase">
            <tr>
              <th className="p-3">ID</th><th className="p-3">Holder</th><th className="p-3">Course</th>
              <th className="p-3">Issued</th><th className="p-3">Status</th><th className="p-3">Student account</th><th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {certs.map((c) => (
              <tr key={c.id} className="border-t border-[#2a2a3a] text-white">
                <td className="p-3 font-mono">{c.id}</td>
                <td className="p-3">{c.holderName}</td>
                <td className="p-3">{c.courseTitle}</td>
                <td className="p-3">{c.issuedOn}</td>
                <td className="p-3">{c.status}</td>
                <td className="p-3 text-[#888899]">{studentName(c.studentUid)}</td>
                <td className="p-3 whitespace-nowrap">
                  <button onClick={() => startEdit(c)} className="text-[#6c63ff] font-bold mr-3">Edit</button>
                  <button onClick={() => remove(c.id)} className="text-red-400 font-bold">Delete</button>
                </td>
              </tr>
            ))}
            {certs.length === 0 && <tr><td className="p-4 text-[#888899]" colSpan={7}>No certificates yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
