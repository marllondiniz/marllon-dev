"use client";

import { motion } from "framer-motion";
import { Maximize2, TrendingDown, TrendingUp } from "lucide-react";
import CountUp from "./CountUp";

const GENERIC_URL = "https://emoji-wonder-site.lovable.app";
const IDENTITY_URL = "/demo-alta-conversao";

const CONVERSION_LOW = 0.9;
const CONVERSION_HIGH = 11;

type Props = {
  onExpand?: (url: string, title: string) => void;
  title?: string;
  subtitle?: string;
};

export default function CompareGenericVsIdentity({
  onExpand,
  title = "Genérico vs com identidade",
  subtitle,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="grid gap-6 md:grid-cols-2"
    >
      {/* Card genérico */}
      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#111113]">
        <div className="flex items-center justify-between border-b border-zinc-800 bg-[#0d0d0f] px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-red-400/70">
              IA sem direção
            </span>
          </div>
          <div className="flex items-center gap-2">
            {onExpand && (
              <button
                type="button"
                onClick={() => onExpand(GENERIC_URL, "Protótipo, IA sem direção")}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800/50 px-2.5 py-1.5 font-mono text-[10px] text-zinc-400 transition hover:border-zinc-600 hover:text-white"
              >
                <Maximize2 className="h-3.5 w-3.5" />
                Expandir
              </button>
            )}
            <a
              href={GENERIC_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[10px] text-zinc-500 hover:text-zinc-400"
            >
              Abrir site →
            </a>
          </div>
        </div>
        <div className="p-3">
          <div className="overflow-hidden rounded-xl border border-zinc-800/60 bg-white">
            <iframe
              src={GENERIC_URL}
              title="Exemplo: site protótipo (IA sem direção)"
              className="h-[480px] min-h-[420px] w-full border-0"
              loading="lazy"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        </div>
        {/* Contador de conversão — baixa */}
        <div className="flex items-center justify-center gap-2 border-t border-zinc-800/80 bg-red-500/5 px-4 py-2.5">
          <TrendingDown className="h-4 w-4 text-red-400/80" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
            Conversão
          </span>
          <span className="font-[family-name:var(--font-space)] text-lg font-bold text-red-400">
            {CONVERSION_LOW}%
          </span>
          <span className="font-mono text-[10px] text-red-400/70">baixa</span>
        </div>
        <p className="px-4 pb-4 pt-2 text-center font-mono text-[11px] italic text-zinc-600">
          {subtitle ?? "Protótipo genérico, poderia ser qualquer um."}
        </p>
      </div>

      {/* Card com identidade — mais impacto visual */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-[#22c55e]/50 bg-[#111113] shadow-[0_0_40px_rgba(34,197,94,0.08)] ring-2 ring-[#22c55e]/20">
        <div className="absolute left-3 top-3 z-10 rounded-md border border-[#22c55e]/40 bg-[#0a0a0b]/90 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[#22c55e] backdrop-blur-sm">
          Alta conversão
        </div>
        <div className="flex items-center justify-between border-b border-[#22c55e]/20 bg-[#0d0d0f] px-4 py-3 pt-10">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#22c55e] shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#22c55e] font-semibold">
              Com identidade
            </span>
          </div>
          <div className="flex items-center gap-2">
            {onExpand && (
              <button
                type="button"
                onClick={() => onExpand(IDENTITY_URL, "Demo alta conversão")}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#22c55e]/40 bg-[#22c55e]/15 px-2.5 py-1.5 font-mono text-[10px] text-[#22c55e] transition hover:border-[#22c55e]/60 hover:bg-[#22c55e]/25"
              >
                <Maximize2 className="h-3.5 w-3.5" />
                Expandir
              </button>
            )}
            <a
              href={IDENTITY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[10px] text-zinc-400 hover:text-[#22c55e]"
            >
              Abrir site →
            </a>
          </div>
        </div>
        <div className="p-3">
          <div className="overflow-hidden rounded-xl border border-zinc-700/80 bg-[#09090b] shadow-[0_0_24px_rgba(34,197,94,0.06)]">
            <iframe
              src={IDENTITY_URL}
              title="Exemplo: landing com identidade (alta conversão)"
              className="h-[480px] min-h-[420px] w-full border-0"
              loading="lazy"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        </div>
        {/* Contador de conversão — alta */}
        <div className="flex items-center justify-center gap-2 border-t border-[#22c55e]/20 bg-[#22c55e]/10 px-4 py-2.5">
          <TrendingUp className="h-4 w-4 text-[#22c55e]" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
            Conversão
          </span>
          <span className="font-[family-name:var(--font-space)] text-xl font-bold text-[#22c55e] cyber-text-glow">
            <CountUp to={CONVERSION_HIGH} suffix="%" duration={1.5} />
          </span>
          <span className="font-mono text-[10px] font-semibold text-[#22c55e]/80">alta</span>
        </div>
        <p className="px-4 pb-4 pt-2 text-center font-mono text-[11px] font-medium text-[#22c55e]/80">
          Landing com direção, clara e com CTA definido.
        </p>
      </div>
    </motion.div>
  );
}
