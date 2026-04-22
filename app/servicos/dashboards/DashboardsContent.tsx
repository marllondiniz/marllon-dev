"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, LineChart, Link2, Monitor, Target } from "lucide-react";
import BlurText from "@/app/components/BlurText";
import Magnet from "@/app/components/Magnet";
import { TrafficMetricsDashboardExample } from "@/app/components/TrafficMetricsDashboardExample";
import SpotlightCard from "@/app/components/SpotlightCard";

export default function DashboardsContent() {
  return (
    <main className="pb-20">
      <section className="cyber-section border-t border-zinc-800/50 section-padding">
        <div className="section-container">
          <Link
            href="/#servicos"
            className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-[#22c55e]"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar aos serviços
          </Link>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mb-4 flex items-center gap-3"
          >
            <span className="hex-badge flicker">SRV://DASHBOARDS</span>
          </motion.div>
          <BlurText
            text="Dashboards para acompanhar dados com clareza."
            as="h1"
            animateBy="words"
            delay={100}
            stepDuration={0.4}
            className="mb-4 font-[family-name:var(--font-space)] text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl [&>span:nth-child(n+2)]:text-[#22c55e] [&>span:nth-child(n+2)]:cyber-text-glow"
          />
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl text-lg text-zinc-400"
          >
            Criação e organização de painéis para visualizar e acompanhar métricas, KPIs e indicadores do
            negócio — com foco no que importa para decidir, sem se perder em telas e planilhas soltas.
          </motion.p>
        </div>
      </section>

      <section className="cyber-section border-t border-zinc-800/50 section-padding bg-[#111113]">
        <div className="section-container">
          <div className="grid gap-5 lg:grid-cols-2">
            {[
              {
                icon: Monitor,
                title: "O que entrega",
                body: "Uma visão em um só lugar: tráfego, conversões, funil, financeiro do digital ou o que fizer sentido para o seu momento. Cada painel é pensado para a operação, não genérico demais e nem inútil demais.",
              },
              {
                icon: Link2,
                title: "Como conecta",
                body: "Quando a gestão de tráfego, landing ou CRM já existem, o dashboard liga o que aconteceu no anúncio com o que virou oportunidade e venda — e quando não existem, desenhamos a base mínima para medir de verdade.",
              },
            ].map((b) => {
              const Icon = b.icon;
              return (
                <motion.div
                  key={b.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <SpotlightCard
                    className="cyber-card corner-accent h-full rounded-2xl border border-zinc-800 bg-[#161618] p-6 transition-all duration-300 hover:border-[#22c55e]/40"
                    spotlightColor="rgba(34,197,94,0.06)"
                    spotlightSize={280}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#22c55e]/20 bg-[#22c55e]/10">
                      <Icon className="h-6 w-6 text-[#22c55e]" aria-hidden />
                    </div>
                    <h2 className="mt-4 font-[family-name:var(--font-space)] text-lg font-bold text-white">
                      {b.title}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-400">{b.body}</p>
                  </SpotlightCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="cyber-section border-t border-zinc-800/50 section-padding">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#22c55e]/25 bg-[#22c55e]/10">
              <LineChart className="h-5 w-5 text-[#22c55e]" aria-hidden />
            </div>
            <h2 className="font-[family-name:var(--font-space)] text-2xl font-bold text-white md:text-3xl">
              Exemplo de painel (referência)
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 max-w-2xl text-zinc-400"
          >
            Abaixo, uma prévia estilizada de como fica a leitura de investimento, alcance, cliques e
            taxas (CTR, CPC, CPM) no mesmo bloco. Em projetos reais, o layout e as métricas seguem a sua
            conta e o que foi combinado no escopo.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <TrafficMetricsDashboardExample />
          </motion.div>
        </div>
      </section>

      <section className="cyber-section border-t border-zinc-800/50 section-padding bg-[#111113]">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6 flex items-center gap-3"
          >
            <Target className="h-6 w-6 text-[#22c55e]" aria-hidden />
            <h2 className="font-[family-name:var(--font-space)] text-2xl font-bold text-white md:text-3xl">
              Para quem é
            </h2>
          </motion.div>
          <ul className="max-w-2xl space-y-3 font-mono text-sm text-zinc-400">
            {[
              "Quem já investe em tráfego e quer acompanhar resultado sem viver no Ads Manager o dia inteiro.",
              "Equipes pequenas que precisam de um número único de verdade para reunião e decisão.",
              "Quem integra anúncio, página e venda e quer ver tudo conectado no mesmo recorte de tempo.",
            ].map((line) => (
              <motion.li
                key={line}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-start gap-2"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#22c55e]" />
                {line}
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      <section className="cyber-section border-t border-zinc-800/50 section-padding" id="briefing-dashboard">
        <div className="section-container max-w-2xl text-center">
          <BlurText
            text="Quer um painel sob medida?"
            as="h2"
            animateBy="words"
            delay={100}
            stepDuration={0.4}
            className="justify-center font-[family-name:var(--font-space)] text-2xl font-bold tracking-tight text-white md:text-3xl [&>span:nth-child(n+2)]:text-[#22c55e] [&>span:nth-child(n+2)]:cyber-text-glow"
          />
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-4 font-mono text-sm text-zinc-400"
          >
            Preencha o briefing em 3 passos. Eu analiso e respondo por WhatsApp ou e-mail com o próximo
            passo.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <Magnet padding={60} magnetStrength={3}>
              <Link
                href="/briefing-dashboards"
                className="inline-flex items-center gap-2 rounded-xl bg-[#22c55e] px-6 py-3.5 font-semibold text-black shadow-[0_0_20px_rgba(34,197,94,0.3)] transition hover:bg-[#16a34a] hover:shadow-[0_0_40px_rgba(34,197,94,0.5)]"
              >
                <LineChart className="h-5 w-5" />
                Preencher briefing de dashboards
              </Link>
            </Magnet>
            <Link
              href="/servicos/gestao-de-trafego"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-600 bg-zinc-900/50 px-6 py-3.5 font-semibold text-zinc-300 transition hover:border-zinc-500 hover:text-white"
            >
              Ver gestão de tráfego
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
