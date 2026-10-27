import Link from "next/link";

export default function StickyMobileCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 p-3 flex justify-between items-center sm:hidden shadow-lg">
      <span className="font-semibold text-gray-900 text-sm">Join Next Batch</span>
      <Link
        href="#contact"
        className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium shadow"
      >
        Enroll Now
      </Link>
    </div>
  );
}