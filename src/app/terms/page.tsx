import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Cyber Nova Academy",
  description: "Review the terms and conditions for enrolling in courses and using Cyber Nova Academy's platform.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#111118] text-gray-200 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-syne text-4xl font-extrabold text-white mb-4">Terms & Conditions</h1>
        <p className="text-sm text-gray-400 mb-10">Last updated: October 15, 2026</p>
        
        <div className="space-y-6 text-base leading-relaxed text-gray-300">
          <section>
            <h2 className="font-syne text-xl font-bold text-white mb-2">1. Agreement to Terms</h2>
            <p className="text-gray-300">
              By accessing or using Cyber Nova Academy's website and services, you agree to be bound by these Terms and Conditions. If you disagree with any part of the terms, you may not access our services.
            </p>
          </section>

          <section>
            <h2 className="font-syne text-xl font-bold text-white mb-2">2. Intellectual Property Rights</h2>
            <p className="text-gray-300">
              Other than content you own, under these Terms, Cyber Nova Academy and/or its licensors own all the intellectual property rights and materials contained in this website.
            </p>
          </section>

          <section>
            <h2 className="font-syne text-xl font-bold text-white mb-2">3. Course Enrollment & Fees</h2>
            <p className="text-gray-300">
              All course enrollments require accurate user information. Fees must be cleared according to the agreed schedule for continuous access to class modules and training sessions.
            </p>
          </section>

          <section>
            <h2 className="font-syne text-xl font-bold text-white mb-2">4. Limitation of Liability</h2>
            <p className="text-gray-300">
              In no event shall Cyber Nova Academy, nor any of its officers, directors, and employees, be held liable for anything arising out of or in any way connected with your use of this website.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}