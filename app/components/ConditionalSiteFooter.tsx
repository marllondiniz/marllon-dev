"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Linkedin, Mail, MapPin } from "lucide-react";
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
          <span className="text-zinc-400">Marllon Diniz</span>
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
      className="border-t border-zinc-800 bg-zinc-950 py-8 text-center text-sm text-zinc-500"
      role="contentinfo"
    >
      <div className="mx-auto max-w-5xl px-6">
        <p className="font-medium text-zinc-400">
          <span itemProp="name">Marllon Diniz</span>
          {" · "}
          <Link
            href={SITE_URL}
            className="text-[#22c55e] hover:text-[#22c55e]/85 underline-offset-2 hover:underline"
            rel="home"
          >
            {SITE_HOST}
          </Link>
        </p>
        <p className="mt-1.5 text-xs text-zinc-500">
          Portfólio e contato:{" "}
          <Link
            href={SITE_URL}
            className="text-zinc-400 underline-offset-2 hover:text-[#22c55e] hover:underline"
          >
            {SITE_URL}
          </Link>
        </p>
        <address className="mt-2 not-italic">
          <span
            className="inline-flex items-center justify-center gap-1.5"
            itemProp="address"
            itemScope
            itemType="https://schema.org/PostalAddress"
          >
            <MapPin className="h-4 w-4 text-zinc-500" aria-hidden="true" />
            <span itemProp="addressRegion">Espírito Santo</span>,{" "}
            <span itemProp="addressCountry">Brasil</span>
          </span>
        </address>
        <nav
          className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1"
          aria-label="Contato, redes e serviços"
        >
          <Link
            href="/site-72h"
            className="inline-flex items-center gap-1.5 font-medium text-[#22c55e] hover:text-[#22c55e]/80"
            aria-label="Seu site pronto em 72h"
          >
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
            Seu site pronto em 72h
          </Link>
          <a
            href="mailto:marllonzinid@gmail.com"
            className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white"
            itemProp="email"
            aria-label="Email: marllonzinid@gmail.com"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            marllonzinid@gmail.com
          </a>
          <a
            href="https://www.linkedin.com/in/marllon-diniz"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white"
            itemProp="sameAs"
            aria-label="LinkedIn de Marllon Diniz"
          >
            <Linkedin className="h-4 w-4" aria-hidden="true" />
            LinkedIn
          </a>
        </nav>
        <p className="mt-3 text-sm font-medium text-[#22c55e]/90">Início de um futuro próspero</p>
        <p className="mt-2 text-zinc-500">
          <small>
            © {new Date().getFullYear()} Marllon Diniz ·{" "}
            <Link
              href={SITE_URL}
              className="text-zinc-400 underline-offset-2 hover:text-white hover:underline"
            >
              {SITE_HOST}
            </Link>{" "}
            · Back-end · Web · Integrações · Automação · Dados.
          </small>
        </p>
      </div>
    </footer>
  );
}
