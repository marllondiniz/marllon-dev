"use client";

import { useState, useEffect, useCallback, Fragment } from "react";
import Link from "next/link";
import { ArrowLeft, Lock, RefreshCw, MessageSquare, LogOut } from "lucide-react";

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
  created_at: string;
};

export default function AdminLeadsPage() {
  const [password, setPassword] = useState("");
  const [secret, setSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [briefings, setBriefings] = useState<Briefing[]>([]);
  const [loadingBriefings, setLoadingBriefings] = useState(false);
  const [expandedBriefingId, setExpandedBriefingId] = useState<string | null>(null);

  const fetchBriefings = useCallback(async (adminSecret: string) => {
    setLoadingBriefings(true);
    setError("");
    try {
      const res = await fetch("/api/briefing", {
        headers: { "x-admin-secret": adminSecret },
      });
      if (res.status === 401) {
        setSecret(null);
        setError("Senha incorreta.");
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Erro ao carregar briefings.");
        return;
      }
      const data = await res.json();
      setBriefings(data.briefings ?? []);
    } finally {
      setLoadingBriefings(false);
    }
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!password.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/briefing", { headers: { "x-admin-secret": password.trim() } });
      if (res.status === 401) {
        setError("Senha incorreta.");
        return;
      }
      if (res.ok) {
        setSecret(password.trim());
        await fetchBriefings(password.trim());
        return;
      }
      setError("Erro ao acessar.");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    setSecret(null);
    setPassword("");
    setBriefings([]);
    setExpandedBriefingId(null);
  }

  function handleRefresh() {
    if (secret) fetchBriefings(secret);
  }

  useEffect(() => {
    if (secret) fetchBriefings(secret);
  }, [secret, fetchBriefings]);

  return (
    <main className="min-h-screen bg-[#0a0a0b] font-sans text-white">
      <div className="section-container mx-auto max-w-5xl px-4 py-10 sm:px-6">
        {secret ? (
          <>
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <h1 className="font-[family-name:var(--font-space)] text-2xl font-bold text-white sm:text-3xl">
                  Admin — Briefings
                </h1>
                <span className="rounded-full bg-[#22c55e]/20 px-3 py-1 font-mono text-xs text-[#22c55e]">
                  {briefings.length} briefing{briefings.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={loadingBriefings}
                  className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900/80 px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-[#22c55e]/40 hover:text-white disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 ${loadingBriefings ? "animate-spin" : ""}`} />
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
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-400 transition hover:border-[#22c55e]/40 hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Voltar ao site
                </Link>
              </div>
            </div>

            {error && (
              <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            {loadingBriefings && briefings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
                <RefreshCw className="mb-4 h-10 w-10 animate-spin text-[#22c55e]" />
                <p>Carregando...</p>
              </div>
            ) : (
              <section>
                <h2 className="mb-4 font-[family-name:var(--font-space)] text-lg font-bold text-white">
                  Briefings
                </h2>
                  {briefings.length === 0 ? (
                    <div className="rounded-2xl border border-zinc-800 bg-[#111113] px-6 py-12 text-center text-zinc-500">
                      <MessageSquare className="mx-auto mb-3 h-10 w-10 text-zinc-600" />
                      <p className="text-sm">Nenhum briefing ainda. Formulário /briefing.</p>
                    </div>
                  ) : (
                    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#111113]">
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[640px] text-left text-sm">
                          <thead>
                            <tr className="border-b border-zinc-800 bg-[#0d0d0f]/80">
                              <th className="px-4 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-zinc-500 sm:px-6">Data</th>
                              <th className="px-4 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-zinc-500 sm:px-6">Nome</th>
                              <th className="px-4 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-zinc-500 sm:px-6">WhatsApp</th>
                              <th className="px-4 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-zinc-500 sm:px-6">O que vende</th>
                              <th className="px-4 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-zinc-500 sm:px-6">Prazo</th>
                              <th className="px-4 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-zinc-500 sm:px-6"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {briefings.map((b) => (
                              <Fragment key={b.id}>
                                <tr
                                  key={b.id}
                                  className="border-b border-zinc-800/80 transition hover:bg-zinc-900/50 cursor-pointer"
                                  onClick={() => setExpandedBriefingId(expandedBriefingId === b.id ? null : b.id)}
                                >
                                  <td className="whitespace-nowrap px-4 py-3 text-zinc-500 sm:px-6">
                                    {new Date(b.created_at).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                                  </td>
                                  <td className="px-4 py-3 font-medium text-white sm:px-6">{b.name}</td>
                                  <td className="px-4 py-3 text-zinc-400 sm:px-6">
                                    <a href={`https://wa.me/55${b.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-[#22c55e] hover:underline" onClick={(e) => e.stopPropagation()}>{b.whatsapp}</a>
                                  </td>
                                  <td className="max-w-[200px] truncate px-4 py-3 text-zinc-400 sm:px-6" title={b.product}>{b.product}</td>
                                  <td className="px-4 py-3 text-zinc-500 sm:px-6">{b.deadline}</td>
                                  <td className="px-4 py-3 text-zinc-500 sm:px-6">{expandedBriefingId === b.id ? "▲ Ocultar" : "▼ Ver detalhes"}</td>
                                </tr>
                                {expandedBriefingId === b.id && (
                                  <tr className="border-b border-zinc-800/80 bg-zinc-900/30">
                                    <td colSpan={6} className="px-4 py-4 sm:px-6">
                                      <div className="grid gap-2 text-xs sm:grid-cols-2">
                                        <p><span className="text-zinc-500">Produto:</span> {b.product}</p>
                                        <p><span className="text-zinc-500">Público:</span> {b.audience}</p>
                                        <p><span className="text-zinc-500">Benefício:</span> {b.benefit}</p>
                                        <p><span className="text-zinc-500">CTA:</span> {b.cta}</p>
                                        <p><span className="text-zinc-500">Preço/condições:</span> {b.pricing}</p>
                                        <p><span className="text-zinc-500">Objeções:</span> {b.objections || "—"}</p>
                                        <p><span className="text-zinc-500">Materiais:</span> {b.materials || "—"}</p>
                                        <p><span className="text-zinc-500">Links da marca:</span> {b.brand_links || "—"}</p>
                                        <p><span className="text-zinc-500">Onde fica a página:</span> {b.page_location}</p>
                                        <p><span className="text-zinc-500">Tráfego:</span> {b.traffic}</p>
                                        <p><span className="text-zinc-500">Integração leads:</span> {b.integration || "—"}</p>
                                        <p><span className="text-zinc-500">Referências:</span> {b.refs || "—"}</p>
                                        <p><span className="text-zinc-500">Restrições:</span> {b.restrictions || "—"}</p>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </Fragment>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
              </section>
            )}
          </>
        ) : (
          <div className="mx-auto max-w-md">
            <div className="mb-8 flex items-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-white"
              >
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
                  <h1 className="font-[family-name:var(--font-space)] text-xl font-bold text-white">
                    Área admin
                  </h1>
                  <p className="text-sm text-zinc-500">Briefings preenchidos</p>
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
                {error && (
                  <p className="text-sm text-red-400">{error}</p>
                )}
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
