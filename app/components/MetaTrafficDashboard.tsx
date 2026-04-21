"use client";

import { ReactNode } from "react";
import {
  Activity,
  Coins,
  Eye,
  LineChart,
  Link2,
  MessageCircle,
  MousePointerClick,
  Percent,
  Target,
  TrendingUp,
  Wallet,
} from "lucide-react";
import {
  MetaTrafficHierarchy,
  type Ad,
  type AdSet,
  type Campaign,
} from "./MetaTrafficHierarchy";
import { MetaTrafficExportToolbar } from "./MetaTrafficExportToolbar";

export type DashboardBrandVariant = "default" | "easybee" | "luzdoluar";

type BrandAccent = {
  toolbarCard: string;
  selectFocus: string;
  periodPill: string;
  heroAccentCard: string;
  heroIcon: string;
  heroValue: string;
  rateValue: string;
  sectionLabel: string;
};

function brandAccent(variant: DashboardBrandVariant): BrandAccent {
  if (variant === "easybee") {
    return {
      toolbarCard:
        "border-amber-400/30 bg-gradient-to-b from-amber-950/45 via-zinc-900/55 to-zinc-950/30",
      selectFocus: "focus:border-amber-500/55 focus:ring-amber-500/25",
      periodPill: "border-amber-500/40 bg-amber-950/55 text-amber-50",
      heroAccentCard:
        "border-amber-500/35 bg-gradient-to-br from-amber-500/20 via-zinc-900/45 to-zinc-900/20 hover:border-amber-400/55",
      heroIcon: "bg-amber-500/25 text-amber-100",
      heroValue: "text-amber-50",
      rateValue: "text-amber-100",
      sectionLabel: "text-amber-200/80",
    };
  }
  if (variant === "luzdoluar") {
    return {
      toolbarCard:
        "border-[#c5a47e]/28 bg-gradient-to-b from-[#141a24]/95 via-zinc-900/60 to-zinc-950/40",
      selectFocus: "focus:border-[#c5a47e]/55 focus:ring-[#c5a47e]/22",
      periodPill: "border-[#c5a47e]/38 bg-[#1a1f2c]/90 text-[#f0e6d8]",
      heroAccentCard:
        "border-[#c5a47e]/32 bg-gradient-to-br from-[#c5a47e]/14 via-zinc-900/50 to-zinc-900/25 hover:border-[#d4bc96]/45",
      heroIcon: "bg-[#c5a47e]/18 text-[#f0e6d8]",
      heroValue: "text-[#f0e6d8]",
      rateValue: "text-[#d4bc96]",
      sectionLabel: "text-[#c5a47e]/80",
    };
  }
  return {
    toolbarCard: "border-zinc-800/70 bg-gradient-to-b from-zinc-900/60 to-zinc-900/10",
    selectFocus: "focus:border-emerald-500/50 focus:ring-emerald-500/20",
    periodPill: "border-zinc-700/70 bg-zinc-900/60 text-zinc-300",
    heroAccentCard:
      "border-emerald-500/25 bg-gradient-to-br from-emerald-500/[0.10] via-zinc-900/40 to-zinc-900/20 hover:border-emerald-500/40",
    heroIcon: "bg-emerald-500/15 text-emerald-300",
    heroValue: "text-emerald-300",
    rateValue: "text-emerald-300",
    sectionLabel: "text-zinc-500",
  };
}

export type DashboardAccount = {
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
  ctr: number;
  cpc: number;
  cpm: number;
};

export type DashboardPreset = { id: string; label: string };

export type MetaTrafficDashboardProps = {
  presets: DashboardPreset[];
  preset: string;
  onPresetChange: (p: string) => void;

  adAccountId?: string;
  timeRange?: { since: string; until: string };
  account: DashboardAccount | null;

  campaigns: Campaign[];
  adsets: AdSet[];
  ads: Ad[];

  loading?: boolean;
  error?: string | null;
  errorHint?: string | null;
  warnings?: string[];
  /** Dica exibida logo abaixo dos controles (ex.: env incompleto na Vercel). */
  controlsHint?: string | null;

  onExportMarkdown: () => void;
  onExportPdf: () => void;
  disableExport?: boolean;

  /** Controles extras próximos ao seletor de período (ex.: dropdown de cliente no admin). */
  leftExtras?: ReactNode;
  /** Ações à direita (refresh, voltar ao site, sair). */
  rightExtras?: ReactNode;

  /** Tema de cores (ex.: Easybee = âmbar). */
  brandVariant?: DashboardBrandVariant;
  /** Faixa de marca acima dos controles (ex.: logo). */
  brandSlot?: ReactNode;
};

