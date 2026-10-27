"use client";

import { useState, useEffect } from "react";

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) setShow(true);
  }, []);

  const save = (value: "accepted" | "declined") => {
    localStorage.setItem("cookie-consent", value);
    setShow(false);
    // Tells the Analytics component to load (or not) without a page reload.
    window.dispatchEvent(new Event("cookie-consent-change"));
  };

  if (!show) return null;

  return (
    <div role="dialog" aria-label="Cookie consent" className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 text-white p-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-gray-700">
      <p className="text-sm">
        We use cookies for anonymous analytics to improve this website. You can decline.
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => save("declined")}
          className="border border-gray-500 hover:bg-gray-800 text-white px-4 py-2 rounded text-sm font-medium"
        >
          Decline
        </button>
        <button
          type="button"
          onClick={() => save("accepted")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
