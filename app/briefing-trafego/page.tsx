"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, ChevronRight, User, TrendingUp, Target } from "lucide-react";
import BlurText from "@/app/components/BlurText";
import Magnet from "@/app/components/Magnet";
import CyberBackground from "@/app/components/CyberBackground";

const STEPS = [
  { id: 1, icon: User,       title: "Contato",           desc: "Como eu te encontro" },
  { id: 2, icon: TrendingUp, title: "Negócio e tráfego", desc: "Onde você está hoje" },
  { id: 3, icon: Target,     title: "Objetivos",         desc: "Para onde você quer ir" },
];

const inputCls =
  "w-full rounded-xl border border-zinc-700/80 bg-[#111113] px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-[#22c55e]/60 focus:ring-1 focus:ring-[#22c55e]/30";
const inputErrorCls =
  "w-full rounded-xl border border-red-500/60 bg-[#111113] px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-red-500/60 focus:ring-1 focus:ring-red-500/30";
const textareaCls =
  "w-full resize-y min-h-[100px] rounded-xl border border-zinc-700/80 bg-[#111113] px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-[#22c55e]/60 focus:ring-1 focus:ring-[#22c55e]/30";

function isValidBrazilianPhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 10) return /^[1-9]\d$/.test(digits.slice(0, 2));
  if (digits.length === 11) return /^[1-9]\d$/.test(digits.slice(0, 2)) && digits[2] === "9";
  return false;
}

function formatBrazilianPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (!digits.length) return "";
  if (digits.length <= 2) return `(${digits}`;
  const ddd = digits.slice(0, 2);
  const rest = digits.slice(2);
  const cel = rest[0] === "9";
  if (cel) {
    if (rest.length <= 1) return `(${ddd}) ${rest}`;
    if (rest.length <= 5) return `(${ddd}) ${rest[0]} ${rest.slice(1)}`;
    return `(${ddd}) ${rest[0]} ${rest.slice(1, 5)}-${rest.slice(5, 9)}`;
  }
  if (rest.length <= 4) return `(${ddd}) ${rest}`;
  return `(${ddd}) ${rest.slice(0, 4)}-${rest.slice(4, 8)}`;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

const BUDGET_ALLOWED = /[\dR$.,\sa]/gi;
function filterBudgetInput(value: string): string {
  return ((value.match(BUDGET_ALLOWED) || []).join("")).slice(0, 80);
}
function isValidBudget(budget: string): boolean {
  if (!budget.trim()) return true;
  const cleaned = budget.trim().replace(/\s+/g, " ");
  if (cleaned.length > 80 || !/\d/.test(cleaned)) return false;
  return /^[\dR$.,\sa]+$/i.test(cleaned);
}

