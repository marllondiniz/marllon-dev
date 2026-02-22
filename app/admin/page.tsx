"use client";

import { useState, useEffect, useCallback, Fragment } from "react";
import Link from "next/link";
import {
  ArrowLeft, Lock, RefreshCw, MessageSquare, LogOut,
  Check, Circle, Globe, TrendingUp, ChevronDown, ChevronUp,
} from "lucide-react";

type Briefing = {
  id: string;
  name: string;
  whatsapp: string;
  product: string;
  audience: string;
  benefit: string;
  cta: string;
  pricing: string;
  objections: string | null;
  materials: string | null;
  brand_links: string | null;
  page_location: string;
  deadline: string;
  traffic: string;
  integration: string | null;
  refs: string | null;
  restrictions: string | null;
  plan: string | null;
  attended: boolean;
  created_at: string;
};

type TrafficBriefing = {
  id: string;
  name: string;
  whatsapp: string;
  email: string;
  current_situation: string;
  goals: string;
  budget: string | null;
  attended: boolean;
  created_at: string;
};

function fmt(date: string) {
  return new Date(date).toLocaleString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function WaLink({ phone, children }: { phone: string; children: React.ReactNode }) {
  return (
    <a
      href={`https://wa.me/55${phone.replace(/\D/g, "")}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#22c55e] hover:underline"
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </a>
  );
}

function AttendedBtn({
  attended, updating, onToggle,
}: { attended: boolean; updating: boolean; onToggle: (e: React.MouseEvent) => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={updating}
      title={attended ? "Desmarcar atendido" : "Marcar como atendido"}
      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition disabled:opacity-50 ${
        attended
          ? "bg-[#22c55e]/15 text-[#22c55e] hover:bg-[#22c55e]/25"
          : "bg-zinc-800 text-zinc-500 hover:bg-zinc-700 hover:text-zinc-300"
      }`}
    >
      {updating ? (
        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
      ) : attended ? (
        <Check className="h-3.5 w-3.5" />
      ) : (
        <Circle className="h-3.5 w-3.5" />
      )}
      {attended ? "Atendido" : "Pendente"}
    </button>
  );
}

export default function AdminLeadsPage() {
  const [password, setPassword] = useState("");
  const [secret, setSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [briefings, setBriefings] = useState<Briefing[]>([]);
  const [trafficBriefings, setTrafficBriefings] = useState<TrafficBriefing[]>([]);
  const [loadingBriefings, setLoadingBriefings] = useState(false);
  const [loadingTraffic, setLoadingTraffic] = useState(false);

  const [expandedSiteId, setExpandedSiteId] = useState<string | null>(null);
  const [expandedTrafficId, setExpandedTrafficId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [updatingTrafficId, setUpdatingTrafficId] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<"site" | "traffic">("site");
  const [filterSite, setFilterSite] = useState<"all" | "pending">("all");
  const [filterTraffic, setFilterTraffic] = useState<"all" | "pending">("all");

  const fetchBriefings = useCallback(async (s: string) => {
    setLoadingBriefings(true);
    setError("");
    try {
      const res = await fetch("/api/briefing", { headers: { "x-admin-secret": s } });
      if (res.status === 401) { setSecret(null); setError("Senha incorreta."); return; }
      if (!res.ok) { const d = await res.json().catch(() => ({})); setError(d.error || "Erro."); return; }
      const data = await res.json();
      setBriefings(data.briefings ?? []);
    } finally { setLoadingBriefings(false); }
  }, []);

  const fetchTrafficBriefings = useCallback(async (s: string) => {
    setLoadingTraffic(true);
    setError("");
    try {
      const res = await fetch("/api/traffic-briefing", { headers: { "x-admin-secret": s } });
      if (res.status === 401) { setSecret(null); setError("Senha incorreta."); return; }
      if (!res.ok) { const d = await res.json().catch(() => ({})); setError(d.error || "Erro."); return; }
      const data = await res.json();
      setTrafficBriefings(data.briefings ?? []);
    } finally { setLoadingTraffic(false); }
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!password.trim()) return;
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/traffic-briefing", { headers: { "x-admin-secret": password.trim() } });
      if (res.status === 401) { setError("Senha incorreta."); return; }
      if (res.ok) {
        const s = password.trim();
        setSecret(s);
        await fetchBriefings(s);
        await fetchTrafficBriefings(s);
        return;
      }
      setError("Erro ao acessar.");
    } finally { setLoading(false); }
  }

  function handleLogout() {
    setSecret(null); setPassword("");
    setBriefings([]); setTrafficBriefings([]);
    setExpandedSiteId(null); setExpandedTrafficId(null);
  }

  function handleRefresh() {
    if (secret) { fetchBriefings(secret); fetchTrafficBriefings(secret); }
  }

  async function handleToggleAttended(b: Briefing, e: React.MouseEvent) {
    e.stopPropagation();
    if (!secret || updatingId) return;
    setUpdatingId(b.id);
    try {
      const res = await fetch("/api/briefing", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-secret": secret },
        body: JSON.stringify({ id: b.id, attended: !b.attended }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Erro.");
      setBriefings((prev) => prev.map((x) => x.id === b.id ? { ...x, attended: !x.attended } : x));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro.");
    } finally { setUpdatingId(null); }
  }

  async function handleToggleTrafficAttended(t: TrafficBriefing, e: React.MouseEvent) {
    e.stopPropagation();
    if (!secret || updatingTrafficId) return;
    setUpdatingTrafficId(t.id);
    try {
      const res = await fetch("/api/traffic-briefing", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-secret": secret },
        body: JSON.stringify({ id: t.id, attended: !t.attended }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Erro.");
      setTrafficBriefings((prev) => prev.map((x) => x.id === t.id ? { ...x, attended: !x.attended } : x));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro.");
    } finally { setUpdatingTrafficId(null); }
  }

  useEffect(() => {
    if (secret) { fetchBriefings(secret); fetchTrafficBriefings(secret); }
  }, [secret, fetchBriefings, fetchTrafficBriefings]);

  const filteredSite = filterSite === "pending" ? briefings.filter((b) => !b.attended) : briefings;
  const filteredTraffic = filterTraffic === "pending" ? trafficBriefings.filter((t) => !t.attended) : trafficBriefings;
  const pendingSite = briefings.filter((b) => !b.attended).length;
  const pendingTraffic = trafficBriefings.filter((t) => !t.attended).length;

  return (
    <main className="min-h-screen bg-[#0a0a0b] font-sans text-white">
      <div className="section-container mx-auto max-w-5xl px-4 py-10 sm:px-6">
        {secret ? (
          <>
            {/* Header */}
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="font-[family-name:var(--font-space)] text-2xl font-bold text-white sm:text-3xl">
                  Admin — Briefings
                </h1>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="rounded-full border border-[#22c55e]/20 bg-[#22c55e]/10 px-3 py-0.5 font-mono text-xs text-[#22c55e]">
                    {briefings.length} site
                    {pendingSite > 0 && <span className="ml-1 text-yellow-400">({pendingSite} pendente{pendingSite > 1 ? "s" : ""})</span>}
                  </span>
                  <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-0.5 font-mono text-xs text-blue-400">
                    {trafficBriefings.length} tráfego
                    {pendingTraffic > 0 && <span className="ml-1 text-yellow-400">({pendingTraffic} pendente{pendingTraffic > 1 ? "s" : ""})</span>}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={loadingBriefings || loadingTraffic}
                  className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900/80 px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-[#22c55e]/40 hover:text-white disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 ${loadingBriefings || loadingTraffic ? "animate-spin" : ""}`} />
                  Atualizar
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900/80 px-4 py-2.5 text-sm font-medium text-zinc-400 transition hover:border-red-500/40 hover:text-red-400"
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </button>
                <Link href="/" className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-400 transition hover:border-[#22c55e]/40 hover:text-white">
                  <ArrowLeft className="h-4 w-4" />
                  Site
                </Link>
              </div>
            </div>

            {error && (
              <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>
            )}

            {/* Tabs */}
            <div className="mb-6 flex gap-1 rounded-xl border border-zinc-800 bg-[#111113] p-1">
              <button
                type="button"
                onClick={() => setActiveTab("site")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                  activeTab === "site"
                    ? "bg-[#22c55e]/15 text-[#22c55e]"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <Globe className="h-4 w-4" />
                Site / Páginas
                {briefings.length > 0 && (
                  <span className={`rounded-full px-1.5 py-0.5 font-mono text-[10px] ${activeTab === "site" ? "bg-[#22c55e]/20 text-[#22c55e]" : "bg-zinc-800 text-zinc-500"}`}>
                    {briefings.length}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("traffic")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                  activeTab === "traffic"
                    ? "bg-blue-500/15 text-blue-400"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <TrendingUp className="h-4 w-4" />
                Tráfego
                {trafficBriefings.length > 0 && (
                  <span className={`rounded-full px-1.5 py-0.5 font-mono text-[10px] ${activeTab === "traffic" ? "bg-blue-500/20 text-blue-400" : "bg-zinc-800 text-zinc-500"}`}>
                    {trafficBriefings.length}
                  </span>
                )}
              </button>
            </div>

            {/* Tab: Site */}
            {activeTab === "site" && (
              <section>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h2 className="font-[family-name:var(--font-space)] text-base font-bold text-white">
                    Briefings de site
                  </h2>
                  {briefings.length > 0 && (
                    <div className="flex gap-1 rounded-lg border border-zinc-800 bg-zinc-900 p-0.5">
                      {(["all", "pending"] as const).map((f) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => setFilterSite(f)}
                          className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                            filterSite === f ? "bg-zinc-700 text-white" : "text-zinc-500 hover:text-zinc-300"
                          }`}
                        >
                          {f === "all" ? "Todos" : `Pendentes (${pendingSite})`}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {loadingBriefings && briefings.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-zinc-800 bg-[#111113] py-16">
                    <RefreshCw className="mb-3 h-8 w-8 animate-spin text-[#22c55e]" />
                    <p className="text-sm text-zinc-500">Carregando...</p>
                  </div>
                ) : filteredSite.length === 0 ? (
                  <div className="rounded-2xl border border-zinc-800 bg-[#111113] px-6 py-14 text-center">
                    <MessageSquare className="mx-auto mb-3 h-10 w-10 text-zinc-700" />
                    <p className="text-sm text-zinc-500">
                      {briefings.length === 0 ? "Nenhum briefing de site ainda." : "Nenhum briefing pendente."}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredSite.map((b) => (
                      <Fragment key={b.id}>
                        <div
                          className={`cursor-pointer overflow-hidden rounded-2xl border transition ${
                            b.attended ? "border-zinc-800 bg-[#111113]" : "border-zinc-700 bg-[#111113] hover:border-zinc-600"
                          }`}
                          onClick={() => setExpandedSiteId(expandedSiteId === b.id ? null : b.id)}
                        >
                          <div className="flex flex-wrap items-start gap-3 p-4 sm:p-5">
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-semibold text-white">{b.name}</span>
                                {b.plan && (
                                  <span className="rounded-full bg-[#22c55e]/15 px-2 py-0.5 font-mono text-[10px] text-[#22c55e]">
                                    {b.plan}
                                  </span>
                                )}
                                {!b.attended && (
                                  <span className="rounded-full bg-yellow-500/10 px-2 py-0.5 font-mono text-[10px] text-yellow-400">
                                    Novo
                                  </span>
                                )}
                              </div>
                              <p className="mt-0.5 truncate text-sm text-zinc-400" title={b.product}>{b.product}</p>
                              <div className="mt-2 flex flex-wrap gap-3 text-xs text-zinc-500">
                                <WaLink phone={b.whatsapp}>{b.whatsapp}</WaLink>
                                <span>·</span>
                                <span>{fmt(b.created_at)}</span>
                                <span>·</span>
                                <span>Prazo: {b.deadline}</span>
                              </div>
                            </div>
                            <div className="flex shrink-0 items-center gap-2" onClick={(e) => e.stopPropagation()}>
                              <AttendedBtn
                                attended={b.attended ?? false}
                                updating={updatingId === b.id}
                                onToggle={(e) => handleToggleAttended(b, e)}
                              />
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setExpandedSiteId(expandedSiteId === b.id ? null : b.id); }}
                                className="rounded-lg border border-zinc-700 p-1.5 text-zinc-500 transition hover:text-zinc-300"
                              >
                                {expandedSiteId === b.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                              </button>
                            </div>
                          </div>

                          {expandedSiteId === b.id && (
                            <div className="border-t border-zinc-800 bg-zinc-900/40 px-4 py-4 sm:px-5">
                              <div className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
                                {[
                                  ["O que vende", b.product],
                                  ["Cliente ideal", b.audience],
                                  ["Transformação entregue", b.benefit],
                                  ["Ação na página (CTA)", b.cta],
                                  ["Preço / condições", b.pricing],
                                  ["Objeções", b.objections],
                                  ["Materiais", b.materials],
                                  ["Links da marca", b.brand_links],
                                  ["Onde a página fica", b.page_location],
                                  ["Fonte de tráfego", b.traffic],
                                  ["Integração leads", b.integration],
                                  ["Referências", b.refs],
                                  ["Restrições", b.restrictions],
                                ].map(([label, value]) => (
                                  value && (
                                    <div key={label as string}>
                                      <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">{label}</span>
                                      <p className="mt-0.5 text-zinc-300">{value}</p>
                                    </div>
                                  )
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </Fragment>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* Tab: Tráfego */}
            {activeTab === "traffic" && (
              <section>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h2 className="font-[family-name:var(--font-space)] text-base font-bold text-white">
                    Briefings de tráfego
                  </h2>
                  {trafficBriefings.length > 0 && (
                    <div className="flex gap-1 rounded-lg border border-zinc-800 bg-zinc-900 p-0.5">
                      {(["all", "pending"] as const).map((f) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => setFilterTraffic(f)}
                          className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                            filterTraffic === f ? "bg-zinc-700 text-white" : "text-zinc-500 hover:text-zinc-300"
                          }`}
                        >
                          {f === "all" ? "Todos" : `Pendentes (${pendingTraffic})`}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {loadingTraffic && trafficBriefings.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-zinc-800 bg-[#111113] py-16">
                    <RefreshCw className="mb-3 h-8 w-8 animate-spin text-blue-400" />
                    <p className="text-sm text-zinc-500">Carregando...</p>
                  </div>
                ) : filteredTraffic.length === 0 ? (
                  <div className="rounded-2xl border border-zinc-800 bg-[#111113] px-6 py-14 text-center">
                    <TrendingUp className="mx-auto mb-3 h-10 w-10 text-zinc-700" />
                    <p className="text-sm text-zinc-500">
                      {trafficBriefings.length === 0 ? "Nenhum briefing de tráfego ainda." : "Nenhum briefing pendente."}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredTraffic.map((t) => (
                      <div
                        key={t.id}
                        className={`cursor-pointer overflow-hidden rounded-2xl border transition ${
                          t.attended ? "border-zinc-800 bg-[#111113]" : "border-zinc-700 bg-[#111113] hover:border-zinc-600"
                        }`}
                        onClick={() => setExpandedTrafficId(expandedTrafficId === t.id ? null : t.id)}
                      >
                        <div className="flex flex-wrap items-start gap-3 p-4 sm:p-5">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-semibold text-white">{t.name}</span>
                              {!t.attended && (
                                <span className="rounded-full bg-yellow-500/10 px-2 py-0.5 font-mono text-[10px] text-yellow-400">
                                  Novo
                                </span>
                              )}
                            </div>
                            <p className="mt-0.5 text-sm text-zinc-400">{t.email}</p>
                            <div className="mt-2 flex flex-wrap gap-3 text-xs text-zinc-500">
                              <WaLink phone={t.whatsapp}>{t.whatsapp}</WaLink>
                              <span>·</span>
                              <span>{fmt(t.created_at)}</span>
                              {t.budget && <><span>·</span><span className="text-zinc-400">Orçamento: {t.budget}</span></>}
                            </div>
                          </div>
                          <div className="flex shrink-0 items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            <AttendedBtn
                              attended={t.attended ?? false}
                              updating={updatingTrafficId === t.id}
                              onToggle={(e) => handleToggleTrafficAttended(t, e)}
                            />
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); setExpandedTrafficId(expandedTrafficId === t.id ? null : t.id); }}
                              className="rounded-lg border border-zinc-700 p-1.5 text-zinc-500 transition hover:text-zinc-300"
                            >
                              {expandedTrafficId === t.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>

                        {expandedTrafficId === t.id && (
                          <div className="border-t border-zinc-800 bg-zinc-900/40 px-4 py-4 sm:px-5">
                            <div className="space-y-4 text-sm">
                              <div>
                                <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">Negócio e situação atual</span>
                                <p className="mt-1 whitespace-pre-wrap leading-relaxed text-zinc-300">{t.current_situation}</p>
                              </div>
                              <div>
                                <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">Objetivos e plataformas</span>
                                <p className="mt-1 whitespace-pre-wrap leading-relaxed text-zinc-300">{t.goals}</p>
                              </div>
                              {t.budget && (
                                <div>
                                  <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">Orçamento mensal</span>
                                  <p className="mt-1 text-zinc-300">{t.budget}</p>
                                </div>
                              )}
                              <div className="pt-1">
                                <a
                                  href={`https://wa.me/55${t.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(`Olá ${t.name}, recebi seu briefing de gestão de tráfego. Vou analisar e te retorno em breve!`)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 rounded-lg bg-[#22c55e]/15 px-4 py-2 text-sm font-medium text-[#22c55e] transition hover:bg-[#22c55e]/25"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Responder no WhatsApp
                                </a>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}
          </>
        ) : (
          <div className="mx-auto max-w-md">
            <div className="mb-8">
              <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-white">
                <ArrowLeft className="h-4 w-4" />
                Voltar ao site
              </Link>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-[#111113] p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#22c55e]/20 bg-[#22c55e]/10">
                  <Lock className="h-6 w-6 text-[#22c55e]" />
                </div>
                <div>
                  <h1 className="font-[family-name:var(--font-space)] text-xl font-bold text-white">Área admin</h1>
                  <p className="text-sm text-zinc-500">Briefings recebidos</p>
                </div>
              </div>
              <form onSubmit={handleLogin} className="space-y-4">
                <label htmlFor="admin-password" className="block font-mono text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Senha
                </label>
                <input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite a senha de admin"
                  className="w-full rounded-xl border border-zinc-700 bg-[#0a0a0b] px-4 py-3.5 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-[#22c55e]/50 focus:ring-2 focus:ring-[#22c55e]/20"
                  autoFocus
                />
                {error && <p className="text-sm text-red-400">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-[#22c55e] py-3.5 font-semibold text-black transition hover:bg-[#16a34a] disabled:opacity-70"
                >
                  {loading ? "Entrando..." : "Entrar"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
