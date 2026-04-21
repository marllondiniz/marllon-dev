import { BookOpen } from "lucide-react";
import { LUZ_DO_LUAR_MANUAL_PDF_HREF } from "@/lib/luzdoluar";

type Props = {
  className?: string;
  /** `default`: destaque abaixo do login. `compact`: mesma linha do banner do painel. */
  variant?: "default" | "compact";
};

export function LuzDoLuarManualLink({ className = "", variant = "default" }: Props) {
  const isCompact = variant === "compact";
  return (
    <a
      href={LUZ_DO_LUAR_MANUAL_PDF_HREF}
      target="_blank"
      rel="noopener noreferrer"
      className={
        "group inline-flex max-w-full items-center gap-1.5 rounded-md border border-[#c5a47e]/25 " +
        "bg-[#1a1f2c]/80 text-left transition hover:border-[#c5a47e]/45 hover:bg-[#1a1f2c] " +
        (isCompact
          ? "px-2.5 py-1.5 text-[10px] leading-tight "
          : "w-full justify-center px-3 py-2.5 text-sm ") +
        className
      }
    >
      <BookOpen
        className={`shrink-0 text-[#c5a47e] group-hover:text-[#f0e6d8] ${isCompact ? "h-3.5 w-3.5" : "h-4 w-4"}`}
        aria-hidden
      />
      <span className="min-w-0 break-words font-medium text-[#d4bc96] group-hover:text-[#f0e6d8]">
        Manual de atendimento
      </span>
    </a>
  );
}
