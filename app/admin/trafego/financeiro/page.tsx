"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, LineChart, Lock, LogOut } from "lucide-react";
import {
  TrafficAdminFinanceiroPanel,
  type TrafficFinanceiroClient,
} from "@/app/components/TrafficAdminFinanceiroPanel";
import {
  clearAdminTrafficSession,
  readAdminTrafficSession,
  saveAdminTrafficSession,
} from "@/lib/admin-traffic-session";

export default function AdminTrafegoFinanceiroPage() {
  const [password, setPassword] = useState("");
  const [secret, setSecret] = useState<string | null>(null);
  const [sessionReady, setSessionReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [clients, setClients] = useState<TrafficFinanceiroClient[]>([]);
  const [clientEnvHint, setClientEnvHint] = useState<string | null>(null);

  const clearSession = useCallback(() => {
    clearAdminTrafficSession();
    setSecret(null);
    setPassword("");
    setClients([]);
    setClientEnvHint(null);
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      const s = readAdminTrafficSession();
      if (!s) {
        if (alive) setSessionReady(true);
        return;
      }
      const res = await fetch("/api/admin-traffic-clients", {
        headers: { "x-admin-secret": s },
      });
      if (!alive) return;
      if (res.ok) {
        const json = (await res.json()) as {
          clients?: TrafficFinanceiroClient[];
          clientEnvHint?: string;
        };
        setSecret(s);
        setClients(json.clients ?? []);
        setClientEnvHint(json.clientEnvHint ?? null);
      } else {
        clearAdminTrafficSession();
      }
      setSessionReady(true);
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (secret) saveAdminTrafficSession(secret);
  }, [secret]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!password.trim()) return;
    setLoading(true);
    setError("");
    try {
      const s = password.trim();
      const res = await fetch("/api/admin-traffic-clients", {
        headers: { "x-admin-secret": s },
      });
      const json = (await res.json()) as {
        clients?: TrafficFinanceiroClient[];
        clientEnvHint?: string;
        error?: string;
      };
      if (res.status === 401) {
        setError("Senha incorreta.");
        return;
      }
      if (!res.ok) {
        setError(json.error || "Erro ao carregar.");
        return;
      }
      setSecret(s);
      setClients(json.clients ?? []);
      setClientEnvHint(json.clientEnvHint ?? null);
    } finally {
      setLoading(false);
    }
  }

  if (!sessionReady) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        <p className="text-sm text-zinc-500">Carregando…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-6xl px-3 py-4 sm:px-6 sm:py-6">
        {secret ? (
          <div className="space-y-4">
            <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-600">Admin · tráfego</p>
                <h1 className="text-lg font-semibold text-white">Financeiro</h1>
                <p className="mt-0.5 text-xs text-zinc-500">
                  Valores na Meta (mídia) e o que você recebeu — por conta, sem carregar a Meta.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href="/admin/trafego"
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-zinc-700/80 bg-zinc-900/60 px-3 text-xs text-zinc-300 transition hover:border-emerald-500/40 hover:text-emerald-300"
                >
                  <LineChart className="h-3.5 w-3.5" />
                  Métricas Meta
                </Link>
                <Link
                  href="/admin"
                  className="inline-flex h-9 items-center justify-center rounded-lg border border-zinc-700/80 bg-zinc-900/60 px-3 text-xs text-zinc-300 transition hover:border-zinc-500 hover:text-white"
                >
                  Briefings
                </Link>
                <button
                  type="button"
                  onClick={clearSession}
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-zinc-700/80 bg-zinc-900/60 px-3 text-xs text-zinc-300 transition hover:border-red-500/40 hover:text-red-400"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sair
                </button>
              </div>
            </header>

            {clientEnvHint && (
              <p className="text-xs leading-relaxed text-amber-200/90">{clientEnvHint}</p>
            )}

            <TrafficAdminFinanceiroPanel secret={secret} clients={clients} onSessionInvalid={clearSession} />
          </div>
        ) : (
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="w-full max-w-sm">
              <Link
                href="/admin/trafego"
                className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar às métricas Meta
              </Link>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                    <Lock className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <h1 className="font-semibold text-white">Financeiro · tráfego</h1>
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
