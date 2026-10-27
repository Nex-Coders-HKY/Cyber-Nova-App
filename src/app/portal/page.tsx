'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import MyCertificates from '../../components/MyCertificates';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import {
  FileText,
  Video,
  Download,
  GraduationCap,
  BookOpen,
  Award,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function StudentPortalPage() {
  const router = useRouter();
  const { user } = useAuth();

  // Protected Route Check: Logged in na hone par Redirect
  if (!user) {
    if (typeof window !== 'undefined') {
      router.push('/login?redirect=/portal');
    }
    return null;
  }

  // Sample Resources Data
  const courseResources = [
    {
      id: 1,
      title: 'Web Development Masterclass Notes',
      type: 'PDF Module',
      size: '12.4 MB',
      updated: '2 Days Ago',
      color: '#6c63ff',
      icon: FileText
    },
    {
      id: 2,
      title: 'Python & AI Fundamentals Slides',
      type: 'Lecture Deck',
      size: '8.1 MB',
      updated: '1 Week Ago',
      color: '#43e97b',
      icon: FileText
    },
    {
      id: 3,
      title: 'Recorded Batch Session: React Hooks',
      type: 'Video Lecture',
      size: '1080p Full HD',
      updated: '3 Days Ago',
      color: '#818cf8',
      icon: Video
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e8e8f0]">
      <Navbar />

      <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Welcome Banner */}
        <div className="bg-[#13131e] border border-[#2a2a3a] rounded-3xl p-6 sm:p-10 mb-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#6c63ff]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#43e97b]/15 text-[#02fd88] text-xs font-semibold uppercase tracking-wider mb-3 border border-[#43e97b]/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Student Portal Active</span>
              </div>
              <h1 className="font-syne text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Welcome, {user.name || user.email}!
              </h1>
              <p className="text-xs sm:text-sm text-[#888899] mt-2 max-w-xl">
                Access your batch schedule, downloadable course materials, lecture slides, and official verified certificates.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="bg-[#1a1a26] border border-[#2a2a3a] px-4 py-3 rounded-2xl text-center">
                <div className="text-xs text-[#888899]">Student ID</div>
                <div className="font-mono text-sm font-bold text-[#818cf8]">CN-2026-STU</div>
              </div>
            </div>
          </div>
        </div>

        {/* Resources Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-syne text-xl font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#6c63ff]" />
                <span>Course Materials & Notes</span>
              </h2>
              <p className="text-xs text-[#888899]">Download latest lecture notes and course hand-outs.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {courseResources.map((item) => {
              const IconComp = item.icon;
              return (
                <div
                  key={item.id}
                  className="bg-[#13131e] border border-[#2a2a3a] hover:border-[#6c63ff]/50 rounded-2xl p-5 transition-all shadow-lg flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${item.color}20`, color: item.color }}
                      >
                        <IconComp className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#1a1a26] text-[#888899] border border-[#2a2a3a]">
                        {item.size}
                      </span>
                    </div>

                    <h3 className="font-bold text-white text-base mb-1">{item.title}</h3>
                    <p className="text-xs text-[#888899] mb-4">{item.type} • {item.updated}</p>
                  </div>

                  <button
                    onClick={() => alert(`Downloading "${item.title}"...`)}
                    className="w-full py-2.5 rounded-xl bg-[#1a1a26] hover:bg-[#252538] text-white text-xs font-semibold border border-[#2a2a3a] flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-[#43e97b]" />
                    <span>Download Resource</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <MyCertificates />
      </main>

      <Footer />
    </div>
  );
}