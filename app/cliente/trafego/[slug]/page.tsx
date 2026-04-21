"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, LogOut, RefreshCw } from "lucide-react";
import { EasyBeeBrandBanner } from "@/app/components/EasyBeeBrandBanner";
import { LuzDoLuarBrandBanner } from "@/app/components/LuzDoLuarBrandBanner";
import {
  MetaTrafficDashboard,
  type DashboardAccount,
  type DashboardBrandVariant,
} from "@/app/components/MetaTrafficDashboard";
import { trafficPortalKind } from "@/lib/traffic-portal-slugs";
import {
  downloadMetaTrafficMarkdown,
  downloadMetaTrafficPdf,
  type MetaTrafficExportInput,
} from "@/lib/export-meta-traffic-report";

type AccountTotals = DashboardAccount & {
  leads: number;
  qualifiedLeads: number;
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

type AdSetRow = CampaignRow & {
  adSetId: string;
  adSetName: string;
};

type AdRow = AdSetRow & {
  adId: string;
  adName: string;
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

const PRESETS = [
  { id: "today", label: "Hoje" },
  { id: "yesterday", label: "Ontem" },
  { id: "last_7d", label: "Últimos 7 dias" },
  { id: "last_14d", label: "Últimos 14 dias" },
  { id: "last_30d", label: "Últimos 30 dias" },
  { id: "last_90d", label: "Últimos 90 dias" },
  { id: "this_month", label: "Este mês" },
  { id: "last_month", label: "Mês passado" },
  { id: "last_37_months", label: "Histórico longo (~37 meses Meta)" },
];

export default function ClienteTrafegoPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const portal = trafficPortalKind(slug);
  const dashboardBrand: DashboardBrandVariant =
    portal === "easybee" ? "easybee" : portal === "luzdoluar" ? "luzdoluar" : "default";

  const [clientSecret, setClientSecret] = useState("");
  const [sessionOk, setSessionOk] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState("");
  const [errorHint, setErrorHint] = useState("");
  const [data, setData] = useState<ApiPayload | null>(null);
  const [preset, setPreset] = useState("last_30d");
  const [showPassword, setShowPassword] = useState(false);

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
    <main
      className={
        portal === "easybee"
          ? "min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-white"
          : portal === "luzdoluar"
            ? "min-h-screen bg-gradient-to-b from-[#080a0f] via-zinc-950 to-[#080a0f] text-white"
            : "min-h-screen bg-zinc-950 text-white"
      }
    >
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        {sessionOk ? (
          <MetaTrafficDashboard
            presets={PRESETS}
            preset={preset}
            onPresetChange={setPreset}
            brandVariant={dashboardBrand}
            brandSlot={
              portal === "easybee" ? (
                <EasyBeeBrandBanner variant="compact" subtitle="Métricas Meta Ads" />
              ) : portal === "luzdoluar" ? (
                <LuzDoLuarBrandBanner variant="compact" subtitle="Métricas Meta Ads" />
              ) : undefined
            }
            adAccountId={data?.adAccountId}
            timeRange={data?.timeRange}
            account={data?.account ?? null}
            campaigns={data?.campaigns ?? []}
            adsets={data?.adsets ?? []}
            ads={data?.ads ?? []}
            loading={loadingData}
            error={error || null}
            errorHint={errorHint || null}
            warnings={data?.warnings}
            disableExport={!data}
            onExportMarkdown={() => {
              const p = buildExportPayload();
              if (p) downloadMetaTrafficMarkdown(p);
            }}
            onExportPdf={() => {
              const p = buildExportPayload();
              if (p) downloadMetaTrafficPdf(p);
            }}
            rightExtras={
              <>
                <button
                  type="button"
                  onClick={() => clientSecret && fetchData(clientSecret, preset)}
                  disabled={loadingData}
                  className={
                    "inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-zinc-700/80 bg-zinc-900/60 px-3 text-xs text-zinc-300 transition disabled:opacity-50 " +
                    (portal === "easybee"
                      ? "hover:border-amber-500/45 hover:text-amber-200"
                      : portal === "luzdoluar"
                        ? "hover:border-[#c5a47e]/45 hover:text-[#e8dcc8]"
                        : "hover:border-emerald-500/40 hover:text-emerald-300")
                  }
                  title="Atualizar"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${loadingData ? "animate-spin" : ""}`} />
                  <span className="hidden sm:inline">Atualizar</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSessionOk(false);
                    setClientSecret("");
                    setData(null);
                  }}
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-zinc-700/80 bg-zinc-900/60 px-3 text-xs text-zinc-300 transition hover:border-red-500/40 hover:text-red-400"
                  title="Sair"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Sair</span>
                </button>
              </>
            }
          />
        ) : (
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="w-full max-w-sm">
              <Link
                href="/"
                className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar ao site
              </Link>
              <div
                className={
                  portal === "easybee"
                    ? "rounded-xl border border-amber-500/25 bg-zinc-900/70 p-6 shadow-xl shadow-amber-950/25"
                    : portal === "luzdoluar"
                      ? "rounded-xl border border-[#c5a47e]/28 bg-zinc-900/75 p-6 shadow-xl shadow-black/45"
                      : "rounded-xl border border-zinc-800 bg-zinc-900/50 p-6"
                }
              >
                {portal === "easybee" ? (
                  <div className="mb-6">
                    <EasyBeeBrandBanner variant="login" subtitle="Painel de métricas" />
                  </div>
                ) : portal === "luzdoluar" ? (
                  <div className="mb-6">
                    <LuzDoLuarBrandBanner variant="login" subtitle="Painel de métricas" />
                  </div>
                ) : null}
                <form onSubmit={handleLogin} className="space-y-3">
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={clientSecret}
                      onChange={(e) => setClientSecret(e.target.value)}
                      placeholder="Senha do painel"
                      className={
                        "w-full rounded-lg border bg-zinc-950 py-2.5 pl-3 pr-11 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 " +
                        (portal === "easybee"
                          ? "border-amber-700/40 focus:border-amber-500/60 focus:ring-amber-500/30"
                          : portal === "luzdoluar"
                            ? "border-[#5c4f3d]/55 focus:border-[#c5a47e]/55 focus:ring-[#c5a47e]/25"
                            : "border-zinc-700 focus:border-emerald-500/50 focus:ring-emerald-500/20")
                      }
                      autoFocus
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className={
                        "absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md text-zinc-400 hover:text-white " +
                        (portal === "easybee"
                          ? "hover:bg-amber-950/50"
                          : portal === "luzdoluar"
                            ? "hover:bg-[#1a1f2c]"
                            : "hover:bg-zinc-800")
                      }
                      aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 shrink-0" />
                      ) : (
                        <Eye className="h-4 w-4 shrink-0" />
                      )}
                    </button>
                  </div>
                  {error && <p className="text-xs text-red-400">{error}</p>}
                  {errorHint && (
                    <p className="mt-2 whitespace-pre-wrap text-xs leading-relaxed text-zinc-500">
                      {errorHint}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className={
                      "w-full rounded-lg py-2.5 text-sm font-semibold disabled:opacity-50 " +
                      (portal === "easybee"
                        ? "bg-amber-500 text-zinc-950 hover:bg-amber-400"
                        : portal === "luzdoluar"
                          ? "bg-[#c5a47e] text-zinc-950 hover:bg-[#d4bc96]"
                          : "bg-emerald-500 text-white hover:bg-emerald-600")
                    }
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
