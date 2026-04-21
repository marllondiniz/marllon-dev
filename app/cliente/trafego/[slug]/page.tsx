"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Lock,
  RefreshCw,
  MousePointerClick,
  Eye,
  Wallet,
  Target,
  MessageCircle,
  Link2,
  Coins,
} from "lucide-react";
import { MetaTrafficHierarchy } from "@/app/components/MetaTrafficHierarchy";
import { MetaTrafficExportToolbar } from "@/app/components/MetaTrafficExportToolbar";
import {
  downloadMetaTrafficMarkdown,
  downloadMetaTrafficPdf,
  type MetaTrafficExportInput,
} from "@/lib/export-meta-traffic-report";

type AccountTotals = {
  accountName: string;
  impressions: number;
  clicks: number;
  spend: number;
  reach: number;
  frequency: number;
  cpp: number;
  inlineLinkClicks: number;
  costPerInlineLinkClick: number;
  messagingConversationsStarted: number;
  leads: number;
  qualifiedLeads: number;
  ctr: number;
  cpc: number;
  cpm: number;
};

type CampaignRow = {
  campaignId: string;
  campaignName: string;
  impressions: number;
  clicks: number;
  spend: number;
  frequency: number;
  cpp: number;
  inlineLinkClicks: number;
  costPerInlineLinkClick: number;
  messagingConversationsStarted: number;
  leads: number;
  qualifiedLeads: number;
  cpm: number;
  ctr: number;
  cpc: number;
};

type AdSetRow = {
  adSetId: string;
  adSetName: string;
  campaignId: string;
  campaignName: string;
  impressions: number;
  clicks: number;
  spend: number;
  frequency: number;
  cpp: number;
  inlineLinkClicks: number;
  costPerInlineLinkClick: number;
  messagingConversationsStarted: number;
  leads: number;
  qualifiedLeads: number;
  cpm: number;
  ctr: number;
  cpc: number;
};

type AdRow = {
  adId: string;
  adName: string;
  adSetId: string;
  adSetName: string;
  campaignName: string;
  impressions: number;
  clicks: number;
  spend: number;
  frequency: number;
  cpp: number;
  inlineLinkClicks: number;
  costPerInlineLinkClick: number;
  messagingConversationsStarted: number;
  leads: number;
  qualifiedLeads: number;
  cpm: number;
  ctr: number;
  cpc: number;
};

type ApiPayload = {
  role: string;
  label?: string;
  preset: string;
  adAccountId: string;
  timeRange?: { since: string; until: string };
  account: AccountTotals | null;
  campaigns: CampaignRow[];
  adsets?: AdSetRow[];
  ads?: AdRow[];
  warnings?: string[];
  hint?: string;
};

const PRESETS: { id: string; label: string }[] = [
  { id: "last_7d", label: "Últimos 7 dias" },
  { id: "last_14d", label: "Últimos 14 dias" },
  { id: "last_30d", label: "Últimos 30 dias" },
  { id: "last_90d", label: "Últimos 90 dias" },
  { id: "this_month", label: "Este mês" },
  { id: "last_month", label: "Mês passado" },
  { id: "last_37_months", label: "Histórico longo (~37 meses Meta)" },
];

function brl(n: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);
}

function fmtInt(n: number) {
  return new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 }).format(n);
}

function pct(n: number) {
  return `${n.toFixed(2)}%`;
}

