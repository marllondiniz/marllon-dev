import type { Metadata } from "next";
import VibeCodingContent from "./VibeCodingContent";

export const metadata: Metadata = {
  title: "Vibe Coding com Direção — Velocidade de IA. Identidade de Marca.",
  description:
    "Sites rápidos com design exclusivo e artesanal. Sem cara de IA, sem layouts genéricos. Planos: One Page, 3 Páginas e Site Corporativo. zinid.tech",
  openGraph: {
    title: "Vibe Coding com Direção | Sites exclusivos e rápidos | zinid.tech",
    description:
      "Velocidade de IA com direção estratégica. Design exclusivo, sem estética genérica. One Page, 3 Páginas ou Site Corporativo.",
  },
};

export default function VibeCodingPage() {
  return <VibeCodingContent />;
}
