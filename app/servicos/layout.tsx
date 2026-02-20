import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ServicosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0b]">
      <header className="sticky top-0 z-50 border-b border-zinc-800/50 bg-[#0a0a0b]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link
            href="/#servicos"
            className="inline-flex items-center gap-2 font-mono text-sm text-zinc-400 transition hover:text-[#22c55e]"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar aos serviços
          </Link>
          <Link href="/" className="font-mono text-xs text-zinc-500 hover:text-white">
            zinid.tech
          </Link>
        </div>
      </header>
      {children}
    </div>
  );
}
