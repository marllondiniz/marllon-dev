"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Check,
  ArrowLeft,
  ArrowRight,
  MessageCircle,
  ChevronDown,
  Clock,
  Zap,
  Smartphone,
  BarChart2,
  Link2,
  Gift,
  Shield,
  Layers,
  Building2,
  Sparkles,
} from "lucide-react";
import BlurText from "@/app/components/BlurText";
import Magnet from "@/app/components/Magnet";
import SpotlightCard from "@/app/components/SpotlightCard";
import CyberBackground from "@/app/components/CyberBackground";
import CountUp from "@/app/components/CountUp";
import CompareGenericVsIdentity from "@/app/components/CompareGenericVsIdentity";
import IframeModal from "@/app/components/IframeModal";

const WHATSAPP_NUMBER = "5527992338038";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=Quero%20meu%20site%20em%2072h`;

const PROBLEMS = [
  {
    n: "01",
    headline: "Parece que foi feito em 20 minutos.",
    sub: "Porque foi. Você abriu o Lovable, gerou algo, achou ok. Mas o visitante percebe na hora: template genérico, emoji no lugar de argumento, zero identidade.",
    tag: "IA sem direção",
  },
  {
    n: "02",
    headline: "Você espera 30 dias e paga caro pra ter o mesmo que todo mundo.",
    sub: "Agência tradicional é lenta, cara e ainda entrega um resultado que parece igual ao do concorrente. Você nem sabe o que aconteceu no processo.",
    tag: "Agência tradicional",
  },
  {
    n: "03",
    headline: "O tráfego chega. O site não segura.",
    sub: 'Você investe em anúncio, paga por cada clique e o site não converte. Aí parece que "tráfego não funciona". Não é o tráfego.',
    tag: "Página sem rastreio",
  },
];

const DELIVERABLES = [
  { icon: Zap, label: "Copy que não enrola", sub: "Clareza + benefício + CTA" },
  { icon: Smartphone, label: "Design mobile-first", sub: "Premium e responsivo" },
  { icon: BarChart2, label: "Pixel / GA4", sub: "Rastreamento pronto" },
  { icon: Link2, label: "Integrações", sub: "WhatsApp / Agenda / CRM" },
];

const TIMELINE = [
  { n: "01", time: "24h", label: "Rascunho entregue", sub: "Estrutura + copy para revisão" },
  { n: "02", time: "72h", label: "Versão final no ar", sub: "Design + integrações prontas" },
  { n: "03", time: "+1", label: "Rodada de ajustes", sub: "Inclusa no pacote" },
];

const EXTRAS_PREMIUM = {
  title: "Tráfego pago",
  tagline: "Você desenvolve o produto, o resto deixa comigo.",
  note: "Serviço à parte: estratégia e gestão de tráfego de ponta a ponta.",
};

const EXTRAS_LIST = [
  "Relatório de SEO e GEO (Generative Engine Optimization) para ranqueamento no Google e IAs + certificado de garantia",
  "Otimização para PWA",
  "Configuração anti-crawler e compliance LGPD",
];

const PLANS_72 = [
  {
    id: "express",
    icon: Zap,
    badge: "01",
    title: "Site Express 72h",
    subtitle: "1 página, entrega rápida",
    prazo: "Entrega em até 72h",
    ideal: [
      "Tráfego pago",
      "Captação no orgânico",
      "Link da bio",
      "Validação de oferta",
    ],
    inclui: [
      "1 página com estrutura de conversão (headline, prova, CTA, FAQ)",
      "Copy base sem enrolação",
      "Design premium, mobile perfeito",
      "WhatsApp + formulário + Calendly (se tiver)",
      "Meta Pixel + GA4 instalados",
      "1 rodada de ajustes",
    ],
    quote: "72h ou você não paga.",
    price: "A partir de R$ 497",
    priceRange: "R$ 497 – R$ 997",
    featured: true,
    whatsapp: `https://wa.me/${WHATSAPP_NUMBER}?text=Quero%20o%20Site%20Express%2072h`,
  },
  {
    id: "start",
    icon: Layers,
    badge: "02",
    title: "Site Start",
    subtitle: "3 páginas, mini-site profissional",
    prazo: "Entrega em 10 a 15 dias úteis",
    ideal: [
      "Home (oferta + prova + CTA)",
      "Serviços ou Produtos",
      "Contato + Agendamento",
    ],
    inclui: [
      "3 páginas com design consistente",
      "Copy ajustada por página",
      "SEO básico (títulos, headings, indexação)",
      "Pixel + GA4",
      "2 rodadas de ajustes",
      "Vídeo de treinamento pra você editar depois",
    ],
    quote: "Mini-site com cara de agência.",
    price: "A partir de R$ 1.297",
    priceRange: "R$ 1.297 – R$ 1.997",
    featured: false,
    whatsapp: `https://wa.me/${WHATSAPP_NUMBER}?text=Quero%20o%20Site%20Start%20(3%20p%C3%A1ginas)`,
  },
  {
    id: "pro",
    icon: Building2,
    badge: "03",
    title: "Empresa Pro",
    subtitle: "Até 8 páginas, institucional",
    prazo: "Entrega em 20 a 30 dias úteis",
    ideal: [
      "Empresas consolidadas",
      "Múltiplos serviços ou soluções",
      "Estruturas institucionais",
      "Negócios que precisam escalar",
    ],
    inclui: [
      "Até 8 páginas (expansível)",
      "Design corporate + identidade aplicada",
      "SEO on-page completo",
      "Performance e otimização mobile",
      "LGPD básico (banner + políticas)",
      "Integrações (CRM, RD/HubSpot, e-mail)",
      "3 rodadas de ajustes",
      "Checklist de qualidade antes de publicar",
    ],
    quote: "Um ativo digital, não só um site.",
    price: "A partir de R$ 2.997",
    priceRange: "R$ 2.997 – R$ 4.997",
    featured: false,
    whatsapp: `https://wa.me/${WHATSAPP_NUMBER}?text=Quero%20o%20Empresa%20Pro`,
  },
];

