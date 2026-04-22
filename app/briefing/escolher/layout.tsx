import type { Metadata } from "next";

const title = "Escolher briefing — zinid.tech";
const description =
  "Selecione o serviço (tráfego, dashboards ou site) e preencha o formulário guiado no próximo passo.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description },
};

export default function EscolherBriefingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