function brl(n: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);
}

function fmtInt(n: number) {
  return new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 }).format(n);
}

function pct(n: number) {
  return `${n.toFixed(2)}%`;
}

function freq(n: number) {
  return n.toFixed(2).replace(".", ",");
}

export function MetaTrafficDashboard(props: MetaTrafficDashboardProps) {
  const {
    presets,
    preset,
    onPresetChange,
    adAccountId,
    timeRange,
    account,
    campaigns,
    adsets,
    ads,
    loading,
    error,
    errorHint,
    warnings,
    controlsHint,
    onExportMarkdown,
    onExportPdf,
    disableExport,
    leftExtras,
    rightExtras,
    brandVariant = "default",
    brandSlot,
  } = props;

  const ac = brandAccent(brandVariant);
  const exportAccent =
    brandVariant === "easybee" ? "amber" : brandVariant === "luzdoluar" ? "gold" : "emerald";

  const presetLabel = presets.find((p) => p.id === preset)?.label ?? preset;
  const a = account;

  return (
    <div className="space-y-6">
      <div className={`rounded-2xl border p-4 sm:p-5 ${ac.toolbarCard}`}>
        {brandSlot ? (
          <div className="mb-4 flex w-full justify-center border-b border-zinc-800/60 pb-4 sm:justify-start">
            {brandSlot}
          </div>
        ) : null}
        <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end lg:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
            <div className="w-full sm:max-w-xs">
              <label
                htmlFor="meta-preset"
                className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-zinc-500"
              >
                Período
              </label>
              <select
                id="meta-preset"
                value={preset}
                onChange={(e) => onPresetChange(e.target.value)}
                className={`w-full rounded-lg border border-zinc-700/80 bg-zinc-900 px-3 py-2 text-sm text-white transition focus:outline-none focus:ring-1 ${ac.selectFocus}`}
              >
                {presets.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
            {leftExtras}
          </div>
          <div className="flex flex-wrap items-end gap-2 sm:gap-3">
            {rightExtras}
            <MetaTrafficExportToolbar
              align="start"
              accent={exportAccent}
              disabled={Boolean(disableExport)}
              onMarkdown={onExportMarkdown}
              onPdf={onExportPdf}
            />
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 ${ac.periodPill}`}
          >
            {presetLabel}
          </span>
          {timeRange && (
            <span className="font-mono text-zinc-400">
              {timeRange.since} → {timeRange.until}
            </span>
          )}
          {adAccountId && (
            <>
              <span className="hidden text-zinc-700 sm:inline">·</span>
              <span className="font-mono text-zinc-500">{adAccountId}</span>
            </>
          )}
          {a?.accountName && (
            <>
              <span className="hidden text-zinc-700 sm:inline">·</span>
              <span className="truncate text-zinc-400">{a.accountName}</span>
            </>
          )}
        </div>

        {controlsHint && (
          <p className="mt-2 text-xs leading-snug text-amber-200/90">{controlsHint}</p>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </div>
      )}
      {errorHint && (
        <div className="whitespace-pre-wrap rounded-lg border border-zinc-700/80 bg-zinc-900/80 px-3 py-3 text-xs leading-relaxed text-zinc-300">
          {errorHint}
        </div>
      )}

      {loading && !a ? (
        <DashboardSkeleton />
      ) : a ? (
        <>
          <HeroKPIs account={a} brandAc={ac} />
          <RateStrip account={a} brandAc={ac} />
          <SecondaryKPIs account={a} />

          <section>
            <header className="mb-3 flex items-center gap-3">
              <span
                className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${ac.sectionLabel}`}
              >
                Campanhas · conjuntos · anúncios
              </span>
              <span className="h-px flex-1 bg-zinc-800/80" />
            </header>
            <MetaTrafficHierarchy
              campaigns={campaigns}
              adsets={adsets}
              ads={ads}
            />
          </section>

          {warnings && warnings.length > 0 && (
            <div className="rounded-lg border border-amber-500/25 bg-amber-500/5 px-3 py-2 text-xs text-amber-200/90">
              {warnings.map((w) => (
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
    </div>
  );
}

type HeroItem = {
  icon: typeof Wallet;
  label: string;
  value: string;
  title?: string;
  primary?: boolean;
};

function HeroKPIs({ account, brandAc }: { account: DashboardAccount; brandAc: BrandAccent }) {
  const items: HeroItem[] = [
    {
      icon: Wallet,
      label: "Investimento",
      value: brl(account.spend),
      primary: true,
      title: "Valor investido no período",
    },
    { icon: Eye, label: "Impressões", value: fmtInt(account.impressions) },
    {
      icon: MousePointerClick,
      label: "Cliques (todos)",
      value: fmtInt(account.clicks),
    },
    {
      icon: Target,
      label: "Alcance",
      value: fmtInt(account.reach),
      title: "Pessoas únicas alcançadas",
    },
  ];
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map(({ icon: Icon, label, value, title, primary }) => (
        <div
          key={label}
          title={title}
          className={`relative overflow-hidden rounded-xl border p-4 transition ${
            primary ? brandAc.heroAccentCard : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700"
          }`}
        >
          <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-zinc-500">
            <span
              className={`inline-flex h-7 w-7 items-center justify-center rounded-lg ${
                primary ? brandAc.heroIcon : "bg-zinc-800/80 text-zinc-400"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
            </span>
            <span className="leading-tight">{label}</span>
          </div>
          <p
            className={`mt-3 text-2xl font-semibold tabular-nums ${
              primary ? brandAc.heroValue : "text-white"
            }`}
          >
            {value}
          </p>
        </div>
      ))}
    </div>
  );
}

function RateStrip({ account, brandAc }: { account: DashboardAccount; brandAc: BrandAccent }) {
  const items = [
    { icon: Percent, label: "CTR", value: pct(account.ctr) },
    { icon: TrendingUp, label: "CPC médio", value: brl(account.cpc) },
    { icon: LineChart, label: "CPM", value: brl(account.cpm) },
  ];
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {items.map(({ icon: Icon, label, value }) => (
        <div
          key={label}
          className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/30 px-4 py-3"
        >
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Icon className="h-3.5 w-3.5" />
            {label}
          </div>
          <p className={`font-mono text-base font-medium tabular-nums ${brandAc.rateValue}`}>
            {value}
          </p>
        </div>
      ))}
    </div>
  );
}

function SecondaryKPIs({ account }: { account: DashboardAccount }) {
  const items: {
    icon: typeof Activity;
    label: string;
    value: string;
    title?: string;
  }[] = [
    { icon: Activity, label: "Frequência", value: freq(account.frequency) },
    {
      icon: Coins,
      label: "CPP",
      value: brl(account.cpp),
      title: "Custo por mil pessoas alcançadas",
    },
    {
      icon: Link2,
      label: "Cliques no link",
      value: fmtInt(account.inlineLinkClicks),
    },
    {
      icon: Link2,
      label: "CPC no link",
      value: brl(account.costPerInlineLinkClick),
    },
    {
      icon: MessageCircle,
      label: "Conv. msg. (7d)",
      value: fmtInt(account.messagingConversationsStarted),
    },
  ];
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {items.map(({ icon: Icon, label, value, title }) => (
        <div
          key={label}
          title={title}
          className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-3.5 transition hover:border-zinc-700"
        >
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-zinc-500">
            <Icon className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{label}</span>
          </div>
          <p className="mt-1.5 text-base font-semibold tabular-nums text-white">
            {value}
          </p>
        </div>
      ))}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-xl border border-zinc-800 bg-zinc-900/40"
          />
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-14 animate-pulse rounded-xl border border-zinc-800 bg-zinc-900/30"
          />
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-20 animate-pulse rounded-xl border border-zinc-800 bg-zinc-900/30"
          />
        ))}
      </div>
    </div>
  );
}
