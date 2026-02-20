"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Target, AlertCircle, ListOrdered, CheckSquare, HelpCircle, Mail, ArrowLeft } from "lucide-react";
import BlurText from "@/app/components/BlurText";
import Magnet from "@/app/components/Magnet";

const EMAIL = "marllonzinid@gmail.com";

export default function LandingPagesContent() {
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
            <span className="hex-badge flicker">SRV://LANDING_PAGES</span>
            <span className="status-dot" />
          </motion.div>
          <BlurText
            text="Landing pages que convertem junto com seu tráfego."
            as="h1"
            animateBy="words"
            delay={100}
            stepDuration={0.4}
            className="mb-4 font-[family-name:var(--font-space)] text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl [&>span:nth-child(n+4)]:text-[#22c55e] [&>span:nth-child(n+4)]:cyber-text-glow"
          />
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl text-lg text-zinc-400"
          >
            Estrutura, copy e tecnologia para páginas focadas em conversão, integradas com anúncios, pixel, CRM e eventos. Uma LP alinhada ao que você promete no tráfego.
          </motion.p>
          <ul className="mt-6 space-y-2 font-mono text-sm text-zinc-500">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
              <strong className="text-zinc-400">Para quem é:</strong> quem já anuncia (ou vai anunciar) e precisa de página que receba e converta o clique.
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
              <strong className="text-zinc-400">Entregável:</strong> página única, responsiva, com formulário e integrações que você precisar.
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
              <strong className="text-zinc-400">Foco:</strong> mensagem e oferta alinhadas ao anúncio, CTA claro e dados prontos para relatório.
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
              text="Para quem é a criação de landing pages"
              as="h2"
              animateBy="words"
              delay={80}
              stepDuration={0.35}
              className="font-[family-name:var(--font-space)] text-2xl font-bold text-white md:text-3xl [&>span:nth-child(n+5)]:text-[#22c55e]"
            />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl text-zinc-400 leading-relaxed mb-6"
          >
            Para quem já faz (ou quer fazer) tráfego pago e sente que a página não entrega o que o anúncio promete, ou que o formulário e os dados ficam perdidos. Uma LP bem feita reduz custo por lead e por venda e deixa os relatórios consistentes.
          </motion.p>
          <ul className="space-y-3">
            {[
              "Infoprodutores e experts: páginas de captura, vendas e webinar.",
              "Serviços e agendamentos: formulário + integração com calendário ou CRM.",
              "E-commerce e ofertas: página de oferta única com checkout ou redirecionamento.",
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
              text="Problemas que a LP resolve"
              as="h2"
              animateBy="words"
              delay={80}
              stepDuration={0.35}
              className="font-[family-name:var(--font-space)] text-2xl font-bold text-white md:text-3xl [&>span:nth-child(n+4)]:text-[#22c55e]"
            />
          </motion.div>
          <ul className="space-y-3 mb-6">
            {[
              "Anúncio promete uma coisa, página fala outra — quebra de expectativa e perda de conversão.",
              "Formulário que não envia para lugar nenhum ou não conecta com CRM/e-mail.",
              "Página lenta ou que não abre bem no celular — desperdício de tráfego pago.",
              "Falta de pixel e eventos: você não consegue medir lead ou venda no relatório de campanha.",
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
            Uma LP boa é continuação natural do anúncio: mesma mensagem, oferta clara e CTA que leva à ação (cadastro, compra, agendamento), com tudo medido.
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
              text="Como funciona a criação da LP"
              as="h2"
              animateBy="words"
              delay={80}
              stepDuration={0.35}
              className="font-[family-name:var(--font-space)] text-2xl font-bold text-white md:text-3xl [&>span:nth-child(n+4)]:text-[#22c55e]"
            />
          </motion.div>
          <ol className="space-y-6">
            {[
              {
                title: "Brief e alinhamento",
                desc: "Entendo sua oferta, público, anúncio (ou rascunho) e onde os leads/vendas devem cair (e-mail, CRM, etc.). Definimos headline, benefícios e CTA.",
              },
              {
                title: "Estrutura e copy",
                desc: "Monto a estrutura da página (hero, benefícios, prova, CTA) e o texto alinhado à mensagem do tráfego. Você revisa e aprovamos antes de codar.",
              },
              {
                title: "Desenvolvimento e integrações",
                desc: "Página responsiva, formulário funcionando e integrações combinadas: envio por e-mail, webhook, CRM, pixel (Meta/Google), eventos de conversão.",
              },
              {
                title: "Entrega e evolução",
                desc: "Você recebe o link e as instruções. Se quiser, acompanhamos os primeiros dias e sugerimos ajustes de copy ou layout com base em resultado.",
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
              text="O que você leva com a LP"
              as="h2"
              animateBy="words"
              delay={80}
              stepDuration={0.35}
              className="font-[family-name:var(--font-space)] text-2xl font-bold text-white md:text-3xl [&>span:nth-child(n+4)]:text-[#22c55e]"
            />
          </motion.div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {[
              "Página única responsiva (desktop e mobile), com sua identidade e copy aprovada.",
              "Formulário com envio por e-mail e/ou webhook para CRM/ferramentas que você usar.",
              "Pixel (Meta, Google) e eventos de conversão configurados para relatório de campanha.",
              "Link estável e rápido, pronto para usar no anúncio.",
              "Documentação rápida do que foi configurado e como alterar textos se precisar.",
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
                q: "Preciso ter o texto pronto?",
                a: "Não. Posso propor a estrutura e o copy com base no seu anúncio e oferta; você revisa e aprovamos antes de desenvolver.",
              },
              {
                q: "Funciona com qualquer ferramenta de e-mail/CRM?",
                a: "Na maioria dos casos sim: webhook, Zapier, integrações nativas. No brief alinhamos para onde os dados devem ir.",
              },
              {
                q: "Quanto tempo para entregar?",
                a: "Depende da complexidade (página simples x várias integrações). Em geral, de alguns dias a 1–2 semanas após aprovação do copy.",
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
            text="Quer uma landing page que converta com seu tráfego?"
            as="h2"
            animateBy="words"
            delay={100}
            stepDuration={0.4}
            className="justify-center font-[family-name:var(--font-space)] text-2xl font-bold tracking-tight text-white md:text-3xl [&>span:nth-child(n+5)]:text-[#22c55e] [&>span:nth-child(n+5)]:cyber-text-glow"
          />
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-4 font-mono text-sm text-zinc-400"
          >
            Me conta sua oferta, onde você anuncia (ou vai anunciar) e onde quer receber os leads. Eu te devolvo uma proposta alinhada.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <Magnet padding={60} magnetStrength={3}>
              <a
                href={`mailto:${EMAIL}?subject=Landing Page - Contato site`}
                className="inline-flex items-center gap-2 rounded-xl bg-[#22c55e] px-6 py-3.5 font-semibold text-black shadow-[0_0_20px_rgba(34,197,94,0.3)] transition hover:bg-[#16a34a] hover:shadow-[0_0_40px_rgba(34,197,94,0.5)]"
              >
                <Mail className="h-5 w-5" />
                Quero falar sobre landing page
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
