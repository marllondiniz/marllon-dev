"use client";

import { FileDown, FileText } from "lucide-react";

export type ExportToolbarAccent = "emerald" | "amber" | "gold";

type Props = {
  disabled: boolean;
  onMarkdown: () => void;
  onPdf: () => void;
  /** `start` / `end` / `center` (centro do cabeçalho em 3 colunas). */
  align?: "start" | "end" | "center";
  /** Cor de destaque dos botões (alinhado ao tema do painel). */
  accent?: ExportToolbarAccent;
  /** Ex.: `w-full` para ocupar a coluna no mobile. */
  className?: string;
};

/**
 * Bloco de exportação Markdown / PDF para os painéis de tráfego Meta.
 */
export function MetaTrafficExportToolbar({
  disabled,
  onMarkdown,
  onPdf,
  align = "end",
  accent = "emerald",
  className = "",
}: Props) {
  const outerAlign =
    align === "start" ? "items-start" : align === "center" ? "items-center" : "items-end";

  const accentHover =
    accent === "amber"
      ? "hover:bg-amber-500/[0.14] hover:text-amber-50 focus-visible:ring-amber-400/50"
      : accent === "gold"
        ? "hover:bg-[#c5a47e]/14 hover:text-[#faf6ef] focus-visible:ring-[#c5a47e]/42"
        : "hover:bg-emerald-500/[0.12] hover:text-emerald-50 focus-visible:ring-emerald-400/45";

  const baseBtn =
    "inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-medium transition sm:min-w-[7.5rem] sm:px-4 sm:text-sm " +
    "text-zinc-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 " +
    accentHover +
    " disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100";

  const iconTone =
    accent === "amber" ? "text-amber-300" : accent === "gold" ? "text-[#d4bc96]" : "text-emerald-400";

  const groupRing =
    accent === "amber"
      ? "border-amber-700/45 ring-amber-500/15"
      : accent === "gold"
        ? "border-[#5c4f3d]/55 ring-[#c5a47e]/14"
        : "border-zinc-600/90 ring-white/[0.06]";

  return (
    <div
      className={`flex min-w-0 flex-col gap-1.5 ${outerAlign} ${className}`}
    >
      <span
        className={`w-full text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500 ${
          align === "end" ? "text-right" : align === "center" ? "text-center" : "text-left"
        }`}
      >
        Exportar relatório
      </span>
      <div
        className={
          "flex w-full min-w-0 max-w-full gap-0.5 rounded-2xl border bg-gradient-to-b from-zinc-800/90 to-zinc-950/90 p-1 shadow-lg shadow-black/40 ring-1 " +
          groupRing
        }
        role="group"
        aria-label="Opções de exportação do relatório"
      >
        <button
          type="button"
          disabled={disabled}
          onClick={onMarkdown}
          className={baseBtn}
          title="Baixar em Markdown (.md)"
        >
          <FileText className={`h-4 w-4 shrink-0 ${iconTone}`} aria-hidden />
          <span className="whitespace-nowrap">Markdown</span>
        </button>
        <span
          className="my-1.5 w-px shrink-0 self-stretch bg-zinc-600/80"
          aria-hidden
        />
        <button
          type="button"
          disabled={disabled}
          onClick={onPdf}
          className={baseBtn}
          title="Baixar em PDF"
        >
          <FileDown className={`h-4 w-4 shrink-0 ${iconTone}`} aria-hidden />
          <span className="whitespace-nowrap">PDF</span>
        </button>
      </div>
    </div>
  );
}
