import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ArtigoNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0b] px-6">
      <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">
        404 — Artigo não encontrado
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-space)] text-2xl font-bold text-white">
        Este artigo não existe ou foi removido.
      </h1>
      <Link
        href="/#conteudo"
        className="mt-8 inline-flex items-center gap-2 font-mono text-sm text-[#22c55e] transition hover:gap-3"
      >
        <ArrowLeft className="h-4 w-4" />
        Ver todos os artigos
      </Link>
    </div>
  );
}
