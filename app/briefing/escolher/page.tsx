"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, BarChart3, LayoutTemplate, TrendingUp } from "lucide-react";
import BlurText from "@/app/components/BlurText";
import CyberBackground from "@/app/components/CyberBackground";
import Magnet from "@/app/components/Magnet";
import SpotlightCard from "@/app/components/SpotlightCard";

const options = [
  {
    href: "/briefing-trafego",
    title: "Gestão de tráfego",
    desc: "Campanhas, Meta/Google, orçamento e metas. Briefing em 3 passos.",
    icon: TrendingUp,
  },
  {
    href: "/briefing-dashboards",
    title: "Dashboards e dados",
    desc: "O que acompanhar no painel, integrações e contexto. Briefing em 3 passos.",
    icon: BarChart3,
  },
  {
    href: "/briefing",
    title: "Site, página e oferta",
    desc: "Oferta, página, prazo e integrações. Formulário guiado em etapas.",
    icon: LayoutTemplate,
  },
] as const;

export default function EscolherBriefingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden pb-24">
      <CyberBackground />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(34,197,94,0.06),transparent)]" />

      <section className="cyber-section relative px-6 pt-10">
        <div className="section-container relative mx-auto max-w-2xl">
          <Link
            href="/#contato"
            className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-[#22c55e]"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar à página inicial
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 flex justify-center"
          >
            <span className="hex-badge flicker">BRIEFING://SELECT</span>
          </motion.div>
          <BlurText
            text="Qual serviço você quer detalhar?"
            as="h1"
            animateBy="words"
            delay={80}
            stepDuration={0.35}
            className="flex justify-center text-center font-[family-name:var(--font-space)] text-2xl font-bold text-white sm:text-3xl [&>span:nth-child(n+2)]:text-[#22c55e]"
          />
          <p className="mt-3 text-center text-sm text-zinc-500">
            Escolha abaixo. No próximo passo abrimos o briefing certo para o seu caso.
          </p>
        </div>
      </section>

      <section className="cyber-section relative px-6 pt-2">
        <div className="section-container relative mx-auto max-w-3xl">
          <ul className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3">
            {options.map((opt, i) => {
              const Icon = opt.icon;
              return (
                <motion.li
                  key={opt.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * i, duration: 0.3 }}
                >
                  <Magnet padding={40} magnetStrength={2.5}>
                    <Link href={opt.href} className="block h-full min-h-[180px]">
                      <SpotlightCard
                        className="cyber-card corner-accent h-full rounded-2xl border border-zinc-800 bg-[#111113] p-5 transition duration-300 hover:border-[#22c55e]/40"
                        spotlightColor="rgba(34, 197, 94, 0.07)"
                        spotlightSize={260}
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#22c55e]/25 bg-[#22c55e]/10">
                          <Icon className="h-5 w-5 text-[#22c55e]" aria-hidden />
                        </div>
                        <h2 className="mt-3 font-[family-name:var(--font-space)] text-base font-bold text-white sm:text-lg">
                          {opt.title}
                        </h2>
                        <p className="mt-2 text-xs leading-relaxed text-zinc-500">{opt.desc}</p>
                        <span className="mt-3 inline-block font-mono text-[11px] font-medium text-[#22c55e]">
                          Continuar →
                        </span>
                      </SpotlightCard>
                    </Link>
                  </Magnet>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </section>
    </main>
  );
}