export default function ClienteTrafegoPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";

  const [clientSecret, setClientSecret] = useState("");
  const [sessionOk, setSessionOk] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState("");
  const [errorHint, setErrorHint] = useState("");
  const [data, setData] = useState<ApiPayload | null>(null);
  const [preset, setPreset] = useState("last_30d");

  const fetchData = useCallback(
    async (secret: string, p: string) => {
      setLoadingData(true);
      setError("");
      setErrorHint("");
      try {
        const url = new URL("/api/meta-insights", window.location.origin);
        url.searchParams.set("preset", p);
        const res = await fetch(url.toString(), {
          headers: {
            "x-trafego-slug": slug,
            "x-trafego-secret": secret,
          },
        });
        const json = (await res.json()) as ApiPayload & { error?: string; hint?: string };
        if (res.status === 401) {
          setSessionOk(false);
          setError("Senha incorreta.");
          setData(null);
          return;
        }
        if (!res.ok) {
          setError(json.error || "Erro ao carregar métricas.");
          setErrorHint(json.hint || "");
          setData(null);
          return;
        }
        setData(json);
      } catch {
        setError("Falha na rede.");
        setData(null);
      } finally {
        setLoadingData(false);
      }
    },
    [slug]
  );

  useEffect(() => {
    if (sessionOk && clientSecret) fetchData(clientSecret, preset);
  }, [sessionOk, preset, clientSecret, fetchData]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!clientSecret.trim()) return;
    setLoading(true);
    setError("");
    setErrorHint("");
    try {
      const url = new URL("/api/meta-insights", window.location.origin);
      url.searchParams.set("preset", preset);
      const res = await fetch(url.toString(), {
        headers: {
          "x-trafego-slug": slug,
          "x-trafego-secret": clientSecret.trim(),
        },
      });
      if (res.status === 401) {
        setError("Senha incorreta.");
        return;
      }
      const json = (await res.json()) as ApiPayload & { error?: string; hint?: string };
      if (!res.ok) {
        setError(json.error || "Erro ao acessar.");
        setErrorHint(json.hint || "");
        return;
      }
      setData(json);
      setSessionOk(true);
    } finally {
      setLoading(false);
    }
  }

  const a = data?.account;

  function buildExportPayload(): MetaTrafficExportInput | null {
    if (!data) return null;
    const presetLabel = PRESETS.find((p) => p.id === data.preset)?.label ?? data.preset;
    const reportTitle = data.label?.trim()
      ? `Métricas · ${data.label}`
      : "Métricas Meta Ads";
    return {
      reportTitle,
      adAccountId: data.adAccountId,
      presetLabel,
      presetId: data.preset,
      timeRange: data.timeRange,
      account: data.account,
      campaigns: data.campaigns ?? [],
      adsets: data.adsets ?? [],
      ads: data.ads ?? [],
      warnings: data.warnings,
    };
  }

  if (!slug) {
    return (
      <main className="min-h-screen bg-zinc-950 p-6 text-white">
        <p className="text-sm text-zinc-500">Link inválido.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        {sessionOk ? (
          <>
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end lg:justify-between">
              <div className="w-full max-w-xs">
                <label htmlFor="preset-client" className="mb-1 block text-xs text-zinc-500">
                  Período
                </label>
                <select
                  id="preset-client"
                  value={preset}
                  onChange={(e) => setPreset(e.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white"
                >
                  {PRESETS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => clientSecret && fetchData(clientSecret, preset)}
                  disabled={loadingData}
                  className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-white disabled:opacity-50"
                  title="Atualizar"
                >
                  <RefreshCw className={`inline h-3.5 w-3.5 ${loadingData ? "animate-spin" : ""}`} />
                </button>
                <Link
                  href="/"
                  className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-white"
                >
                  ← Site
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setSessionOk(false);
                    setClientSecret("");
                    setData(null);
                  }}
                  className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 hover:border-red-500/40 hover:text-red-400"
                >
                  Sair
                </button>
                <MetaTrafficExportToolbar
                  align="start"
                  disabled={!data}
                  onMarkdown={() => {
                    const p = buildExportPayload();
                    if (p) downloadMetaTrafficMarkdown(p);
                  }}
                  onPdf={() => {
                    const p = buildExportPayload();
                    if (p) downloadMetaTrafficPdf(p);
                  }}
                />
              </div>
            </div>

            {error && (
              <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {error}
              </div>
            )}
            {errorHint && (
              <div className="mb-4 whitespace-pre-wrap rounded-lg border border-zinc-600 bg-zinc-900/80 px-3 py-3 text-xs leading-relaxed text-zinc-300">
                {errorHint}
              </div>
            )}

            {loadingData && !a ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/50 py-16">
                <RefreshCw className="mb-2 h-8 w-8 animate-spin text-emerald-400" />
                <p className="text-sm text-zinc-500">Carregando…</p>
              </div>
            ) : a ? (
              <>
                <p className="mb-4 text-sm text-zinc-400">{a.accountName}</p>
                <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {[
                    { icon: Eye, label: "Impressões", value: fmtInt(a.impressions) },
                    { icon: MousePointerClick, label: "Cliques (todos)", value: fmtInt(a.clicks) },
                    { icon: Wallet, label: "Investimento", value: brl(a.spend) },
                    { icon: Target, label: "Alcance", value: fmtInt(a.reach) },
                    {
                      icon: Coins,
                      label: "CPP (custo / mil alcance)",
                      value: brl(a.cpp),
                      title: "Custo por mil pessoas alcançadas",
                    },
                    {
                      icon: Link2,
                      label: "Cliques no link",
                      value: fmtInt(a.inlineLinkClicks),
                      title: "Cliques no link do anúncio (inline)",
                    },
                    {
                      icon: Link2,
                      label: "CPC no link",
                      value: brl(a.costPerInlineLinkClick),
                      title: "Custo por clique no link",
                    },
                    {
                      icon: MessageCircle,
                      label: "Conv. por mensagem (7d)",
                      value: fmtInt(a.messagingConversationsStarted),
                      title: "Conversas por mensagem iniciadas (atribuição 7 dias)",
                    },
                  ].map(({ icon: Icon, label, value, title }) => (
                    <div
                      key={label}
                      className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4"
                      title={title}
                    >
                      <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <Icon className="h-3.5 w-3.5 shrink-0" />
                        <span className="leading-tight">{label}</span>
                      </div>
                      <p className="mt-2 text-xl font-semibold text-white">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-3">
                    <span className="text-xs text-zinc-500">CTR (todos os cliques)</span>
                    <p className="mt-1 font-mono text-lg text-emerald-400">{pct(a.ctr)}</p>
                  </div>
                  <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-3">
                    <span className="text-xs text-zinc-500">CPC médio (todos)</span>
                    <p className="mt-1 font-mono text-lg text-emerald-400">{brl(a.cpc)}</p>
                  </div>
                  <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-3">
                    <span className="text-xs text-zinc-500">CPM</span>
                    <p className="mt-1 font-mono text-lg text-emerald-400">{brl(a.cpm)}</p>
                  </div>
                </div>

                <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Campanhas · conjuntos · anúncios
                </h2>
                <MetaTrafficHierarchy
                  campaigns={data?.campaigns ?? []}
                  adsets={data?.adsets ?? []}
                  ads={data?.ads ?? []}
                />

                {data?.warnings && data.warnings.length > 0 && (
                  <div className="mt-8 rounded-lg border border-amber-500/25 bg-amber-500/5 px-3 py-2 text-xs text-amber-200/90">
                    {data.warnings.map((w) => (
                      <p key={w} className="mb-1 last:mb-0">
                        {w}
                      </p>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-zinc-500">Sem dados para exibir.</p>
            )}
          </>
        ) : (
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="w-full max-w-sm">
              <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white">
                <ArrowLeft className="h-4 w-4" />
                Voltar ao site
              </Link>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                    <Lock className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <h1 className="font-semibold text-white">Resultados do tráfego</h1>
                    <p className="text-xs text-zinc-500">Acesso exclusivo · slug: {slug}</p>
                  </div>
                </div>
                <form onSubmit={handleLogin} className="space-y-3">
                  <input
                    type="password"
                    value={clientSecret}
                    onChange={(e) => setClientSecret(e.target.value)}
                    placeholder="Senha do painel"
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20"
                    autoFocus
                  />
                  {error && <p className="text-xs text-red-400">{error}</p>}
                  {errorHint && (
                    <p className="mt-2 whitespace-pre-wrap text-xs leading-relaxed text-zinc-500">{errorHint}</p>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-emerald-500 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-50"
                  >
                    {loading ? "Entrando..." : "Ver métricas"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
