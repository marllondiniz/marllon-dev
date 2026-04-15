"use client";

import { FileDown, FileText } from "lucide-react";

type Props = {
  disabled: boolean;
  onMarkdown: () => void;
  onPdf: () => void;
  /** `start` alinha à esquerda (útil ao lado do seletor Período); `end` à direita (cabeçalho). */
  align?: "start" | "end";
};

/**
 * Bloco de exportação Markdown / PDF para os painéis de tráfego Meta.
 */
export function MetaTrafficExportToolbar({
  disabled,
  onMarkdown,
  onPdf,
  align = "end",
}: Props) {
  const outerAlign =
    align === "start"
      ? "items-start"
      : "items-stretch sm:items-end"; /* stretch: grupo ocupa largura no mobile */

  const baseBtn =
    "inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-medium transition sm:min-w-[7.5rem] sm:px-4 sm:text-sm " +
    "text-zinc-200 hover:bg-emerald-500/[0.12] hover:text-emerald-50 active:scale-[0.98] " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/45 " +
    "disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100";

  return (
    <div className={`flex flex-col gap-1.5 ${outerAlign}`}>
      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
        Exportar relatório
      </span>
      <div
        className="flex min-w-0 gap-0.5 rounded-2xl border border-zinc-600/90 bg-gradient-to-b from-zinc-800/90 to-zinc-950/90 p-1 shadow-lg shadow-black/40 ring-1 ring-white/[0.06]"
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
          <FileText className="h-4 w-4 shrink-0 text-emerald-400" aria-hidden />
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
          <FileDown className="h-4 w-4 shrink-0 text-emerald-400" aria-hidden />
          <span className="whitespace-nowrap">PDF</span>
        </button>
      </div>
    </div>
  );
}
