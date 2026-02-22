"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Target, AlertCircle, ListOrdered, CheckSquare, HelpCircle, Mail, ArrowLeft, BookOpen, Store, Briefcase, BarChart3, Palette, FileText, Zap, TrendingUp } from "lucide-react";
import BlurText from "@/app/components/BlurText";
import Magnet from "@/app/components/Magnet";
import SpotlightCard from "@/app/components/SpotlightCard";

const EMAIL = "marllonzinid@gmail.com";

export default function GestaoDeTrafegoContent() {
  return (
    <main className="pb-20">
      {/* Hero */}
      <section className="cyber-section border-t border-zinc-800/50 section-padding">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mb-4 flex items-center gap-3"
          >
            <span className="hex-badge flicker">SRV://GESTÃO_DE_TRÁFEGO</span>
          </motion.div>
          <BlurText
            text="Gestão de tráfego focada em resultado, não em cliques."
            as="h1"
            animateBy="words"
            delay={100}
            stepDuration={0.4}
            className="mb-4 font-[family-name:var(--font-space)] text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl [&>span:nth-child(n+5)]:text-[#22c55e] [&>span:nth-child(n+5)]:cyber-text-glow"
          />
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl text-lg text-zinc-400"
          >
            Campanhas estruturadas, funil claro e decisões em cima de dados para fazer cada real investido voltar em vendas.
          </motion.p>
          <ul className="mt-6 space-y-2 font-mono text-sm text-zinc-500">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
              <strong className="text-zinc-400">Para quem é:</strong> negócios que já vendem (ou têm oferta clara) e querem escalar.
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
              <strong className="text-zinc-400">Canais:</strong> Meta Ads, Google Ads e outros canais pagos.
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
              <strong className="text-zinc-400">Foco:</strong> geração de oportunidades qualificadas, não só visitas.
            </li>
          </ul>
        </div>
      </section>

      {/* Para quem é — Cards */}
      <section className="cyber-section border-t border-zinc-800/50 section-padding">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-6"
          >
            <Target className="h-6 w-6 text-[#22c55e]" aria-hidden />
            <BlurText
              text="Para quem é a gestão de tráfego"
              as="h2"
              animateBy="words"
              delay={80}
              stepDuration={0.35}
              className="font-[family-name:var(--font-space)] text-2xl font-bold text-white md:text-3xl [&>span:nth-child(n+4)]:text-[#22c55e]"
            />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl text-zinc-400 leading-relaxed mb-10"
          >
            Trabalho com negócios que já têm produto ou serviço validado e querem organizar o crescimento. Se o tráfego está desorganizado ou você não vê de onde vêm os resultados, essa gestão é para você.
          </motion.p>
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              { icon: BookOpen, title: "Infoprodutores e experts", desc: "Lançamentos, perpétuos e funis de conteúdo. Escala com anúncios alinhados à sua oferta." },
              { icon: Store, title: "Negócios locais", desc: "Serviços recorrentes, leads qualificados e agendamentos. Tráfego que vira cliente na sua região." },
              { icon: Briefcase, title: "Serviços B2B", desc: "Geração de oportunidades para times comerciais. Campanhas que alimentam o funil de vendas." },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <SpotlightCard
                    className="cyber-card corner-accent h-full rounded-2xl border border-zinc-800 bg-[#161618] p-6 transition-all duration-300 hover:border-[#22c55e]/40 hover:shadow-[0_0_24px_rgba(34,197,94,0.08)]"
                    spotlightColor="rgba(34,197,94,0.06)"
                    spotlightSize={280}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#22c55e]/20 bg-[#22c55e]/10">
                      <Icon className="h-6 w-6 text-[#22c55e]" aria-hidden />
                    </div>
                    <h3 className="mt-4 font-[family-name:var(--font-space)] text-lg font-bold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
                  </SpotlightCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Problemas que resolvo — Cards */}
      <section className="cyber-section border-t border-zinc-800/50 section-padding bg-[#111113]">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-6"
          >
            <AlertCircle className="h-6 w-6 text-[#ef4444]" aria-hidden />
            <BlurText
              text="Problemas que geralmente encontro"
              as="h2"
              animateBy="words"
              delay={80}
              stepDuration={0.35}
              className="font-[family-name:var(--font-space)] text-2xl font-bold text-white md:text-3xl [&>span:nth-child(n+2)]:text-[#ef4444]"
            />
          </motion.div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {[
              { title: "Campanhas sem estratégia", desc: "Muito teste isolado, pouca visão de funil. Organizamos objetivo, público e mensagem." },
              { title: "Métricas desconectadas", desc: "Clique e CTR altos, vendas que não acompanham. Conectamos métricas ao resultado real." },
              { title: "Anúncio x página", desc: "Anúncio fala uma coisa, landing entrega outra. Alinhamos mensagem em toda a jornada." },
              { title: "Relatórios confusos", desc: "Dados em prints e planilhas difíceis. Você recebe relatórios claros e acionáveis." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <SpotlightCard
                  className="cyber-card h-full rounded-2xl border border-zinc-800 bg-[#161618] p-5 transition-all duration-300 hover:border-red-500/40 hover:shadow-[0_0_20px_rgba(239,68,68,0.08)]"
                  spotlightColor="rgba(239,68,68,0.06)"
                  spotlightSize={220}
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 font-mono text-xs font-bold text-red-400">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 font-[family-name:var(--font-space)] font-bold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-xl border border-red-500/25 bg-red-500/5 px-5 py-4 text-zinc-300 font-mono text-sm leading-relaxed"
          >
            A ideia é sair do &quot;apertar botão em campanha&quot; e ir para uma visão contínua: funil, mensagem, oferta, página e dados conversando entre si.
          </motion.p>
        </div>
      </section>

      {/* Passo a passo — Como funciona */}
      <section className="cyber-section border-t border-zinc-800/50 section-padding">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-10"
          >
            <ListOrdered className="h-6 w-6 text-[#22c55e]" aria-hidden />
            <BlurText
              text="Passo a passo: como funciona"
              as="h2"
              animateBy="words"
              delay={80}
              stepDuration={0.35}
              className="font-[family-name:var(--font-space)] text-2xl font-bold text-white md:text-3xl [&>span:nth-child(n+4)]:text-[#22c55e]"
            />
          </motion.div>
          <ol className="relative">
            {/* Linha vertical da timeline (desktop) */}
            <div
              className="absolute left-[23px] top-0 bottom-0 hidden w-0.5 bg-gradient-to-b from-[#22c55e]/60 via-[#22c55e]/30 to-transparent md:block"
              aria-hidden
            />
            {[
              {
                title: "Diagnóstico e alinhamento",
                desc: "Entendo seu modelo de negócio, oferta, ticket, histórico de campanhas e páginas atuais. Definimos metas realistas e o que é \"resultado\" para você.",
              },
              {
                title: "Estruturação do funil e das campanhas",
                desc: "Organizamos a jornada: quem ainda não conhece você, quem já conhece e quem está pronto para comprar. A partir disso, defino campanhas, públicos, criativos e mensagens.",
              },
              {
                title: "Acompanhamento diário e otimização",
                desc: "Monitoro os principais indicadores (CPM, CPC, CTR, CPL, CPA, ROAS, etc.) e faço ajustes em orçamento, segmentações e criativos para buscar o melhor custo por resultado.",
              },
              {
                title: "Relatórios e decisões em cima de dados",
                desc: "Você recebe relatórios periódicos (sem \"tecnês desnecessário\") mostrando o que funcionou, o que não funcionou e os próximos passos sugeridos.",
              },
            ].map((step, i) => (
              <motion.li
                key={step.title}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative flex gap-6 pb-10 last:pb-0 md:gap-8"
              >
                {/* Número do passo */}
                <div className="relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[#22c55e] bg-[#0a0a0b] font-[family-name:var(--font-space)] text-lg font-bold text-[#22c55e] shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                  {i + 1}
                </div>
                {/* Card do passo */}
                <div className="min-w-0 flex-1">
                  <SpotlightCard
                    className="cyber-card corner-accent rounded-2xl border border-zinc-800 bg-[#161618] p-6 transition-all duration-300 hover:border-[#22c55e]/40"
                    spotlightColor="rgba(34,197,94,0.06)"
                    spotlightSize={300}
                  >
                    <h3 className="font-[family-name:var(--font-space)] text-lg font-bold text-white">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{step.desc}</p>
                  </SpotlightCard>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* O que você recebe — Cards */}
      <section className="cyber-section border-t border-zinc-800/50 section-padding bg-[#111113]">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-8"
          >
            <CheckSquare className="h-6 w-6 text-[#22c55e]" aria-hidden />
            <BlurText
              text="O que você leva com a gestão de tráfego"
              as="h2"
              animateBy="words"
              delay={80}
              stepDuration={0.35}
              className="font-[family-name:var(--font-space)] text-2xl font-bold text-white md:text-3xl [&>span:nth-child(n+5)]:text-[#22c55e]"
            />
          </motion.div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: BarChart3, title: "Campanhas estruturadas", desc: "Por objetivo e etapa de funil. Tudo organizado para você escalar com clareza." },
              { icon: Zap, title: "Calendário de testes", desc: "Criativos, públicos e ofertas com cronograma definido. Menos achismo, mais método." },
              { icon: FileText, title: "Relatórios claros", desc: "Métricas que importam para o seu negócio, sem tecnês. Decisão em cima de dados." },
              { icon: Palette, title: "Alinhamento anúncio → página", desc: "Integração com sua landing para mensagem e oferta conversando do clique à conversão." },
              { icon: Target, title: "Suporte estratégico", desc: "Ajuste de oferta e comunicação conforme os dados. Parceria contínua, não só gestão de campanha." },
              { icon: TrendingUp, title: "Otimização contínua", desc: "Ajustes baseados em métricas para melhorar custo por resultado. Campanhas sempre evoluindo." },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                >
                  <SpotlightCard
                    className="cyber-card h-full rounded-2xl border border-zinc-800 bg-[#161618] p-5 transition-all duration-300 hover:border-[#22c55e]/40 hover:shadow-[0_0_20px_rgba(34,197,94,0.06)]"
                    spotlightColor="rgba(34,197,94,0.06)"
                    spotlightSize={240}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#22c55e]/20 bg-[#22c55e]/10">
                      <Icon className="h-5 w-5 text-[#22c55e]" aria-hidden />
                    </div>
                    <h3 className="mt-3 font-[family-name:var(--font-space)] font-bold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
                  </SpotlightCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="cyber-section border-t border-zinc-800/50 section-padding">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-8"
          >
            <HelpCircle className="h-6 w-6 text-[#22c55e]" aria-hidden />
            <BlurText
              text="Perguntas rápidas"
              as="h2"
              animateBy="words"
              delay={80}
              stepDuration={0.35}
              className="font-[family-name:var(--font-space)] text-2xl font-bold text-white md:text-3xl [&>span:last-child]:text-[#22c55e]"
            />
          </motion.div>
          <dl className="space-y-6">
            {[
              {
                q: "Preciso já ter uma landing page pronta?",
                a: "Idealmente sim, mas posso te orientar ou trabalhar junto na construção/ajuste da LP.",
              },
              {
                q: "Você cuida também dos criativos?",
                a: "Posso sugerir ideias, roteiros e estruturas de criativo. A produção pode ser sua equipe ou parceiros, e alinhamos isso no início.",
              },
              {
                q: "Quanto tempo até ver resultado?",
                a: "Costumo trabalhar com ciclos iniciais de 30 a 90 dias para teste, otimização e estabilização das campanhas.",
              },
            ].map((faq) => (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-xl border border-zinc-800 bg-[#161618] p-5"
              >
                <dt className="font-semibold text-white">{faq.q}</dt>
                <dd className="mt-2 text-sm text-zinc-400 leading-relaxed">{faq.a}</dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </section>

      {/* CTA */}
      <section id="contato" className="cyber-section border-t border-zinc-800/50 section-padding">
        <div className="section-container max-w-2xl text-center">
          <BlurText
            text="Quer organizar e escalar seu tráfego?"
            as="h2"
            animateBy="words"
            delay={100}
            stepDuration={0.4}
            className="justify-center font-[family-name:var(--font-space)] text-2xl font-bold tracking-tight text-white md:text-3xl [&>span:nth-child(n+4)]:text-[#22c55e] [&>span:nth-child(n+4)]:cyber-text-glow"
          />
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-4 font-mono text-sm text-zinc-400"
          >
            Me conta rapidinho como está seu cenário hoje e o que você quer alcançar. Eu analiso e te respondo com os próximos passos sugeridos.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <Magnet padding={60} magnetStrength={3}>
              <a
                href={`mailto:${EMAIL}?subject=Gestão de tráfego - Contato site`}
                className="inline-flex items-center gap-2 rounded-xl bg-[#22c55e] px-6 py-3.5 font-semibold text-black shadow-[0_0_20px_rgba(34,197,94,0.3)] transition hover:bg-[#16a34a] hover:shadow-[0_0_40px_rgba(34,197,94,0.5)]"
              >
                <Mail className="h-5 w-5" />
                Quero falar sobre gestão de tráfego
              </a>
            </Magnet>
            <Link
              href="/#servicos"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-600 bg-zinc-900/50 px-6 py-3.5 font-semibold text-zinc-300 transition hover:border-zinc-500 hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
              Ver outros serviços
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
