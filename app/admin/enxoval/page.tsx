"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Lock,
  LogOut,
  RefreshCw,
  Plus,
  Trash2,
  Edit2,
  Baby,
  FolderTree,
  Package,
  Gift,
  Check,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import type { EnxovalCategory, EnxovalItemWithStatus, EnxovalReservation } from "@/app/enxoval/types";

function fmt(date: string) {
  return new Date(date).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type Tab = "categorias" | "itens" | "reservas";

export default function AdminEnxovalPage() {
  const [password, setPassword] = useState("");
  const [secret, setSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [tab, setTab] = useState<Tab>("itens");
  const [categories, setCategories] = useState<EnxovalCategory[]>([]);
  const [items, setItems] = useState<EnxovalItemWithStatus[]>([]);
  const [reservations, setReservations] = useState<(EnxovalReservation & { item?: { name?: string } })[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  const [editCategory, setEditCategory] = useState<EnxovalCategory | null>(null);
  const [editItem, setEditItem] = useState<EnxovalItemWithStatus | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newItem, setNewItem] = useState({
    category_id: "",
    name: "",
    quantity_total: 1,
    link: "",
  });
  const [reservationFilter, setReservationFilter] = useState<string>("all");
  const [categoryOpen, setCategoryOpen] = useState(false);

  const fetcher = (url: string, opts?: RequestInit) =>
    fetch(url, { ...opts, headers: { ...opts?.headers, "x-admin-secret": secret ?? "" } });

  const loadCategories = useCallback(async () => {
    const res = await fetcher("/api/enxoval/categories");
    const data = await res.json();
    setCategories(data.categories ?? []);
  }, [secret]);

  const loadItems = useCallback(async () => {
    const res = await fetcher("/api/enxoval/items");
    const data = await res.json();
    setItems(data.items ?? []);
  }, [secret]);

  const loadReservations = useCallback(async () => {
    const url =
      reservationFilter === "all"
        ? "/api/enxoval/reservations"
        : `/api/enxoval/reservations?status=${reservationFilter}`;
    const res = await fetcher(url);
    const data = await res.json();
    setReservations(data.reservations ?? []);
  }, [secret, reservationFilter]);

  const loadAll = useCallback(async () => {
    if (!secret) return;
    setLoadingData(true);
    try {
      await Promise.all([loadCategories(), loadItems(), loadReservations()]);
    } finally {
      setLoadingData(false);
    }
  }, [secret, loadCategories, loadItems, loadReservations]);

  useEffect(() => {
    if (secret) loadAll();
  }, [secret, loadAll]);

  useEffect(() => {
    if (secret && tab === "reservas") loadReservations();
  }, [secret, tab, reservationFilter]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!password.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/enxoval/categories", {
        headers: { "x-admin-secret": password.trim() },
      });
      if (res.status === 401) {
        setError("Senha incorreta.");
        return;
      }
      if (res.ok) {
        setSecret(password.trim());
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
  }

  async function createCategory() {
    if (!newCategoryName.trim() || !secret) return;
    const res = await fetcher("/api/enxoval/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCategoryName.trim() }),
    });
    const data = await res.json();
    if (res.ok) {
      setNewCategoryName("");
      loadCategories();
    } else {
      setError(data.error || "Erro ao criar.");
    }
  }

  async function updateCategory() {
    if (!editCategory || !secret) return;
    const res = await fetcher("/api/enxoval/categories", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editCategory.id, name: editCategory.name }),
    });
    if (res.ok) {
      setEditCategory(null);
      loadCategories();
    } else {
      const data = await res.json();
      setError(data.error || "Erro.");
    }
  }

  async function deleteCategory(id: string) {
    if (!confirm("Excluir categoria? Itens precisam ser excluídos antes.")) return;
    const res = await fetcher(`/api/enxoval/categories?id=${id}`, { method: "DELETE" });
    if (res.ok) loadCategories();
    else {
      const data = await res.json();
      setError(data.error || "Erro.");
    }
  }

  async function createItem() {
    if (!newItem.category_id || !newItem.name.trim() || !secret) return;
    const res = await fetcher("/api/enxoval/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...newItem,
        link: newItem.link || undefined,
      }),
    });
    if (res.ok) {
      setNewItem({ category_id: "", name: "", quantity_total: 1, link: "" });
      loadItems();
    } else {
      const data = await res.json();
      setError(data.error || "Erro ao criar.");
    }
  }

  async function updateItem() {
    if (!editItem || !secret) return;
    const res = await fetcher("/api/enxoval/items", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editItem.id,
        name: editItem.name,
        quantity_total: editItem.quantity_total,
        link: editItem.link ?? undefined,
      }),
    });
    if (res.ok) {
      setEditItem(null);
      loadItems();
    } else {
      const data = await res.json();
      setError(data.error || "Erro.");
    }
  }

  async function deleteItem(id: string) {
    if (!confirm("Excluir item?")) return;
    const res = await fetcher(`/api/enxoval/items?id=${id}`, { method: "DELETE" });
    if (res.ok) loadItems();
  }

  async function patchReservation(id: string, status: "cancelled" | "delivered") {
    const res = await fetcher("/api/enxoval/reservations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) loadReservations();
  }

  function catName(id: string) {
    return categories.find((c) => c.id === id)?.name ?? "-";
  }

  if (!secret) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 p-4">
        <div className="w-full max-w-sm">
          <Link href="/admin" className="mb-6 flex items-center gap-2 text-sm text-zinc-400 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Admin
          </Link>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <Baby className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <h1 className="font-semibold text-white">Lista de Enxoval</h1>
                <p className="text-xs text-zinc-500">Área restrita</p>
              </div>
            </div>
            <form onSubmit={handleLogin} className="space-y-3">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20"
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
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-3xl px-4 py-6">
        {/* Header */}
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-sm text-zinc-400 hover:text-white">
              ← Admin
            </Link>
            <span className="text-zinc-600">·</span>
            <h1 className="text-lg font-semibold">Lista de Enxoval</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadAll}
              disabled={loadingData}
              className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-white disabled:opacity-50"
              title="Atualizar"
            >
              <RefreshCw className={`inline h-3.5 w-3.5 ${loadingData ? "animate-spin" : ""}`} />
            </button>
            <a
              href="/enxoval"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-white"
            >
              Ver lista
            </a>
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
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Tabs */}
        <nav className="mb-6 flex gap-1 rounded-lg bg-zinc-900/50 p-1">
          {[
            { id: "categorias" as Tab, label: "Categorias", icon: FolderTree },
            { id: "itens" as Tab, label: "Itens", icon: Package },
            { id: "reservas" as Tab, label: "Reservas", icon: Gift },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-sm ${
                tab === id ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </nav>

        {/* Categorias */}
        {tab === "categorias" && (
          <section className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Nova categoria"
                className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500"
              />
              <button
                type="button"
                onClick={createCategory}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
              >
                <Plus className="inline h-4 w-4" /> Adicionar
              </button>
            </div>
            <ul className="space-y-2">
              {categories.map((c) => (
                <li key={c.id} className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2">
                  {editCategory?.id === c.id ? (
                    <div className="flex flex-1 items-center gap-2">
                      <input
                        type="text"
                        value={editCategory.name}
                        onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })}
                        className="flex-1 rounded border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-sm text-white"
                      />
                      <button type="button" onClick={updateCategory} className="rounded bg-emerald-600 px-2 py-1 text-xs text-white">
                        Salvar
                      </button>
                      <button type="button" onClick={() => setEditCategory(null)} className="rounded border border-zinc-600 px-2 py-1 text-xs text-zinc-400">
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="text-sm font-medium text-white">{c.name}</span>
                      <div className="flex gap-1">
                        <button type="button" onClick={() => setEditCategory(c)} className="rounded p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-white">
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button type="button" onClick={() => deleteCategory(c.id)} className="rounded p-1.5 text-zinc-500 hover:bg-red-500/10 hover:text-red-400">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
              {categories.length === 0 && (
                <li className="py-8 text-center text-sm text-zinc-500">Nenhuma categoria.</li>
              )}
            </ul>
          </section>
        )}

        {/* Itens */}
        {tab === "itens" && (
          <section className="space-y-4">
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
              <p className="mb-3 text-xs font-medium text-zinc-500">Novo item</p>
              <div className="flex flex-wrap items-end gap-2">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setCategoryOpen((v) => !v)}
                    className="flex min-w-[140px] items-center justify-between rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-left text-sm text-white"
                  >
                    {newItem.category_id ? catName(newItem.category_id) : "Categoria"}
                    <ChevronDown className={`h-4 w-4 text-zinc-500 ${categoryOpen ? "rotate-180" : ""}`} />
                  </button>
                  {categoryOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setCategoryOpen(false)} aria-hidden />
                      <div className="absolute left-0 top-full z-20 mt-1 max-h-40 overflow-auto rounded-lg border border-zinc-700 bg-zinc-900 py-1 shadow-xl">
                        {categories.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => {
                              setNewItem((p) => ({ ...p, category_id: c.id }));
                              setCategoryOpen(false);
                            }}
                            className="block w-full px-3 py-2 text-left text-sm text-white hover:bg-zinc-800"
                          >
                            {c.name}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Nome"
                  className="min-w-[120px] flex-1 rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white placeholder-zinc-500"
                />
                <input
                  type="number"
                  min={1}
                  value={newItem.quantity_total}
                  onChange={(e) => setNewItem((p) => ({ ...p, quantity_total: Number(e.target.value) || 1 }))}
                  className="w-14 rounded-lg border border-zinc-700 bg-zinc-950 px-2 py-2 text-center text-sm text-white"
                  title="Quantidade"
                />
                <input
                  type="url"
                  value={newItem.link}
                  onChange={(e) => setNewItem((p) => ({ ...p, link: e.target.value }))}
                  placeholder="Link (opcional)"
                  className="min-w-[140px] flex-1 rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white placeholder-zinc-500"
                />
                <button
                  type="button"
                  onClick={createItem}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
                >
                  <Plus className="inline h-4 w-4" /> Adicionar
                </button>
              </div>
            </div>

            <ul className="space-y-2">
              {items.map((it) => (
                <li key={it.id} className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
                  {editItem?.id === it.id ? (
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        <input
                          type="text"
                          value={editItem.name}
                          onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                          className="min-w-[140px] flex-1 rounded border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-sm text-white"
                        />
                        <input
                          type="number"
                          min={editItem.quantity_reserved}
                          value={editItem.quantity_total}
                          onChange={(e) => setEditItem({ ...editItem, quantity_total: Number(e.target.value) || 1 })}
                          className="w-14 rounded border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-center text-sm text-white"
                        />
                        <input
                          type="url"
                          value={editItem.link ?? ""}
                          onChange={(e) => setEditItem({ ...editItem, link: e.target.value || null })}
                          placeholder="Link"
                          className="min-w-[140px] flex-1 rounded border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-sm text-white placeholder-zinc-500"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button type="button" onClick={updateItem} className="rounded bg-emerald-600 px-3 py-1 text-xs text-white">
                          Salvar
                        </button>
                        <button type="button" onClick={() => setEditItem(null)} className="rounded border border-zinc-600 px-3 py-1 text-xs text-zinc-400">
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-white">{it.name}</p>
                        <p className="text-xs text-zinc-500">
                          {catName(it.category_id)} · {it.quantity_reserved}/{it.quantity_total} reservado(s)
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {it.link && (
                          <a href={it.link} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300" title={it.link}>
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                        <button type="button" onClick={() => setEditItem(it)} className="rounded p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-white">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button type="button" onClick={() => deleteItem(it.id)} className="rounded p-1.5 text-zinc-500 hover:bg-red-500/10 hover:text-red-400">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
              {items.length === 0 && (
                <li className="py-12 text-center text-sm text-zinc-500">Nenhum item.</li>
              )}
            </ul>
          </section>
        )}

        {/* Reservas */}
        {tab === "reservas" && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-zinc-400">Reservas</h2>
              <select
                value={reservationFilter}
                onChange={(e) => setReservationFilter(e.target.value)}
                className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm text-white"
              >
                <option value="all">Todas</option>
                <option value="active">Ativas</option>
                <option value="cancelled">Canceladas</option>
                <option value="delivered">Entregues</option>
              </select>
            </div>
            <ul className="space-y-2">
              {reservations.map((r) => (
                <li key={r.id} className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-white">{r.item?.name ?? "-"}</p>
                      <p className="text-sm text-zinc-400">{r.name}</p>
                      <p className="mt-1 text-xs text-zinc-500">
                        {fmt(r.created_at)} · Qtd: {r.quantity}
                      </p>
                      <a
                        href={`https://wa.me/55${r.phone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-flex items-center gap-1 text-sm text-emerald-400 hover:underline"
                      >
                        {r.phone}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          r.status === "active"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : r.status === "delivered"
                              ? "bg-blue-500/20 text-blue-400"
                              : "bg-zinc-700 text-zinc-400"
                        }`}
                      >
                        {r.status === "active" ? "Ativa" : r.status === "delivered" ? "Entregue" : "Cancelada"}
                      </span>
                      {r.status === "active" && (
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => patchReservation(r.id, "cancelled")}
                            className="rounded border border-zinc-600 px-2 py-1 text-xs text-zinc-400 hover:bg-red-500/10 hover:text-red-400"
                          >
                            Cancelar
                          </button>
                          <button
                            type="button"
                            onClick={() => patchReservation(r.id, "delivered")}
                            className="rounded bg-emerald-600 px-2 py-1 text-xs text-white hover:bg-emerald-500"
                          >
                            <Check className="inline h-3 w-3" /> Entregue
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
              {reservations.length === 0 && (
                <li className="py-12 text-center text-sm text-zinc-500">Nenhuma reserva.</li>
              )}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}
