"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Linkedin, Mail } from "lucide-react";
import { SITE_HOST, SITE_URL } from "@/lib/site";

function isCompactFooterPath(pathname: string | null): boolean {
  if (!pathname) return false;
  return (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/cliente") ||
    pathname === "/enxoval"
  );
}

/**
 * Rodapé global: versão completa nas páginas públicas; faixa compacta em painéis
 * para manter zinid.tech visível em todo o site.
 */
export default function ConditionalSiteFooter() {
  const pathname = usePathname();

  if (isCompactFooterPath(pathname)) {
    return (
      <footer
        className="border-t border-zinc-800/90 bg-zinc-950 py-3 text-center text-[11px] text-zinc-500"
        role="contentinfo"
      >
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-2 gap-y-1.5 px-4 sm:text-xs">
          <span className="sr-only">Site principal:</span>
          <Link
            href={SITE_URL}
            className="font-semibold text-[#22c55e] underline-offset-2 hover:text-[#22c55e]/90 hover:underline"
            rel="home"
          >
            {SITE_HOST}
          </Link>
          <span className="text-zinc-700" aria-hidden>
            ·
          </span>
          <Link
            href={SITE_URL}
            className="text-zinc-500 underline-offset-2 hover:text-zinc-300 hover:underline"
          >
            Ir ao site
          </Link>
          <span className="text-zinc-700" aria-hidden>
            ·
          </span>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </footer>
    );
  }

  return (
    <footer
      className="border-t border-zinc-800 bg-zinc-950 py-5 text-center text-sm text-zinc-500"
      role="contentinfo"
    >
      <div className="mx-auto max-w-5xl space-y-3 px-6">
        <p className="font-medium text-zinc-300">
          <Link
            href={SITE_URL}
            className="text-[#22c55e] hover:text-[#22c55e]/85 underline-offset-2 hover:underline"
            rel="home"
            itemProp="name"
          >
            {SITE_HOST}
          </Link>
        </p>
        <nav
          className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1"
          aria-label="Contato e redes"
        >
          <a
            href="mailto:marllonzinid@gmail.com"
            className="inline-flex items-center gap-1.5 text-zinc-400 transition hover:text-white"
            itemProp="email"
            aria-label="Email: marllonzinid@gmail.com"
          >
            <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="max-w-[min(100vw-3rem,16rem)] truncate sm:max-w-none">
              marllonzinid@gmail.com
            </span>
          </a>
          <a
            href="https://www.linkedin.com/in/marllon-diniz"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-zinc-400 transition hover:text-white"
            itemProp="sameAs"
            aria-label="Perfil no LinkedIn"
          >
            <Linkedin className="h-4 w-4 shrink-0" aria-hidden="true" />
            LinkedIn
          </a>
        </nav>
        <p className="text-xs text-zinc-500">
          <small>© {new Date().getFullYear()} {SITE_HOST} · ES, Brasil</small>
        </p>
      </div>
    </footer>
  );
}
