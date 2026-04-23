"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Lock, LogOut, RefreshCw } from "lucide-react";
import { EasyBeeBrandBanner } from "@/app/components/EasyBeeBrandBanner";
import { LuzDoLuarBrandBanner } from "@/app/components/LuzDoLuarBrandBanner";
import {
  MetaTrafficDashboard,
  type DashboardAccount,
  type DashboardBrandVariant,
} from "@/app/components/MetaTrafficDashboard";
import {
  getTrafficPresetLabel,
  TRAFFIC_DATE_PRESETS,
  TRAFFIC_DEFAULT_PRESET,
  TRAFFIC_LEGACY_PRESETS,
} from "@/lib/traffic-date-presets";
import { trafficPortalKind } from "@/lib/traffic-portal-slugs";
import {
  downloadMetaTrafficMarkdown,
  downloadMetaTrafficPdf,
  type MetaTrafficExportInput,
} from "@/lib/export-meta-traffic-report";
import type { AdCreativePreview } from "@/lib/meta-traffic";

const PRESETS = [...TRAFFIC_DATE_PRESETS, ...TRAFFIC_LEGACY_PRESETS];

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
  creative?: AdCreativePreview;
};

type ClientItem = { slug: string; name: string };

type ApiPayload = {
  role: string;
  clients?: ClientItem[];
  clientEnvHint?: string;
  preset: string;
  adAccountId: string;
  timeRange?: { since: string; until: string };
  account: AccountTotals | null;
  campaigns: CampaignRow[];
  adsets?: AdSetRow[];
  ads?: AdRow[];
  warnings?: string[];
  error?: string;
  hint?: string;
};

export default function AdminTrafegoPage() {
  const [password, setPassword] = useState("");
  const [secret, setSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState("");
  const [errorHint, setErrorHint] = useState("");
  const [data, setData] = useState<ApiPayload | null>(null);
  const [preset, setPreset] = useState(TRAFFIC_DEFAULT_PRESET);
  const [slug, setSlug] = useState<string>("");
  const portal = trafficPortalKind(slug);
  const dashboardBrand: DashboardBrandVariant =
    portal === "easybee" ? "easybee" : portal === "luzdoluar" ? "luzdoluar" : "default";

  const load = useCallback(
    async (s: string, p: string, clientSlug?: string) => {
      setLoadingData(true);
      setError("");
      setErrorHint("");
      try {
        const url = new URL("/api/meta-insights", window.location.origin);
        url.searchParams.set("preset", p);
        if (clientSlug) url.searchParams.set("slug", clientSlug);
        const res = await fetch(url.toString(), { headers: { "x-admin-secret": s } });
        const json = (await res.json()) as ApiPayload & { error?: string; hint?: string };
        if (res.status === 401) {
          setSecret(null);
          setError("Senha incorreta ou sessão expirada.");
          return;
        }
        if (!res.ok) {
          setError(json.error || "Erro ao carregar métricas.");
          setErrorHint(json.hint || "");
          setData(null);
          return;
        }
        setData(json);
        if (json.clients && json.clients.length && !clientSlug) {
          setSlug(json.clients[0].slug);
        }
      } catch {
        setError("Falha na rede.");
        setData(null);
      } finally {
        setLoadingData(false);
      }
    },
    []
  );

  useEffect(() => {
    if (secret) load(secret, preset, slug || undefined);
  }, [secret, preset, slug, load]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!password.trim()) return;
    setLoading(true);
    setError("");
    setErrorHint("");
    try {
      const s = password.trim();
      const url = new URL("/api/meta-insights", window.location.origin);
      url.searchParams.set("preset", preset);
      const res = await fetch(url.toString(), { headers: { "x-admin-secret": s } });
      const json = (await res.json()) as ApiPayload & { error?: string; hint?: string };
      if (res.status === 401) {
        setError("Senha incorreta.");
        return;
      }
      setSecret(s);
      if (!res.ok) {
        setError(json.error || "Erro ao carregar dados da Meta.");
        setErrorHint(json.hint || "");
        setData(null);
        return;
      }
      setData(json);
      setError("");
      setErrorHint("");
      if (json.clients && json.clients.length > 0) {
        setSlug(json.clients[0].slug);
      }
    } finally {
      setLoading(false);
    }
  }

  function buildExportPayload(): MetaTrafficExportInput | null {
    if (!data) return null;
    const presetLabel = getTrafficPresetLabel(data.preset);
    const clientName = data.clients?.find((c) => c.slug === slug)?.name?.trim();
    const reportTitle = clientName
      ? `Métricas Meta Ads · ${clientName}`
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

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-6xl px-3 py-4 sm:px-6 sm:py-6">
        {secret ? (
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
            controlsHint={data?.clientEnvHint ?? null}
            disableExport={!data}
            onExportMarkdown={() => {
              const p = buildExportPayload();
              if (p) downloadMetaTrafficMarkdown(p);
            }}
            onExportPdf={() => {
              const p = buildExportPayload();
              if (p) downloadMetaTrafficPdf(p);
            }}
            leftExtras={
              data?.clients && data.clients.length > 0 ? (
                <div className="w-full sm:max-w-xs">
                  <label
                    htmlFor="client-slug"
                    className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-zinc-500"
                  >
                    Conta (cliente)
                  </label>
                  <select
                    id="client-slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className={
                      "w-full rounded-lg border border-zinc-700/80 bg-zinc-900 px-3 py-2 text-sm text-white transition focus:outline-none focus:ring-1 " +
                      (portal === "easybee"
                        ? "focus:border-amber-500/55 focus:ring-amber-500/25"
                        : portal === "luzdoluar"
                          ? "focus:border-[#c5a47e]/55 focus:ring-[#c5a47e]/22"
                          : "focus:border-emerald-500/50 focus:ring-emerald-500/20")
                    }
                  >
                    {data.clients.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null
            }
            rightExtras={
              <>
                <button
                  type="button"
                  onClick={() => secret && load(secret, preset, slug || undefined)}
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
                    setSecret(null);
                    setPassword("");
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
                href="/admin"
                className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar ao admin
              </Link>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                    <Lock className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <h1 className="font-semibold text-white">Métricas Meta</h1>
                    <p className="text-xs text-zinc-500">Mesma senha do admin</p>
                  </div>
                </div>
                <form onSubmit={handleLogin} className="space-y-3">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Senha"
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20"
                    autoFocus
                  />
                  {error && <p className="text-xs text-red-400">{error}</p>}
                  {errorHint && (
                    <p className="mt-2 whitespace-pre-wrap text-xs leading-relaxed text-zinc-500">
                      {errorHint}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-emerald-500 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-50"
                  >
                    {loading ? "Entrando..." : "Entrar"}
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
