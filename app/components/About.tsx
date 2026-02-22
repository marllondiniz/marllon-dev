"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { Code2, Plug, Workflow, Brain, Box, Zap, Target } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import BlurText from "./BlurText";

const Hyperspeed = dynamic(() => import("./Hyperspeed"), { ssr: false });

const blocks = [
  { title: "Back-end & Web", desc: "Sistemas, APIs e aplicações", icon: Code2 },
  { title: "Integrações", desc: "APIs externas e bancos de dados", icon: Plug },
  { title: "Automação", desc: "Processos e fluxos internos", icon: Workflow },
  { title: "IA aplicada", desc: "LLMs e desenvolvimento", icon: Brain },
];

const pillars = [
  { label: "Código", sub: "Back-end & Web", icon: Box },
  { label: "Integração", sub: "APIs & Dados", icon: Zap },
  { label: "Entrega", sub: "Automação & IA", icon: Target },
];

const floatingTags: Array<{ text: string; x: string; y: string }> = [];

function PhotoCard() {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 80, damping: 18 });
  const sy = useSpring(my, { stiffness: 80, damping: 18 });
  const rotateX = useTransform(sy, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-10, 10]);

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleLeave = () => { mx.set(0); my.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 900 }}
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="relative mx-auto w-full max-w-[340px] select-none"
    >
      {/* Glow externo */}
      <div className="absolute -inset-4 rounded-3xl bg-[radial-gradient(ellipse_at_center,rgba(34,197,94,0.18),transparent_70%)] blur-2xl pointer-events-none" />

      {/* Container da foto */}
      <div className="relative overflow-hidden rounded-2xl border border-[#22c55e]/30 bg-[#0a0a0b]">

        {/* Linha de scan */}
        <div
          className="pointer-events-none absolute left-0 right-0 z-20 h-[2px] bg-gradient-to-r from-transparent via-[#22c55e]/70 to-transparent"
          style={{ animation: "scan-move 3s linear infinite" }}
        />

        {/* Canto superior esquerdo */}
        <span className="absolute top-0 left-0 z-20 h-6 w-6 border-t-2 border-l-2 border-[#22c55e]" />
        {/* Canto superior direito */}
        <span className="absolute top-0 right-0 z-20 h-6 w-6 border-t-2 border-r-2 border-[#22c55e]" />
        {/* Canto inferior esquerdo */}
        <span className="absolute bottom-0 left-0 z-20 h-6 w-6 border-b-2 border-l-2 border-[#22c55e]" />
        {/* Canto inferior direito */}
        <span className="absolute bottom-0 right-0 z-20 h-6 w-6 border-b-2 border-r-2 border-[#22c55e]" />

        {/* Foto */}
        <Image
          src="/marllon.jpeg"
          alt="Marllon Diniz"
          width={340}
          height={420}
          priority
          className="photo-glitch block h-[380px] w-full object-cover object-top grayscale-[20%] contrast-[1.05]"
        />

        {/* Overlay degradê inferior */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0a0a0b] via-[#0a0a0b]/60 to-transparent z-10" />

        {/* Badge ID na parte inferior */}
        <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center">
          <span className="hex-badge flicker text-[10px]">ID://MARLLON_DINIZ</span>
        </div>
      </div>

      {/* Tags flutuantes */}
      {floatingTags.map((tag, i) => (
        <motion.span
          key={tag.text}
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 + i * 0.1, duration: 0.4 }}
          animate={{ y: [0, -6, 0] }}
          style={{
            position: "absolute",
            left: tag.x,
            top: tag.y,
            translateZ: 30,
            animation: `float-tag ${3.5 + i * 0.4}s ease-in-out infinite`,
          }}
          className="rounded-lg border border-[#22c55e]/25 bg-black/70 px-2 py-1 font-mono text-[9px] text-[#22c55e] backdrop-blur-sm shadow-[0_0_8px_rgba(34,197,94,0.2)]"
        >
          {tag.text}
        </motion.span>
      ))}
    </motion.div>
  );
}

const ROTATE_INTERVAL_MS = 4000;

