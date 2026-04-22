"use client";

import { useEffect } from "react";

/** Conteúdo “quem sou” passou para a home (`/#quem-sou`); mantém links antigos funcionando. */
export default function SobreRedirectPage() {
  useEffect(() => {
    window.location.replace("/#quem-sou");
  }, []);

  return (
    <main className="flex min-h-[50dvh] items-center justify-center bg-[#0a0a0b]">
      <p className="text-sm text-zinc-500">A abrir a página inicial…</p>
    </main>
  );
}