const ADDONS = [
  { label: "Sessão de estratégia (1h de call — oferta, mensagem e CTA alinhados)", range: "R$ 297 a R$ 597" },
  { label: "Página extra", range: "R$ 300 a R$ 800" },
  { label: "Manutenção mensal (ajustes + melhorias + suporte)", range: "R$ 197 a R$ 997/mês" },
  { label: "A/B de seção (2 variações)", range: "R$ 397 a R$ 997" },
];

export default function Site72hContent() {
  const [iframeModal, setIframeModal] = useState<{
    url: string;
    title: string;
  } | null>(null);

  return (
    <main className="relative overflow-hidden pb-20">

      {/* ─── HERO ────────────────────────────────────────────── */}
      <section
        className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-6 pb-16 pt-16 text-center"
      >
        <CyberBackground />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(34,197,94,0.07),transparent)]" />
        <div className="pointer-events-none absolute inset-0 cyber-grid-bg opacity-20" />

        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 mb-5 flex items-center justify-center gap-3"
        >
          <span className="hex-badge flicker">SITE://72H</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative z-10 mx-auto max-w-4xl"
        >
          <BlurText
            text="Seu site premium pronto em 72h."
            as="h1"
            animateBy="words"
            delay={100}
            stepDuration={0.4}
            className="justify-center font-[family-name:var(--font-space)] text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl [&>span:nth-child(n+5)]:text-[#22c55e] [&>span:nth-child(n+5)]:cyber-text-glow"
          />
          <span className="mx-auto mt-2 block h-px w-64 bg-gradient-to-r from-transparent via-[#22c55e] to-transparent opacity-50" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative z-10 mx-auto mt-5 max-w-xl text-lg text-zinc-400 leading-relaxed"
        >
          Copy, design, rastreamento e integrações prontas para o seu site.{" "}
          <span className="text-zinc-300 font-medium">Você manda o link do Instagram e eu faço o resto.</span>
        </motion.p>

        {/* Stats rápidos */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-6 font-mono text-sm"
        >
          {[
            { n: 72, suffix: "h", label: "Entrega garantida" },
            { n: 26, suffix: "+", label: "Clientes atendidos" },
            { n: 100, suffix: "%", label: "Mobile-first" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-[family-name:var(--font-space)] text-2xl font-bold text-white">
                <CountUp to={s.n} suffix={s.suffix} duration={1.8} />
              </div>
              <div className="mt-0.5 text-[10px] uppercase tracking-wider text-zinc-600">
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="relative z-10 mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Magnet padding={60} magnetStrength={3}>
            <Link
              href="/briefing"
              className="inline-flex items-center gap-2 rounded-xl bg-[#22c55e] px-7 py-3.5 font-semibold text-black shadow-[0_0_24px_rgba(34,197,94,0.3)] transition hover:bg-[#16a34a] hover:shadow-[0_0_40px_rgba(34,197,94,0.5)]"
            >
              Quero meu site em 72h
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Magnet>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900/50 px-7 py-3.5 font-semibold text-zinc-300 backdrop-blur-sm transition hover:border-[#22c55e]/50 hover:text-white"
          >
            <MessageCircle className="h-5 w-5" />
            Falar no WhatsApp
          </a>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-zinc-700"
        >
          <span className="font-mono text-[10px] uppercase tracking-widest">scroll</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
            <ChevronDown className="h-5 w-5" />
          </motion.div>
        </motion.div>
      </section>

      {/* ─── PROBLEMA ────────────────────────────────────────── */}
      <section className="relative border-t border-zinc-800/50 section-padding overflow-hidden bg-[#0a0a0b]">
        {/* Fundo vermelho sutil */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(239,68,68,0.04),transparent)]" />

        <div className="section-container-wide relative">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mb-4 flex items-center gap-3"
          >
            <span className="hex-badge flicker">PROBLEMA</span>
          </motion.div>

          {/* Headline forte */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4"
          >
            <h2 className="font-[family-name:var(--font-space)] text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
              Seu site está{" "}
              <span className="text-red-400">afugentando</span>{" "}
              quem poderia comprar.
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mb-10 max-w-2xl text-base text-zinc-500"
          >
            Não é o produto. Não é o preço. É o site.
          </motion.p>

          {/* Itens de dor */}
          <div className="flex flex-col gap-6">
            {PROBLEMS.map((p, i) => (
              <motion.div
                key={p.n}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
              >
                <SpotlightCard
                  className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-[#111113] transition-all duration-300 hover:border-red-500/25 hover:shadow-[0_0_32px_rgba(239,68,68,0.06)]"
                  spotlightColor="rgba(239,68,68,0.05)"
                  spotlightSize={400}
                >
                  {/* Barra lateral vermelha */}
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-500/60 via-red-500/20 to-transparent transition-all duration-300 group-hover:from-red-500/80 group-hover:via-red-500/40" />

                  <div className="flex flex-col gap-4 px-7 py-6 sm:flex-row sm:items-start sm:gap-8">
                    {/* Número */}
                    <span className="font-[family-name:var(--font-space)] text-5xl font-bold leading-none text-red-500/15 transition-colors duration-300 group-hover:text-red-500/25 sm:text-6xl flex-shrink-0">
                      {p.n}
                    </span>

                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-red-400/60">
                          {p.tag}
                        </span>
                      </div>
                      <h3 className="font-[family-name:var(--font-space)] text-lg font-bold text-white sm:text-xl">
                        {p.headline}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                        {p.sub}
                      </p>
                    </div>
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>

          {/* Linha de impacto final */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-10 flex items-center gap-4 rounded-xl border border-red-500/15 bg-red-500/5 px-6 py-4"
          >
            <span className="text-2xl leading-none text-red-400/50">×</span>
            <p className="font-mono text-sm text-zinc-400">
              Em todos os casos,{" "}
              <strong className="text-white">o problema não é o tráfego, o produto nem o preço.</strong>{" "}
              É o site que não foi feito pra converter.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── EXEMPLOS ────────────────────────────────────────── */}
      <section id="exemplos" className="cyber-section border-t border-zinc-800/50 section-padding">
        <div className="section-container-wide">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mb-4 flex items-center gap-3"
          >
            <span className="hex-badge flicker">EXEMPLOS</span>
          </motion.div>
          <BlurText
            text="Veja a diferença"
            as="h2"
            animateBy="words"
            delay={80}
            stepDuration={0.35}
            className="mb-2 font-[family-name:var(--font-space)] text-2xl font-bold text-white sm:text-3xl [&>span:last-child]:text-[#22c55e]"
          />
          <p className="mb-10 max-w-xl text-zinc-400 text-sm">
            Genérico (qualquer um) vs com identidade e direção. Clique em <strong className="text-zinc-300">Expandir</strong> para ver melhor.
          </p>
          <CompareGenericVsIdentity
            onExpand={(url, title) => setIframeModal({ url, title })}
            subtitle="Protótipo genérico, poderia ser qualquer um."
          />
        </div>
      </section>

      {/* ─── SOLUÇÃO ─────────────────────────────────────────── */}
      <section className="cyber-section data-stream border-t border-zinc-800/50 section-padding bg-[#0a0a0b]">
        <div className="section-container-wide">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mb-4 flex items-center gap-3"
          >
            <span className="hex-badge flicker">SOLUÇÃO</span>
          </motion.div>
          <BlurText
            text="IA pra acelerar. Estratégia pra vender."
            as="h2"
            animateBy="words"
            delay={80}
            stepDuration={0.35}
            className="mb-3 font-[family-name:var(--font-space)] text-2xl font-bold text-white sm:text-3xl md:text-4xl [&>span:nth-child(n+4)]:text-[#22c55e]"
          />
          <p className="mb-10 max-w-xl text-zinc-400">
            Uso IA pra acelerar a parte técnica. A direção, o copy e o acabamento ficam comigo, com estratégia, não no automático.
          </p>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {DELIVERABLES.map((d, i) => (
              <motion.div
                key={d.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <SpotlightCard
                  className="cyber-card corner-accent group h-full rounded-2xl border border-zinc-800 bg-[#161618] p-5 transition-all duration-300 hover:border-[#22c55e]/40 hover:shadow-[0_0_20px_rgba(34,197,94,0.08)]"
                  spotlightColor="rgba(34,197,94,0.06)"
                  spotlightSize={260}
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-[#22c55e]/20 bg-[#22c55e]/5 transition-colors group-hover:border-[#22c55e]/30 group-hover:bg-[#22c55e]/10">
                    <d.icon className="h-5 w-5 text-[#22c55e]" />
                  </div>
                  <p className="font-[family-name:var(--font-space)] font-bold text-white">
                    {d.label}
                  </p>
                  <p className="mt-1 font-mono text-xs text-zinc-500">{d.sub}</p>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TIMELINE / O QUE VOCÊ RECEBE ───────────────────── */}
      <section className="cyber-section border-t border-zinc-800/50 section-padding">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mb-4 flex items-center gap-3"
          >
            <span className="hex-badge flicker">ENTREGA</span>
          </motion.div>
          <BlurText
            text="Do briefing ao ar em 72h"
            as="h2"
            animateBy="words"
            delay={80}
            stepDuration={0.35}
            className="mb-10 font-[family-name:var(--font-space)] text-2xl font-bold text-white sm:text-3xl [&>span:last-child]:text-[#22c55e]"
          />

          {/* Timeline */}
          <div className="relative mb-12">
            <div className="pointer-events-none absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-[#22c55e]/20 to-transparent md:block" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-0">
              {TIMELINE.map((step, i) => (
                <motion.div
                  key={step.n}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col items-center text-center md:px-6"
                >
                  <div className="relative z-10 mb-4 flex h-16 w-16 flex-col items-center justify-center rounded-2xl border border-[#22c55e]/30 bg-[#0a0a0b] ring-4 ring-[#0a0a0b]">
                    <span className="font-[family-name:var(--font-space)] text-xl font-bold text-[#22c55e] leading-none">
                      {step.time}
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-600">
                      {step.n}
                    </span>
                  </div>
                  <p className="font-[family-name:var(--font-space)] font-bold text-white">
                    {step.label}
                  </p>
                  <p className="mt-1 font-mono text-xs text-zinc-500">{step.sub}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Extras: produto premium (tráfego) + outros */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <SpotlightCard
              className="cyber-card corner-accent rounded-2xl border border-[#22c55e]/25 bg-[#161618] p-6 transition-all duration-300 hover:border-[#22c55e]/40 hover:shadow-[0_0_24px_rgba(34,197,94,0.08)]"
              spotlightColor="rgba(34,197,94,0.06)"
              spotlightSize={400}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#22c55e]/20 bg-[#22c55e]/10">
                  <Gift className="h-5 w-5 text-[#22c55e]" />
                </div>
                <div>
                  <p className="font-[family-name:var(--font-space)] font-bold text-white">
                    Extras que podem entrar
                  </p>
                  <p className="font-mono text-[10px] text-zinc-500">a combinar, conforme o projeto</p>
                </div>
              </div>

              {/* Produto premium: Tráfego */}
              <div className="mb-5 rounded-xl border border-[#22c55e]/30 bg-[#22c55e]/5 p-4">
                <p className="font-[family-name:var(--font-space)] font-bold text-[#22c55e]">
                  {EXTRAS_PREMIUM.title}
                </p>
                <p className="mt-1 text-sm font-medium text-white">
                  {EXTRAS_PREMIUM.tagline}
                </p>
                <p className="mt-1 font-mono text-[10px] text-zinc-500">
                  {EXTRAS_PREMIUM.note}
                </p>
              </div>

              <ul className="space-y-3">
                {EXTRAS_LIST.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 font-mono text-sm text-zinc-300">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#22c55e]" />
                    {item}
                  </li>
                ))}
              </ul>
            </SpotlightCard>
          </motion.div>
        </div>
      </section>

      {/* ─── PLANOS ──────────────────────────────────────────── */}
      <section id="planos" className="cyber-section data-stream border-t border-zinc-800/50 section-padding bg-[#0a0a0b]">
        <div className="section-container-wide">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mb-4 flex items-center gap-3"
          >
            <span className="hex-badge flicker">PLANOS</span>
          </motion.div>
          <BlurText
            text="Planos"
            as="h2"
            animateBy="words"
            delay={80}
            stepDuration={0.4}
            className="mb-2 font-[family-name:var(--font-space)] text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl [&>span:last-child]:text-[#22c55e] [&>span:last-child]:cyber-text-glow"
          />
          <BlurText
            text="Escolha o que cabe no seu momento. Entrega com identidade, não com cara de template."
            as="p"
            animateBy="words"
            delay={50}
            stepDuration={0.25}
            direction="bottom"
            className="mb-12 max-w-2xl font-mono text-sm text-zinc-400"
          />

          {/* Mobile: coluna vertical (cada plano 100% da largura, sem cortar) */}
          <div className="flex flex-col gap-5 md:hidden">
            {PLANS_72.map((plan, i) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className={plan.featured ? "pt-6" : ""}
              >
                <Plan72Card plan={plan} index={i} />
              </motion.div>
            ))}
          </div>

          {/* Desktop: grid — featured elevado (pt para o badge "mais escolhido" não cortar) */}
          <div className="hidden md:grid md:grid-cols-3 md:gap-5 md:items-stretch md:pt-10">
            {PLANS_72.map((plan, i) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className={plan.featured ? "md:-mt-4" : ""}
              >
                <Plan72Card plan={plan} index={i} />
              </motion.div>
            ))}
          </div>

          {/* Add-ons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-14"
          >
            <div className="mb-5 flex items-center gap-3">
              <Sparkles className="h-4 w-4 text-[#22c55e]/70" />
              <span className="font-mono text-xs uppercase tracking-wider text-zinc-500">
                Add-ons disponíveis
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {ADDONS.map((addon) => (
                <div
                  key={addon.label}
                  className="flex flex-col justify-between gap-2 rounded-xl border border-zinc-800 bg-[#161618] px-4 py-3 sm:flex-row sm:items-center hover:border-zinc-700 transition-colors"
                >
                  <span className="text-sm text-zinc-400">{addon.label}</span>
                  <span className="font-mono text-xs font-bold text-[#22c55e] whitespace-nowrap">
                    {addon.range}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── GARANTIA ────────────────────────────────────────── */}
      <section className="cyber-section data-stream border-t border-zinc-800/50 section-padding bg-[#0a0a0b]">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <SpotlightCard
              className="relative overflow-hidden rounded-2xl border border-[#22c55e]/35 bg-[#161618] p-8 text-center transition-all duration-300 hover:border-[#22c55e]/50 hover:shadow-[0_0_36px_rgba(34,197,94,0.1)] md:p-12"
              spotlightColor="rgba(34,197,94,0.08)"
              spotlightSize={480}
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_0%,rgba(34,197,94,0.05),transparent)]" />
              <div className="relative">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#22c55e]/30 bg-[#22c55e]/10">
                  <Shield className="h-7 w-7 text-[#22c55e]" />
                </div>
                <p className="font-mono text-xs uppercase tracking-widest text-[#22c55e]/70">
                  Garantia
                </p>
                <h2 className="mt-2 font-[family-name:var(--font-space)] text-3xl font-bold text-white sm:text-4xl">
                  72h ou você não paga.
                </h2>
                <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-zinc-400">
                  Se o site não passar no checklist (mobile, CTA, rastreio, clareza), eu ajusto até passar. Sem custo extra.
                </p>
                <div className="mx-auto mt-8 flex flex-wrap items-center justify-center gap-3">
                  {["Mobile aprovado", "CTA claro", "Rastreio instalado", "Clareza de oferta"].map(
                    (item) => (
                      <span
                        key={item}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#22c55e]/20 bg-[#22c55e]/5 px-3 py-1 font-mono text-[10px] text-[#22c55e]/80"
                      >
                        <Check className="h-3 w-3" />
                        {item}
                      </span>
                    )
                  )}
                </div>
              </div>
            </SpotlightCard>
          </motion.div>
        </div>
      </section>

      {/* ─── CTA FINAL ───────────────────────────────────────── */}
      <section className="cyber-section border-t border-zinc-800/50 section-padding">
        <div className="section-container max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6 flex items-center justify-center gap-3"
          >
            <span className="hex-badge flicker">
              <Clock className="h-3 w-3" />
              INIT://SITE_72H
            </span>
          </motion.div>

          <BlurText
            text="Me chama no WhatsApp e te mando 3 ideias de layout pro seu nicho em 10 minutos."
            as="h2"
            animateBy="words"
            delay={80}
            stepDuration={0.35}
            className="mb-4 justify-center font-[family-name:var(--font-space)] text-2xl font-bold text-white sm:text-3xl [&>span:nth-child(n+7)]:text-[#22c55e] [&>span:nth-child(n+7)]:cyber-text-glow"
          />

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-2 font-mono text-sm text-zinc-500 terminal-cursor"
          >
            Sem compromisso. Só uma conversa rápida.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mb-10 text-sm font-medium"
          >
            <span className="shiny-text" data-text="Seu site premium em até 72h.">
              Seu site premium em até 72h.
            </span>
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto mb-10 h-px max-w-xs bg-gradient-to-r from-transparent via-[#22c55e]/40 to-transparent"
            style={{ transformOrigin: "left" }}
          />

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Magnet padding={60} magnetStrength={3}>
              <Link
                href="/briefing"
                className="inline-flex items-center gap-2 rounded-xl bg-[#22c55e] px-7 py-3.5 font-semibold text-black shadow-[0_0_20px_rgba(34,197,94,0.3)] transition hover:bg-[#16a34a] hover:shadow-[0_0_40px_rgba(34,197,94,0.5)]"
              >
                Preencher briefing
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Magnet>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-[#22c55e]/40 bg-[#22c55e]/10 px-7 py-3.5 font-semibold text-[#22c55e] backdrop-blur-sm transition hover:border-[#22c55e]/70 hover:bg-[#22c55e]/20"
            >
              <MessageCircle className="h-5 w-5" />
              Chamar no WhatsApp
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-12 font-mono text-[10px] uppercase tracking-widest text-zinc-700 flicker"
          >
            // session_ready · awaiting_connection
          </motion.p>
        </div>
      </section>

      <IframeModal
        url={iframeModal?.url ?? null}
        title={iframeModal?.title ?? ""}
        onClose={() => setIframeModal(null)}
      />
    </main>
  );
}

/* ─── Plan72Card ─────────────────────────────────────────── */
function Plan72Card({
  plan,
}: {
  plan: (typeof PLANS_72)[number];
  index: number;
}) {
  const Icon = plan.icon;
  return (
    <SpotlightCard
      className={`cyber-card hex-overlay corner-accent group relative flex h-full flex-col rounded-xl border bg-[#161618] p-5 transition-all duration-300 md:rounded-2xl md:p-6 ${
        plan.featured
          ? "border-[#22c55e]/40 shadow-[0_0_28px_rgba(34,197,94,0.08)] hover:border-[#22c55e]/60 hover:shadow-[0_0_40px_rgba(34,197,94,0.15)] pt-10 md:pt-10"
          : "border-zinc-800 hover:border-[#22c55e]/35 hover:shadow-[0_0_20px_rgba(34,197,94,0.06)]"
      }`}
      spotlightColor="rgba(34,197,94,0.06)"
      spotlightSize={360}
    >
      {plan.featured && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10">
          <span className="inline-flex items-center gap-1 rounded-full border border-[#22c55e]/40 bg-[#0a0a0b] px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-[#22c55e] shadow-[0_0_12px_rgba(0,0,0,0.5)]">
            mais escolhido
          </span>
        </div>
      )}

      {/* Cabeçalho */}
      <div className="flex items-center justify-between gap-3 mb-4 pt-1">
        <div className="flex items-center gap-3">
          <div
            className={`inline-flex items-center justify-center rounded-lg border p-2 transition-colors duration-300 ${
              plan.featured
                ? "border-[#22c55e]/30 bg-[#22c55e]/10 group-hover:border-[#22c55e]/50"
                : "border-[#22c55e]/20 bg-[#22c55e]/5 group-hover:border-[#22c55e]/30 group-hover:bg-[#22c55e]/10"
            }`}
          >
            <Icon className={`h-5 w-5 text-[#22c55e] ${plan.featured ? "ai-pulse" : ""}`} />
          </div>
          <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-wider">
            {plan.badge}
          </span>
        </div>
      </div>

      <h3
        className={`font-[family-name:var(--font-space)] text-xl font-bold transition-colors duration-300 group-hover:text-[#22c55e] ${
          plan.featured ? "text-[#22c55e]" : "text-white"
        }`}
      >
        {plan.title}
      </h3>
      <p className="mt-1 text-sm text-zinc-500">{plan.subtitle}</p>
      {"prazo" in plan && plan.prazo && (
        <p className="mt-2 font-mono text-[10px] text-[#22c55e]/90">{plan.prazo}</p>
      )}

      {/* Preço */}
      {"price" in plan && plan.price && (
        <div className="mt-3 flex flex-wrap items-baseline gap-2">
          <span className="font-[family-name:var(--font-space)] text-lg font-bold text-[#22c55e]">
            {plan.price}
          </span>
          {"priceRange" in plan && plan.priceRange && (
            <span className="font-mono text-[10px] text-zinc-500">
              ({plan.priceRange})
            </span>
          )}
        </div>
      )}

      {/* Ideal para */}
      <div className="mt-5">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-zinc-600">
          Ideal para
        </p>
        <ul className="space-y-1.5">
          {plan.ideal.map((item) => (
            <li key={item} className="flex items-start gap-2 font-mono text-xs text-zinc-400">
              <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-zinc-600" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Inclui */}
      <div className="mt-5">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-zinc-600">
          Inclui
        </p>
        <ul className="space-y-1.5">
          {plan.inclui.map((item) => (
            <li key={item} className="flex items-start gap-2 font-mono text-xs text-zinc-300">
              <Check className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-[#22c55e]" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Rodapé */}
      <div className="mt-auto pt-5">
        <div className="h-px w-full bg-gradient-to-r from-[#22c55e]/20 to-transparent mb-4" />
        <p className="font-[family-name:var(--font-space)] text-sm font-semibold text-zinc-300">
          {plan.quote}
        </p>
        <a
          href={plan.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-4 flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold text-sm transition-all ${
            plan.featured
              ? "bg-[#22c55e] text-black shadow-[0_0_16px_rgba(34,197,94,0.3)] hover:bg-[#16a34a] hover:shadow-[0_0_28px_rgba(34,197,94,0.5)]"
              : "border border-zinc-700 text-zinc-300 hover:border-[#22c55e]/40 hover:text-white"
          }`}
        >
          <MessageCircle className="h-4 w-4" />
          Quero esse plano
        </a>
      </div>
    </SpotlightCard>
  );
}
