"use client";

import { useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Star,
  Zap,
  Target,
  BarChart3,
  Shield,
  Clock,
  MessageCircle,
  Smartphone,
  TrendingUp,
  Users,
  Award,
} from "lucide-react";

/* ────────────────────────────────────────────────────────── */
/*  Dados                                                      */
/* ────────────────────────────────────────────────────────── */

const STATS = [
  { value: "11%", label: "Taxa de conversão média", icon: TrendingUp },
  { value: "72h", label: "Prazo de entrega", icon: Clock },
  { value: "130+", label: "Páginas entregues", icon: Award },
  { value: "97%", label: "Clientes satisfeitos", icon: Users },
];

const BENEFITS = [
  {
    icon: Target,
    title: "Copy que converte",
    desc: "Texto pensado para o seu público específico — não um template genérico. Cada palavra tem uma função.",
    tag: "Alto impacto",
  },
  {
    icon: Smartphone,
    title: "Mobile-first real",
    desc: "Mais de 80% do tráfego é mobile. Sua página carrega em < 2s e converte em qualquer tela.",
    tag: "Performance",
  },
  {
    icon: BarChart3,
    title: "Rastreio completo",
    desc: "Pixel, GA4, eventos customizados e painel de conversão. Você vê cada clique e escala com dados.",
    tag: "Dados",
  },
  {
    icon: Zap,
    title: "Entrega em 72h",
    desc: "Do briefing à página no ar em 3 dias. Sem fila, sem espera de semanas, sem surpresas.",
    tag: "Velocidade",
  },
  {
    icon: Shield,
    title: "Garantia real",
    desc: "Se não ficar satisfeito com a primeira versão, fazemos quantas rodadas precisar até acertar.",
    tag: "Garantia",
  },
  {
    icon: MessageCircle,
    title: "Suporte direto",
    desc: "Canal direto via WhatsApp durante e após a entrega. Sem ticketing, sem burocracia.",
    tag: "Suporte",
  },
];

const TESTIMONIALS = [
  {
    name: "Rafael M.",
    role: "Fundador — Agência digital",
    rating: 5,
    text: "Nossa landing anterior convertia 1,2%. Com a nova, fomos para 9,8% em 3 semanas. O processo foi simples, rápido e entregou muito além do que esperávamos.",
    avatar: "RM",
    color: "from-orange-400 to-rose-500",
  },
  {
    name: "Carla B.",
    role: "Coach de carreira",
    rating: 5,
    text: "Precisava lançar meu programa em menos de uma semana. Em 72h tinha a página no ar, bonita, rápida e já conectada ao meu CRM. Incrível.",
    avatar: "CB",
    color: "from-violet-400 to-purple-600",
  },
  {
    name: "Diego S.",
    role: "Gestor de tráfego",
    rating: 5,
    text: "Indico para todos os meus clientes. Estrutura de conversão impecável, carregamento rápido e a copy faz o trabalho pesado. ROI visível desde o primeiro dia.",
    avatar: "DS",
    color: "from-emerald-400 to-teal-600",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Briefing em 15 min",
    desc: "Uma conversa rápida para entender seu produto, público-alvo, objeções e objetivo principal da página.",
  },
  {
    num: "02",
    title: "Produção em 48h",
    desc: "Copy, design, desenvolvimento e integrações. Você recebe atualizações e pode acompanhar o progresso.",
  },
  {
    num: "03",
    title: "Entrega e ajustes",
    desc: "Página no ar com uma rodada de ajustes incluída. Você aprova e começa a receber leads.",
  },
];

