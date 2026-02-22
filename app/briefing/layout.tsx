import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Briefing — Crie sua Landing Page | zinid.tech",
  description:
    "Responda 5 perguntas rápidas e receba sua proposta de landing page personalizada em até 2h.",
};

export default function BriefingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
