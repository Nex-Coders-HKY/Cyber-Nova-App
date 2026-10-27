import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Thank You | Cyber Nova Academy",
  description: "Thank you for getting in touch with us.",
};

export default function ThankYouPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Thank You!</h1>
      <p className="text-lg text-gray-600 max-w-md mb-8">
        We have received your submission. Our team will get back to you shortly.
      </p>
      <Link
        href="/"
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg shadow transition"
      >
        Go Back Home
      </Link>
    </main>
  );
}