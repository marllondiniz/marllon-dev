"use client";

import { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, ArrowLeft, Check, ChevronRight,
  Target, Zap, Layers, Clock, Users,
} from "lucide-react";
import BlurText from "@/app/components/BlurText";
import Magnet from "@/app/components/Magnet";
import CyberBackground from "@/app/components/CyberBackground";

const STEPS = [
  { id: 1, icon: Target,  title: "Sua oferta",         desc: "O que você vende e para quem" },
  { id: 2, icon: Zap,     title: "A página",            desc: "Ação, preço e objeções" },
  { id: 3, icon: Layers,  title: "Material e contexto", desc: "O que você tem e onde vai usar" },
  { id: 4, icon: Clock,   title: "Prazo e técnico",     desc: "Quando, tráfego e integrações" },
  { id: 5, icon: Users,   title: "Contato",             desc: "Para eu te chamar em breve" },
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
  product: "", audience: "", benefit: "", cta: "", pricing: "",
  objections: "", materials: "", brandLinks: "", pageLocation: "",
  deadline: "", traffic: "", integration: "", references: "",
  restrictions: "", name: "", whatsapp: "",
};

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

const PLAN_LABELS: Record<string, string> = {
  express: "Site Express 72h",
  start: "Site Start",
  pro: "Empresa Pro",
};

const inputCls =
  "w-full rounded-xl border border-zinc-700/80 bg-[#111113] px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-[#22c55e]/60 focus:ring-1 focus:ring-[#22c55e]/30";
const textareaCls =
  "w-full resize-y min-h-[90px] rounded-xl border border-zinc-700/80 bg-[#111113] px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-[#22c55e]/60 focus:ring-1 focus:ring-[#22c55e]/30";

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

