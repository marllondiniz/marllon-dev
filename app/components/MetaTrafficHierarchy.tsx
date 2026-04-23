"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ImageOff, Video, X } from "lucide-react";
import type { AdCreativePreview } from "@/lib/meta-traffic";

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
  creative?: AdCreativePreview;
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

function creativeDisplayUrl(c?: AdCreativePreview): string | undefined {
  if (!c) return undefined;
  if (c.kind === "image") return c.imageUrl || c.thumbnailUrl;
  return c.thumbnailUrl || c.imageUrl;
}

function CreativeThumb({ creative }: { creative?: AdCreativePreview }) {
  const url = creativeDisplayUrl(creative);
  if (!url) {
    return (
      <div
        className="flex h-11 w-11 items-center justify-center rounded-md border border-zinc-700 bg-zinc-900 text-zinc-600"
        aria-hidden
      >
        <ImageOff className="h-4 w-4" />
      </div>
    );
  }
  return (
    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-md border border-zinc-700 bg-zinc-900">
      <Image src={url} alt="" fill className="object-cover" sizes="44px" />
      {creative?.kind === "video" && (
        <span
          className="absolute bottom-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded bg-black/75 text-white"
          aria-hidden
        >
          <Video className="h-2.5 w-2.5" strokeWidth={2.5} />
        </span>
      )}
    </div>
  );
}

function AdCreativeModal({ ad, onClose }: { ad: Ad | null; onClose: () => void }) {
  useEffect(() => {
    if (!ad) return;
    document.body.style.overflow = "hidden";
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onEscape);
    return () => {
      window.removeEventListener("keydown", onEscape);
      document.body.style.overflow = "";
    };
  }, [ad, onClose]);

  const c = ad?.creative;
  const imgUrl = c ? creativeDisplayUrl(c) : undefined;

  return (
    <AnimatePresence>
      {ad && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[95vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-zinc-700 bg-[#0d0d0f] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="ad-preview-title"
          >
            <div className="flex items-center justify-between gap-3 border-b border-zinc-800 px-4 py-3">
              <h2 id="ad-preview-title" className="min-w-0 truncate text-sm font-medium text-white">
                {ad.adName}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-800 hover:text-white"
                aria-label="Fechar prévia"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="max-h-[calc(90vh-3.5rem)] overflow-y-auto p-4">
              {c?.kind === "video" && c.videoSourceUrl ? (
                <video
                  src={c.videoSourceUrl}
                  controls
                  className="mx-auto max-h-[70vh] w-full rounded-lg bg-black"
                  playsInline
                />
              ) : c?.kind === "video" && imgUrl ? (
                <>
                  <div className="flex justify-center">
                    <Image
                      src={imgUrl}
                      alt=""
                      width={900}
                      height={900}
                      className="max-h-[70vh] w-auto max-w-full rounded-lg object-contain"
                      unoptimized
                    />
                  </div>
                  <p className="mt-3 text-center text-xs leading-relaxed text-zinc-500">
                    Só a capa do vídeo pôde ser carregada. Para assistir ao anúncio completo, abra-o no Gerenciador de
                    Anúncios da Meta.
                  </p>
                </>
              ) : imgUrl ? (
                <div className="flex justify-center">
                  <Image
                    src={imgUrl}
                    alt=""
                    width={900}
                    height={900}
                    className="max-h-[70vh] w-auto max-w-full rounded-lg object-contain"
                    unoptimized
                  />
                </div>
              ) : (
                <p className="text-center text-sm text-zinc-500">
                  Nenhuma imagem ou vídeo disponível para este anúncio.
                </p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function MetricHeaderRow() {
  return (
    <tr className="border-b border-zinc-800/90 bg-zinc-900/95 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
      <th className="px-2 py-2 text-left font-medium">Nome / prévia</th>
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
  const [previewAd, setPreviewAd] = useState<Ad | null>(null);

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
    <>
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
                <table className="w-full min-w-[600px] border-collapse text-left text-sm sm:min-w-[680px]">
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
                          onOpenCreative={setPreviewAd}
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
    <AdCreativeModal ad={previewAd} onClose={() => setPreviewAd(null)} />
    </>
  );
}

function FragmentAdSetRows({
  adset: s,
  adRows,
  open,
  onToggle,
  onOpenCreative,
}: {
  adset: AdSet;
  adRows: Ad[];
  open: boolean;
  onToggle: () => void;
  onOpenCreative: (ad: Ad) => void;
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
                <td className="max-w-[280px] px-3 py-1.5 pl-10">
                  <div className="flex min-w-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenCreative(ad)}
                      className="shrink-0 rounded-md outline-none ring-sky-400/0 transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-sky-400/80"
                      aria-label={`Abrir prévia do anúncio: ${ad.adName}`}
                    >
                      <CreativeThumb creative={ad.creative} />
                    </button>
                    <span className="truncate text-xs text-zinc-300" title={ad.adName}>
                      {ad.adName}
                    </span>
                  </div>
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
