"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Zap, TrendingUp, LayoutTemplate, ArrowRight } from "lucide-react";

const servicos = [
  { href: "/site-72h", label: "Seu site em 72h", icon: LayoutTemplate },
  { href: "/servicos/gestao-de-trafego", label: "Gestão de tráfego", icon: TrendingUp },
];

const links = [
  { href: "/#sobre", label: "Sobre" },
  { href: "/#conteudo", label: "Tech & IA" },
  { href: "/#contato", label: "Contato" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [servicosOpen, setServicosOpen] = useState(false);
  const isHome = pathname === "/";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/50 bg-[#0a0a0b]/85 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="font-[family-name:var(--font-space)] text-lg font-bold tracking-tight text-white transition hover:text-[#22c55e]"
        >
          zinid<span className="text-[#22c55e]">.tech</span>
        </Link>

        {/* Desktop: serviços + links */}
        <div className="hidden items-center gap-1 md:flex">
          {/* Dropdown Serviços */}
          <div
            className="relative"
            onMouseEnter={() => setServicosOpen(true)}
            onMouseLeave={() => setServicosOpen(false)}
          >
            <button
              type="button"
              className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-zinc-300 transition hover:bg-white/5 hover:text-white"
            >
              Serviços
              <ChevronDown
                className={`h-4 w-4 transition-transform ${servicosOpen ? "rotate-180" : ""}`}
              />
            </button>
            <AnimatePresence>
              {servicosOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-full pt-1"
                >
                  <div className="min-w-[220px] rounded-xl border border-zinc-800 bg-[#0a0a0b]/95 py-2 shadow-xl backdrop-blur-xl">
                    {servicos.map((s) => {
                      const Icon = s.icon;
                      return (
                        <Link
                          key={s.href}
                          href={s.href}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 transition hover:bg-[#22c55e]/10 hover:text-[#22c55e]"
                        >
                          <Icon className="h-4 w-4 text-[#22c55e]/70" />
                          {s.label}
                        </Link>
                      );
                    })}
                    <Link
                      href="/#servicos"
                      className="flex items-center gap-3 border-t border-zinc-800/80 px-4 py-2.5 text-sm font-medium text-[#22c55e] transition hover:bg-[#22c55e]/10"
                    >
                      <ArrowRight className="h-4 w-4" />
                      Ver todos
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-300 transition hover:bg-white/5 hover:text-white"
            >
              {link.label}
            </Link>
          ))}

          {isHome && (
            <Link
              href="/site-72h"
              className="ml-2 inline-flex items-center gap-2 rounded-lg bg-[#22c55e] px-4 py-2 text-sm font-semibold text-black transition hover:bg-[#16a34a]"
            >
              <Zap className="h-4 w-4" />
              Seu site em 72h
            </Link>
          )}
        </div>

        {/* Mobile: menu button */}
        <div className="flex items-center gap-2 md:hidden">
          {isHome && (
            <Link
              href="/site-72h"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#22c55e]/40 bg-[#22c55e]/10 px-3 py-2 text-xs font-semibold text-[#22c55e]"
            >
              Site em 72h
            </Link>
          )}
          <button
            type="button"
            aria-label="Abrir menu"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800/50 text-zinc-300 transition hover:border-zinc-600 hover:text-white"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-zinc-800 bg-[#0a0a0b] md:hidden"
          >
            <div className="space-y-1 px-4 py-4">
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                Serviços
              </p>
              {servicos.map((s) => {
                const Icon = s.icon;
                return (
                  <Link
                    key={s.href}
                    href={s.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-zinc-300 transition hover:bg-[#22c55e]/10 hover:text-[#22c55e]"
                  >
                    <Icon className="h-4 w-4 text-[#22c55e]/70" />
                    {s.label}
                  </Link>
                );
              })}
              <Link
                href="/#servicos"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-[#22c55e]"
              >
                <ArrowRight className="h-4 w-4" />
                Ver todos os serviços
              </Link>
              <div className="my-3 border-t border-zinc-800" />
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-4 py-3 text-zinc-300 transition hover:bg-white/5 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
