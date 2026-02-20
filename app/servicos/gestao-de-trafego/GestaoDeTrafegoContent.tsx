"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Target, AlertCircle, ListOrdered, CheckSquare, HelpCircle, Mail, ArrowLeft } from "lucide-react";
import BlurText from "@/app/components/BlurText";
import Magnet from "@/app/components/Magnet";

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
            <span className="status-dot" />
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

      {/* Para quem é */}
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
            className="max-w-2xl text-zinc-400 leading-relaxed mb-6"
          >
            Trabalho com negócios que já têm um produto ou serviço validado e querem organizar o crescimento. Se você já vende, mas sente que o tráfego está desorganizado, depende de &quot;campanhas soltas&quot; ou não entende de onde vêm os resultados, essa gestão é para você.
          </motion.p>
          <ul className="space-y-3">
            {[
              "Infoprodutores e experts: lançamentos, perpétuos e funis de conteúdo.",
              "Negócios locais: serviços recorrentes, leads qualificados e agendamentos.",
              "Serviços B2B: geração de oportunidades para times comerciais.",
            ].map((item, i) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-2 font-mono text-sm text-zinc-300"
              >
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#22c55e]" />
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* Problemas que resolvo */}
      <section className="cyber-section border-t border-zinc-800/50 section-padding bg-[#111113]">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-6"
          >
            <AlertCircle className="h-6 w-6 text-[#22c55e]" aria-hidden />
            <BlurText
              text="Problemas que geralmente encontro"
              as="h2"
              animateBy="words"
              delay={80}
              stepDuration={0.35}
              className="font-[family-name:var(--font-space)] text-2xl font-bold text-white md:text-3xl [&>span:nth-child(n+4)]:text-[#22c55e]"
            />
          </motion.div>
          <ul className="space-y-3 mb-6">
            {[
              "Campanhas sem estratégia clara: muito teste isolado, pouca visão de funil.",
              "Métricas desconectadas: clique e CTR altos, mas vendas que não acompanham.",
              "Falta de conexão com a página: anúncio fala uma coisa, landing entrega outra.",
              "Relatórios confusos: dados espalhados em prints e planilhas difíceis de ler.",
            ].map((item, i) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="flex items-start gap-2 font-mono text-sm text-zinc-300"
              >
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#22c55e]" />
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-zinc-400 border-l-2 border-[#22c55e]/50 pl-4 py-2"
          >
            A ideia é sair do &quot;apertar botão em campanha&quot; e ir para uma visão contínua: funil, mensagem, oferta, página e dados conversando entre si.
          </motion.p>
        </div>
      </section>

      {/* Como eu trabalho */}
      <section className="cyber-section border-t border-zinc-800/50 section-padding">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-8"
          >
            <ListOrdered className="h-6 w-6 text-[#22c55e]" aria-hidden />
            <BlurText
              text="Como funciona a gestão de tráfego comigo"
              as="h2"
              animateBy="words"
              delay={80}
              stepDuration={0.35}
              className="font-[family-name:var(--font-space)] text-2xl font-bold text-white md:text-3xl [&>span:nth-child(n+5)]:text-[#22c55e]"
            />
          </motion.div>
          <ol className="space-y-6">
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
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-xl border border-zinc-800 bg-[#161618] p-6"
              >
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-1 font-[family-name:var(--font-space)] text-lg font-bold text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{step.desc}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* O que você recebe */}
      <section className="cyber-section border-t border-zinc-800/50 section-padding bg-[#111113]">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-6"
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
          <ul className="grid gap-3 sm:grid-cols-2">
            {[
              "Campanhas estruturadas por objetivo e etapa de funil.",
              "Calendário de testes de criativos, públicos e ofertas.",
              "Relatórios claros com métricas que realmente importam para o seu negócio.",
              "Integração com sua landing page para garantir alinhamento anúncio → página.",
              "Suporte estratégico para ajustar oferta e comunicação conforme os dados.",
            ].map((item, i) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-2 font-mono text-sm text-zinc-300"
              >
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#22c55e]" />
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>
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
