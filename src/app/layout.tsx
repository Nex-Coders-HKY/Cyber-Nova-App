import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CookieBanner from "@/components/CookieBanner";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import { AuthProvider } from "@/context/AuthContext";
import { CoursesProvider } from "@/context/CoursesContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cyber Nova Academy | Professional Web Development Courses",
  description: "Learn full-stack web development, DSA, and modern frameworks with expert instructors.",
  openGraph: {
    title: "Cyber Nova Academy",
    description: "Learn full-stack web development with expert instructors.",
    images: ["/og-image.jpg"],
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CoursesProvider>
            {children}
          </CoursesProvider>
        </AuthProvider>
        <CookieBanner />
        <StickyMobileCTA />
      </body>
    </html>
  );
}