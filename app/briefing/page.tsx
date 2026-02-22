"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  ChevronRight,
  Zap,
  Users,
  Target,
  Clock,
  Layers,
  Send,
  MessageCircle,
} from "lucide-react";
import BlurText from "@/app/components/BlurText";
import Magnet from "@/app/components/Magnet";
import CyberBackground from "@/app/components/CyberBackground";

/* ────────────────────────────────────────────────────────── */
/*  Estrutura dos passos                                       */
/* ────────────────────────────────────────────────────────── */

const STEPS = [
  { id: 1, icon: Target, title: "Negócio e produto", desc: "O que você vende e para quem" },
  { id: 2, icon: Zap, title: "Oferta e CTA", desc: "O que a pessoa faz na página" },
  { id: 3, icon: Layers, title: "Material existente", desc: "O que você já tem" },
  { id: 4, icon: Clock, title: "Prazo e uso", desc: "Quando e como a página será usada" },
  { id: 5, icon: Users, title: "Extras", desc: "Referências e restrições" },
];

type FormData = {
  product: string;
  audience: string;
  benefit: string;
  cta: string;
  pricing: string;
  objections: string;
  materials: string;
  brandLinks: string;
  pageLocation: string;
  deadline: string;
  traffic: string;
  integration: string;
  references: string;
  restrictions: string;
  name: string;
  whatsapp: string;
};

const INITIAL: FormData = {
  product: "",
  audience: "",
  benefit: "",
  cta: "",
  pricing: "",
  objections: "",
  materials: "",
  brandLinks: "",
  pageLocation: "",
  deadline: "",
  traffic: "",
  integration: "",
  references: "",
  restrictions: "",
  name: "",
  whatsapp: "",
};

function buildWhatsAppMessage(f: FormData): string {
  const lines = [
    `*Briefing Landing Page*`,
    ``,
    `*Nome:* ${f.name}`,
    ``,
    `*1. Negócio e produto*`,
    `• O que vende: ${f.product}`,
    `• Para quem: ${f.audience}`,
    `• Resultado principal: ${f.benefit}`,
    ``,
    `*2. Oferta e CTA*`,
    `• Ação principal: ${f.cta}`,
    `• Preço/condições: ${f.pricing}`,
    `• Objeções frequentes: ${f.objections}`,
    ``,
    `*3. Material existente*`,
    `• Materiais: ${f.materials || "Não informado"}`,
    `• Links da marca: ${f.brandLinks || "Não informado"}`,
    `• Onde a página ficará: ${f.pageLocation}`,
    ``,
    `*4. Prazo e uso*`,
    `• Prazo: ${f.deadline}`,
    `• Tráfego: ${f.traffic}`,
    `• Integração de leads: ${f.integration || "Não informado"}`,
    ``,
    `*5. Extras*`,
    `• Referências: ${f.references || "Não informado"}`,
    `• Restrições: ${f.restrictions || "Não informado"}`,
  ];
  return lines.join("\n");
}

/** Valida número de telefone brasileiro: 10 dígitos (fixo) ou 11 (celular com 9). */
function isValidBrazilianPhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 10) {
    const ddd = digits.slice(0, 2);
    return /^[1-9]\d$/.test(ddd);
  }
  if (digits.length === 11) {
    const ddd = digits.slice(0, 2);
    const nine = digits[2] === "9";
    return /^[1-9]\d$/.test(ddd) && nine;
  }
  return false;
}