function Field({ label, hint, required, optional, children }: {
  label: string; hint?: string; required?: boolean; optional?: boolean; children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline gap-2">
        <label className="block text-sm font-semibold text-white">
          {label}
          {required && <span className="ml-1 text-[#22c55e]">*</span>}
        </label>
        {optional && <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-600">opcional</span>}
      </div>
      {hint && <p className="text-xs text-zinc-500 leading-relaxed">{hint}</p>}
      {children}
    </div>
  );
}

export default function BriefingTrafegoPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "", whatsapp: "", email: "", current_situation: "", goals: "", budget: "",
  });
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ whatsapp?: string; email?: string; budget?: string }>({});

  function canAdvance() {
    if (step === 1) {
      return !!(form.name && isValidBrazilianPhone(form.whatsapp) && isValidEmail(form.email));
    }
    if (step === 2) return !!form.current_situation.trim();
    if (step === 3) return !!form.goals.trim();
    return false;
  }

  function handleNext() {
    if (step === 1) {
      const errs: typeof errors = {};
      if (!isValidBrazilianPhone(form.whatsapp)) errs.whatsapp = "Número inválido. Use DDD + número. Ex.: (27) 9 9999-9999";
      if (!isValidEmail(form.email)) errs.email = "Informe um e-mail válido.";
      setErrors(errs);
      if (Object.keys(errs).length > 0) return;
    }
    setStep(step + 1);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (step !== 3) return;
    if (!isValidBudget(form.budget)) {
      setErrors((p) => ({ ...p, budget: "Informe apenas em formato de dinheiro (ex.: R$ 2.000 ou R$ 2.000 a R$ 5.000)." }));
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/traffic-briefing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          whatsapp: form.whatsapp.trim(),
          email: form.email.trim(),
          current_situation: form.current_situation.trim(),
          goals: form.goals.trim(),
          budget: form.budget.trim() || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Erro ao enviar.");
      setDone(true);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao enviar. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pb-20 pt-16">
        <CyberBackground />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(34,197,94,0.07),transparent)]" />
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 mx-auto max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[#22c55e]/40 bg-[#22c55e]/10">
            <Check className="h-10 w-10 text-[#22c55e]" />
          </div>
          <h1 className="font-[family-name:var(--font-space)] text-3xl font-bold text-white">Briefing enviado!</h1>
          <p className="mt-4 text-zinc-400">
            Recebi tudo. Analiso sua situação e entro em contato em breve para alinhar os próximos passos da gestão de tráfego.
          </p>
          <Link href="/servicos/gestao-de-trafego" className="mt-8 inline-flex items-center gap-2 rounded-xl border border-zinc-600 px-6 py-3.5 font-semibold text-zinc-300 transition hover:border-[#22c55e]/40 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Voltar à gestão de tráfego
          </Link>
        </motion.div>
      </main>
    );
  }

  const currentStep = STEPS[step - 1];
  const StepIcon = currentStep.icon;

  return (
    <main className="relative overflow-hidden pb-20">
      <CyberBackground />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(34,197,94,0.06),transparent)]" />

      <section className="cyber-section relative px-6 pt-10 pb-4">
        <div className="section-container relative mx-auto max-w-xl">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 flex justify-center">
            <span className="hex-badge flicker">BRIEFING://TRÁFEGO</span>
          </motion.div>
          <BlurText
            text="Briefing para gestão de tráfego"
            as="h1"
            animateBy="words"
            delay={80}
            stepDuration={0.35}
            className="flex justify-center text-center font-[family-name:var(--font-space)] text-2xl font-bold text-white sm:text-3xl [&>span:nth-child(n+3)]:text-[#22c55e]"
          />
          <p className="mt-2 text-center text-sm text-zinc-500">
            3 passos rápidos. Analiso e respondo com a estratégia para o seu tráfego.
          </p>
          <div className="mt-5 flex justify-center">
            <Link href="/servicos/gestao-de-trafego" className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-600 transition hover:text-zinc-400">
              <ArrowLeft className="h-3.5 w-3.5" />
              Voltar à gestão de tráfego
            </Link>
          </div>
        </div>
      </section>

      <section className="cyber-section relative px-6 pt-2 pb-12">
        <div className="section-container relative mx-auto max-w-xl">

          {/* Progress */}
          <div className="mb-6">
            <div className="mb-3 flex items-center justify-between gap-2">
              {STEPS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => step > s.id && setStep(s.id)}
                  className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold transition ${
                    step === s.id
                      ? "bg-[#22c55e] text-black shadow-[0_0_12px_rgba(34,197,94,0.4)]"
                      : step > s.id
                        ? "cursor-pointer bg-[#22c55e]/25 text-[#22c55e] hover:bg-[#22c55e]/40"
                        : "bg-zinc-800 text-zinc-600 cursor-default"
                  }`}
                >
                  {step > s.id ? <Check className="h-3.5 w-3.5" /> : s.id}
                </button>
              ))}
            </div>
            <div className="h-1 w-full overflow-hidden rounded-full bg-zinc-800">
              <motion.div
                className="h-full bg-[#22c55e]"
                animate={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="mt-2 flex items-center gap-2">
              <StepIcon className="h-3.5 w-3.5 text-[#22c55e]" />
              <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                Passo {step} de {STEPS.length} — {currentStep.title}
              </p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#111113] p-6 sm:p-8"
            >
              <div className="mb-6 border-b border-zinc-800 pb-4">
                <h2 className="font-[family-name:var(--font-space)] text-base font-bold text-white">{currentStep.title}</h2>
                <p className="mt-0.5 text-xs text-zinc-500">{currentStep.desc}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">

                {step === 1 && (
                  <>
                    <Field label="Seu nome completo" required>
                      <input type="text" className={inputCls}
                        placeholder="Como devo te chamar?"
                        value={form.name}
                        onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                        required
                      />
                    </Field>
                    <Field label="Seu WhatsApp" required>
                      <input
                        type="tel"
                        required
                        placeholder="(27) 9 9999-9999"
                        value={form.whatsapp}
                        onChange={(e) => {
                          setForm((p) => ({ ...p, whatsapp: formatBrazilianPhone(e.target.value) }));
                          if (errors.whatsapp) setErrors((p) => ({ ...p, whatsapp: undefined }));
                        }}
                        onBlur={() => {
                          if (form.whatsapp.trim() && !isValidBrazilianPhone(form.whatsapp))
                            setErrors((p) => ({ ...p, whatsapp: "Número inválido. Use DDD + número. Ex.: (27) 9 9999-9999" }));
                          else setErrors((p) => ({ ...p, whatsapp: undefined }));
                        }}
                        className={errors.whatsapp ? inputErrorCls : inputCls}
                      />
                      {errors.whatsapp && <p className="text-xs text-red-400">{errors.whatsapp}</p>}
                    </Field>
                    <Field label="Seu e-mail" required>
                      <input
                        type="email"
                        required
                        placeholder="seu@email.com"
                        value={form.email}
                        onChange={(e) => {
                          setForm((p) => ({ ...p, email: e.target.value }));
                          if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
                        }}
                        className={errors.email ? inputErrorCls : inputCls}
                      />
                      {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
                    </Field>
                  </>
                )}

                {step === 2 && (
                  <Field label="O que você vende, para quem, e como está sua situação com tráfego hoje?" required hint="Quanto mais detalhe, melhor posso te ajudar. Descreva o produto/serviço, o público e o que já está acontecendo com seus anúncios.">
                    <textarea
                      required
                      className={textareaCls}
                      style={{ minHeight: 140 }}
                      placeholder={`Ex.: Vendo consultas de nutrição para mulheres de 30 a 50 anos que querem emagrecer com saúde.\n\nJá tenho anúncios rodando no Meta há 3 meses. Gasto R$ 1.500/mês mas o custo por lead está alto (R$ 80+) e a maioria não converte em consulta marcada. Minha página é um link do WhatsApp direto.`}
                      value={form.current_situation}
                      onChange={(e) => setForm((p) => ({ ...p, current_situation: e.target.value }))}
                    />
                  </Field>
                )}

                {step === 3 && (
                  <>
                    <Field label="O que você quer alcançar e qual plataforma quer usar?" required hint="Seja específico sobre metas, números e canais. Quanto mais claro, melhor a estratégia.">
                      <textarea
                        required
                        className={textareaCls}
                        style={{ minHeight: 130 }}
                        placeholder={`Ex.: Quero reduzir meu custo por lead para abaixo de R$ 40 e aumentar a taxa de conversão em consultas. Quero usar Meta Ads (principal) e testar Google Ads para buscas. Meta de 40 leads/mês qualificados.`}
                        value={form.goals}
                        onChange={(e) => setForm((p) => ({ ...p, goals: e.target.value }))}
                      />
                    </Field>
                    <Field label="Orçamento mensal para anúncios" optional hint="Quanto você investe ou pretende investir por mês em mídia paga.">
                      <input
                        type="text"
                        inputMode="decimal"
                        placeholder="Ex.: R$ 1.500 ou R$ 1.000 a R$ 3.000"
                        maxLength={80}
                        value={form.budget}
                        onChange={(e) => {
                          setForm((p) => ({ ...p, budget: filterBudgetInput(e.target.value) }));
                          if (errors.budget) setErrors((p) => ({ ...p, budget: undefined }));
                        }}
                        className={errors.budget ? inputErrorCls : inputCls}
                      />
                      {errors.budget && <p className="text-xs text-red-400">{errors.budget}</p>}
                    </Field>
                  </>
                )}

                <div className="flex items-center justify-between gap-3 pt-4">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 px-5 py-3 text-sm font-medium text-zinc-400 transition hover:border-[#22c55e]/40 hover:text-white"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Voltar
                    </button>
                  ) : <div />}
                  {step < 3 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={!canAdvance()}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#22c55e] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#16a34a] disabled:opacity-40"
                    >
                      Próximo
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <Magnet padding={50} magnetStrength={2}>
                      <button
                        type="submit"
                        disabled={submitting || !canAdvance()}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#22c55e] px-6 py-4 font-semibold text-black shadow-[0_0_20px_rgba(34,197,94,0.25)] transition hover:bg-[#16a34a] disabled:opacity-40"
                      >
                        {submitting ? (
                          <>
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            Enviar briefing
                            <ArrowRight className="h-5 w-5" />
                          </>
                        )}
                      </button>
                    </Magnet>
                  )}
                </div>
              </form>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
}
