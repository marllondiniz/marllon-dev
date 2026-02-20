"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  Zap,
  Check,
  X,
  Sparkles,
  FileText,
  Layout,
  Building2,
  Mail,
  ArrowLeft,
  Cpu,
  Terminal,
  ArrowRight,
  ChevronDown,
  Star,
} from "lucide-react";
import BlurText from "@/app/components/BlurText";
import Magnet from "@/app/components/Magnet";
import SpotlightCard from "@/app/components/SpotlightCard";
import CyberBackground from "@/app/components/CyberBackground";
import CountUp from "@/app/components/CountUp";
import CompareGenericVsIdentity from "@/app/components/CompareGenericVsIdentity";
import IframeModal from "@/app/components/IframeModal";

const EMAIL = "marllonzinid@gmail.com";

function FloatingTag({
  delay,
  x,
  y,
  children,
}: {
  delay: number;
  x: string;
  y: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.6, ease: "easeOut" }}
      style={{ position: "absolute", left: x, top: y }}
      className="hidden lg:flex items-center gap-2 rounded-xl border border-zinc-800/80 bg-black/70 backdrop-blur-md px-3 py-2 text-xs font-mono text-zinc-500 shadow-[0_0_20px_rgba(0,0,0,0.6)]"
    >
      {children}
    </motion.div>
  );
}

const DIFERENCIAL_ITEMS = [
  { title: "Conceito visual exclusivo", icon: Star },
  { title: "Direção criativa de marca", icon: Sparkles },
  { title: "Hierarquia para conversão", icon: ArrowRight },
  { title: "Escrita estratégica", icon: Terminal },
  { title: "Código limpo e performático", icon: Zap },
  { title: "Zero estética genérica", icon: X },
];

const STEPS = [
  { n: "01", label: "Estrutura base", sub: "scaffolding rápido" },
  { n: "02", label: "Componentes", sub: "biblioteca de UI" },
  { n: "03", label: "Layout inicial", sub: "wireframe vivo" },
  { n: "04", label: "Boilerplate", sub: "configuração zero" },
  { n: "05", label: "Iteração", sub: "testes em segundos" },
];