function PillarsRotate() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % pillars.length);
    }, ROTATE_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  const p = pillars[index];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="circuit-bg cyber-glow-border relative overflow-hidden rounded-2xl border border-zinc-800 bg-[#0a0a0b] p-8 md:p-10"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#22c55e]/30 to-transparent section-line" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-700/40 to-transparent" />

      <p className="mb-8 text-center font-mono text-xs font-medium uppercase tracking-widest text-zinc-500">
        <span className="flicker">// três pilares</span>
      </p>

      <div className="relative min-h-[180px] flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={p.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="text-center rounded-xl border border-zinc-800/50 bg-[#0d0d0f] py-8 px-8 w-full max-w-sm mx-auto"
          >
            <p.icon className="mx-auto h-12 w-12 text-[#22c55e] ai-pulse" aria-hidden />
            <div className="mt-3 font-[family-name:var(--font-space)] text-2xl font-bold text-white">
              {p.label}
            </div>
            <div className="mt-1 font-mono text-sm text-zinc-400">{p.sub}</div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Indicadores: clicáveis para trocar */}
      <div className="mt-8 flex justify-center gap-3">
        {pillars.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Ver pilar: ${pillars[i].label}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === index ? "w-8 bg-[#22c55e]" : "w-2 bg-zinc-600 hover:bg-zinc-500"
            }`}
          />
        ))}
      </div>

      <p className="mt-8 text-center font-mono text-sm text-zinc-400 terminal-cursor">
        Código que entrega. Integrações que funcionam. IA que acelera.
      </p>
    </motion.div>
  );
}

export default function About() {
  return (
    <section
      id="sobre"
      className="cyber-section data-stream relative border-t border-zinc-800/50 overflow-hidden section-padding"
    >
      {/* Background: efeito Hyperspeed (estrada/luzes) — deslocado para cima, perto da foto */}
      <div className="absolute left-0 right-0 top-0 z-0 h-[120%] -translate-y-[12%]">
        <Hyperspeed className="opacity-40" />
      </div>
      <div className="absolute inset-0 z-0 bg-[#111113]/85" aria-hidden />

      <div className="section-container relative z-10">
        {/* Layout 2 colunas: foto à esquerda, badge + título + texto à direita */}
        <div className="mb-16 grid gap-10 lg:grid-cols-[340px_1fr] lg:items-start lg:gap-12">
          {/* Foto com efeito */}
          <div className="flex justify-center lg:justify-start">
            <PhotoCard />
          </div>

          {/* Coluna direita: Badge + Título + Texto */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="mb-4 flex items-center gap-3"
            >
              <span className="hex-badge flicker">ID://MARLLON_DINIZ</span>
            </motion.div>

            <BlurText
              text="Quem é Marllon Diniz?"
              as="h2"
              animateBy="words"
              delay={130}
              stepDuration={0.45}
              className="mb-8 font-[family-name:var(--font-space)] text-3xl font-bold tracking-tight text-white md:text-4xl [&>span:nth-child(n+3)]:text-[#22c55e] [&>span:nth-child(n+3)]:cyber-text-glow"
            />

            {/* Texto */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-xl border-l-2 border-[#22c55e]/50 bg-[#0d0d0f] pl-6 pr-4 py-5"
            >
              <p className="mb-4 text-lg leading-relaxed text-zinc-300">
                Meu nome é <strong className="text-white">Marllon Diniz</strong>. Desenvolvedor com experiência desde 2022 em back-end, web, integrações de APIs, automações e soluções orientadas a dados.
              </p>
              <p className="mb-4 text-lg leading-relaxed text-zinc-300">
                Uso intensivo de{" "}
                <span className="text-[#22c55e]">IA aplicada ao desenvolvimento</span>{" "}
                via LLMs — mais de{" "}
                <span className="font-mono text-[#22c55e]">1.6 bilhões de tokens</span> usados em 2025 para acelerar entregas, qualidade de código, arquitetura e integrações.
              </p>
              <p className="text-xl font-medium text-white md:text-2xl">
                Eu construo sistemas que <span className="text-[#22c55e] cyber-text-glow">organizam e escalam</span>.
              </p>
              <p className="mt-3 border-t border-[#22c55e]/20 pt-4 text-base font-medium text-[#22c55e]/90">
                Início de um futuro próspero
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Carrossel infinito em tela inteira (ocupa toda a largura da viewport) */}
      <div className="w-screen relative left-1/2 -translate-x-1/2 overflow-hidden py-2 mb-20">
        <div className="infinite-carousel infinite-carousel--full" aria-label="Back-end, Integrações, Automação, IA aplicada">
          <div className="infinite-carousel-track">
            {[...blocks, ...blocks, ...blocks].map((item, i) => (
              <motion.div
                key={`${item.title}-${i}`}
                initial={{ opacity: 0.6 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="infinite-carousel-card cyber-card hex-overlay corner-accent group relative rounded-2xl border border-zinc-800 bg-[#161618] p-6 transition-all duration-300"
              >
                <item.icon
                  className="h-8 w-8 text-[#22c55e] ai-pulse"
                  aria-hidden
                />
                <div className="mt-2 h-px w-full bg-gradient-to-r from-[#22c55e]/30 to-transparent" />
                <h3 className="mt-3 font-semibold text-white">{item.title}</h3>
                <p className="mt-1 font-mono text-xs text-zinc-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl">
        {/* Pillars: troca automática (um pilar por vez) */}
        <PillarsRotate />
      </div>
    </section>
  );
}
