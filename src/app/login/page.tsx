'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  GraduationCap,
  Mail,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError(null);
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      setError('Please enter your email address.');
      return;
    }
    try {
      setLoading(true);
      const cred = await signInWithEmailAndPassword(auth, trimmedEmail, password);
      // Role comes only from a server-set custom claim. Force-refresh to read the latest claims.
      const token = await cred.user.getIdTokenResult(true);
      const userRole = token.claims.role;
      if (userRole !== 'admin' && userRole !== 'student') {
        await signOut(auth);
        setError('This account is not enabled for the portal. Please contact the academy.');
        return;
      }
      setSuccess(true);
      const safeRedirect = redirectPath.startsWith('/') && !redirectPath.startsWith('//') ? redirectPath : '/portal';
      setTimeout(() => {
        router.push(userRole === 'admin' ? '/admin' : (safeRedirect === '/' ? '/portal' : safeRedirect));
      }, 600);
    } catch (err: any) {
      if (
        err.code === 'auth/invalid-credential' ||
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/wrong-password'
      ) {
        setError('Invalid Email or Password. Please check your credentials.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address format.');
      } else {
        setError('Login failed: ' + (err.message || 'Authentication error'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-md mx-auto">
      <div className="bg-[#13131e] border border-[#2a2a3a] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-[#6c63ff]/20 blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#6c63ff] via-[#818cf8] to-[#43e97b] p-0.5 mx-auto mb-3 shadow-lg shadow-[#6c63ff]/20">
            <div className="w-full h-full bg-[#111118] rounded-[14px] flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-[#6c63ff]" />
            </div>
          </div>
          <h1 className="font-syne text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome Back
          </h1>
          <p className="text-xs sm:text-sm text-[#888899] mt-1">
            Log in to your Cyber Nova account
          </p>
        </div>

        {/* Success Alert */}
        {success && (
          <div className="mb-4 p-3 rounded-xl bg-[#00a651]/15 border border-[#00a651]/40 text-[#02fd88] text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Login successful! Redirecting...</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-[#ff6584]/15 border border-[#ff6584]/40 text-[#ff6584] text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-[#1a1a26] rounded-xl border border-[#2a2a3a] mb-5">
          <button
            type="button"
            onClick={() => setRole('student')}
            className={`py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              role === 'student'
                ? 'bg-[#6c63ff] text-white shadow-md'
                : 'text-[#888899] hover:text-white'
            }`}
          >
            Student Account
          </button>
          <button
            type="button"
            onClick={() => setRole('admin')}
            className={`py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              role === 'admin'
                ? 'bg-[#6c63ff] text-white shadow-md'
                : 'text-[#888899] hover:text-white'
            }`}
          >
            Academy Admin
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#888899] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1a1a26] border border-[#2a2a3a] text-white text-sm focus:outline-none focus:border-[#6c63ff] transition-colors"
              />
              <Mail className="w-4 h-4 text-[#888899] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#888899] mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1a1a26] border border-[#2a2a3a] text-white text-sm focus:outline-none focus:border-[#6c63ff] transition-colors"
              />
              <Lock className="w-4 h-4 text-[#888899] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#6c63ff] hover:bg-[#5b52e0] text-white font-bold text-sm transition-all shadow-xl shadow-[#6c63ff]/30 hover:shadow-[#6c63ff]/50 cursor-pointer flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
          >
            <span>
              {loading
                ? 'Authenticating...'
                : role === 'admin'
                ? 'Log In as Administrator'
                : 'Log In to Student Portal'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e8e8f0]">
      <Navbar />
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm text-[#888899]">Loading login...</div>}>
        <LoginContent />
      </Suspense>
      <Footer />
    </div>
  );
}