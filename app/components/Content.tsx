"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Code2, Sparkles, Workflow, Cpu, BookOpen, ArrowRight } from "lucide-react";
import { articles } from "@/app/data/articles";
import BlurText from "./BlurText";
import SpotlightCard from "./SpotlightCard";

const topicIcons: Record<string, typeof Code2> = {
  "Back-end e APIs": Code2,
  "IA e LLMs": Sparkles,
  "Automação e integrações": Workflow,
  "Arquitetura de sistemas": Cpu,
};

const topics = [
  { title: "Back-end e APIs", icon: Code2 },
  { title: "IA e LLMs", icon: Sparkles },
  { title: "Automação e integrações", icon: Workflow },
  { title: "Arquitetura de sistemas", icon: Cpu },
];

export default function Content() {
  return (
    <section id="conteudo" className="cyber-section data-stream border-t border-zinc-800/50 bg-[#111113] section-padding">
      <div className="section-container">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="mb-4 flex items-center gap-3"
        >
          <span className="hex-badge flicker">HUB://TECH_IA</span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">carregando...</span>
        </motion.div>

        <BlurText
          text="Tech & IA"
          as="h2"
          animateBy="words"
          delay={120}
          stepDuration={0.4}
          className="mb-4 font-[family-name:var(--font-space)] text-3xl font-bold tracking-tight text-white md:text-4xl [&>span:last-child]:text-[#22c55e] [&>span:last-child]:cyber-text-glow"
        />
        <BlurText
          text="Hub de desenvolvimento, IA e automação."
          as="p"
          animateBy="words"
          delay={60}
          stepDuration={0.3}
          direction="bottom"
          className="mb-12 font-mono text-sm text-zinc-400"
        />

        {/* Topic cards: grid estático */}
        <div
          className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-4"
          role="list"
          aria-label="Back-end e APIs, IA e LLMs, Automação, Arquitetura"
        >
          {topics.map((t, i) => (
            <motion.div
              key={t.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="cyber-card hex-overlay corner-accent group relative rounded-xl border border-zinc-800 bg-[#161618] p-5 transition-all duration-300 hover:border-[#22c55e]/30"
              role="listitem"
            >
              <div className="relative inline-block">
                <t.icon
                  className="h-7 w-7 text-[#22c55e] ai-pulse"
                  aria-hidden
                />
                <span className="absolute -inset-1 rounded-full bg-[#22c55e]/5 blur-sm" />
              </div>
              <h3 className="mt-3 font-semibold text-white group-hover:text-[#22c55e] transition-colors duration-300">
                {t.title}
              </h3>
              <div className="mt-2 h-px w-full bg-gradient-to-r from-[#22c55e]/20 to-transparent" />
            </motion.div>
          ))}
        </div>

        {/* Artigos por tema */}
        <div className="mb-6 flex items-center gap-3">
          <BookOpen className="h-5 w-5 text-[#22c55e]" aria-hidden />
          <p className="font-mono text-xs font-medium uppercase tracking-widest text-zinc-500">
            Tech Brief — artigos
          </p>
        </div>

        {/* Mobile: lista simples (sem cards) */}
        <div className="md:hidden space-y-4">
          {articles.map((art, i) => (
            <motion.article
              key={art.slug}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
            >
              <Link
                href={`/artigo/${art.slug}`}
                className="block border-b border-zinc-800 pb-4 transition-colors hover:border-[#22c55e]/30"
              >
                <span className="font-mono text-[10px] text-[#22c55e]">{art.theme}</span>
                <span className="font-mono text-[10px] text-zinc-500 ml-2">· {art.date}</span>
                <h3 className="mt-1 font-[family-name:var(--font-space)] font-bold text-white">
                  {art.title}
                </h3>
                <p className="mt-1 text-sm text-zinc-400 line-clamp-2">{art.excerpt}</p>
                <span className="mt-2 inline-flex items-center gap-1 font-mono text-xs text-[#22c55e]">
                  Ler artigo
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            </motion.article>
          ))}
        </div>

        {/* Desktop: cards */}
        <div className="hidden md:grid md:grid-cols-2 gap-6">
          {articles.map((art, i) => (
            <motion.article
              key={art.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <SpotlightCard
                className="cyber-card hex-overlay corner-accent group relative rounded-2xl border border-zinc-800 bg-[#161618] transition-all duration-300 hover:border-[#22c55e]/30 hover:bg-[#18191c] h-full"
                spotlightColor="rgba(34, 197, 94, 0.06)"
                spotlightSize={300}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between gap-3">
                    {(() => {
                      const Icon = topicIcons[art.theme] ?? Code2;
                      return <Icon className="h-8 w-8 flex-shrink-0 text-[#22c55e]" aria-hidden />;
                    })()}
                    <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                      {art.date}
                    </span>
                  </div>
                  <span className="mt-3 inline-block font-mono text-[10px] text-[#22c55e]">
                    {art.theme}
                  </span>
                  <h3 className="mt-1 font-[family-name:var(--font-space)] text-lg font-bold text-white group-hover:text-[#22c55e] transition-colors">
                    {art.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    {art.excerpt}
                  </p>
                  <Link
                    href={`/artigo/${art.slug}`}
                    className="mt-4 inline-flex items-center gap-1.5 font-mono text-xs text-[#22c55e] group-hover:gap-2 transition-all hover:text-[#22c55e]"
                  >
                    Ler artigo
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </SpotlightCard>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
