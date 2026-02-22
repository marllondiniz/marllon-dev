"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
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
  Layers,
  Building2,
} from "lucide-react";
import CyberBackground from "@/app/components/CyberBackground";
import BlurText from "@/app/components/BlurText";
import Magnet from "@/app/components/Magnet";

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

const WHATSAPP_NUMBER = "5527992338038";

const PLANS = [
  {
    id: "express",
    icon: Zap,
    badge: "01",
    title: "Site Express 72h",
    subtitle: "1 página, entrega rápida",
    prazo: "Entrega em até 72h",
    inclui: [
      "Página completa com copy estratégico",
      "Design exclusivo e responsivo",
      "Rastreio (Pixel + GA4) configurado",
      "Formulário conectado ao seu CRM/e-mail",
      "Entrega em até 72h",
      "1 rodada de ajustes incluída",
      "Garantia de satisfação",
    ],
    price: "R$ 497",
    priceFrom: "R$ 997",
    featured: true,
    ctaHref: "/briefing",
    ctaLabel: "Quero começar agora",
  },
  {
    id: "start",
    icon: Layers,
    badge: "02",
    title: "Site Start",
    subtitle: "3 páginas, mini-site profissional",
    prazo: "Entrega em 10 a 15 dias úteis",
    inclui: [
      "3 páginas com design consistente",
      "Copy ajustada por página",
      "SEO básico (títulos, headings, indexação)",
      "Pixel + GA4",
      "2 rodadas de ajustes",
      "Vídeo de treinamento pra você editar depois",
    ],
    price: "R$ 1.297",
    priceFrom: "R$ 1.997",
    featured: false,
    ctaHref: `https://wa.me/${WHATSAPP_NUMBER}?text=Quero%20o%20Site%20Start%20(3%20p%C3%A1ginas)`,
    ctaLabel: "Quero esse plano",
  },
  {
    id: "pro",
    icon: Building2,
    badge: "03",
    title: "Empresa Pro",
    subtitle: "Até 8 páginas, institucional",
    prazo: "Entrega em 20 a 30 dias úteis",
    inclui: [
      "Até 8 páginas (expansível)",
      "Design corporate + identidade aplicada",
      "SEO on-page completo",
      "Performance e otimização mobile",
      "LGPD básico (banner + políticas)",
      "Integrações (CRM, RD/HubSpot, e-mail)",
      "3 rodadas de ajustes",
    ],
    price: "R$ 2.997",
    priceFrom: "R$ 4.997",
    featured: false,
    ctaHref: `https://wa.me/${WHATSAPP_NUMBER}?text=Quero%20o%20Empresa%20Pro`,
    ctaLabel: "Quero esse plano",
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
        <Star key={i} className="h-4 w-4 fill-[#22c55e] text-[#22c55e]" />
      ))}
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#111113] transition-all hover:border-[#22c55e]/30">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-6 py-5 text-left"
      >
        <span className="pr-4 font-semibold text-white">{q}</span>
        <ChevronDown
          className={`h-5 w-5 flex-shrink-0 text-[#22c55e] transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <p className="px-6 pb-5 text-sm leading-relaxed text-zinc-400">{a}</p>
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
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // Simula envio (em produção viria de uma API)
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 800);
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0a0a0b] font-sans text-white">
      {/* ─── HERO ─────────────────────────────────────────── */}
      <section className="relative flex min-h-[min(100vh,780px)] flex-col items-center justify-center overflow-hidden px-3 pt-12 pb-20 text-center sm:px-6 sm:pt-16 sm:pb-24 md:pt-20 md:pb-28">
        <CyberBackground />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(34,197,94,0.07),transparent)]" />
        <div className="pointer-events-none absolute inset-0 cyber-grid-bg opacity-20" />

        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-10 sm:gap-12 md:gap-14">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-3"
          >
            <span className="hex-badge flicker">CONVERSÃO://72H</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto max-w-4xl"
          >
            <BlurText
              text="Sua página vendendo todo dia, com identidade."
              as="h1"
              animateBy="words"
              delay={80}
              stepDuration={0.35}
              className="justify-center font-[family-name:var(--font-space)] text-3xl font-bold leading-[1.12] tracking-tight text-white sm:text-5xl md:text-6xl [&>span:nth-child(n+5)]:text-[#22c55e] [&>span:nth-child(n+5)]:cyber-text-glow"
            />
            <span className="mx-auto mt-2 block h-px w-48 bg-gradient-to-r from-transparent via-[#22c55e]/50 to-transparent" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative mx-auto max-w-xl text-base leading-relaxed text-zinc-400 sm:max-w-2xl sm:text-lg"
          >
            Copy estratégico, design com identidade e performance. Entrega em 72h, rastreio completo. Mesma proposta da sua página principal.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-4"
          >
            <Magnet padding={50} magnetStrength={2}>
              <Link
                href="/briefing"
                className="group inline-flex items-center gap-2 rounded-xl bg-[#22c55e] px-5 py-3.5 font-semibold text-black shadow-[0_0_24px_rgba(34,197,94,0.3)] transition hover:bg-[#16a34a] hover:shadow-[0_0_40px_rgba(34,197,94,0.5)] sm:rounded-2xl sm:px-6"
              >
                Quero minha página
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Magnet>
            <a
              href="#como-funciona"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 px-5 py-3.5 font-semibold text-zinc-400 transition hover:border-[#22c55e]/40 hover:text-white sm:rounded-2xl sm:px-6"
            >
              Como funciona
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-zinc-500 sm:gap-x-6"
          >
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4 text-[#22c55e]" />
              Sem taxa oculta
            </span>
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4 text-[#22c55e]" />
              Entrega garantida
            </span>
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4 text-[#22c55e]" />
              130+ projetos
            </span>
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-zinc-600">
          <span className="font-mono text-[10px] uppercase tracking-widest">scroll</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
            <ChevronDown className="h-5 w-5" />
          </motion.div>
        </div>
      </section>

      {/* ─── STATS BAR ─────────────────────────────────────── */}
      <section className="cyber-section border-t border-zinc-800/50 section-padding">
        <div className="section-container-wide mx-auto grid grid-cols-2 gap-8 sm:grid-cols-4">
          {STATS.map(({ value, label, icon: Icon }) => (
            <div key={label} className="flex flex-col items-center gap-2 text-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#22c55e]/20 bg-[#22c55e]/10">
                <Icon className="h-5 w-5 text-[#22c55e]" />
              </div>
              <span className="font-[family-name:var(--font-space)] text-3xl font-bold tracking-tight text-white">{value}</span>
              <span className="text-xs text-zinc-500 leading-snug">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── BENEFITS ──────────────────────────────────────── */}
      <section className="cyber-section border-t border-zinc-800/50 section-padding bg-[#0a0a0b]">
        <div className="section-container-wide">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mb-4 flex items-center gap-3"
          >
            <span className="hex-badge flicker">INCLUSO</span>
          </motion.div>
          <BlurText
            text="Tudo que sua página precisa para converter de verdade"
            as="h2"
            animateBy="words"
            delay={60}
            stepDuration={0.3}
            className="mb-4 font-[family-name:var(--font-space)] text-2xl font-bold text-white sm:text-3xl md:text-4xl [&>span:nth-child(n+6)]:text-[#22c55e]"
          />
          <p className="mb-12 max-w-xl text-zinc-500 text-sm">
            Não é template, não é IA sem direção. É estratégia real aplicada ao seu negócio.
          </p>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map(({ icon: Icon, title, desc, tag }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-[#111113] p-6 transition-all hover:border-[#22c55e]/40 hover:shadow-[0_0_24px_rgba(34,197,94,0.08)]"
              >
                <div className="absolute right-4 top-4 rounded-full border border-[#22c55e]/30 bg-[#22c55e]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#22c55e]">
                  {tag}
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#22c55e]/20 bg-[#22c55e]/10">
                  <Icon className="h-6 w-6 text-[#22c55e]" />
                </div>
                <h3 className="mt-4 font-[family-name:var(--font-space)] text-lg font-bold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ──────────────────────────────────── */}
      <section className="cyber-section relative border-t border-zinc-800/50 section-padding">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(34,197,94,0.04),transparent)]" />
        <div className="section-container-wide relative">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mb-4 flex items-center gap-3"
          >
            <span className="hex-badge flicker">RESULTADOS</span>
          </motion.div>
          <h2 className="mb-12 font-[family-name:var(--font-space)] text-2xl font-bold text-white sm:text-3xl md:text-4xl">
            Quem usou, <span className="text-[#22c55e]">voltou.</span>
          </h2>

          <div className="grid gap-6 sm:grid-cols-3">
            {TESTIMONIALS.map(({ name, role, rating, text, avatar, color }) => (
              <div
                key={name}
                className="flex flex-col justify-between rounded-2xl border border-zinc-800 bg-[#111113] p-6 transition-colors hover:border-[#22c55e]/30"
              >
                <div>
                  <StarRating count={rating} />
                  <p className="mt-4 text-sm leading-relaxed text-zinc-400">&ldquo;{text}&rdquo;</p>
                </div>
                <div className="mt-6 flex items-center gap-3 border-t border-zinc-800 pt-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${color} text-xs font-bold text-white`}
                  >
                    {avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{name}</p>
                    <p className="text-xs text-zinc-500">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── COMO FUNCIONA ─────────────────────────────────── */}
      <section id="como-funciona" className="cyber-section border-t border-zinc-800/50 section-padding bg-[#0a0a0b]">
        <div className="section-container max-w-3xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mb-4 flex items-center gap-3"
          >
            <span className="hex-badge flicker">PROCESSO</span>
          </motion.div>
          <h2 className="mb-12 font-[family-name:var(--font-space)] text-2xl font-bold text-white sm:text-3xl md:text-4xl">
            Da ideia à página em <span className="text-[#22c55e]">3 passos</span>
          </h2>

          <div className="relative space-y-4">
            <div className="absolute left-7 top-12 h-[calc(100%-6rem)] w-px bg-gradient-to-b from-[#22c55e]/40 via-[#22c55e]/20 to-transparent" />

            {STEPS.map(({ num, title, desc }) => (
              <div key={num} className="relative flex gap-6">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border border-[#22c55e]/40 bg-[#22c55e]/10 font-mono text-sm font-bold text-[#22c55e]">
                  {num}
                </div>
                <div className="flex-1 rounded-2xl border border-zinc-800 bg-[#111113] p-5">
                  <h3 className="font-[family-name:var(--font-space)] font-bold text-white">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-zinc-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PLANOS ─────────────────────────────────────────── */}
      <section id="planos" className="cyber-section border-t border-zinc-800/50 section-padding bg-[#0a0a0b]">
        <div className="section-container-wide">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mb-4 flex items-center gap-3"
          >
            <span className="hex-badge flicker">PLANOS</span>
          </motion.div>
          <BlurText
            text="Escolha o que cabe no seu momento"
            as="h2"
            animateBy="words"
            delay={60}
            stepDuration={0.3}
            className="mb-2 font-[family-name:var(--font-space)] text-2xl font-bold text-white sm:text-3xl md:text-4xl [&>span:last-child]:text-[#22c55e]"
          />
          <p className="mb-12 max-w-xl text-sm text-zinc-500">
            Entrega com identidade, não com cara de template. Pagamento único — sem mensalidade.
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            {PLANS.map((plan, i) => {
              const Icon = plan.icon;
              const isLink = plan.ctaHref.startsWith("/");
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative flex flex-col overflow-hidden rounded-2xl border bg-[#111113] p-6 transition-all sm:p-8 ${
                    plan.featured
                      ? "border-[#22c55e]/40 shadow-[0_0_28px_rgba(34,197,94,0.08)] hover:border-[#22c55e]/60 md:-mt-2 md:pt-10"
                      : "border-zinc-800 hover:border-[#22c55e]/30"
                  }`}
                >
                  {plan.featured && (
                    <span className="absolute top-4 left-1/2 -translate-x-1/2 rounded-full border border-[#22c55e]/40 bg-[#0a0a0b] px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-[#22c55e]">
                      mais escolhido
                    </span>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#22c55e]/20 bg-[#22c55e]/10">
                      <Icon className="h-5 w-5 text-[#22c55e]" />
                    </div>
                    <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-wider">{plan.badge}</span>
                  </div>
                  <h3 className="mt-4 font-[family-name:var(--font-space)] text-xl font-bold text-white">
                    {plan.title}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-500">{plan.subtitle}</p>
                  <p className="mt-2 font-mono text-xs text-[#22c55e]/90">{plan.prazo}</p>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="font-[family-name:var(--font-space)] text-2xl font-bold text-[#22c55e]">
                      {plan.price}
                    </span>
                    <span className="text-sm text-zinc-500 line-through">{plan.priceFrom}</span>
                  </div>
                  <p className="mt-1 text-xs text-zinc-600">Pagamento único — sem mensalidade</p>
                  <ul className="mt-6 flex-1 space-y-2">
                    {plan.inclui.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-zinc-400">
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#22c55e]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  {isLink ? (
                    <Link
                      href={plan.ctaHref}
                      className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#22c55e] py-3.5 font-semibold text-black shadow-[0_0_20px_rgba(34,197,94,0.25)] transition hover:bg-[#16a34a] hover:shadow-[0_0_32px_rgba(34,197,94,0.4)]"
                    >
                      {plan.ctaLabel}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  ) : (
                    <a
                      href={plan.ctaHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-700 py-3.5 font-semibold text-zinc-300 transition hover:border-[#22c55e]/50 hover:text-white"
                    >
                      {plan.ctaLabel}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </a>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── FAQ ───────────────────────────────────────────── */}
      <section className="cyber-section border-t border-zinc-800/50 section-padding bg-[#0a0a0b]">
        <div className="section-container max-w-2xl">
          <h2 className="font-[family-name:var(--font-space)] text-2xl font-bold text-white sm:text-3xl">
            Dúvidas frequentes
          </h2>
          <p className="mt-4 text-sm text-zinc-500">
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
      <section id="cta" className="cyber-section relative border-t border-zinc-800/50 section-padding">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(34,197,94,0.05),transparent)]" />
        <div className="section-container relative max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 flex items-center justify-center gap-3"
          >
            <span className="hex-badge flicker">CONTATO</span>
          </motion.div>
          <h2 className="text-center font-[family-name:var(--font-space)] text-2xl font-bold text-white sm:text-3xl md:text-4xl">
            Sua página pronta em <span className="text-[#22c55e]">72 horas</span>
          </h2>
          <p className="mx-auto mt-4 text-center text-sm text-zinc-500">
            Preencha o formulário e entrarei em contato em até 2h para alinharmos o briefing.
          </p>

          <div className="mt-10 overflow-hidden rounded-2xl border border-zinc-800 bg-[#111113] shadow-[0_0_0_1px_rgba(34,197,94,0.06)]">
            <div className="border-b border-zinc-800/80 bg-[#0d0d0f]/80 px-6 py-4 sm:px-8">
              <p className="flex items-center gap-2 font-mono text-xs text-zinc-500">
                <MessageCircle className="h-4 w-4 text-[#22c55e]/70" aria-hidden />
                Preencha os campos abaixo — resposta em até 2h.
              </p>
            </div>
            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35 }}
                className="flex flex-col items-center gap-5 px-8 py-16 text-center sm:px-12"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#22c55e]/40 bg-[#22c55e]/10">
                  <Check className="h-10 w-10 text-[#22c55e]" aria-hidden />
                </div>
                <h3 className="font-[family-name:var(--font-space)] text-2xl font-bold text-white">
                  Mensagem recebida!
                </h3>
                <p className="max-w-sm text-sm leading-relaxed text-zinc-500">
                  Entrarei em contato em até 2h no WhatsApp ou e-mail que você informou.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 sm:p-8" noValidate>
                <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="demo-name" className="block font-mono text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Nome <span className="text-[#22c55e]">*</span>
                    </label>
                    <input
                      id="demo-name"
                      required
                      type="text"
                      placeholder="Seu nome completo"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full rounded-xl border border-zinc-700 bg-[#0a0a0b] px-4 py-3.5 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-[#22c55e]/50 focus:ring-2 focus:ring-[#22c55e]/20"
                      autoComplete="name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="demo-whatsapp" className="block font-mono text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      WhatsApp <span className="text-[#22c55e]">*</span>
                    </label>
                    <input
                      id="demo-whatsapp"
                      required
                      type="tel"
                      placeholder="(27) 9 9999-9999"
                      value={form.whatsapp}
                      onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                      className="w-full rounded-xl border border-zinc-700 bg-[#0a0a0b] px-4 py-3.5 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-[#22c55e]/50 focus:ring-2 focus:ring-[#22c55e]/20"
                      autoComplete="tel"
                    />
                    <p className="font-mono text-[11px] text-zinc-600">Com DDD. Ex.: (27) 9 9999-9999</p>
                  </div>
                </div>
                <div className="mt-5 space-y-2 sm:mt-6">
                  <label htmlFor="demo-email" className="block font-mono text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    E-mail <span className="text-[#22c55e]">*</span>
                  </label>
                  <input
                    id="demo-email"
                    required
                    type="email"
                    placeholder="seu@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-xl border border-zinc-700 bg-[#0a0a0b] px-4 py-3.5 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-[#22c55e]/50 focus:ring-2 focus:ring-[#22c55e]/20"
                    autoComplete="email"
                  />
                </div>
                <div className="mt-5 space-y-2 sm:mt-6">
                  <label htmlFor="demo-goal" className="block font-mono text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    O que você quer vender ou promover? <span className="text-[#22c55e]">*</span>
                  </label>
                  <textarea
                    id="demo-goal"
                    required
                    rows={4}
                    placeholder="Ex.: Curso de marketing digital para PMEs, consultoria de vendas, e-commerce de moda..."
                    value={form.goal}
                    onChange={(e) => setForm({ ...form, goal: e.target.value })}
                    className="w-full resize-y min-h-[100px] rounded-xl border border-zinc-700 bg-[#0a0a0b] px-4 py-3.5 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-[#22c55e]/50 focus:ring-2 focus:ring-[#22c55e]/20"
                  />
                </div>
                <div className="mt-8">
                  <button
                    type="submit"
                    disabled={loading}
                    className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#22c55e] py-4 font-semibold text-black shadow-[0_0_24px_rgba(34,197,94,0.25)] transition hover:bg-[#16a34a] hover:shadow-[0_0_40px_rgba(34,197,94,0.4)] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-[#22c55e]"
                  >
                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" aria-hidden />
                        Enviando...
                      </>
                    ) : (
                      <>
                        Quero minha página agora
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </div>
                <p className="mt-4 text-center font-mono text-[11px] text-zinc-600">
                  Sem spam. Entro em contato só para alinhar o projeto.
                </p>
              </form>
            )}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 font-mono text-xs text-zinc-600">
            <span className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-[#22c55e]/70" /> Dados seguros
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-[#22c55e]/70" /> Sem compromisso
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-[#22c55e]/70" /> Resposta em até 2h
            </span>
          </div>
        </div>
      </section>

      {/* ─── FOOTER (identidade da página principal) ───────── */}
      <footer className="border-t border-zinc-800 py-8 text-center text-sm text-zinc-500" role="contentinfo">
        <div className="mx-auto max-w-5xl px-6">
          <p className="font-medium text-zinc-400">
            Marllon Diniz · zinid.tech
          </p>
          <nav className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1" aria-label="Serviços e contato">
            <Link
              href="/site-72h"
              className="inline-flex items-center gap-1.5 text-[#22c55e] hover:text-[#22c55e]/80 font-medium"
            >
              <ArrowRight className="h-4 w-4" aria-hidden />
              Seu site pronto em 72h
            </Link>
            <Link
              href="/briefing"
              className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white"
            >
              Briefing rápido
            </Link>
          </nav>
          <p className="mt-3 text-[#22c55e]/90 font-medium text-sm">
            Início de um futuro próspero
          </p>
          <p className="mt-2 text-zinc-500">
            <small>© {new Date().getFullYear()} Marllon Diniz · zinid.tech</small>
          </p>
        </div>
      </footer>
    </main>
  );
}
