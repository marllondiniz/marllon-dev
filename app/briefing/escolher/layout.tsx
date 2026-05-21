import type { Metadata } from "next";

const title = "Escolha o serviço — zinid.tech";
const description =
  "Selecione tráfego, dashboards ou site. No próximo passo abrimos o briefing guiado com as perguntas certas para o serviço que você escolheu.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description },
};

export default function EscolherBriefingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
