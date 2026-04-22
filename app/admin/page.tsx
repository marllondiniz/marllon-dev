"use client";

import { useState, useEffect, useCallback, Fragment } from "react";
import Link from "next/link";
import {
  ArrowLeft, Lock, RefreshCw, MessageSquare, LogOut, Trash2,
  Check, Circle, Globe, TrendingUp, ChevronDown, ChevronUp, Baby, BarChart2, Zap,
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

type FormLead = {
  id: string;
  name: string;
  whatsapp: string;
  email: string;
  goal: string;
  source: string;
  created_at: string;
};

const DASHBOARDS_LEAD_SOURCE = "servicos-dashboards";

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
  const [formLeads, setFormLeads] = useState<FormLead[]>([]);
  const [loadingBriefings, setLoadingBriefings] = useState(false);
  const [loadingTraffic, setLoadingTraffic] = useState(false);
  const [loadingFormLeads, setLoadingFormLeads] = useState(false);
  /** Erro só do GET /api/leads — não bloqueia Site/Tráfego */
  const [formLeadsError, setFormLeadsError] = useState<string | null>(null);

  const [expandedSiteId, setExpandedSiteId] = useState<string | null>(null);
  const [expandedTrafficId, setExpandedTrafficId] = useState<string | null>(null);
  const [expandedFormLeadId, setExpandedFormLeadId] = useState<string | null>(null);
  const [deletingFormLeadId, setDeletingFormLeadId] = useState<string | null>(null);
  const [deletingSiteId, setDeletingSiteId] = useState<string | null>(null);
  const [deletingTrafficBId, setDeletingTrafficBId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [updatingTrafficId, setUpdatingTrafficId] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<"site" | "traffic" | "leadsDemo" | "leadsDashboards">("site");
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

  const fetchFormLeads = useCallback(async (s: string) => {
    setLoadingFormLeads(true);
    setFormLeadsError(null);
    try {
      const res = await fetch("/api/leads", { headers: { "x-admin-secret": s } });
      if (res.status === 401) {
        setSecret(null);
        setError("Senha incorreta.");
        return;
      }
      if (!res.ok) {
        const d = (await res.json().catch(() => ({}))) as { error?: string };
        setFormLeads([]);
        setFormLeadsError(d.error || "Erro ao carregar leads.");
        return;
      }
      const data = await res.json();
      setFormLeads(data.leads ?? []);
    } finally {
      setLoadingFormLeads(false);
    }
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
        await fetchFormLeads(s);
        return;
      }
      setError("Erro ao acessar.");
    } finally { setLoading(false); }
  }

  function handleLogout() {
    setSecret(null); setPassword("");
    setBriefings([]); setTrafficBriefings([]); setFormLeads([]);
    setFormLeadsError(null);
    setDeletingFormLeadId(null);
    setDeletingSiteId(null);
    setDeletingTrafficBId(null);
    setExpandedSiteId(null); setExpandedTrafficId(null); setExpandedFormLeadId(null);
  }

  function handleRefresh() {
    if (secret) { fetchBriefings(secret); fetchTrafficBriefings(secret); fetchFormLeads(secret); }
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

  async function handleDeleteSiteBriefing(b: Briefing, e: React.MouseEvent) {
    e.stopPropagation();
    if (!secret) return;
    if (!window.confirm("Apagar este briefing de site? Esta ação não pode ser desfeita.")) return;
    setDeletingSiteId(b.id);
    setError("");
    try {
      const res = await fetch(`/api/briefing?id=${encodeURIComponent(b.id)}`, {
        method: "DELETE",
        headers: { "x-admin-secret": secret },
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        throw new Error(data.error || "Erro ao apagar.");
      }
      setBriefings((prev) => prev.filter((x) => x.id !== b.id));
      if (expandedSiteId === b.id) {
        setExpandedSiteId(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao apagar.");
    } finally {
      setDeletingSiteId(null);
    }
  }

  async function handleDeleteTrafficBriefing(t: TrafficBriefing, e: React.MouseEvent) {
    e.stopPropagation();
    if (!secret) return;
    if (!window.confirm("Apagar este briefing de tráfego? Esta ação não pode ser desfeita.")) return;
    setDeletingTrafficBId(t.id);
    setError("");
    try {
      const res = await fetch(`/api/traffic-briefing?id=${encodeURIComponent(t.id)}`, {
        method: "DELETE",
        headers: { "x-admin-secret": secret },
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        throw new Error(data.error || "Erro ao apagar.");
      }
      setTrafficBriefings((prev) => prev.filter((x) => x.id !== t.id));
      if (expandedTrafficId === t.id) {
        setExpandedTrafficId(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao apagar.");
    } finally {
      setDeletingTrafficBId(null);
    }
  }

  async function handleDeleteFormLead(l: FormLead, e: React.MouseEvent) {
    e.stopPropagation();
    if (!secret) return;
    if (!window.confirm("Apagar este lead? Esta ação não pode ser desfeita.")) return;
    setDeletingFormLeadId(l.id);
    setError("");
    try {
      const res = await fetch(`/api/leads?id=${encodeURIComponent(l.id)}`, {
        method: "DELETE",
        headers: { "x-admin-secret": secret },
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        throw new Error(data.error || "Erro ao apagar.");
      }
      setFormLeads((prev) => prev.filter((x) => x.id !== l.id));
      if (expandedFormLeadId === l.id) {
        setExpandedFormLeadId(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao apagar.");
    } finally {
      setDeletingFormLeadId(null);
    }
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
    if (secret) { fetchBriefings(secret); fetchTrafficBriefings(secret); fetchFormLeads(secret); }
  }, [secret, fetchBriefings, fetchTrafficBriefings, fetchFormLeads]);

  const filteredSite = filterSite === "pending" ? briefings.filter((b) => !b.attended) : briefings;
  const filteredTraffic = filterTraffic === "pending" ? trafficBriefings.filter((t) => !t.attended) : trafficBriefings;
  const leadsDemo = formLeads.filter((l) => l.source !== DASHBOARDS_LEAD_SOURCE);
  const leadsDashboards = formLeads.filter((l) => l.source === DASHBOARDS_LEAD_SOURCE);
  const pendingSite = briefings.filter((b) => !b.attended).length;
  const pendingTraffic = trafficBriefings.filter((t) => !t.attended).length;

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        {secret ? (
          <>
            <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-lg font-semibold text-white">Briefings</h1>
                <p className="mt-0.5 text-xs text-zinc-500">
                  Site: {briefings.length} {pendingSite > 0 && `(${pendingSite} pendente${pendingSite > 1 ? "s" : ""})`} ·
                  Tráfego: {trafficBriefings.length}{" "}
                  {pendingTraffic > 0 && `(${pendingTraffic} pendente${pendingTraffic > 1 ? "s" : ""})`} · Form demo:{" "}
                  {leadsDemo.length} · Painéis: {leadsDashboards.length}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={loadingBriefings || loadingTraffic || loadingFormLeads}
                  className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-white disabled:opacity-50"
                  title="Atualizar"
                >
                  <RefreshCw
                    className={`inline h-3.5 w-3.5 ${loadingBriefings || loadingTraffic || loadingFormLeads ? "animate-spin" : ""}`}
                  />
                </button>
                <Link href="/admin/trafego" className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-white">
                  <TrendingUp className="inline h-3.5 w-3.5" /> Métricas Meta
                </Link>
                <Link href="/admin/enxoval" className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-white">
                  <Baby className="inline h-3.5 w-3.5" /> Enxoval
                </Link>
                <Link href="/" className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-white">
                  ← Site
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 hover:border-red-500/40 hover:text-red-400"
                >
                  Sair
                </button>
              </div>
            </header>

            {error && (
              <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</div>
            )}

            {formLeadsError && (
              <div className="mb-4 rounded-lg border border-amber-500/35 bg-amber-500/10 px-3 py-2 text-sm text-amber-100/95">
                <p className="text-xs font-medium text-amber-200">Leads (Form demo / Painéis) — falha ao carregar</p>
                <p className="mt-1 font-mono text-[11px] leading-relaxed text-amber-100/80">{formLeadsError}</p>
                <button
                  type="button"
                  onClick={() => setFormLeadsError(null)}
                  className="mt-2 text-xs text-amber-300/80 underline hover:text-amber-200"
                >
                  Dispensar
                </button>
              </div>
            )}

            <nav className="mb-6 flex flex-wrap gap-1 rounded-lg bg-zinc-900/50 p-1">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("site");
                  setExpandedFormLeadId(null);
                }}
                className={`flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-sm sm:flex-none sm:px-3 ${
                  activeTab === "site" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <Globe className="h-4 w-4" />
                Site ({briefings.length})
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("traffic");
                  setExpandedFormLeadId(null);
                }}
                className={`flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-sm sm:flex-none sm:px-3 ${
                  activeTab === "traffic" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <TrendingUp className="h-4 w-4" />
                Tráfego ({trafficBriefings.length})
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("leadsDemo");
                  setExpandedFormLeadId(null);
                }}
                className={`flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-sm sm:flex-none sm:px-3 ${
                  activeTab === "leadsDemo" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <Zap className="h-4 w-4" />
                Form demo ({leadsDemo.length})
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("leadsDashboards");
                  setExpandedFormLeadId(null);
                }}
                className={`flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-sm sm:flex-none sm:px-3 ${
                  activeTab === "leadsDashboards" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <BarChart2 className="h-4 w-4" />
                Painéis ({leadsDashboards.length})
              </button>
            </nav>

            {activeTab === "site" && (
              <section className="space-y-4">
                {briefings.length > 0 && (
                  <div className="flex gap-1 rounded-lg bg-zinc-900/50 p-1">
                    {(["all", "pending"] as const).map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setFilterSite(f)}
                        className={`rounded-md px-3 py-1.5 text-xs ${
                          filterSite === f ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        {f === "all" ? "Todos" : `Pendentes (${pendingSite})`}
                      </button>
                    ))}
                  </div>
                )}

                {loadingBriefings && briefings.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/50 py-12">
                    <RefreshCw className="mb-2 h-6 w-6 animate-spin text-emerald-400" />
                    <p className="text-sm text-zinc-500">Carregando...</p>
                  </div>
                ) : filteredSite.length === 0 ? (
                  <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 py-12 text-center">
                    <MessageSquare className="mx-auto mb-2 h-8 w-8 text-zinc-600" />
                    <p className="text-sm text-zinc-500">
                      {briefings.length === 0 ? "Nenhum briefing ainda." : "Nenhum pendente."}
                    </p>
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {filteredSite.map((b) => (
                      <Fragment key={b.id}>
                        <li
                          className={`cursor-pointer overflow-hidden rounded-lg border transition ${
                            b.attended ? "border-zinc-800 bg-zinc-900/50" : "border-zinc-700 bg-zinc-900/50 hover:border-zinc-600"
                          }`}
                          onClick={() => setExpandedSiteId(expandedSiteId === b.id ? null : b.id)}
                        >
                          <div className="flex flex-wrap items-start gap-3 p-3 sm:p-4">
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
                          <div className="flex shrink-0 items-center gap-0.5 sm:gap-1" onClick={(e) => e.stopPropagation()}>
                            <AttendedBtn
                              attended={b.attended ?? false}
                              updating={updatingId === b.id}
                              onToggle={(e) => handleToggleAttended(b, e)}
                            />
                            <button
                              type="button"
                              onClick={(e) => handleDeleteSiteBriefing(b, e)}
                              disabled={deletingSiteId === b.id}
                              title="Apagar briefing"
                              className="rounded p-1.5 text-zinc-500 transition hover:bg-red-500/15 hover:text-red-400 disabled:opacity-50"
                            >
                              {deletingSiteId === b.id ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); setExpandedSiteId(expandedSiteId === b.id ? null : b.id); }}
                              className="rounded p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
                            >
                              {expandedSiteId === b.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </button>
                          </div>
                          </div>

                          {expandedSiteId === b.id && (
                            <div className="border-t border-zinc-800 bg-zinc-900/30 px-4 py-3 sm:px-5">
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
                        </li>
                      </Fragment>
                    ))}
                  </ul>
                )}
              </section>
            )}

            {activeTab === "traffic" && (
              <section className="space-y-4">
                {trafficBriefings.length > 0 && (
                  <div className="flex gap-1 rounded-lg bg-zinc-900/50 p-1">
                    {(["all", "pending"] as const).map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setFilterTraffic(f)}
                        className={`rounded-md px-3 py-1.5 text-xs ${
                          filterTraffic === f ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        {f === "all" ? "Todos" : `Pendentes (${pendingTraffic})`}
                      </button>
                    ))}
                  </div>
                )}

                {loadingTraffic && trafficBriefings.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/50 py-12">
                    <RefreshCw className="mb-2 h-6 w-6 animate-spin text-emerald-400" />
                    <p className="text-sm text-zinc-500">Carregando...</p>
                  </div>
                ) : filteredTraffic.length === 0 ? (
                  <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 py-12 text-center">
                    <TrendingUp className="mx-auto mb-2 h-8 w-8 text-zinc-600" />
                    <p className="text-sm text-zinc-500">
                      {trafficBriefings.length === 0 ? "Nenhum briefing ainda." : "Nenhum pendente."}
                    </p>
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {filteredTraffic.map((t) => (
                      <li
                        key={t.id}
                        className={`cursor-pointer overflow-hidden rounded-lg border transition ${
                          t.attended ? "border-zinc-800 bg-zinc-900/50" : "border-zinc-700 bg-zinc-900/50 hover:border-zinc-600"
                        }`}
                        onClick={() => setExpandedTrafficId(expandedTrafficId === t.id ? null : t.id)}
                      >
                        <div className="flex flex-wrap items-start gap-3 p-3 sm:p-4">
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
                          <div className="flex shrink-0 items-center gap-0.5 sm:gap-1" onClick={(e) => e.stopPropagation()}>
                            <AttendedBtn
                              attended={t.attended ?? false}
                              updating={updatingTrafficId === t.id}
                              onToggle={(e) => handleToggleTrafficAttended(t, e)}
                            />
                            <button
                              type="button"
                              onClick={(e) => handleDeleteTrafficBriefing(t, e)}
                              disabled={deletingTrafficBId === t.id}
                              title="Apagar briefing"
                              className="rounded p-1.5 text-zinc-500 transition hover:bg-red-500/15 hover:text-red-400 disabled:opacity-50"
                            >
                              {deletingTrafficBId === t.id ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); setExpandedTrafficId(expandedTrafficId === t.id ? null : t.id); }}
                              className="rounded p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
                            >
                              {expandedTrafficId === t.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>

                        {expandedTrafficId === t.id && (
                          <div className="border-t border-zinc-800 bg-zinc-900/30 px-4 py-3 sm:px-5">
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
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            )}

            {activeTab === "leadsDemo" && (
              <section className="space-y-4">
                {loadingFormLeads && formLeads.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/50 py-12">
                    <RefreshCw className="mb-2 h-6 w-6 animate-spin text-emerald-400" />
                    <p className="text-sm text-zinc-500">Carregando...</p>
                  </div>
                ) : leadsDemo.length === 0 ? (
                  <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 py-12 text-center">
                    <Zap className="mx-auto mb-2 h-8 w-8 text-zinc-600" />
                    <p className="text-sm text-zinc-500">Nenhum lead de formulário (demo/outras fontes).</p>
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {leadsDemo.map((l) => (
                      <li
                        key={l.id}
                        className="cursor-pointer overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900/50 transition hover:border-zinc-600"
                        onClick={() => setExpandedFormLeadId(expandedFormLeadId === l.id ? null : l.id)}
                      >
                        <div className="flex flex-wrap items-start gap-3 p-3 sm:p-4">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-semibold text-white">{l.name}</span>
                              <span className="rounded-full bg-zinc-800 px-2 py-0.5 font-mono text-[10px] text-zinc-400">
                                {l.source}
                              </span>
                            </div>
                            <p className="mt-0.5 truncate text-sm text-zinc-400">{l.email}</p>
                            <div className="mt-2 flex flex-wrap gap-3 text-xs text-zinc-500">
                              <WaLink phone={l.whatsapp}>{l.whatsapp}</WaLink>
                              <span>·</span>
                              <span>{fmt(l.created_at)}</span>
                            </div>
                          </div>
                          <div className="flex shrink-0 items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={(e) => handleDeleteFormLead(l, e)}
                              disabled={deletingFormLeadId === l.id}
                              title="Apagar lead"
                              className="rounded p-1.5 text-zinc-500 transition hover:bg-red-500/15 hover:text-red-400 disabled:opacity-50"
                            >
                              {deletingFormLeadId === l.id ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedFormLeadId(expandedFormLeadId === l.id ? null : l.id);
                              }}
                              className="rounded p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
                            >
                              {expandedFormLeadId === l.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                        {expandedFormLeadId === l.id && (
                          <div className="border-t border-zinc-800 bg-zinc-900/30 px-4 py-3 sm:px-5">
                            <div className="space-y-3 text-sm">
                              <div>
                                <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">Briefing (goal)</span>
                                <p className="mt-1 whitespace-pre-wrap leading-relaxed text-zinc-300">{l.goal}</p>
                              </div>
                              <a
                                href={`https://wa.me/55${l.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
                                  `Olá ${l.name}, recebi seu pedido pelo site. Vou te retornar em breve!`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-lg bg-[#22c55e]/15 px-4 py-2 text-sm font-medium text-[#22c55e] transition hover:bg-[#22c55e]/25"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Responder no WhatsApp
                              </a>
                            </div>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            )}

            {activeTab === "leadsDashboards" && (
              <section className="space-y-4">
                {loadingFormLeads && formLeads.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/50 py-12">
                    <RefreshCw className="mb-2 h-6 w-6 animate-spin text-emerald-400" />
                    <p className="text-sm text-zinc-500">Carregando...</p>
                  </div>
                ) : leadsDashboards.length === 0 ? (
                  <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 py-12 text-center">
                    <BarChart2 className="mx-auto mb-2 h-8 w-8 text-zinc-600" />
                    <p className="text-sm text-zinc-500">Nenhum briefing de painéis ainda.</p>
                    <p className="mt-1 text-xs text-zinc-600">Fonte: /briefing-dashboards (servicos-dashboards)</p>
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {leadsDashboards.map((l) => (
                      <li
                        key={l.id}
                        className="cursor-pointer overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900/50 transition hover:border-zinc-600"
                        onClick={() => setExpandedFormLeadId(expandedFormLeadId === l.id ? null : l.id)}
                      >
                        <div className="flex flex-wrap items-start gap-3 p-3 sm:p-4">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-semibold text-white">{l.name}</span>
                              <span className="rounded-full bg-[#22c55e]/15 px-2 py-0.5 font-mono text-[10px] text-[#22c55e]">
                                Briefing painéis
                              </span>
                            </div>
                            <p className="mt-0.5 truncate text-sm text-zinc-400">{l.email}</p>
                            <div className="mt-2 flex flex-wrap gap-3 text-xs text-zinc-500">
                              <WaLink phone={l.whatsapp}>{l.whatsapp}</WaLink>
                              <span>·</span>
                              <span>{fmt(l.created_at)}</span>
                            </div>
                          </div>
                          <div className="flex shrink-0 items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={(e) => handleDeleteFormLead(l, e)}
                              disabled={deletingFormLeadId === l.id}
                              title="Apagar lead"
                              className="rounded p-1.5 text-zinc-500 transition hover:bg-red-500/15 hover:text-red-400 disabled:opacity-50"
                            >
                              {deletingFormLeadId === l.id ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedFormLeadId(expandedFormLeadId === l.id ? null : l.id);
                              }}
                              className="rounded p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
                            >
                              {expandedFormLeadId === l.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                        {expandedFormLeadId === l.id && (
                          <div className="border-t border-zinc-800 bg-zinc-900/30 px-4 py-3 sm:px-5">
                            <div className="space-y-3 text-sm">
                              <div>
                                <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">Conteúdo do briefing</span>
                                <p className="mt-1 whitespace-pre-wrap leading-relaxed text-zinc-300">{l.goal}</p>
                              </div>
                              <a
                                href={`https://wa.me/55${l.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
                                  `Olá ${l.name}, recebi seu briefing de dashboards. Vou analisar e te retorno em breve!`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-lg bg-[#22c55e]/15 px-4 py-2 text-sm font-medium text-[#22c55e] transition hover:bg-[#22c55e]/25"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Responder no WhatsApp
                              </a>
                            </div>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
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
                    <h1 className="font-semibold text-white">Admin</h1>
                    <p className="text-xs text-zinc-500">Briefings recebidos</p>
                  </div>
                </div>
                <form onSubmit={handleLogin} className="space-y-3">
                  <input
                    id="admin-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Senha"
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20"
                    autoFocus
                  />
                  {error && <p className="text-xs text-red-400">{error}</p>}
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