const FAQS = [
  {
    q: "Quanto tempo leva para ter minha página pronta?",
    a: "O prazo padrão é de até 72 horas após o briefing. Em casos urgentes, temos opção de entrega acelerada em 24h.",
  },
  {
    q: "Preciso ter texto ou design pronto?",
    a: "Não. Fazemos o copy e o design do zero com base no seu negócio. Se você já tiver algum material, usamos como referência.",
  },
  {
    q: "Funciona para qualquer nicho?",
    a: "Sim. Já entregamos páginas para infoprodutos, serviços B2B, e-commerce, cursos, consultorias e muito mais.",
  },
  {
    q: "E se eu não gostar do resultado?",
    a: "Incluímos ajustes ilimitados até a aprovação. Você só paga quando estiver 100% satisfeito com o resultado.",
  },
  {
    q: "Tenho domínio e hospedagem. Vocês sobem a página?",
    a: "Sim. Fazemos o deploy no seu servidor, Vercel, Netlify ou onde preferir, sem custo adicional.",
  },
];

/* ────────────────────────────────────────────────────────── */
/*  Componentes internos                                       */
/* ────────────────────────────────────────────────────────── */

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-6 py-5 text-left"
      >
        <span className="pr-4 font-semibold text-white">{q}</span>
        <ChevronDown
          className={`h-5 w-5 flex-shrink-0 text-amber-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <p className="px-6 pb-5 text-sm leading-relaxed text-white/70">{a}</p>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Página                                                     */
/* ────────────────────────────────────────────────────────── */

export default function DemoAltaConversaoPage() {
  const [form, setForm] = useState({ name: "", whatsapp: "", email: "", goal: "" });
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#09090b] font-sans text-white">
      {/* ─── HERO ─────────────────────────────────────────── */}
      <section className="relative flex min-h-[min(100vh,780px)] flex-col items-center justify-center overflow-hidden px-3 py-20 text-center sm:px-6 sm:py-24 md:py-28">
        {/* Gradients de fundo */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[420px] w-[800px] -translate-x-1/2 rounded-full bg-amber-500/12 blur-[100px] sm:h-[500px] sm:w-[900px] sm:blur-[120px]" />
          <div className="absolute bottom-0 left-0 h-[280px] w-[400px] rounded-full bg-orange-600/10 blur-[80px]" />
          <div className="absolute bottom-0 right-0 h-[280px] w-[400px] rounded-full bg-amber-400/8 blur-[80px]" />
        </div>

        {/* Container com mais distância entre os blocos */}
        <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-10 sm:gap-12 md:gap-14">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/15 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-amber-300 sm:text-xs">
            <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
            Alta conversão · Entrega em 72h
          </div>

          {/* Headline */}
          <h1 className="relative text-[2.25rem] font-extrabold leading-[1.12] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[3.5rem]">
            Sua página vendendo{" "}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-amber-300 via-orange-300 to-amber-200 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                todo dia
              </span>
              <svg
                viewBox="0 0 260 10"
                className="absolute -bottom-0.5 left-0 w-full max-w-[260px] sm:max-w-none"
                aria-hidden="true"
              >
                <path
                  d="M2 8 Q65 2 130 6 Q195 10 258 4"
                  stroke="url(#hero-underline)"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="hero-underline" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#fcd34d" />
                    <stop offset="100%" stopColor="#fb923c" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
            , enquanto você foca no negócio.
          </h1>

          {/* Subheadline */}
          <p className="relative mx-auto max-w-xl text-base leading-relaxed text-white/80 sm:max-w-2xl sm:text-lg md:text-xl">
            Landing com identidade, copy estratégico e performance. Entrega em 72h, rastreio completo.
          </p>

          {/* CTAs — sempre lado a lado (flex-row), compactos no iframe para caberem */}
          <div className="relative flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <a
              href="#cta"
              className="group inline-flex flex-shrink-0 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3 text-sm font-bold text-white shadow-[0_0_24px_rgba(245,158,11,0.35)] transition-all hover:shadow-[0_0_40px_rgba(245,158,11,0.5)] hover:scale-[1.02] sm:rounded-2xl sm:px-6 sm:py-3.5 sm:text-base sm:gap-2"
            >
              Quero minha página
              <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#como-funciona"
              className="inline-flex flex-shrink-0 items-center justify-center rounded-xl border border-zinc-600/70 bg-white/5 px-4 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-amber-500/40 hover:bg-amber-500/10 hover:text-white sm:rounded-2xl sm:px-6 sm:py-3.5 sm:text-base"
            >
              Como funciona
            </a>
          </div>

          {/* Mini prova social */}
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-white/70 sm:gap-x-6">
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4 text-amber-400" />
              Sem taxa oculta
            </span>
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4 text-amber-400" />
              Entrega garantida
            </span>
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4 text-amber-400" />
              130+ projetos
            </span>
          </div>
        </div>

        {/* Scroll hint — só em telas maiores */}
        <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 animate-bounce text-white/25 md:block">
          <ChevronDown className="h-6 w-6" />
        </div>
      </section>

      {/* ─── STATS BAR ─────────────────────────────────────── */}
      <section className="border-y border-white/8 bg-white/[0.03] px-6 py-10">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 sm:grid-cols-4">
          {STATS.map(({ value, label, icon: Icon }) => (
            <div key={label} className="flex flex-col items-center gap-2 text-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/15">
                <Icon className="h-5 w-5 text-amber-400" />
              </div>
              <span className="text-3xl font-extrabold tracking-tight text-white">{value}</span>
              <span className="text-xs text-white/50 leading-snug">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── BENEFITS ──────────────────────────────────────── */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-4 text-center">
            <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-amber-400">
              O que está incluso
            </span>
          </div>
          <h2 className="mx-auto max-w-2xl text-center text-3xl font-extrabold tracking-tight sm:text-4xl">
            Tudo que sua página precisa para{" "}
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              converter de verdade
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-white/50">
            Não é template, não é IA sem direção. É estratégia real aplicada ao seu negócio.
          </p>

          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map(({ icon: Icon, title, desc, tag }) => (
              <div
                key={title}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm transition-all hover:border-amber-500/30 hover:bg-white/[0.07]"
              >
                <div className="absolute right-4 top-4 rounded-full bg-amber-500/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  {tag}
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10">
                  <Icon className="h-6 w-6 text-amber-400" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ──────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 py-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/5 blur-[100px]" />
        </div>
        <div className="relative mx-auto max-w-6xl">
          <div className="mb-4 text-center">
            <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-amber-400">
              Resultados reais
            </span>
          </div>
          <h2 className="text-center text-3xl font-extrabold tracking-tight sm:text-4xl">
            Quem usou,{" "}
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              voltou.
            </span>
          </h2>

          <div className="mt-16 grid gap-6 sm:grid-cols-3">
            {TESTIMONIALS.map(({ name, role, rating, text, avatar, color }) => (
              <div
                key={name}
                className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm"
              >
                <div>
                  <StarRating count={rating} />
                  <p className="mt-4 text-sm leading-relaxed text-white/75">&ldquo;{text}&rdquo;</p>
                </div>
                <div className="mt-6 flex items-center gap-3 border-t border-white/8 pt-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${color} text-xs font-bold text-white`}
                  >
                    {avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{name}</p>
                    <p className="text-xs text-white/45">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── COMO FUNCIONA ─────────────────────────────────── */}
      <section id="como-funciona" className="px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <div className="mb-4 text-center">
            <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-amber-400">
              Processo
            </span>
          </div>
          <h2 className="text-center text-3xl font-extrabold tracking-tight sm:text-4xl">
            Da ideia à página em{" "}
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              3 passos
            </span>
          </h2>

          <div className="relative mt-16 space-y-4">
            {/* Linha vertical */}
            <div className="absolute left-7 top-12 h-[calc(100%-6rem)] w-px bg-gradient-to-b from-amber-500/40 via-amber-500/20 to-transparent" />

            {STEPS.map(({ num, title, desc }) => (
              <div key={num} className="relative flex gap-6">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border border-amber-500/40 bg-gradient-to-br from-amber-500/20 to-orange-500/10 font-mono text-sm font-bold text-amber-400">
                  {num}
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5 flex-1">
                  <h3 className="font-bold text-white">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/55">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── OFFER CARD ────────────────────────────────────── */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <div className="relative overflow-hidden rounded-3xl border border-amber-500/25 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent p-8 sm:p-10">
            <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-amber-400/10 blur-[80px]" />
            <div className="relative">
              <span className="rounded-full border border-amber-500/40 bg-amber-500/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-400">
                Landing Express
              </span>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-5xl font-extrabold text-white">R$ 497</span>
                <span className="text-white/40 line-through">R$ 897</span>
              </div>
              <p className="mt-1 text-sm text-white/50">Pagamento único — sem mensalidade</p>
              <ul className="mt-6 space-y-3">
                {[
                  "Página completa com copy estratégico",
                  "Design exclusivo e responsivo",
                  "Rastreio (Pixel + GA4) configurado",
                  "Formulário conectado ao seu CRM/e-mail",
                  "Entrega em até 72h",
                  "1 rodada de ajustes incluída",
                  "Garantia de satisfação",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-white/75">
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-amber-500/20">
                      <Check className="h-3 w-3 text-amber-400" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="#cta"
                className="group mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 py-4 font-bold text-white shadow-[0_0_40px_rgba(245,158,11,0.3)] transition-all hover:shadow-[0_0_60px_rgba(245,158,11,0.5)] hover:scale-[1.02]"
              >
                Quero começar agora
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ ───────────────────────────────────────────── */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-center text-3xl font-extrabold tracking-tight sm:text-4xl">
            Dúvidas frequentes
          </h2>
          <p className="mx-auto mt-4 text-center text-sm text-white/45">
            Não encontrou? Fale direto pelo formulário abaixo.
          </p>
          <div className="mt-10 space-y-3">
            {FAQS.map((f) => (
              <FaqItem key={f.q} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA + FORM ────────────────────────────────────── */}
      <section id="cta" className="relative overflow-hidden px-6 py-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-amber-500/8 blur-[100px]" />
        </div>
        <div className="relative mx-auto max-w-xl">
          <div className="mb-4 text-center">
            <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-amber-400">
              Começar agora
            </span>
          </div>
          <h2 className="text-center text-3xl font-extrabold tracking-tight sm:text-4xl">
            Sua página pronta em{" "}
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              72 horas
            </span>
          </h2>
          <p className="mx-auto mt-4 text-center text-sm text-white/50">
            Preencha o formulário e entrarei em contato em até 2h para alinharmos o briefing.
          </p>

          <div className="mt-10 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-sm">
            {sent ? (
              <div className="flex flex-col items-center gap-4 px-8 py-16 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20">
                  <Check className="h-8 w-8 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Mensagem recebida!</h3>
                <p className="text-sm text-white/55">
                  Entrarei em contato em até 2h no WhatsApp ou e-mail que você informou.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 p-8">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-white/50">
                    Seu nome
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="João Silva"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-white/50">
                    WhatsApp
                  </label>
                  <input
                    required
                    type="tel"
                    placeholder="(11) 9 1234-5678"
                    value={form.whatsapp}
                    onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-white/50">
                    E-mail
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="voce@empresa.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-white/50">
                    O que você quer vender / promover?
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Ex.: Curso de marketing digital para PMEs..."
                    value={form.goal}
                    onChange={(e) => setForm({ ...form, goal: e.target.value })}
                    className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30"
                  />
                </div>
                <button
                  type="submit"
                  className="group mt-2 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 py-4 font-bold text-white shadow-[0_0_40px_rgba(245,158,11,0.25)] transition-all hover:shadow-[0_0_60px_rgba(245,158,11,0.45)] hover:scale-[1.02]"
                >
                  Quero minha página agora
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
                <p className="text-center text-[11px] text-white/30">
                  Sem spam. Entro em contato só para alinhar o projeto.
                </p>
              </form>
            )}
          </div>

          {/* Trust badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-white/35">
            <span className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-amber-500/70" /> Dados seguros
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-amber-500/70" /> Sem compromisso
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-amber-500/70" /> Resposta em até 2h
            </span>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ────────────────────────────────────────── */}
      <footer className="border-t border-white/8 px-6 py-8 text-center text-xs text-white/25">
        © {new Date().getFullYear()} zinid.tech — Todos os direitos reservados.
      </footer>
    </main>
  );
}
