"use client";

import { motion } from "framer-motion";
import { Maximize2 } from "lucide-react";

const GENERIC_URL = "https://emoji-wonder-site.lovable.app";
const IDENTITY_URL = "https://maxis.plus/hub";

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
        <p className="px-4 pb-4 text-center font-mono text-[11px] italic text-zinc-600">
          {subtitle ?? "Protótipo genérico, poderia ser qualquer um."}
        </p>
      </div>

      {/* Card com identidade */}
      <div className="overflow-hidden rounded-2xl border border-[#22c55e]/30 bg-[#111113]">
        <div className="flex items-center justify-between border-b border-zinc-800/50 bg-[#0d0d0f] px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#22c55e]/80" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#22c55e]/70">
              Com identidade
            </span>
          </div>
          <div className="flex items-center gap-2">
            {onExpand && (
              <button
                type="button"
                onClick={() => onExpand(IDENTITY_URL, "MaxisPlus Hub, com identidade")}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#22c55e]/30 bg-[#22c55e]/10 px-2.5 py-1.5 font-mono text-[10px] text-[#22c55e]/80 transition hover:border-[#22c55e]/50 hover:text-[#22c55e]"
              >
                <Maximize2 className="h-3.5 w-3.5" />
                Expandir
              </button>
            )}
            <a
              href={IDENTITY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[10px] text-zinc-500 hover:text-[#22c55e]/80"
            >
              Abrir site →
            </a>
          </div>
        </div>
        <div className="p-3">
          <div className="overflow-hidden rounded-xl border border-[#22c55e]/20 bg-white">
            <iframe
              src={IDENTITY_URL}
              title="Exemplo: site com identidade (MaxisPlus Hub)"
              className="h-[480px] min-h-[420px] w-full border-0"
              loading="lazy"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        </div>
        <p className="px-4 pb-4 text-center font-mono text-[11px] italic text-[#22c55e]/60">
          Hub com direção, reconhecível e específico.
        </p>
      </div>
    </motion.div>
  );
}