function BriefingContent() {
  const searchParams = useSearchParams();
  const selectedPlan = useMemo(() => {
    const id = searchParams.get("plano");
    return id && PLAN_LABELS[id] ? PLAN_LABELS[id] : "";
  }, [searchParams]);

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [done, setDone] = useState(false);
  const [whatsappError, setWhatsappError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const set = (key: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
      if (key === "whatsapp") setWhatsappError("");
    };

  function canAdvance() {
    if (step === 1) return !!(form.product && form.audience && form.benefit);
    if (step === 2) return !!(form.cta && form.pricing);
    if (step === 3) return !!form.pageLocation;
    if (step === 4) return !!(form.deadline && form.traffic);
    if (step === 5) return !!(form.name && form.whatsapp && isValidBrazilianPhone(form.whatsapp));
    return false;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (step !== 5) return;
    if (!isValidBrazilianPhone(form.whatsapp)) {
      setWhatsappError("Número inválido. Use DDD + número. Ex.: (27) 9 9999-9999");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/briefing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, plan: selectedPlan || undefined }),
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
            Recebi tudo. Já estou analisando e entro em contato em até 2h pelo WhatsApp com a proposta da sua página.
          </p>
          {selectedPlan && (
            <p className="mt-3 font-mono text-xs text-[#22c55e]">Plano: {selectedPlan}</p>
          )}
          <Link href="/" className="mt-8 inline-flex items-center gap-2 rounded-xl border border-zinc-600 px-6 py-3.5 font-semibold text-zinc-300 transition hover:border-[#22c55e]/40 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao site
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
            <span className="hex-badge flicker">BRIEFING://SITE</span>
          </motion.div>
          <BlurText
            text="Briefing para sua página"
            as="h1"
            animateBy="words"
            delay={80}
            stepDuration={0.35}
            className="flex justify-center text-center font-[family-name:var(--font-space)] text-2xl font-bold text-white sm:text-3xl [&>span:nth-child(n+3)]:text-[#22c55e]"
          />
          <p className="mt-2 text-center text-sm text-zinc-500">
            Preencha em poucos minutos e receba sua proposta em até 2h.
          </p>
          {selectedPlan && (
            <div className="mt-3 flex justify-center">
              <span className="rounded-full border border-[#22c55e]/30 bg-[#22c55e]/10 px-3 py-1 font-mono text-xs text-[#22c55e]">
                Plano: {selectedPlan}
              </span>
            </div>
          )}
          <div className="mt-5 flex justify-center">
            <Link href="/site-72h" className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-600 transition hover:text-zinc-400">
              <ArrowLeft className="h-3.5 w-3.5" />
              Voltar aos planos
            </Link>
          </div>
        </div>
      </section>

      <section className="cyber-section relative px-6 pt-2 pb-12">
        <div className="section-container relative mx-auto max-w-xl">

          {/* Progress */}
          <div className="mb-6">
            <div className="mb-3 flex items-center justify-between gap-1">
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
                    <Field label="O que você vende?" required hint="Produto, serviço, curso, consultoria… seja específico.">
                      <input type="text" className={inputCls}
                        placeholder="Ex.: Mentoria individual para coaches que querem ter agenda cheia"
                        value={form.product} onChange={set("product")} required />
                    </Field>
                    <Field label="Quem é seu cliente ideal?" required hint="Perfil, cargo, situação de vida ou problema principal que ele tem.">
                      <textarea className={textareaCls}
                        placeholder="Ex.: Mulheres de 30 a 45 anos, coaches em início de carreira, que têm dificuldade de fechar clientes pelo Instagram"
                        value={form.audience} onChange={set("audience")} required />
                    </Field>
                    <Field label="Qual a principal transformação ou resultado que você entrega?" required hint="O 'antes e depois' do seu cliente.">
                      <input type="text" className={inputCls}
                        placeholder="Ex.: Sai sem clientes e chega a R$ 10k/mês em 90 dias"
                        value={form.benefit} onChange={set("benefit")} required />
                    </Field>
                  </>
                )}

                {step === 2 && (
                  <>
                    <Field label="Qual ação você quer que a pessoa faça na página?" required hint="Seja direto: o que acontece ao clicar no botão principal?">
                      <input type="text" className={inputCls}
                        placeholder="Ex.: Clicar em 'Agendar conversa gratuita' e cair no meu WhatsApp"
                        value={form.cta} onChange={set("cta")} required />
                    </Field>
                    <Field label="Qual o preço e condições de pagamento?" required hint="Informe o valor, parcelamento e destaque se houver desconto ou bônus.">
                      <input type="text" className={inputCls}
                        placeholder="Ex.: R$ 1.497 à vista ou 6x de R$ 269 — bônus para quem pagar hoje"
                        value={form.pricing} onChange={set("pricing")} required />
                    </Field>
                    <Field label="Quais as principais objeções do seu cliente antes de comprar?" optional hint="O que as pessoas falam para não comprar? Isso vai para a copy da página.">
                      <textarea className={textareaCls}
                        placeholder="Ex.: 'Não tenho tempo', 'Já tentei outras mentorias', 'É caro para mim agora'…"
                        value={form.objections} onChange={set("objections")} />
                    </Field>
                  </>
                )}

                {step === 3 && (
                  <>
                    <Field label="O que você já tem disponível?" optional hint="Logo, fotos profissionais, vídeo de apresentação, textos, depoimentos, prints de resultados...">
                      <textarea className={textareaCls}
                        placeholder="Ex.: Tenho logo no Canva, 3 fotos profissionais, 12 depoimentos em texto e 2 vídeos de clientes"
                        value={form.materials} onChange={set("materials")} />
                    </Field>
                    <Field label="Links do seu negócio" optional hint="Instagram, site atual, LinkedIn, Google Meu Negócio...">
                      <input type="text" className={inputCls}
                        placeholder="Ex.: instagram.com/seunome | linktr.ee/seunome"
                        value={form.brandLinks} onChange={set("brandLinks")} />
                    </Field>
                    <Field label="Onde essa página será usada?" required hint="De onde virá o tráfego para essa página?">
                      <input type="text" className={inputCls}
                        placeholder="Ex.: Meta Ads (Facebook/Instagram), link na bio, e-mail marketing, Google Ads"
                        value={form.pageLocation} onChange={set("pageLocation")} required />
                    </Field>
                  </>
                )}

                {step === 4 && (
                  <>
                    <Field label="Qual o prazo que você precisa?" required hint="Lembre que o prazo começa após o briefing aprovado.">
                      <input type="text" className={inputCls}
                        placeholder="Ex.: 72h (urgente), 1 semana, até dia 15"
                        value={form.deadline} onChange={set("deadline")} required />
                    </Field>
                    <Field label="Qual fonte de tráfego você vai usar?" required hint="Isso impacta no design e nas chamadas da página.">
                      <input type="text" className={inputCls}
                        placeholder="Ex.: Meta Ads (tráfego frio), Google Ads, WhatsApp (tráfego quente)"
                        value={form.traffic} onChange={set("traffic")} required />
                    </Field>
                    <Field label="Precisa integrar com alguma ferramenta?" optional hint="Para captar leads, disparar e-mails ou acionar automações.">
                      <input type="text" className={inputCls}
                        placeholder="Ex.: RD Station, Mailchimp, ActiveCampaign, WhatsApp Business API, sem integração"
                        value={form.integration} onChange={set("integration")} />
                    </Field>
                  </>
                )}

                {step === 5 && (
                  <>
                    <Field label="Seu nome completo" required>
                      <input type="text" className={inputCls}
                        placeholder="Como devo te chamar?"
                        value={form.name} onChange={set("name")} required />
                    </Field>
                    <Field label="Seu WhatsApp" required hint="Vou enviar a proposta por aqui.">
                      <input
                        type="tel"
                        required
                        placeholder="(27) 9 9999-9999"
                        value={form.whatsapp}
                        onChange={(e) => {
                          setForm((p) => ({ ...p, whatsapp: formatBrazilianPhone(e.target.value) }));
                          setWhatsappError("");
                        }}
                        onBlur={() => {
                          if (form.whatsapp.trim() && !isValidBrazilianPhone(form.whatsapp)) {
                            setWhatsappError("Número inválido. Use DDD + número. Ex.: (27) 9 9999-9999");
                          } else setWhatsappError("");
                        }}
                        className={`${inputCls} ${whatsappError ? "!border-red-500/60" : ""}`}
                      />
                      {whatsappError && <p className="text-xs text-red-400">{whatsappError}</p>}
                    </Field>
                    <Field label="Referências de páginas que você admira" optional hint="Links de landing pages, sites ou anúncios que você gosta do estilo.">
                      <textarea className={textareaCls}
                        placeholder="Ex.: buylist.com.br, empresa.com/pagina — o que te atrai nelas?"
                        value={form.references} onChange={set("references")} />
                    </Field>
                    <Field label="Restrições ou observações importantes" optional hint="O que evitar no design, copy ou estrutura? Alguma informação extra?">
                      <textarea className={textareaCls}
                        placeholder="Ex.: Não usar a cor azul, minha concorrente já usa. Quero um tom mais direto, sem enrolação."
                        value={form.restrictions} onChange={set("restrictions")} />
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
                  {step < 5 ? (
                    <button
                      type="button"
                      onClick={() => setStep(step + 1)}
                      disabled={!canAdvance()}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#22c55e] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#16a34a] disabled:opacity-40"
                    >
                      Próximo
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <Magnet padding={40} magnetStrength={2}>
                      <button
                        type="submit"
                        disabled={submitting || !canAdvance()}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#22c55e] px-6 py-3.5 text-sm font-semibold text-black shadow-[0_0_20px_rgba(34,197,94,0.25)] transition hover:bg-[#16a34a] disabled:opacity-40"
                      >
                        {submitting ? (
                          <>
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            Enviar briefing
                            <ArrowRight className="h-4 w-4" />
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

export default function BriefingPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-zinc-500">Carregando...</div>}>
      <BriefingContent />
    </Suspense>
  );
}
