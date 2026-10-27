import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#111118] text-white flex flex-col items-center justify-center px-4 text-center">
      <h1 className="font-syne text-6xl font-extrabold text-[#6c63ff] mb-4">404</h1>
      <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
      <p className="text-gray-400 max-w-md mb-8 text-sm sm:text-base">
        It looks like you have reached the wrong page. The page you are looking for might have been removed or does not exist.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-xl bg-[#6c63ff] text-white font-semibold hover:bg-[#5b52e0] transition-colors"
      >
        Go Back Home
      </Link>
    </main>
  );
}