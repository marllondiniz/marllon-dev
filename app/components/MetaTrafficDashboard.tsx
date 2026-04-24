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
import { TRAFFIC_LEGACY_PRESET_IDS } from "@/lib/traffic-date-presets";
import {
  MetaTrafficHierarchy,
  type Ad,
  type AdSet,
  type Campaign,
} from "./MetaTrafficHierarchy";
import { MetaTrafficExportToolbar } from "./MetaTrafficExportToolbar";

const LEGACY_PRESET_SET = new Set(TRAFFIC_LEGACY_PRESET_IDS);

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

/** Cores do bloco “Investimento em tráfego” no admin, alinhadas à marca do cliente. */
export type TrafficInvestPanelAccent = {
  iconWrap: string;
  icon: string;
  titleName: string;
  refreshBtn: string;
  formWrap: string;
  inputFocus: string;
  addBtn: string;
  tableWrap: string;
  tableHead: string;
  investCell: string;
  saveBtn: string;
  editHover: string;
};

export function trafficInvestPanelAccent(variant: DashboardBrandVariant): TrafficInvestPanelAccent {
  if (variant === "easybee") {
    return {
      iconWrap: "bg-amber-500/20",
      icon: "text-amber-200",
      titleName: "text-amber-50",
      refreshBtn: "hover:border-amber-500/45 hover:text-amber-200",
      formWrap: "border-amber-500/25 bg-amber-950/25",
      inputFocus: "focus:border-amber-500/55 focus:ring-amber-500/25",
      addBtn: "bg-amber-600 hover:bg-amber-500",
      tableWrap: "border-amber-500/20",
      tableHead: "border-b border-amber-500/20 bg-amber-950/35 text-amber-200/85",
      investCell: "text-amber-50",
      saveBtn: "bg-amber-600/90 hover:bg-amber-500",
      editHover: "hover:border-amber-500/45 hover:text-amber-200",
    };
  }
  if (variant === "luzdoluar") {
    return {
      iconWrap: "bg-[#c5a47e]/18",
      icon: "text-[#e8dcc8]",
      titleName: "text-[#f0e6d8]",
      refreshBtn: "hover:border-[#c5a47e]/45 hover:text-[#e8dcc8]",
      formWrap: "border-[#c5a47e]/28 bg-[#141a18]/50",
      inputFocus: "focus:border-[#c5a47e]/55 focus:ring-[#c5a47e]/22",
      addBtn: "bg-[#8b7355] hover:bg-[#9d8462]",
      tableWrap: "border-[#c5a47e]/22",
      tableHead: "border-b border-[#c5a47e]/22 bg-[#1a1f2c]/90 text-[#c5a47e]/90",
      investCell: "text-[#f0e6d8]",
      saveBtn: "bg-[#8b7355]/95 hover:bg-[#9d8462]",
      editHover: "hover:border-[#c5a47e]/45 hover:text-[#e8dcc8]",
    };
  }
  return {
    iconWrap: "bg-emerald-500/15",
    icon: "text-emerald-400",
    titleName: "text-emerald-200/95",
    refreshBtn: "hover:border-emerald-500/40 hover:text-emerald-300",
    formWrap: "border-zinc-800/80 bg-zinc-950/40",
    inputFocus: "focus:border-emerald-500/50 focus:ring-emerald-500/20",
    addBtn: "bg-emerald-600 hover:bg-emerald-500",
    tableWrap: "border-zinc-800/80",
      tableHead: "border-b border-zinc-800/80 bg-zinc-950/50 text-emerald-200/75",
    investCell: "text-emerald-200/95",
    saveBtn: "bg-emerald-600/90 hover:bg-emerald-500",
    editHover: "hover:border-emerald-500/40 hover:text-emerald-300",
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
  /** Bloco extra no card de controles, abaixo do período / conta (ex.: investimentos por cliente no admin). */
  belowControlsSlot?: ReactNode;
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
    belowControlsSlot,
  } = props;

  const ac = brandAccent(brandVariant);
  const exportAccent =
    brandVariant === "easybee" ? "amber" : brandVariant === "luzdoluar" ? "gold" : "emerald";

  const presetLabel = presets.find((p) => p.id === preset)?.label ?? preset;
  const a = account;
  const mainPresets = presets.filter((p) => !LEGACY_PRESET_SET.has(p.id));
  const extraPresets = presets.filter((p) => LEGACY_PRESET_SET.has(p.id));

  return (
    <div className="space-y-6">
      <div className={`rounded-2xl border p-4 sm:p-5 ${ac.toolbarCard}`}>
        {brandSlot ? (
          <div className="mb-4 flex w-full justify-center border-b border-zinc-800/60 pb-4 sm:justify-start">
            {brandSlot}
          </div>
        ) : null}
        {/* Mobile: período, depois linha [Ações] | [Exportar]. Desktop: [Período | Exportar | Ações] em 3 colunas. */}
        <div className="mx-auto w-full max-w-6xl 2xl:max-w-7xl">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_minmax(0,auto)_1fr] lg:items-end lg:gap-6 xl:gap-8">
            <div className="min-w-0 justify-self-stretch sm:max-w-md lg:justify-self-start">
              <div className="flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
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
                    <optgroup label="Período">
                      {mainPresets.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.label}
                        </option>
                      ))}
                    </optgroup>
                    {extraPresets.length > 0 ? (
                      <optgroup label="Histórico adicional">
                        {extraPresets.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.label}
                          </option>
                        ))}
                      </optgroup>
                    ) : null}
                  </select>
                </div>
                {leftExtras}
              </div>
            </div>

            <div
              className={
                "flex w-full min-w-0 max-lg:items-end " +
                (rightExtras
                  ? "max-lg:justify-between max-lg:gap-2"
                  : "max-lg:justify-end") +
                " lg:contents"
              }
            >
              {rightExtras ? (
                <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 [&>button]:min-h-10 [&>button]:shrink-0 sm:[&>button]:h-9 sm:[&>button]:min-h-0 lg:col-start-3 lg:row-start-1 lg:justify-self-end">
                  {rightExtras}
                </div>
              ) : null}
              <div className="min-w-0 max-lg:max-w-[min(20rem,100%)] max-lg:flex-1 max-lg:justify-self-end lg:col-start-2 lg:row-start-1 lg:max-w-sm lg:flex-initial lg:justify-self-center">
                <MetaTrafficExportToolbar
                  align="center"
                  accent={exportAccent}
                  className="w-full max-w-full lg:mx-auto lg:w-auto"
                  disabled={Boolean(disableExport)}
                  onMarkdown={onExportMarkdown}
                  onPdf={onExportPdf}
                />
              </div>
            </div>
          </div>
        </div>

        <div
          className="mx-auto mt-4 max-w-6xl space-y-3 border-t border-zinc-800/50 pt-4 sm:mt-3 sm:space-y-0 2xl:max-w-7xl"
          role="status"
        >
          <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3 sm:gap-y-1">
            <span
              className={`inline-flex w-fit max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${ac.periodPill}`}
            >
              {presetLabel}
            </span>
            {timeRange && (
              <span className="font-mono text-xs leading-relaxed text-zinc-400 sm:whitespace-nowrap">
                {timeRange.since} → {timeRange.until}
              </span>
            )}
          </div>
          {(adAccountId || a?.accountName) && (
            <div className="flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-2">
              {adAccountId && (
                <span className="break-all font-mono text-[11px] leading-snug text-zinc-500 sm:text-xs">
                  {adAccountId}
                </span>
              )}
              {a?.accountName && adAccountId && (
                <span className="hidden text-zinc-600 sm:inline" aria-hidden>
                  ·
                </span>
              )}
              {a?.accountName && (
                <span className="text-sm font-medium leading-snug text-zinc-300 sm:truncate sm:max-w-md">
                  {a.accountName}
                </span>
              )}
            </div>
          )}
        </div>

        {controlsHint && (
          <p className="mt-2 text-xs leading-snug text-amber-200/90">{controlsHint}</p>
        )}
        {belowControlsSlot ? (
          <div className="mt-4 border-t border-zinc-800/50 pt-4">{belowControlsSlot}</div>
        ) : null}
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
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-3 xl:grid-cols-4">
      {items.map(({ icon: Icon, label, value, title, primary }) => (
        <div
          key={label}
          title={title}
          className={`relative min-w-0 overflow-hidden rounded-xl border p-3 transition sm:p-4 ${
            primary ? brandAc.heroAccentCard : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700"
          }`}
        >
          <div className="flex min-w-0 items-center gap-1.5 text-[10px] font-medium uppercase leading-tight tracking-wide text-zinc-500 sm:gap-2 sm:text-[11px]">
            <span
              className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                primary ? brandAc.heroIcon : "bg-zinc-800/80 text-zinc-400"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
            </span>
            <span className="min-w-0 break-words hyphens-auto">{label}</span>
          </div>
          <p
            className={`mt-2 break-words text-lg font-semibold leading-snug tabular-nums sm:mt-3 sm:text-2xl ${
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
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
      {items.map(({ icon: Icon, label, value }) => (
        <div
          key={label}
          className="flex min-h-[48px] min-w-0 items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-900/30 px-3 py-2.5 sm:min-h-0 sm:px-4 sm:py-3"
        >
          <div className="flex min-w-0 items-center gap-1.5 text-xs text-zinc-500 sm:gap-2">
            <Icon className="h-3.5 w-3.5 shrink-0" />
            <span className="leading-tight">{label}</span>
          </div>
          <p
            className={`shrink-0 pl-1 text-right font-mono text-sm font-medium tabular-nums sm:text-base ${brandAc.rateValue}`}
          >
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
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3 xl:grid-cols-5">
      {items.map(({ icon: Icon, label, value, title }) => (
        <div
          key={label}
          title={title}
          className="min-w-0 rounded-xl border border-zinc-800 bg-zinc-900/30 p-3 transition hover:border-zinc-700 sm:p-3.5"
        >
          <div className="flex min-w-0 items-start gap-1.5 text-[10px] uppercase leading-tight tracking-wide text-zinc-500 sm:items-center sm:gap-2 sm:text-[11px]">
            <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 sm:mt-0" />
            <span className="line-clamp-2 sm:truncate sm:line-clamp-none">{label}</span>
          </div>
          <p className="mt-1.5 break-words text-sm font-semibold tabular-nums text-white sm:text-base">
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
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-3 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-[5.5rem] animate-pulse rounded-xl border border-zinc-800 bg-zinc-900/40 sm:h-24"
          />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-[3rem] animate-pulse rounded-xl border border-zinc-800 bg-zinc-900/30 sm:h-14"
          />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3 xl:grid-cols-5">
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
