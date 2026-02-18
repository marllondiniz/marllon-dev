import type { Metadata } from "next";
import LandingPagesContent from "./LandingPagesContent";

export const metadata: Metadata = {
  title: "Criação de Landing Pages — Conversão e tráfego",
  description:
    "Landing pages focadas em conversão: estrutura, copy e tecnologia alinhadas ao seu anúncio e oferta. Formulários, pixel, CRM e testes contínuos.",
  openGraph: {
    title: "Criação de Landing Pages | Marllon Diniz - zinid.tech",
    description:
      "Landing pages focadas em conversão: estrutura, copy e tecnologia alinhadas ao seu anúncio e oferta.",
  },
};

export default function LandingPagesPage() {
  return <LandingPagesContent />;
}
