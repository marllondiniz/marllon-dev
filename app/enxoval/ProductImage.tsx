"use client";

import { Gift, ExternalLink } from "lucide-react";
import type { EnxovalItemWithStatus } from "./types";

type Props = {
  item: EnxovalItemWithStatus;
  categoryName: string;
  color: { bg: string; icon: string };
  size?: "sm" | "md" | "lg";
};

export default function ProductImage({ item, categoryName, color, size = "md" }: Props) {
  const sizeCls =
    size === "sm" ? "h-14 w-14" : size === "lg" ? "h-16 w-16" : "h-20 w-20";

  if (item.link?.includes("amazon"))
    return (
      <a
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        className={`${sizeCls} shrink-0 flex flex-col items-center justify-center gap-0.5 overflow-hidden rounded-xl bg-gradient-to-b from-[#232f3e] to-[#131a22] transition hover:from-[#37475a]`}
        title="Ver na Amazon"
      >
        <span className="text-[8px] font-bold uppercase tracking-wider text-[#ff9900]">amazon</span>
        <ExternalLink className="h-4 w-4 text-[#ff9900]" />
      </a>
    );

  if (item.link)
    return (
      <a
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        className={`${sizeCls} shrink-0 flex items-center justify-center overflow-hidden rounded-xl ${color.bg}`}
        title="Ver produto"
      >
        <ExternalLink className={`h-6 w-6 ${color.icon}`} />
      </a>
    );

  return (
    <div className={`${sizeCls} shrink-0 flex items-center justify-center overflow-hidden rounded-xl ${color.bg}`}>
      <Gift className={`h-8 w-8 ${color.icon} opacity-60`} />
    </div>
  );
}
