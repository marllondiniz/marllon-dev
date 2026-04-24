"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Banknote, LineChart, Pencil, Plus, RefreshCw, Trash2, Wallet, X } from "lucide-react";
import { trafficInvestPanelAccent, type DashboardBrandVariant } from "@/app/components/MetaTrafficDashboard";
import { trafficPortalKind } from "@/lib/traffic-portal-slugs";

export type TrafficFinanceiroClient = { slug: string; name: string };

type TrafficInvestmentRow = {
  id: string;
  client_slug: string;
  /** Legado / observação opcional — novos lançamentos ficam vazios (conta já está no seletor). */
  person_name: string;
  investment_text: string;
  received_text?: string | null;
  created_at: string;
};

function formatInvestmentApiError(
  json: { error?: string; hint?: string; details?: string },
  fallback: string
) {
  const lines = [json.error || fallback, json.hint, json.details].filter((x) => typeof x === "string" && x.trim());
  return lines.join("\n\n");
}

function formatRowDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

type TrafficAdminFinanceiroPanelProps = {
  secret: string;
  clients: TrafficFinanceiroClient[];
  onSessionInvalid?: () => void;
};

export function TrafficAdminFinanceiroPanel({
  secret,
  clients,
  onSessionInvalid,
}: TrafficAdminFinanceiroPanelProps) {
  const [slug, setSlug] = useState<string>("");
  const [loadingInvestments, setLoadingInvestments] = useState(false);
  const [investmentRows, setInvestmentRows] = useState<TrafficInvestmentRow[]>([]);
  const [investmentsError, setInvestmentsError] = useState<string | null>(null);
  const [newInvestmentText, setNewInvestmentText] = useState("");
  const [newReceivedText, setNewReceivedText] = useState("");
  const [savingNew, setSavingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editInvestmentText, setEditInvestmentText] = useState("");
  const [editReceivedText, setEditReceivedText] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!clients.length) return;
    if (!clients.some((c) => c.slug === slug)) {
      setSlug(clients[0]!.slug);
    }
  }, [clients, slug]);

  const investmentClientSlug = useMemo(() => {
    if (!clients.length) return slug;
    if (slug && clients.some((c) => c.slug === slug)) return slug;
    return clients[0]!.slug;
  }, [clients, slug]);

  const investmentClientLabel = useMemo(() => {
    return clients.find((c) => c.slug === investmentClientSlug)?.name?.trim() ?? null;
  }, [clients, investmentClientSlug]);

  const showNoteColumn = useMemo(
    () => investmentRows.some((r) => (r.person_name ?? "").trim()),
    [investmentRows]
  );

  const portal = trafficPortalKind(slug);
  const dashboardBrand: DashboardBrandVariant =
    portal === "easybee" ? "easybee" : portal === "luzdoluar" ? "luzdoluar" : "default";
  const invAccent = trafficInvestPanelAccent(dashboardBrand);

  const fetchInvestments = useCallback(
    async (s: string, clientSlug: string) => {
      setLoadingInvestments(true);
      setInvestmentsError(null);
      try {
        const url = new URL("/api/traffic-admin-investments", window.location.origin);
        url.searchParams.set("slug", clientSlug);
        const res = await fetch(url.toString(), { headers: { "x-admin-secret": s } });
        if (res.status === 401) {
          setInvestmentsError("Não autorizado.");
          setInvestmentRows([]);
          onSessionInvalid?.();
          return;
        }
        const json = (await res.json()) as {
          rows?: TrafficInvestmentRow[];
          error?: string;
          hint?: string;
          details?: string;
        };
        if (!res.ok) {
          setInvestmentsError(formatInvestmentApiError(json, "Erro ao carregar investimentos."));
          setInvestmentRows([]);
          return;
        }
        setInvestmentRows(json.rows ?? []);
      } catch {
        setInvestmentsError("Falha ao carregar investimentos.");
        setInvestmentRows([]);
      } finally {
        setLoadingInvestments(false);
      }
    },
    [onSessionInvalid]
  );

  useEffect(() => {
    setEditingId(null);
    setEditInvestmentText("");
    setEditReceivedText("");
    fetchInvestments(secret, investmentClientSlug);
  }, [secret, investmentClientSlug, fetchInvestments]);

  async function handleAddInvestment() {
    const inv = newInvestmentText.trim();
    const rec = newReceivedText.trim();
    if (!inv || !rec) return;
    setSavingNew(true);
    setInvestmentsError(null);
    try {
      const res = await fetch("/api/traffic-admin-investments", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-secret": secret },
        body: JSON.stringify({
          client_slug: investmentClientSlug,
          person_name: "",
          investment_text: inv,
          received_text: rec,
        }),
      });
      const json = (await res.json()) as { error?: string; hint?: string; details?: string };
      if (res.status === 401) {
        onSessionInvalid?.();
        return;
      }
      if (!res.ok) {
        setInvestmentsError(formatInvestmentApiError(json, "Erro ao salvar."));
        return;
      }
      setNewInvestmentText("");
      setNewReceivedText("");
      await fetchInvestments(secret, investmentClientSlug);
    } finally {
      setSavingNew(false);
    }
  }

  function startEdit(row: TrafficInvestmentRow) {
    setEditingId(row.id);
    setEditInvestmentText(row.investment_text);
    setEditReceivedText(row.received_text?.trim() ?? "");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditInvestmentText("");
    setEditReceivedText("");
  }

  async function handleSaveEdit() {
    if (!editingId) return;
    const inv = editInvestmentText.trim();
    const rec = editReceivedText.trim();
    if (!inv || !rec) return;
    setSavingEdit(true);
    setInvestmentsError(null);
    try {
      const res = await fetch("/api/traffic-admin-investments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-secret": secret },
        body: JSON.stringify({
          id: editingId,
          investment_text: inv,
          received_text: rec,
        }),
      });
      const json = (await res.json()) as { error?: string; hint?: string; details?: string };
      if (res.status === 401) {
        onSessionInvalid?.();
        return;
      }
      if (!res.ok) {
        setInvestmentsError(formatInvestmentApiError(json, "Erro ao atualizar."));
        return;
      }
      cancelEdit();
      await fetchInvestments(secret, investmentClientSlug);
    } finally {
      setSavingEdit(false);
    }
  }

  async function handleDeleteRow(id: string) {
    if (!window.confirm("Remover este registro?")) return;
    setDeletingId(id);
    setInvestmentsError(null);
    try {
      const res = await fetch(`/api/traffic-admin-investments?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: { "x-admin-secret": secret },
      });
      const json = (await res.json()) as { error?: string; hint?: string; details?: string };
      if (res.status === 401) {
        onSessionInvalid?.();
        return;
      }
      if (!res.ok) {
        setInvestmentsError(formatInvestmentApiError(json, "Erro ao apagar."));
        return;
      }
      if (editingId === id) cancelEdit();
      await fetchInvestments(secret, investmentClientSlug);
    } finally {
      setDeletingId(null);
    }
  }

  const selectFocus =
    portal === "easybee"
      ? "focus:border-amber-500/55 focus:ring-amber-500/25"
      : portal === "luzdoluar"
        ? "focus:border-[#c5a47e]/55 focus:ring-[#c5a47e]/22"
        : "focus:border-emerald-500/50 focus:ring-emerald-500/20";

  const inputCls =
    "w-full rounded-xl border border-zinc-700/80 bg-zinc-950/80 px-3 py-2.5 text-sm text-white placeholder-zinc-600 transition focus:outline-none focus:ring-1 " +
    invAccent.inputFocus;

  const activeAccount = (investmentClientLabel ?? investmentClientSlug) || "conta atual";

  return (
    <div className="space-y-6">
      {clients.length > 0 ? (
        <div
          className={`rounded-2xl border px-4 py-4 sm:px-5 sm:py-5 ${invAccent.formWrap}`}
        >
          <label
            htmlFor="financeiro-client-slug"
            className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500"
          >
            Conta (cliente)
          </label>
          <select
            id="financeiro-client-slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className={
              "mt-2 w-full max-w-lg rounded-xl border border-zinc-700/80 bg-zinc-950/90 px-3 py-2.5 text-sm font-medium text-white transition focus:outline-none focus:ring-1 sm:text-base " +
              selectFocus
            }
          >
            {clients.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
          <p className="mt-2 text-[11px] leading-relaxed text-zinc-500">
            Os lançamentos abaixo são só de{" "}
            <span className={`font-medium ${invAccent.titleName}`}>{activeAccount}</span>
            {showNoteColumn ? (
              <>
                . Registros antigos podem ter uma <span className="text-zinc-400">nota</span> na tabela.
              </>
            ) : (
              "."
            )}
          </p>
        </div>
      ) : null}

      <section className="space-y-4 text-left" aria-labelledby="admin-traffic-financeiro-title">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 gap-3">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${invAccent.iconWrap}`}
            >
              <Banknote className={`h-5 w-5 ${invAccent.icon}`} aria-hidden />
            </div>
            <div className="min-w-0">
              <h2 id="admin-traffic-financeiro-title" className="text-base font-semibold text-white sm:text-[17px]">
                Lançamentos financeiros
              </h2>
              <p className="mt-0.5 max-w-xl text-[11px] leading-relaxed text-zinc-500">
                Informe o valor que foi para a <span className="text-zinc-400">Meta</span> e{" "}
                <span className="text-zinc-400">quanto você recebeu</span> neste registro. A empresa já está definida
                acima.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => fetchInvestments(secret, investmentClientSlug)}
            disabled={loadingInvestments}
            className={
              "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-zinc-700/80 bg-zinc-900/60 px-3 text-[11px] text-zinc-400 transition disabled:opacity-50 " +
              invAccent.refreshBtn
            }
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loadingInvestments ? "animate-spin" : ""}`} />
            Atualizar lista
          </button>
        </div>

        <div className={`rounded-2xl border p-4 sm:p-5 ${invAccent.formWrap}`}>
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
            Novo lançamento
          </p>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
            <div className="space-y-1.5">
              <label htmlFor="financeiro-inv-meta" className="flex items-center gap-2 text-xs font-medium text-zinc-200">
                <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${invAccent.iconWrap}`}>
                  <LineChart className={`h-3.5 w-3.5 ${invAccent.icon}`} aria-hidden />
                </span>
                Na Meta (mídia)
              </label>
              <p className="text-[10px] text-zinc-600">Valor destinado a anúncios neste lançamento.</p>
              <input
                id="financeiro-inv-meta"
                value={newInvestmentText}
                onChange={(e) => setNewInvestmentText(e.target.value)}
                maxLength={120}
                placeholder="Ex.: R$ 2.000"
                className={inputCls}
              />
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="financeiro-inv-received"
                className="flex items-center gap-2 text-xs font-medium text-zinc-200"
              >
                <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${invAccent.iconWrap}`}>
                  <Wallet className={`h-3.5 w-3.5 ${invAccent.icon}`} aria-hidden />
                </span>
                Eu recebi
              </label>
              <p className="text-[10px] text-zinc-600">Fee, repasse ou valor que entrou para você.</p>
              <input
                id="financeiro-inv-received"
                value={newReceivedText}
                onChange={(e) => setNewReceivedText(e.target.value)}
                maxLength={120}
                placeholder="Ex.: R$ 800"
                className={inputCls}
              />
            </div>
          </div>
          <div className="mt-5 flex flex-col-reverse gap-2 border-t border-zinc-800/50 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => void handleAddInvestment()}
              disabled={savingNew || !newInvestmentText.trim() || !newReceivedText.trim()}
              className={
                "inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold text-white shadow-lg shadow-black/20 transition disabled:opacity-50 sm:w-auto " +
                invAccent.addBtn
              }
            >
              <Plus className="h-4 w-4" />
              Adicionar lançamento
            </button>
          </div>
        </div>

        {investmentsError && (
          <p className="whitespace-pre-wrap text-xs leading-relaxed text-red-400">{investmentsError}</p>
        )}
        {loadingInvestments && investmentRows.length === 0 && !investmentsError ? (
          <p className="text-xs text-zinc-500">Carregando…</p>
        ) : investmentRows.length === 0 ? (
          <p className="rounded-xl border border-zinc-800/80 bg-zinc-950/40 px-4 py-8 text-center text-xs text-zinc-500">
            Nenhum lançamento para esta conta. Preencha os dois valores acima e clique em{" "}
            <span className="text-zinc-400">Adicionar lançamento</span>.
          </p>
        ) : (
          <div className={`overflow-hidden rounded-2xl border ${invAccent.tableWrap}`}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[420px] text-left text-xs">
                <thead>
                  <tr className={`text-[10px] font-semibold uppercase tracking-wide ${invAccent.tableHead}`}>
                    <th className="whitespace-nowrap px-3 py-2.5 sm:px-4">Data</th>
                    {showNoteColumn ? (
                      <th className="min-w-[6rem] px-3 py-2.5 sm:px-4">Nota (legado)</th>
                    ) : null}
                    <th className="px-3 py-2.5 sm:px-4">Na Meta</th>
                    <th className="px-3 py-2.5 sm:px-4">Eu recebi</th>
                    <th className="whitespace-nowrap px-3 py-2.5 text-right sm:px-4">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 bg-zinc-950/20">
                  {investmentRows.map((row) => (
                    <tr key={row.id} className="text-zinc-300">
                      <td className="whitespace-nowrap px-3 py-2.5 font-mono text-[11px] text-zinc-500 sm:px-4">
                        {formatRowDate(row.created_at)}
                      </td>
                      {showNoteColumn ? (
                        <td className="max-w-[140px] px-3 py-2.5 text-zinc-500 sm:px-4">
                          {(row.person_name ?? "").trim() || "—"}
                        </td>
                      ) : null}
                      <td className={`max-w-[160px] px-3 py-2.5 font-medium sm:max-w-[200px] sm:px-4 ${invAccent.investCell}`}>
                        {editingId === row.id ? (
                          <input
                            value={editInvestmentText}
                            onChange={(e) => setEditInvestmentText(e.target.value)}
                            maxLength={120}
                            className="w-full min-w-[6rem] rounded-lg border border-zinc-600 bg-zinc-900 px-2 py-1.5 text-xs text-white"
                          />
                        ) : (
                          <span className="block truncate" title={row.investment_text}>
                            {row.investment_text}
                          </span>
                        )}
                      </td>
                      <td className="max-w-[160px] px-3 py-2.5 font-medium text-zinc-200 sm:max-w-[200px] sm:px-4">
                        {editingId === row.id ? (
                          <input
                            value={editReceivedText}
                            onChange={(e) => setEditReceivedText(e.target.value)}
                            maxLength={120}
                            className="w-full min-w-[6rem] rounded-lg border border-zinc-600 bg-zinc-900 px-2 py-1.5 text-xs text-white"
                          />
                        ) : (
                          <span className="block truncate" title={row.received_text ?? undefined}>
                            {row.received_text?.trim() ? row.received_text.trim() : "—"}
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2.5 text-right sm:px-4">
                        {editingId === row.id ? (
                          <div className="flex justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => void handleSaveEdit()}
                              disabled={savingEdit || !editInvestmentText.trim() || !editReceivedText.trim()}
                              className={
                                "rounded-lg px-2.5 py-1.5 text-[10px] font-semibold text-white disabled:opacity-50 " +
                                invAccent.saveBtn
                              }
                            >
                              Salvar
                            </button>
                            <button
                              type="button"
                              onClick={cancelEdit}
                              disabled={savingEdit}
                              className="inline-flex rounded-lg border border-zinc-600 p-1.5 text-zinc-400 hover:text-white"
                              title="Cancelar"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => startEdit(row)}
                              disabled={deletingId !== null || editingId !== null}
                              className={
                                "inline-flex rounded-lg border border-zinc-600 p-1.5 text-zinc-400 disabled:opacity-40 " +
                                invAccent.editHover
                              }
                              title="Editar"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => void handleDeleteRow(row.id)}
                              disabled={deletingId === row.id || editingId !== null}
                              className="inline-flex rounded-lg border border-zinc-600 p-1.5 text-zinc-400 hover:border-red-500/40 hover:text-red-400 disabled:opacity-40"
                              title="Apagar"
                            >
                              <Trash2 className={`h-3.5 w-3.5 ${deletingId === row.id ? "animate-pulse" : ""}`} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
