import type { Metadata } from "next";
import GestaoDeTrafegoContent from "./GestaoDeTrafegoContent";

export const metadata: Metadata = {
  title: "Gestão de Tráfego — Campanhas e conversão",
  description:
    "Gestão de tráfego focada em resultado: campanhas estruturadas, funil claro e decisões em cima de dados. Meta Ads, Google Ads e otimização contínua.",
  openGraph: {
    title: "Gestão de Tráfego | Marllon Diniz - zinid.tech",
    description:
      "Gestão de tráfego focada em resultado: campanhas estruturadas, funil claro e decisões em cima de dados.",
  },
};

export default function GestaoDeTrafegoPage() {
  return <GestaoDeTrafegoContent />;
}
