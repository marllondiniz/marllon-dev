"use client";

import type { ComponentType } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import dynamic from "next/dynamic";

const LogoLoop = dynamic(
  () => import("./LogoLoop").then((m) => m.default),
  { ssr: false }
) as ComponentType<{
  logos: Array<{ src: string; alt: string; href?: string; title?: string }>;
  speed?: number;
  direction?: string;
  logoHeight?: number;
  gap?: number;
  pauseOnHover?: boolean;
  fadeOut?: boolean;
  fadeOutColor?: string;
  scaleOnHover?: boolean;
  ariaLabel?: string;
  className?: string;
}>;

const partners = [
  {
    name: "Maxis Plus",
    tagline: "Hub de negócios digitais escaláveis",
    url: "https://maxis.plus/hub",
    logo: "/logo-maxis.avif",
  },
  {
    name: "MaxisTalks",
    tagline: "Palco para quem gera valor",
    url: "https://maxistalks.com/",
    logo: "/maxistalks-logo.webp",
  },
  {
    name: "Dieta Calculada",
    tagline: "Controle sua alimentação de forma inteligente",
    url: "https://lp.dietacalculada.com/",
    logo: "/dieta-calculada.png",
  },
];

export default function Partners() {
  return (
    <section className="cyber-section data-stream relative border-t border-zinc-800/50 bg-[#0a0a0b] section-padding">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-4 flex justify-center"
        >
          <span className="hex-badge flicker">Onde atuo</span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 text-center font-[family-name:var(--font-space)] text-2xl font-bold tracking-tight text-white md:mb-12 md:text-3xl"
        >
          Parceiros de <span className="text-[#22c55e] cyber-text-glow">impacto</span>
        </motion.h2>

        {/* Desktop: grid de cards com logo, nome, tagline e link */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="hidden md:grid md:grid-cols-3 gap-6"
        >
          {partners.map((partner) => (
            <a
              key={partner.name}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-6 transition-colors hover:border-[#22c55e]/40 hover:bg-zinc-800/40"
            >
              <div className="mb-4 flex h-12 items-center">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={120}
                  height={44}
                  className="max-h-11 w-auto object-contain object-left opacity-90 transition-opacity group-hover:opacity-100"
                />
              </div>
              <h3 className="mb-1 font-semibold text-white">{partner.name}</h3>
              <p className="mb-4 flex-1 text-sm text-zinc-400">{partner.tagline}</p>
              <span className="inline-flex items-center gap-1 text-sm text-[#22c55e] transition-colors group-hover:text-[#2dd96a]">
                Visitar <ExternalLink className="h-3.5 w-3.5" />
              </span>
            </a>
          ))}
        </motion.div>
      </div>

      {/* Mobile: LogoLoop — faixa contínua de logos (sem link) */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="md:hidden overflow-hidden py-4"
      >
        <LogoLoop
          logos={partners.map((p) => ({
            src: p.logo,
            alt: p.name,
            title: p.tagline,
            href: "", // sem link no mobile
          }))}
          speed={90}
          direction="left"
          logoHeight={40}
          gap={32}
          pauseOnHover
          fadeOut
          fadeOutColor="#0a0a0b"
          scaleOnHover
          ariaLabel="Empresas e hubs onde atuo"
          className="w-full"
        />
      </motion.div>
    </section>
  );
}
