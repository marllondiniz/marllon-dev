"use client";

import { useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ChevronDown, Wrench, Sparkles, Terminal, Cpu, Zap } from "lucide-react";
import CyberBackground from "./CyberBackground";
import BlurText from "./BlurText";
import CountUp from "./CountUp";
import Magnet from "./Magnet";

function FloatingCard({ delay, x, y, children }: { delay: number; x: string; y: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.6, ease: "easeOut" }}
      style={{ position: "absolute", left: x, top: y }}
      className="hidden lg:flex items-center gap-2 rounded-xl border border-[#22c55e]/20 bg-black/60 backdrop-blur-md px-3 py-2 text-xs font-mono text-zinc-400 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
    >
      {children}
    </motion.div>
  );
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  const rotateX = useTransform(springY, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-8, 8]);

  const floatX1 = useTransform(springX, [-0.5, 0.5], [-12, 12]);
  const floatY1 = useTransform(springY, [-0.5, 0.5], [-8, 8]);
  const floatX2 = useTransform(springX, [-0.5, 0.5], [10, -10]);
  const floatY2 = useTransform(springY, [-0.5, 0.5], [6, -6]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseX.set((e.clientX / innerWidth) - 0.5);
      mouseY.set((e.clientY / innerHeight) - 0.5);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-12 pb-20"
      style={{ perspective: "1200px" }}
    >
      <CyberBackground />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(34,197,94,0.07),transparent)]" />
      <div className="pointer-events-none absolute inset-0 cyber-grid-bg opacity-30" />

      <motion.div
        style={{ x: floatX1, y: floatY1 }}
        className="pointer-events-none absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(34,197,94,0.06),transparent_70%)]"
      />
      <motion.div
        style={{ x: floatX2, y: floatY2 }}
        className="pointer-events-none absolute bottom-1/4 right-1/4 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(34,197,94,0.04),transparent_70%)]"
      />

      <motion.div style={{ x: floatX1, y: floatY1 }} className="pointer-events-none absolute inset-0">
        <FloatingCard delay={0.9} x="6%" y="28%">
          <Cpu className="h-3 w-3 text-[#22c55e]" />
          <span>back-end running...</span>
        </FloatingCard>
        <FloatingCard delay={1.1} x="72%" y="18%">
          <Zap className="h-3 w-3 text-[#22c55e]" />
          <span>1.6B+ tokens</span>
        </FloatingCard>
        <FloatingCard delay={1.3} x="78%" y="62%">
          <Terminal className="h-3 w-3 text-[#22c55e]" />
          <span>4+ anos exp.</span>
        </FloatingCard>
        <FloatingCard delay={1.5} x="2%" y="62%">
          <Sparkles className="h-3 w-3 text-[#22c55e]" />
          <span>IA aplicada</span>
        </FloatingCard>
      </motion.div>

      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative z-10 mx-auto max-w-4xl text-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ translateZ: 20 }}
          className="mb-6 text-sm font-mono uppercase tracking-widest text-zinc-500"
        >
          Desenvolvedor Back-end · Web · Integrações · Automação · IA aplicada
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ translateZ: 40 }}
        >
          <BlurText
            text="Eu construo sistemas."
            as="h1"
            animateBy="words"
            delay={150}
            stepDuration={0.5}
            className="justify-center font-[family-name:var(--font-space)] text-4xl font-bold leading-[1.15] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
          />
          <BlurText
            text="Escalo resultados."
            as="span"
            animateBy="words"
            delay={150}
            stepDuration={0.5}
            className="justify-center font-[family-name:var(--font-space)] text-4xl font-bold leading-[1.15] tracking-tight text-[#22c55e] sm:text-5xl md:text-6xl lg:text-7xl"
          />
          <span className="block h-px mx-auto mt-1 w-64 bg-gradient-to-r from-transparent via-[#22c55e] to-transparent opacity-60" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          style={{ translateZ: 30 }}
          className="mx-auto mt-5 max-w-2xl text-lg font-medium tracking-wide sm:text-xl md:text-2xl"
        >
          <span
            className="shiny-text"
            data-text="Início de um futuro próspero"
          >
            Início de um futuro próspero
          </span>
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          style={{ translateZ: 20 }}
          className="mx-auto mt-4 max-w-xl font-mono text-sm text-zinc-400 terminal-cursor"
        >
          Back-end | Web | Integrações de APIs | Automação | IA aplicada ao desenvolvimento
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ translateZ: 30 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Magnet padding={60} magnetStrength={3}>
            <a
              href="#servicos"
              className="inline-flex items-center gap-2 rounded-xl bg-[#22c55e] px-6 py-3.5 font-semibold text-black shadow-[0_0_24px_rgba(34,197,94,0.3)] transition hover:bg-[#16a34a] hover:shadow-[0_0_40px_rgba(34,197,94,0.5)]"
            >
              <Wrench className="h-5 w-5" />
              Serviços e Soluções
            </a>
          </Magnet>
          <Magnet padding={60} magnetStrength={3}>
            <a
              href="#conteudo"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-600 bg-zinc-900/50 px-6 py-3.5 font-semibold text-zinc-300 backdrop-blur-sm transition hover:border-zinc-500 hover:text-white"
            >
              <Sparkles className="h-5 w-5" />
              Tech & IA
            </a>
          </Magnet>
        </motion.div>

        {/* Stats com CountUp */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{ translateZ: 10 }}
          className="mt-14 flex flex-wrap justify-center gap-8 border-t border-zinc-800/60 pt-10"
        >
          <div className="text-center">
            <div className="font-[family-name:var(--font-space)] text-2xl font-bold text-white">
              <CountUp to={4} suffix="+" duration={2} />
            </div>
            <div className="mt-0.5 text-xs text-zinc-500">Anos de experiência</div>
          </div>
          <div className="text-center">
            <div className="font-[family-name:var(--font-space)] text-2xl font-bold text-white">
              <CountUp to={1600} suffix="M+" prefix="" duration={2.5} />
            </div>
            <div className="mt-0.5 text-xs text-zinc-500">Tokens de IA (2025)</div>
          </div>
          <div className="text-center">
            <div className="font-[family-name:var(--font-space)] text-2xl font-bold text-white">
              <CountUp to={4} suffix="+" duration={2} />
            </div>
            <div className="mt-0.5 text-xs text-zinc-500">Empresas atendidas</div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-zinc-600"
      >
        <span className="font-mono text-[10px] uppercase tracking-widest">scroll</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
          <ChevronDown className="h-5 w-5" />
        </motion.div>
      </motion.div>
    </section>
  );
}
