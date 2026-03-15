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
    <div className="min-h-screen text-zinc-800 relative overflow-hidden">
      {/* Background verde água (teal) */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background:
            "linear-gradient(145deg, #042f2e 0%, #064e3b 25%, #0d4d4b 50%, #134e4a 75%, #14b8a6 100%)",
        }}
      />
      {children}
    </div>
  );
}
