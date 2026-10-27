"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

// Google Analytics loads only after the visitor accepts cookies.
// Set NEXT_PUBLIC_GA_MEASUREMENT_ID in .env.local to enable it. If empty, nothing loads.
const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function Analytics() {
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const check = () => {
      const v = localStorage.getItem("cookie-consent");
      // "true" is the value saved by the old banner; treat it as accepted.
      setAccepted(v === "accepted" || v === "true");
    };
    check();
    window.addEventListener("cookie-consent-change", check);
    return () => window.removeEventListener("cookie-consent-change", check);
  }, []);

  if (!accepted || !GA_ID) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
      </Script>
    </>
  );
}