export default function VibeCodingContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-7, 7]);
  const floatX1 = useTransform(springX, [-0.5, 0.5], [-10, 10]);
  const floatY1 = useTransform(springY, [-0.5, 0.5], [-6, 6]);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth - 0.5);
      mouseY.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, [mouseX, mouseY]);

  const [iframeModal, setIframeModal] = useState<{ url: string; title: string } | null>(null);

  return (
    <main className="relative overflow-hidden pb-20">

      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section
        ref={containerRef}
        className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pb-16 pt-12"
        style={{ perspective: "1200px" }}
      >
        <CyberBackground />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(34,197,94,0.07),transparent)]" />
        <div className="pointer-events-none absolute inset-0 cyber-grid-bg opacity-25" />
        <motion.div
          style={{ x: floatX1, y: floatY1 }}
          className="pointer-events-none absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(34,197,94,0.05),transparent_70%)]"
        />

        {/* Floating ironic tags */}
        <motion.div style={{ x: floatX1, y: floatY1 }} className="pointer-events-none absolute inset-0">
          <FloatingTag delay={0.9} x="5%" y="25%">
            <span className="text-red-400/70">✗</span>
            <span>emoji_count: 34</span>
          </FloatingTag>
          <FloatingTag delay={1.1} x="72%" y="16%">
            <span className="text-red-400/70">✗</span>
            <span>template: detected</span>
          </FloatingTag>
          <FloatingTag delay={1.3} x="76%" y="62%">
            <span className="text-[#22c55e]/80">✓</span>
            <span>identidade: real</span>
          </FloatingTag>
          <FloatingTag delay={1.5} x="2%" y="63%">
            <span className="text-[#22c55e]/80">✓</span>
            <span>design: exclusivo</span>
          </FloatingTag>
        </motion.div>

        {/* Hero content — 3D tilt */}
        <motion.div
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="relative z-10 mx-auto max-w-4xl text-center"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            style={{ translateZ: 20 }}
            className="mb-6 flex items-center justify-center gap-3"
          >
            <span className="hex-badge flicker">VIBE_CODING://DIRECAO</span>
            <span className="status-dot" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ translateZ: 40 }}
          >
            <BlurText
              text="Vibe Coding"
              as="h1"
              animateBy="words"
              delay={150}
              stepDuration={0.5}
              className="justify-center font-[family-name:var(--font-space)] text-5xl font-bold leading-[1.1] tracking-tight text-white sm:text-6xl md:text-7xl"
            />
            <BlurText
              text="com Direção."
              as="span"
              animateBy="words"
              delay={150}
              stepDuration={0.5}
              className="justify-center font-[family-name:var(--font-space)] text-5xl font-bold leading-[1.1] tracking-tight text-[#22c55e] cyber-text-glow sm:text-6xl md:text-7xl"
            />
            <span className="block mx-auto mt-2 h-px w-72 bg-gradient-to-r from-transparent via-[#22c55e] to-transparent opacity-50" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            style={{ translateZ: 30 }}
            className="mx-auto mt-6 max-w-2xl text-lg font-medium tracking-wide sm:text-xl"
          >
            <span className="shiny-text" data-text="Velocidade de IA. Identidade de Marca.">
              Velocidade de IA. Identidade de Marca.
            </span>
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            style={{ translateZ: 20 }}
            className="mx-auto mt-3 max-w-xl font-mono text-sm text-zinc-500 terminal-cursor"
          >
            Sites rápidos, exclusivos e sem cara de IA.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            style={{ translateZ: 30 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Magnet padding={60} magnetStrength={3}>
              <a
                href="#planos"
                className="inline-flex items-center gap-2 rounded-xl bg-[#22c55e] px-6 py-3.5 font-semibold text-black shadow-[0_0_24px_rgba(34,197,94,0.3)] transition hover:bg-[#16a34a] hover:shadow-[0_0_40px_rgba(34,197,94,0.5)]"
              >
                <Zap className="h-5 w-5" />
                Ver planos
              </a>
            </Magnet>
            <Magnet padding={60} magnetStrength={3}>
              <a
                href={`mailto:${EMAIL}?subject=Vibe Coding - Site exclusivo`}
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-600 bg-zinc-900/50 px-6 py-3.5 font-semibold text-zinc-300 backdrop-blur-sm transition hover:border-[#22c55e]/50 hover:text-white"
              >
                <Mail className="h-5 w-5" />
                Falar comigo
              </a>
            </Magnet>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            style={{ translateZ: 10 }}
            className="mt-14 flex flex-wrap justify-center gap-8 border-t border-zinc-800/60 pt-8"
          >
            {[
              { to: 26, suffix: "+", label: "Empresas atendidas" },
              { to: 4, suffix: "+", label: "Anos de experiência" },
              { to: 100, suffix: "%", label: "Design exclusivo" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-[family-name:var(--font-space)] text-2xl font-bold text-white">
                  <CountUp to={s.to} suffix={s.suffix} duration={2} />
                </div>
                <div className="mt-0.5 text-xs text-zinc-500">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-zinc-600"
        >
          <span className="font-mono text-[10px] uppercase tracking-widest">scroll</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
            <ChevronDown className="h-5 w-5" />
          </motion.div>
        </motion.div>
      </section>

      {/* ─── COMPARATIVO TERMINAL ─────────────────────────────── */}
      <section className="cyber-section data-stream border-t border-zinc-800/50 section-padding bg-[#0a0a0b]">
        <div className="section-container-wide">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mb-4 flex items-center gap-3"
          >
            <span className="hex-badge flicker">COMPARE://OUTPUT</span>
            <span className="status-dot" />
          </motion.div>
          <BlurText
            text="O problema não é a IA."
            as="h2"
            animateBy="words"
            delay={80}
            stepDuration={0.4}
            className="mb-2 font-[family-name:var(--font-space)] text-2xl font-bold text-white sm:text-3xl md:text-4xl"
          />
          <BlurText
            text="É a ausência de direção."
            as="p"
            animateBy="words"
            delay={60}
            stepDuration={0.3}
            direction="bottom"
            className="mb-10 font-[family-name:var(--font-space)] text-xl font-bold text-[#22c55e] cyber-text-glow sm:text-2xl md:text-3xl"
          />

          <CompareGenericVsIdentity
            onExpand={(url, title) => setIframeModal({ url, title })}
          />
        </div>
      </section>

      {/* ─── O QUE É VIBE CODING — STEPS ─────────────────────── */}
      <section className="cyber-section border-t border-zinc-800/50 section-padding">
        <div className="section-container-wide">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mb-4 flex items-center gap-3"
          >
            <span className="hex-badge flicker">DEF://VIBE_CODING</span>
            <span className="status-dot" />
          </motion.div>
          <BlurText
            text="O que a IA acelera"
            as="h2"
            animateBy="words"
            delay={80}
            stepDuration={0.35}
            className="mb-10 font-[family-name:var(--font-space)] text-2xl font-bold text-white md:text-3xl [&>span:last-child]:text-[#22c55e]"
          />

          {/* Steps com linha de conexão */}
          <div className="relative">
            {/* Linha horizontal de conexão — desktop */}
            <div className="pointer-events-none absolute left-0 right-0 top-10 hidden h-px bg-gradient-to-r from-transparent via-[#22c55e]/20 to-transparent md:block" />
            <div className="grid grid-cols-2 gap-4 md:grid-cols-5 md:gap-0">
              {STEPS.map((step, i) => (
                <motion.div
                  key={step.n}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex flex-col items-center text-center md:px-4"
                >
                  {/* Nó numerado */}
                  <div className="relative z-10 mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-[#22c55e]/30 bg-[#0a0a0b] ring-4 ring-[#0a0a0b]">
                    <span className="font-mono text-xs font-bold text-[#22c55e]">{step.n}</span>
                  </div>
                  <p className="font-[family-name:var(--font-space)] text-sm font-bold text-white">
                    {step.label}
                  </p>
                  <p className="mt-1 font-mono text-[10px] text-zinc-600 uppercase tracking-wider">
                    {step.sub}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 rounded-xl border border-zinc-800/60 bg-[#161618] px-5 py-4"
          >
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-mono text-sm text-zinc-400">
                Isso reduz tempo. Reduz custo. Reduz retrabalho.
              </p>
              <p className="font-mono text-sm font-semibold text-zinc-300">
                Mas sozinho, isso não cria <span className="text-[#22c55e]">marca</span>.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── PRÓS E CONTRAS — TABLE STYLE ─────────────────────── */}
      <section className="cyber-section data-stream border-t border-zinc-800/50 section-padding bg-[#0a0a0b]">
        <div className="section-container-wide">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mb-8 flex items-center gap-3"
          >
            <span className="hex-badge flicker">PROS//CONTRAS</span>
            <span className="status-dot" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <SpotlightCard
              className="cyber-card hex-overlay corner-accent overflow-hidden rounded-2xl border border-zinc-800 bg-[#161618] transition-all duration-300 hover:border-zinc-700 hover:shadow-[0_0_24px_rgba(0,0,0,0.4)]"
              spotlightColor="rgba(34, 197, 94, 0.04)"
              spotlightSize={500}
            >
              {/* Header */}
              <div className="grid grid-cols-2 border-b border-zinc-800">
                <div className="flex items-center gap-2 border-r border-zinc-800 px-5 py-4">
                  <Check className="h-4 w-4 text-[#22c55e]" />
                  <span className="font-[family-name:var(--font-space)] text-sm font-bold text-white">
                    Quando bem utilizado
                  </span>
                </div>
                <div className="flex items-center gap-2 px-5 py-4">
                  <X className="h-4 w-4 text-amber-500/80" />
                  <span className="font-[family-name:var(--font-space)] text-sm font-bold text-white">
                    Quando mal utilizado
                  </span>
                </div>
              </div>
              {/* Rows */}
              {[
                ["Entrega mais rápida", "Layouts genéricos"],
                ["Redução de custo operacional", 'Sites com "cara de IA"'],
                ["Agilidade na validação de ideias", "Uso excessivo de emojis"],
                ["Desenvolvimento moderno", "Copy superficial"],
                ["Iterações mais eficientes", "Falta de identidade visual"],
              ].map(([pro, con], i) => (
                <div key={pro} className={`grid grid-cols-2 border-b border-zinc-800/50 last:border-0 ${i % 2 === 0 ? "" : "bg-zinc-900/20"}`}>
                  <div className="flex items-center gap-2 border-r border-zinc-800/50 px-5 py-3 font-mono text-xs text-zinc-300">
                    <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#22c55e]" />
                    {pro}
                  </div>
                  <div className="flex items-center gap-2 px-5 py-3 font-mono text-xs text-zinc-500">
                    <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500/60" />
                    {con}
                  </div>
                </div>
              ))}
              {/* Footer */}
              <div className="border-t border-zinc-800 bg-[#22c55e]/5 px-5 py-4">
                <p className="font-mono text-xs text-zinc-400">
                  <span className="text-[#22c55e]">›</span> O problema nunca foi a ferramenta — foi a{" "}
                  <strong className="text-white">ausência de direção</strong>.
                </p>
              </div>
            </SpotlightCard>
          </motion.div>
        </div>
      </section>

      {/* ─── DIFERENCIAL — BENTO GRID ─────────────────────────── */}
      <section className="cyber-section border-t border-zinc-800/50 section-padding">
        <div className="section-container-wide">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mb-4 flex items-center gap-3"
          >
            <span className="hex-badge flicker">DIFERENCIAL</span>
            <span className="status-dot" />
          </motion.div>
          <BlurText
            text="Nosso Diferencial"
            as="h2"
            animateBy="words"
            delay={80}
            stepDuration={0.35}
            className="mb-8 font-[family-name:var(--font-space)] text-2xl font-bold text-white md:text-3xl [&>span:last-child]:text-[#22c55e]"
          />

          <div className="grid gap-4 md:grid-cols-3">
            {/* Card grande — statement */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="md:col-span-2"
            >
              <SpotlightCard
                className="cyber-card hex-overlay corner-accent group relative h-full min-h-[220px] overflow-hidden rounded-2xl border border-[#22c55e]/30 bg-[#161618] p-7 transition-all duration-300 hover:border-[#22c55e]/50 hover:shadow-[0_0_36px_rgba(34,197,94,0.12)]"
                spotlightColor="rgba(34, 197, 94, 0.1)"
                spotlightSize={480}
              >
                {/* Glow bg */}
                <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(34,197,94,0.08),transparent_70%)]" />
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#22c55e]/25 bg-[#22c55e]/10 mb-5">
                  <Cpu className="h-6 w-6 text-[#22c55e] ai-pulse" />
                </div>
                <p className="mb-3 font-mono text-xs uppercase tracking-wider text-zinc-500">
                  nosso processo
                </p>
                <p className="font-[family-name:var(--font-space)] text-xl font-bold text-white md:text-2xl leading-snug">
                  Aqui, a IA acelera.{" "}
                  <span className="text-[#22c55e]">A estratégia conduz.</span>
                </p>
                <p className="mt-4 text-sm text-zinc-400 leading-relaxed max-w-md">
                  Usamos vibe coding como base técnica para ganhar velocidade. O acabamento é humano — cada detalhe pensado para posicionar a marca, não só preencher tela.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {["Velocidade real", "Identidade de marca", "Zero templates"].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-[#22c55e]/20 bg-[#22c55e]/5 px-2.5 py-1 font-mono text-[10px] text-[#22c55e]/80 uppercase tracking-wider"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </SpotlightCard>
            </motion.div>

            {/* Card pequeno — visual declaração */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
            >
              <SpotlightCard
                className="cyber-card hex-overlay corner-accent group relative h-full min-h-[220px] overflow-hidden rounded-2xl border border-zinc-800 bg-[#161618] p-6 transition-all duration-300 hover:border-[#22c55e]/40 hover:shadow-[0_0_24px_rgba(34,197,94,0.08)]"
                spotlightColor="rgba(34, 197, 94, 0.06)"
                spotlightSize={300}
              >
                <p className="mb-5 font-mono text-[10px] uppercase tracking-wider text-zinc-600">
                  resultado esperado
                </p>
                <p className="font-[family-name:var(--font-space)] text-3xl font-bold text-white leading-tight">
                  Velocidade<br />
                  <span className="text-[#22c55e]">sem perder</span><br />
                  identidade.
                </p>
                <div className="mt-6 h-px w-full bg-gradient-to-r from-[#22c55e]/40 to-transparent" />
                <p className="mt-4 font-mono text-xs text-zinc-500">
                  Tecnologia sem perder personalidade.
                </p>
              </SpotlightCard>
            </motion.div>

            {/* 6 cards menores de feature */}
            {DIFERENCIAL_ITEMS.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 * i }}
              >
                <SpotlightCard
                  className="cyber-card corner-accent group relative h-full rounded-xl border border-zinc-800 bg-[#161618] p-4 transition-all duration-300 hover:border-[#22c55e]/40 hover:shadow-[0_0_20px_rgba(34,197,94,0.08)]"
                  spotlightColor="rgba(34, 197, 94, 0.05)"
                  spotlightSize={250}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-[#22c55e]/20 bg-[#22c55e]/5 transition-colors duration-300 group-hover:border-[#22c55e]/30 group-hover:bg-[#22c55e]/10">
                      <item.icon className="h-4 w-4 text-[#22c55e]" />
                    </div>
                    <p className="font-[family-name:var(--font-space)] text-sm font-semibold text-zinc-300 leading-snug group-hover:text-white transition-colors">
                      {item.title}
                    </p>
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PLANOS ────────────────────────────────────────────── */}
      <section id="planos" className="cyber-section data-stream border-t border-zinc-800/50 section-padding bg-[#0a0a0b]">
        <div className="section-container-wide">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mb-4 flex items-center gap-3"
          >
            <span className="hex-badge flicker">PLANOS</span>
            <span className="status-dot" />
          </motion.div>
          <BlurText
            text="Planos"
            as="h2"
            animateBy="words"
            delay={80}
            stepDuration={0.4}
            className="mb-3 font-[family-name:var(--font-space)] text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl [&>span:last-child]:text-[#22c55e] [&>span:last-child]:cyber-text-glow"
          />
          <BlurText
            text="Nem todo negócio precisa do mesmo nível. Mas todo negócio precisa de presença bem construída."
            as="p"
            animateBy="words"
            delay={60}
            stepDuration={0.3}
            direction="bottom"
            className="mb-12 max-w-2xl font-mono text-sm text-zinc-400"
          />

          {/* Mobile: carousel */}
          <div className="block md:hidden">
            <div className="carousel-mobile">
              {PLANS.map((plan, i) => (
                <div key={plan.id} className="carousel-card">
                  <PlanCard plan={plan} index={i} />
                </div>
              ))}
            </div>
          </div>

          {/* Desktop: grid — middle featured */}
          <div className="hidden md:grid md:grid-cols-3 md:gap-5 md:items-stretch">
            {PLANS.map((plan, i) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className={plan.featured ? "md:-mt-4" : ""}
              >
                <PlanCard plan={plan} index={i} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── EQUILÍBRIO — STATEMENT ───────────────────────────── */}
      <section className="cyber-section border-t border-zinc-800/50 section-padding">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <SpotlightCard
              className="cyber-card neon-scan hex-overlay corner-accent group relative overflow-hidden rounded-2xl border border-[#22c55e]/30 bg-[#161618] p-8 text-center transition-all duration-300 hover:border-[#22c55e]/50 hover:shadow-[0_0_40px_rgba(34,197,94,0.12)] md:p-12"
              spotlightColor="rgba(34, 197, 94, 0.07)"
              spotlightSize={500}
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(34,197,94,0.04),transparent)]" />
              <p className="relative mb-3 font-mono text-[10px] uppercase tracking-widest text-zinc-600">
                o equilíbrio
              </p>
              <p className="relative font-[family-name:var(--font-space)] text-2xl font-bold text-zinc-400 leading-relaxed md:text-3xl">
                Não é artesanal lento.
                <br />
                Não é automático genérico.
              </p>
              <p className="relative mt-4 font-[family-name:var(--font-space)] text-2xl font-bold text-white md:text-3xl">
                É processo moderno com{" "}
                <span className="text-[#22c55e] cyber-text-glow">direção estratégica</span>.
              </p>
              <div className="relative mx-auto mt-8 h-px max-w-xs bg-gradient-to-r from-transparent via-[#22c55e]/40 to-transparent" />
              <p className="relative mt-6 max-w-lg mx-auto text-sm text-zinc-400 leading-relaxed">
                Se você quer apenas um site qualquer, existem centenas de ferramentas.
                <br />
                Se você quer um site <strong className="text-white">rápido, exclusivo e com identidade real</strong>, vamos conversar.
              </p>
            </SpotlightCard>
          </motion.div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────── */}
      <section id="contato" className="cyber-section data-stream border-t border-zinc-800/50 section-padding">
        <div className="section-container max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6 flex items-center justify-center gap-3"
          >
            <span className="hex-badge flicker">
              <Terminal className="h-3 w-3" />
              INIT://CONTACT_SESSION
            </span>
            <span className="status-dot" />
          </motion.div>

          <BlurText
            text="Quer um site rápido, exclusivo e com identidade?"
            as="h2"
            animateBy="words"
            delay={100}
            stepDuration={0.4}
            className="justify-center font-[family-name:var(--font-space)] text-2xl font-bold tracking-tight text-white md:text-3xl [&>span:nth-child(n+6)]:text-[#22c55e] [&>span:nth-child(n+6)]:cyber-text-glow"
          />

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-4 font-mono text-sm text-zinc-400 terminal-cursor"
          >
            One page, 3 páginas ou site corporativo. Sem cara de IA. Com direção.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="mt-2 text-sm font-medium"
          >
            <span className="shiny-text" data-text="Velocidade de IA. Identidade de Marca.">
              Velocidade de IA. Identidade de Marca.
            </span>
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mx-auto mt-8 h-px max-w-xs bg-gradient-to-r from-transparent via-[#22c55e]/40 to-transparent"
            style={{ transformOrigin: "left" }}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Magnet padding={60} magnetStrength={3}>
              <a
                href={`mailto:${EMAIL}?subject=Vibe Coding - Site exclusivo`}
                className="inline-flex items-center gap-2 rounded-xl bg-[#22c55e] px-6 py-3.5 font-semibold text-black shadow-[0_0_20px_rgba(34,197,94,0.3)] transition hover:bg-[#16a34a] hover:shadow-[0_0_40px_rgba(34,197,94,0.5)]"
              >
                <Mail className="h-5 w-5" />
                Quero falar sobre meu site
              </a>
            </Magnet>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900/50 px-6 py-3.5 font-semibold text-zinc-300 backdrop-blur-sm transition hover:border-[#22c55e]/50 hover:text-white hover:shadow-[0_0_16px_rgba(34,197,94,0.1)]"
            >
              <ArrowLeft className="h-5 w-5" />
              Voltar ao início
            </Link>
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

/* ─── Planos data ───────────────────────────────────────── */
const PLANS = [
  {
    id: "one-page",
    icon: FileText,
    title: "One Page",
    subtitle: "Presença estratégica e objetiva",
    badge: "01",
    ideal: ["Lançamentos", "Profissionais autônomos", "Validação de produto", "Página de vendas"],
    inclui: [
      "1 página totalmente personalizada",
      "Estrutura pensada para conversão",
      "Design exclusivo",
      "Responsivo mobile + desktop",
      "Performance otimizada",
    ],
    quote: "Entrar forte, com clareza.",
    featured: false,
  },
  {
    id: "3-paginas",
    icon: Layout,
    title: "3 Páginas",
    subtitle: "Estrutura sólida para crescer",
    badge: "02",
    ideal: ["Home", "Sobre", "Serviços ou Produtos"],
    inclui: [
      "Identidade visual aplicada",
      "Hierarquia estratégica de conteúdo",
      "Layout exclusivo por página",
      "Estrutura pensada para autoridade",
      "Experiência profissional moderna",
    ],
    quote: "Mais contexto. Mais valor.",
    featured: true,
  },
  {
    id: "corporativo",
    icon: Building2,
    title: "Corporativo",
    subtitle: "Arquitetura completa para empresas",
    badge: "03",
    ideal: ["Empresas consolidadas", "Múltiplos serviços", "Estruturas institucionais"],
    inclui: [
      "Arquitetura personalizada",
      "Múltiplas páginas",
      "Blog ou área de conteúdo",
      "Estrutura escalável",
      "Performance avançada",
    ],
    quote: "Um ativo digital, não um site.",
    featured: false,
  },
];

/* ─── PlanCard component ────────────────────────────────── */
function PlanCard({
  plan,
  index,
}: {
  plan: (typeof PLANS)[number];
  index: number;
}) {
  const Icon = plan.icon;
  return (
    <SpotlightCard
      className={`cyber-card hex-overlay corner-accent group relative flex h-full flex-col rounded-xl border bg-[#161618] p-5 transition-all duration-300 md:rounded-2xl md:p-6 ${
        plan.featured
          ? "border-[#22c55e]/40 shadow-[0_0_28px_rgba(34,197,94,0.08)] hover:border-[#22c55e]/60 hover:shadow-[0_0_40px_rgba(34,197,94,0.15)]"
          : "border-zinc-800 hover:border-[#22c55e]/35 hover:shadow-[0_0_20px_rgba(34,197,94,0.06)]"
      }`}
      spotlightColor="rgba(34, 197, 94, 0.06)"
      spotlightSize={360}
    >
      {/* Featured badge */}
      {plan.featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1 rounded-full border border-[#22c55e]/40 bg-[#22c55e]/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-[#22c55e]">
            <Star className="h-3 w-3" />
            mais escolhido
          </span>
        </div>
      )}

      <div className="flex items-center justify-between gap-3 mb-4 pt-1">
        <div className="flex items-center gap-3">
          <div className={`inline-flex items-center justify-center rounded-lg border p-2 transition-colors duration-300 ${
            plan.featured
              ? "border-[#22c55e]/30 bg-[#22c55e]/10 group-hover:border-[#22c55e]/50"
              : "border-[#22c55e]/20 bg-[#22c55e]/5 group-hover:border-[#22c55e]/30 group-hover:bg-[#22c55e]/10"
          }`}>
            <Icon className={`h-5 w-5 text-[#22c55e] ${plan.featured ? "ai-pulse" : ""}`} />
          </div>
          <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-wider">
            {plan.badge}
          </span>
        </div>
      </div>

      <h3 className={`font-[family-name:var(--font-space)] text-xl font-bold transition-colors duration-300 group-hover:text-[#22c55e] ${plan.featured ? "text-[#22c55e]" : "text-white"}`}>
        {plan.title}
      </h3>
      <p className="mt-1 text-sm text-zinc-500">{plan.subtitle}</p>

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

      <div className="mt-auto pt-5">
        <div className="h-px w-full bg-gradient-to-r from-[#22c55e]/20 to-transparent mb-4" />
        <p className="font-[family-name:var(--font-space)] text-sm font-semibold text-zinc-300">
          {plan.quote}
        </p>
        <a
          href={`mailto:${EMAIL}?subject=${plan.title} - Site exclusivo`}
          className={`mt-4 flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold text-sm transition-all ${
            plan.featured
              ? "bg-[#22c55e] text-black shadow-[0_0_16px_rgba(34,197,94,0.3)] hover:bg-[#16a34a] hover:shadow-[0_0_28px_rgba(34,197,94,0.5)]"
              : "border border-zinc-700 text-zinc-300 hover:border-[#22c55e]/40 hover:text-white"
          }`}
        >
          <Mail className="h-4 w-4" />
          Quero esse plano
        </a>
      </div>
    </SpotlightCard>
  );
}
