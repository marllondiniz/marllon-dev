import type { Metadata } from "next";
import DashboardsContent from "./DashboardsContent";

export const metadata: Metadata = {
  title: "Dashboards para acompanhar dados — métricas e KPIs",
  description:
    "Criação de dashboards para visualizar e acompanhar dados em tempo real: métricas, KPIs e indicadores alinhados ao seu negócio, tráfego e resultados.",
  openGraph: {
    title: "Dashboards e dados | zinid.tech",
    description:
      "Painéis sob medida para acompanhar investimento, conversões e indicadores com clareza.",
  },
};

export default function DashboardsPage() {
  return <DashboardsContent />;
}
