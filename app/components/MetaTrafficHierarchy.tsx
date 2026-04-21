"use client";

import { useCallback, useState } from "react";
import { ChevronDown } from "lucide-react";

export type HierarchyMetrics = {
  impressions: number;
  clicks: number;
  inlineLinkClicks: number;
  spend: number;
  cpm: number;
  ctr: number;
};

export type Campaign = HierarchyMetrics & {
  campaignId: string;
  campaignName: string;
};

export type AdSet = HierarchyMetrics & {
  adSetId: string;
  adSetName: string;
  campaignId: string;
  campaignName: string;
};

export type Ad = HierarchyMetrics & {
  adId: string;
  adName: string;
  adSetId: string;
  adSetName: string;
  campaignName: string;
};

type Props = {
  campaigns: Campaign[];
  adsets: AdSet[];
  ads: Ad[];
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

function MetricHeaderRow() {
  return (
    <tr className="border-b border-zinc-800/90 bg-zinc-900/95 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
      <th className="px-2 py-2 text-left font-medium">Nome</th>
      <th className="px-2 py-2 text-right font-medium">Impr.</th>
      <th className="px-2 py-2 text-right font-medium">Cliq.</th>
      <th className="px-2 py-2 text-right font-medium">Link</th>
      <th className="px-2 py-2 text-right font-medium text-sky-500/90">Gasto</th>
      <th className="px-2 py-2 text-right font-medium">CPM</th>
      <th className="px-2 py-2 text-right font-medium">CTR</th>
    </tr>
  );
}

function MetricCells({ m }: { m: HierarchyMetrics }) {
  return (
    <>
      <td className="px-2 py-2 text-right font-mono text-xs text-zinc-300 tabular-nums">{fmtInt(m.impressions)}</td>
      <td className="px-2 py-2 text-right font-mono text-xs text-zinc-300 tabular-nums">{fmtInt(m.clicks)}</td>
      <td className="px-2 py-2 text-right font-mono text-xs text-zinc-300 tabular-nums">{fmtInt(m.inlineLinkClicks)}</td>
      <td className="px-2 py-2 text-right font-mono text-xs tabular-nums text-sky-400">{brl(m.spend)}</td>
      <td className="px-2 py-2 text-right font-mono text-xs text-zinc-300 tabular-nums">{brl(m.cpm)}</td>
      <td className="px-2 py-2 text-right font-mono text-xs text-zinc-300 tabular-nums">{pct(m.ctr)}</td>
    </>
  );
}

export function MetaTrafficHierarchy({ campaigns, adsets, ads }: Props) {
  const [openCampaigns, setOpenCampaigns] = useState<Set<string>>(() => new Set());
  const [openAdSets, setOpenAdSets] = useState<Set<string>>(() => new Set());

  const toggleCampaign = useCallback((id: string) => {
    setOpenCampaigns((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  }, []);

  const toggleAdSet = useCallback((id: string) => {
    setOpenAdSets((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  }, []);

  if (campaigns.length === 0) {
    return (
      <p className="rounded-lg border border-zinc-800 bg-zinc-950/80 py-10 text-center text-sm text-zinc-500">
        Nenhuma campanha com dados neste período.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
      {campaigns.map((c) => {
        const cid = c.campaignId || c.campaignName;
        const sets = adsets.filter((s) => s.campaignId === c.campaignId);
        const open = openCampaigns.has(cid);
        const adCountForCampaign = sets.reduce(
          (acc, s) => acc + ads.filter((a) => a.adSetId === s.adSetId).length,
          0
        );

        return (
          <section key={cid} className="border-b border-zinc-800 last:border-b-0">
            <button
              type="button"
              onClick={() => toggleCampaign(cid)}
              aria-expanded={open}
              className="flex w-full items-start justify-between gap-3 border-b border-zinc-800/80 bg-zinc-900/40 px-3 py-3 text-left transition hover:bg-zinc-800/50"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">{c.campaignName}</p>
                <p className="mt-0.5 text-[11px] text-zinc-500">
                  {sets.length} conjunto(s)
                  {adCountForCampaign > 0 ? ` · ${adCountForCampaign} anúncio(s)` : ""}
                </p>
              </div>
              <ChevronDown
                strokeWidth={2.5}
                className={`mt-0.5 h-5 w-5 shrink-0 text-zinc-200 transition-transform duration-200 ${open ? "rotate-180 text-sky-400" : ""}`}
                aria-hidden
              />
            </button>

            {open && (
              <div className="overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch]">
                <table className="w-full min-w-[560px] border-collapse text-left text-sm sm:min-w-[620px]">
                  <thead>
                    <MetricHeaderRow />
                  </thead>
                  <tbody className="text-zinc-200">
                    <tr className="border-b border-zinc-800/60 bg-zinc-900/30">
                      <td className="px-3 py-2 pl-4 text-xs font-medium text-zinc-400">Total campanha</td>
                      <MetricCells m={c} />
                    </tr>
                    {sets.map((s) => {
                      const sid = s.adSetId || s.adSetName;
                      const adRows = ads.filter((a) => a.adSetId === s.adSetId);
                      const adSetOpen = openAdSets.has(sid);

                      return (
                        <FragmentAdSetRows
                          key={sid}
                          adset={s}
                          adRows={adRows}
                          open={adSetOpen}
                          onToggle={() => toggleAdSet(sid)}
                        />
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}

function FragmentAdSetRows({
  adset: s,
  adRows,
  open,
  onToggle,
}: {
  adset: AdSet;
  adRows: Ad[];
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      <tr className="border-b border-zinc-800/80 bg-black/25">
        <td colSpan={7} className="p-0">
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={open}
            className="flex w-full items-start gap-2.5 py-2.5 pl-4 pr-2 text-left hover:bg-zinc-900/50"
          >
            <ChevronDown
              strokeWidth={2.5}
              className={`mt-0.5 h-4 w-4 shrink-0 text-zinc-200 transition-transform duration-200 ${open ? "rotate-180 text-sky-400" : ""}`}
              aria-hidden
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-zinc-200">{s.adSetName}</p>
              <p className="text-[11px] text-zinc-500">{adRows.length} anúncio(s)</p>
            </div>
          </button>
        </td>
      </tr>
      {open && (
        <>
          <tr className="border-b border-zinc-800/50 bg-zinc-900/20">
            <td className="px-3 py-1.5 pl-8 text-[11px] font-medium text-zinc-500">Total conjunto</td>
            <MetricCells m={s} />
          </tr>
          {adRows.length === 0 ? (
            <tr className="border-b border-zinc-800/40">
              <td colSpan={7} className="px-3 py-3 pl-8 text-xs text-zinc-600">
                Nenhum anúncio com dados neste conjunto.
              </td>
            </tr>
          ) : (
            adRows.map((ad) => (
              <tr key={ad.adId || ad.adName} className="border-b border-zinc-800/40 hover:bg-zinc-900/30">
                <td className="max-w-[220px] truncate px-3 py-1.5 pl-10 text-xs text-zinc-300" title={ad.adName}>
                  {ad.adName}
                </td>
                <MetricCells m={ad} />
              </tr>
            ))
          )}
        </>
      )}
    </>
  );
}
