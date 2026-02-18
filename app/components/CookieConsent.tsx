"use client";

import { useState, useEffect } from "react";
import { Cookie } from "lucide-react";
import Link from "next/link";

const STORAGE_KEY = "zinid-cookie-consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  };

  const reject = () => {
    localStorage.setItem(STORAGE_KEY, "rejected");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Consentimento de cookies"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-800 bg-[#0a0a0b]/95 backdrop-blur-xl px-4 py-4 sm:px-6"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Cookie className="h-5 w-5 flex-shrink-0 text-[#22c55e] mt-0.5" aria-hidden />
          <p className="text-sm text-zinc-300">
            Este site usa cookies para garantir o funcionamento e a experiência de navegação.
            Ao continuar, você concorda com o uso conforme nossa{" "}
            <Link href="/privacidade" className="text-[#22c55e] underline hover:no-underline">
              política de privacidade
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={reject}
            className="rounded-lg border border-zinc-600 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:border-zinc-500 hover:text-white"
          >
            Recusar
          </button>
          <button
            type="button"
            onClick={accept}
            className="rounded-lg bg-[#22c55e] px-4 py-2 text-sm font-semibold text-black transition hover:bg-[#16a34a]"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
}
