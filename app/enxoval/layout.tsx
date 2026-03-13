import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lista de Enxoval",
  description: "Lista de enxoval do bebê — escolha o item que deseja dar e reserve online.",
  openGraph: {
    title: "Lista de Enxoval | zinid.tech",
    description: "Lista de enxoval do bebê — escolha o item que deseja dar e reserve online.",
  },
  robots: { index: true, follow: true },
};

export default function EnxovalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen text-zinc-800"
      style={{
        background: "linear-gradient(160deg, #e8f5ff 0%, #fff0f8 40%, #f0fff4 100%)",
      }}
    >
      {children}
    </div>
  );
}