/** Formata o valor digitado: celular (XX) 9 XXXX-XXXX ou fixo (XX) XXXX-XXXX. */
function formatBrazilianPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length === 0) return "";
  if (digits.length <= 2) return `(${digits}`;
  const ddd = digits.slice(0, 2);
  const rest = digits.slice(2);
  const isCelular = rest[0] === "9";
  if (isCelular) {
    if (rest.length <= 1) return `(${ddd}) ${rest}`;
    if (rest.length <= 5) return `(${ddd}) ${rest[0]} ${rest.slice(1)}`;
    return `(${ddd}) ${rest[0]} ${rest.slice(1, 5)}-${rest.slice(5, 9)}`;
  }
  if (rest.length <= 4) return `(${ddd}) ${rest}`;
  return `(${ddd}) ${rest.slice(0, 4)}-${rest.slice(4, 8)}`;
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div>
        <label className="text-sm font-semibold text-white">
          {label}
          {required && <span className="ml-1 text-[#22c55e]">*</span>}
        </label>
        {hint && <p className="mt-0.5 text-xs text-zinc-500">{hint}</p>}
      </div>
      {children}
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-zinc-700/80 bg-[#111113] px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-[#22c55e]/60 focus:ring-1 focus:ring-[#22c55e]/30";

const textareaCls =
  "w-full resize-none rounded-xl border border-zinc-700/80 bg-[#111113] px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-[#22c55e]/60 focus:ring-1 focus:ring-[#22c55e]/30";

export default function BriefingPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [done, setDone] = useState(false);
  const [whatsappError, setWhatsappError] = useState("");

  const set = (key: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
    if (key === "whatsapp") setWhatsappError("");
  };

  function canAdvance() {
    if (step === 1) return form.product && form.audience && form.benefit;
    if (step === 2) return form.cta && form.pricing;
    if (step === 3) return form.pageLocation;
    if (step === 4) return form.deadline && form.traffic;
    if (step === 5) {
      if (!form.name || !form.whatsapp) return false;
      return isValidBrazilianPhone(form.whatsapp);
    }
    return true;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (step === 5 && form.whatsapp && !isValidBrazilianPhone(form.whatsapp)) {
      setWhatsappError("Informe um número válido com DDD. Ex.: (27) 9 9999-9999");
      return;
    }
    if (!canAdvance()) return;
    const msg = buildWhatsAppMessage(form);
    const encoded = encodeURIComponent(msg);
    const phone = "5527992338038";
    window.open(`https://wa.me/${phone}?text=${encoded}`, "_blank");
    setDone(true);
  }

  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  /* ─── Tela de sucesso ─── */
  if (done) {
    return (
      <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pb-20 pt-16">
        <CyberBackground />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(34,197,94,0.07),transparent)]" />
        <div className="pointer-events-none absolute inset-0 cyber-grid-bg opacity-20" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative z-10 mx-auto max-w-md text-center"
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[#22c55e]/40 bg-[#22c55e]/10">
            <Check className="h-10 w-10 text-[#22c55e]" />
          </div>
          <h1 className="font-[family-name:var(--font-space)] text-3xl font-bold text-white">
            Briefing enviado
          </h1>
          <p className="mt-4 text-zinc-400">
            O WhatsApp foi aberto com todas as suas respostas. Entro em contato em breve para
            confirmar os detalhes e enviar a proposta.
          </p>
          <Magnet padding={50} magnetStrength={2}>
            <Link
              href="/site-72h"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#22c55e] px-6 py-3.5 font-semibold text-black shadow-[0_0_24px_rgba(34,197,94,0.3)] transition hover:bg-[#16a34a] hover:shadow-[0_0_40px_rgba(34,197,94,0.5)]"
            >
              Ver pacotes e preços
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Magnet>
        </motion.div>
      </main>
    );
  }

  /* ─── Formulário multi-step ─── */
  return (
    <main className="relative overflow-hidden pb-20">
      <CyberBackground />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(34,197,94,0.06),transparent)]" />
      <div className="pointer-events-none absolute inset-0 cyber-grid-bg opacity-20" />

      {/* Hero do briefing */}
      <section className="relative flex flex-col items-center overflow-hidden px-6 pb-6 pt-10 text-center sm:pt-12">
        <div className="relative z-10 mb-4 flex items-center justify-center gap-3">
          <span className="hex-badge flicker">BRIEFING://LANDING</span>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 mx-auto max-w-2xl"
        >
          <BlurText
            text="Briefing rápido para sua landing page."
            as="h1"
            animateBy="words"
            delay={80}
            stepDuration={0.35}
            className="justify-center font-[family-name:var(--font-space)] text-3xl font-bold leading-tight text-white sm:text-4xl [&>span:nth-child(n+4)]:text-[#22c55e] [&>span:nth-child(n+4)]:cyber-text-glow"
          />
          <span className="mx-auto mt-2 block h-px w-48 bg-gradient-to-r from-transparent via-[#22c55e]/50 to-transparent" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="relative z-10 mt-4 text-sm text-zinc-500"
        >
          5 etapas · suas respostas vão direto para o WhatsApp
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="relative z-10 mt-4"
        >
          <Link
            href="/site-72h"
            className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-600 transition hover:text-zinc-400"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Voltar ao site 72h
          </Link>
        </motion.div>
      </section>

      {/* Form card */}
      <section className="cyber-section relative px-6 pt-4 pb-12 sm:px-6 md:pt-6 md:pb-16">
        <div className="section-container relative max-w-2xl">
          {/* Progress + steps */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-5"
          >
            <div className="mb-4 h-1 w-full overflow-hidden rounded-full bg-zinc-800">
              <motion.div
                className="h-full rounded-full bg-[#22c55e]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="flex items-center justify-between">
              {STEPS.map(({ id, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => id < step && setStep(id)}
                  className={`flex h-9 w-9 items-center justify-center rounded-full border font-mono text-[10px] transition-all ${
                    id < step
                      ? "border-[#22c55e]/50 bg-[#22c55e]/15 text-[#22c55e] cursor-pointer hover:bg-[#22c55e]/25"
                      : id === step
                        ? "border-[#22c55e] bg-[#22c55e]/20 text-[#22c55e] shadow-[0_0_16px_rgba(34,197,94,0.25)]"
                        : "border-zinc-700 bg-zinc-900 text-zinc-600 cursor-default"
                  }`}
                  title={STEPS[id - 1].title}
                >
                  {id < step ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                </button>
              ))}
            </div>
            <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-wider text-zinc-600">
              Etapa {step} — {STEPS[step - 1].title}
            </p>
          </motion.div>

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#111113]"
          >
            <div className="border-b border-zinc-800 bg-[#0d0d0f] px-6 py-4">
              <div className="flex items-center gap-3">
                {(() => {
                  const Icon = STEPS[step - 1].icon;
                  return (
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-[#22c55e]/30 bg-[#22c55e]/10">
                      <Icon className="h-5 w-5 text-[#22c55e]" />
                    </div>
                  );
                })()}
                <div>
                  <h2 className="font-[family-name:var(--font-space)] font-bold text-white">
                    {STEPS[step - 1].title}
                  </h2>
                  <p className="text-xs text-zinc-500">{STEPS[step - 1].desc}</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              {step === 1 && (
                <>
                  <Field label="O que você vende/oferece?" hint="Produto, serviço, curso, mentoria, assinatura, evento etc." required>
                    <textarea rows={3} className={textareaCls} placeholder="Ex.: Mentoria de marketing digital para pequenos negócios locais" value={form.product} onChange={set("product")} required />
                  </Field>
                  <Field label="Para quem é?" hint="1 frase: quem é a pessoa, principal dor e em que momento ela está." required>
                    <textarea rows={3} className={textareaCls} placeholder="Ex.: Dono de restaurante que quer lotar as mesas no fim de semana mas não sabe como atrair clientes online" value={form.audience} onChange={set("audience")} required />
                  </Field>
                  <Field label="Qual é o principal resultado/transformação?" hint="O que a pessoa ganha ao contratar/comprar?" required>
                    <textarea rows={3} className={textareaCls} placeholder="Ex.: Sair de 2 para 20 agendamentos por semana em 30 dias" value={form.benefit} onChange={set("benefit")} required />
                  </Field>
                </>
              )}

              {step === 2 && (
                <>
                  <Field label="Qual ação principal você quer que a pessoa faça na página?" hint="Ex.: comprar, pedir orçamento, agendar call, chamar no WhatsApp" required>
                    <input type="text" className={inputCls} placeholder="Ex.: Clicar em 'Agendar consulta' e cair no WhatsApp" value={form.cta} onChange={set("cta")} required />
                  </Field>
                  <Field label="Qual é o preço ou condições da oferta?" hint="Desconto, bônus, parcelamento, garantia" required>
                    <textarea rows={3} className={textareaCls} placeholder="Ex.: R$ 997 à vista ou 3x. Bônus: planilha. Garantia 7 dias." value={form.pricing} onChange={set("pricing")} required />
                  </Field>
                  <Field label="Quais objeções aparecem com frequência?">
                    <textarea rows={3} className={textareaCls} placeholder="Ex.: 'Está caro', 'Vou pensar', 'Já tentei e não funcionou'" value={form.objections} onChange={set("objections")} />
                  </Field>
                </>
              )}

              {step === 3 && (
                <>
                  <Field label="Você já tem algum material de base?" hint="Textos, vídeos, páginas antigas, depoimentos, FAQs">
                    <textarea rows={3} className={textareaCls} placeholder="Ex.: Apresentação em PDF, 3 depoimentos em vídeo" value={form.materials} onChange={set("materials")} />
                  </Field>
                  <Field label="Tem site, redes ou links da sua marca?" hint="Para seguir tom de voz, cores, logo">
                    <textarea rows={2} className={textareaCls} placeholder="Ex.: instagram.com/minha_marca — fundo escuro, tom informal" value={form.brandLinks} onChange={set("brandLinks")} />
                  </Field>
                  <Field label="Onde essa página vai ficar?" hint="Domínio, subdomínio, link de campanha" required>
                    <input type="text" className={inputCls} placeholder="Ex.: meusite.com.br/oferta" value={form.pageLocation} onChange={set("pageLocation")} required />
                  </Field>
                </>
              )}

              {step === 4 && (
                <>
                  <Field label="Quando você precisa que a página esteja no ar?" required>
                    <input type="text" className={inputCls} placeholder="Ex.: Até 28/02 (data limite)" value={form.deadline} onChange={set("deadline")} required />
                  </Field>
                  <Field label="Essa página será usada em qual tipo de tráfego?" hint="Meta Ads, Google, e-mail, WhatsApp, Instagram…" required>
                    <textarea rows={2} className={textareaCls} placeholder="Ex.: Meta Ads + stories no Instagram" value={form.traffic} onChange={set("traffic")} required />
                  </Field>
                  <Field label="Precisa de formulário integrado? Para onde vão os leads?">
                    <input type="text" className={inputCls} placeholder="Ex.: E-mail + ActiveCampaign" value={form.integration} onChange={set("integration")} />
                  </Field>
                </>
              )}

              {step === 5 && (
                <>
                  <Field label="Tem alguma landing ou site que você gosta como referência?">
                    <textarea rows={3} className={textareaCls} placeholder="Ex.: gosto de páginas diretas, fundo escuro, destaque em verde" value={form.references} onChange={set("references")} />
                  </Field>
                  <Field label="Existe alguma restrição? Cores, palavras, promessas que não podem aparecer?">
                    <textarea rows={2} className={textareaCls} placeholder="Ex.: Não usar vermelho, não prometer resultado em X dias" value={form.restrictions} onChange={set("restrictions")} />
                  </Field>
                  <div className="border-t border-zinc-800 pt-4">
                    <p className="mb-4 text-xs text-zinc-500">Para eu entrar em contato com a proposta:</p>
                    <div className="space-y-4">
                      <Field label="Seu nome" required>
                        <input type="text" className={inputCls} placeholder="João Silva" value={form.name} onChange={set("name")} required />
                      </Field>
                      <Field label="WhatsApp" required hint="O número é formatado automaticamente enquanto você digita.">
                        <input
                          type="tel"
                          inputMode="numeric"
                          autoComplete="tel"
                          className={`${inputCls} ${whatsappError ? "border-red-500/60 focus:border-red-500/80 focus:ring-red-500/30" : ""}`}
                          placeholder="(27) 9 9999-9999"
                          value={form.whatsapp}
                          onChange={(e) => {
                            const formatted = formatBrazilianPhone(e.target.value);
                            setForm((prev) => ({ ...prev, whatsapp: formatted }));
                            setWhatsappError("");
                          }}
                          onBlur={() => {
                            if (form.whatsapp.trim() && !isValidBrazilianPhone(form.whatsapp)) {
                              setWhatsappError("Número inválido. Use DDD + número. Ex.: (27) 9 9999-9999");
                            } else {
                              setWhatsappError("");
                            }
                          }}
                          required
                        />
                        {whatsappError && (
                          <p className="mt-1.5 text-xs text-red-400" role="alert">
                            {whatsappError}
                          </p>
                        )}
                      </Field>
                    </div>
                  </div>
                </>
              )}

              {/* Navegação — no mobile empilhados e com área de toque maior */}
              <div className="flex flex-col gap-3 border-t border-zinc-800 pt-5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <button
                  type="button"
                  onClick={() => setStep((s) => Math.max(1, s - 1))}
                  disabled={step === 1}
                  className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800/50 px-4 py-3 font-mono text-sm text-zinc-400 transition hover:border-zinc-600 hover:text-white disabled:pointer-events-none disabled:opacity-30 sm:flex-none sm:min-h-0 sm:py-2.5"
                >
                  <ArrowLeft className="h-4 w-4 flex-shrink-0" />
                  Anterior
                </button>

                {step < STEPS.length ? (
                  <Magnet padding={40} magnetStrength={2} className="w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => canAdvance() && setStep((s) => s + 1)}
                      disabled={!canAdvance()}
                      className="group inline-flex min-h-[48px] w-full flex-1 items-center justify-center gap-2 rounded-xl bg-[#22c55e] px-5 py-3 font-semibold text-black shadow-[0_0_20px_rgba(34,197,94,0.3)] transition hover:bg-[#16a34a] hover:shadow-[0_0_32px_rgba(34,197,94,0.4)] disabled:pointer-events-none disabled:opacity-40 sm:min-h-0 sm:w-auto sm:flex-none sm:py-2.5"
                    >
                      Próxima etapa
                      <ChevronRight className="h-4 w-4 flex-shrink-0 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </Magnet>
                ) : (
                  <Magnet padding={40} magnetStrength={2} className="w-full sm:w-auto">
                    <button
                      type="submit"
                      disabled={!canAdvance()}
                      className="group inline-flex min-h-[48px] w-full flex-1 items-center justify-center gap-2 rounded-xl bg-[#22c55e] px-5 py-3 font-semibold text-black shadow-[0_0_20px_rgba(34,197,94,0.3)] transition hover:bg-[#16a34a] hover:shadow-[0_0_32px_rgba(34,197,94,0.4)] disabled:pointer-events-none disabled:opacity-40 sm:min-h-0 sm:w-auto sm:flex-none sm:py-2.5"
                    >
                      Enviar para WhatsApp
                      <MessageCircle className="h-4 w-4 flex-shrink-0" />
                    </button>
                  </Magnet>
                )}
              </div>
            </form>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-center font-mono text-[10px] uppercase tracking-widest text-zinc-700 flicker"
          >
            // respostas enviadas direto ao WhatsApp · sem armazenamento
          </motion.p>
        </div>
      </section>
    </main>
  );
}
