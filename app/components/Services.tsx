"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { TrendingUp, BarChart3, LayoutTemplate, ArrowRight } from "lucide-react";
import SpotlightCard from "./SpotlightCard";
import BlurText from "./BlurText";

const services = [
  {
    title: "Gestão de tráfego",
    description:
      "Estratégia e acompanhamento de tráfego digital para campanhas, anúncios e canais, com foco em resultado e conversão.",
    items: [
      "Anúncios e campanhas",
      "Métricas de tráfego",
      "Otimização de conversão",
      "Relatórios e análise",
    ],
    icon: TrendingUp,
    href: "/servicos/gestao-de-trafego",
  },
  {
    title: "Seu site em 72h",
    description:
      "Seu site premium pronto em 72h: copy, design, rastreamento e integrações. Sem preço de agência, com identidade e foco em conversão.",
    items: [
      "Seu site pronto em 72h ou não paga",
      "Copy + design + Pixel e GA4 no seu site",
      "WhatsApp, formulário e integrações",
      "Briefing rápido e proposta para o seu site",
    ],
    icon: LayoutTemplate,
    href: "/site-72h",
  },
  {
    title: "Dashboards para acompanhar dados",
    description:
      "Criação de dashboards para visualizar e acompanhar dados em tempo real: métricas, KPIs e indicadores do seu negócio.",
    items: [
      "Dashboards sob medida",
      "Métricas e KPIs em tempo real",
      "Visualização de dados",
      "Acompanhamento de resultados",
    ],
    icon: BarChart3,
  },
];

export default function Services() {
  return (
    <section
      id="servicos"
      className="cyber-section data-stream relative border-t border-zinc-800/50 section-padding"
    >
      <div className="section-container-wide w-full">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="mb-2 flex items-center gap-3"
        >
          <span className="hex-badge flicker">SRV://STACK</span>
        </motion.div>

        <BlurText
          text="Serviços e Soluções"
          as="h2"
          animateBy="words"
          delay={120}
          stepDuration={0.4}
          className="mb-3 font-[family-name:var(--font-space)] text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl [&>span:nth-child(n+3)]:text-[#22c55e] [&>span:nth-child(n+3)]:cyber-text-glow"
        />

        <BlurText
          text="O que eu faço para empresas e quem quer construir ativos digitais."
          as="p"
          animateBy="words"
          delay={60}
          stepDuration={0.3}
          direction="bottom"
          className="mb-8 sm:mb-10 md:mb-12 max-w-2xl font-mono text-sm text-zinc-400"
        />

        {/* Mobile: carrossel horizontal — oculto no desktop (max-md) */}
        <div className="hidden max-md:block overflow-visible">
          <div className="w-screen relative left-1/2 -translate-x-1/2 overflow-visible px-4 sm:px-6">
            <div
              className="carousel-mobile"
              role="region"
              aria-label="Serviços e soluções"
            >
              {services.map((service, idx) => (
                <div key={service.title} className="carousel-card">
                  {service.href ? (
                    <Link href={service.href} className="block h-full">
                      <Card service={service} index={idx} />
                    </Link>
                  ) : (
                    <Card service={service} index={idx} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop: grid de cards (sem carrossel) */}
        <div
          className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6"
          role="region"
          aria-label="Serviços e soluções"
        >
          {services.map((service, idx) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
            >
              {service.href ? (
                <Link href={service.href} className="block h-full group">
                  <Card service={service} index={idx} />
                </Link>
              ) : (
                <Card service={service} index={idx} />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Card({
  service,
  index,
}: {
  service: (typeof services)[number];
  index: number;
}) {
  return (
    <SpotlightCard
      className="cyber-card hex-overlay corner-accent group relative h-full min-h-[280px] w-full rounded-xl border border-zinc-800 bg-[#161618] transition-all duration-300 hover:border-[#22c55e]/40 hover:shadow-[0_0_28px_rgba(34,197,94,0.1)] md:rounded-2xl"
      spotlightColor="rgba(34, 197, 94, 0.06)"
      spotlightSize={380}
    >
      <div className="flex h-full flex-col p-5 md:p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center rounded-lg border border-[#22c55e]/20 bg-[#22c55e]/5 p-2 transition-colors duration-300 group-hover:border-[#22c55e]/30 group-hover:bg-[#22c55e]/10">
              <service.icon className="h-6 w-6 text-[#22c55e] ai-pulse" aria-hidden />
            </div>
            <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-wider">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
          {"href" in service && service.href && (
            <span className="flex items-center gap-1.5 font-mono text-[10px] text-[#22c55e] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              Saiba mais
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          )}
        </div>
        <h3 className="mt-3 font-[family-name:var(--font-space)] text-lg font-bold text-white transition-colors duration-300 group-hover:text-[#22c55e] md:text-xl">
          {service.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-zinc-400">
          {service.description}
        </p>
        <ul className="mt-4 flex-1 min-h-0 space-y-1.5">
          {service.items.map((item) => (
            <li key={item} className="flex items-start gap-2 font-mono text-xs text-zinc-300">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#22c55e]" />
              <span className="flex-1">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </SpotlightCard>
  );
}
