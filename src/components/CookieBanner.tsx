"use client";

import { useState, useEffect } from "react";

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShow(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "true");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 text-white p-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-gray-800">
      <p className="text-sm">
        We use cookies to enhance your user experience. By using our website, you agree to our privacy policy.
      </p>
      <div className="flex gap-2">
        <button
          onClick={acceptCookies}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium"
        >
          Accept
        </button>
      </div>
    </div>
  );
}