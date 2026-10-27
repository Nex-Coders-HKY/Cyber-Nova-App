import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Cyber Nova Academy",
  description: "Read our privacy policy to understand how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#111118] text-gray-200 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-syne text-4xl font-extrabold text-white mb-4">Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-10">Last updated: October 15, 2026</p>
        
        <div className="space-y-6 text-base leading-relaxed text-gray-300">
          <section>
            <h2 className="font-syne text-xl font-bold text-white mb-2">1. Information We Collect</h2>
            <p className="text-gray-300">
              We collect personal information that you voluntarily provide to us when registering at the academy, expressing interest in obtaining information about us or our courses, and when participating in activities on the website.
            </p>
          </section>

          <section>
            <h2 className="font-syne text-xl font-bold text-white mb-2">2. How We Use Your Information</h2>
            <p className="text-gray-300">
              We use information collected via our website for various business purposes described below, including to manage student accounts, provide course materials, and send administrative information.
            </p>
          </section>

          <section>
            <h2 className="font-syne text-xl font-bold text-white mb-2">3. Data Security</h2>
            <p className="text-gray-300">
              We implement appropriate technical and organizational security measures designed to protect the security of any personal information we process.
            </p>
          </section>

          <section>
            <h2 className="font-syne text-xl font-bold text-white mb-2">4. Contact Us</h2>
            <p className="text-gray-300">
              If you have questions or comments about this policy, you may contact us at our Karachi campus or via email.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}