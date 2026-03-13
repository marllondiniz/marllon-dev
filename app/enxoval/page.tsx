"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Baby,
  Shirt,
  Car,
  Package,
  Bath,
  Home,
  Heart,
  Sofa,
  Check,
  AlertCircle,
  ExternalLink,
  Star,
  Gift,
  ChevronDown,
  Loader2,
  Trophy,
} from "lucide-react";
import ReservaModal from "./ReservaModal";
import ProductImage from "./ProductImage";
import type { EnxovalCategory, EnxovalItemWithStatus } from "./types";

const CATEGORY_ICONS: Record<string, typeof Baby> = {
  Roupinhas: Shirt,
  Passeio: Car,
  Diversos: Package,
  "Banho e Toalete": Bath,
  Quarto: Home,
  "Para Mamãe": Heart,
  Móveis: Sofa,
};

const CATEGORY_COLORS: Record<string, { bg: string; icon: string; border: string; badge: string }> = {
  Roupinhas:       { bg: "bg-pink-50",   icon: "text-pink-500",   border: "border-pink-200",   badge: "bg-pink-100 text-pink-600" },
  Passeio:         { bg: "bg-sky-50",    icon: "text-sky-500",    border: "border-sky-200",    badge: "bg-sky-100 text-sky-600" },
  Diversos:        { bg: "bg-violet-50", icon: "text-violet-500", border: "border-violet-200", badge: "bg-violet-100 text-violet-600" },
  "Banho e Toalete": { bg: "bg-cyan-50", icon: "text-cyan-500",   border: "border-cyan-200",   badge: "bg-cyan-100 text-cyan-600" },
  Quarto:          { bg: "bg-amber-50",  icon: "text-amber-500",  border: "border-amber-200",  badge: "bg-amber-100 text-amber-600" },
  "Para Mamãe":    { bg: "bg-rose-50",   icon: "text-rose-500",   border: "border-rose-200",   badge: "bg-rose-100 text-rose-600" },
  Móveis:          { bg: "bg-lime-50",   icon: "text-lime-600",   border: "border-lime-200",   badge: "bg-lime-100 text-lime-700" },
};

const DEFAULT_COLOR = { bg: "bg-teal-50", icon: "text-teal-500", border: "border-teal-200", badge: "bg-teal-100 text-teal-600" };

function getCategoryColor(name: string) {
  return CATEGORY_COLORS[name] ?? DEFAULT_COLOR;
}

function getIcon(cat: EnxovalCategory) {
  return CATEGORY_ICONS[cat.name] ?? Baby;
}

function StatusBadge({ status }: { status: EnxovalItemWithStatus["status"] }) {
  if (status === "disponivel")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
        <Check className="h-3 w-3" />
        Disponível
      </span>
    );
  if (status === "parcialmente_reservado")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
        <AlertCircle className="h-3 w-3" />
        Parcial
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-zinc-200 px-2.5 py-0.5 text-xs font-semibold text-zinc-500">
      Esgotado
    </span>
  );
}

export default function EnxovalPage() {
  const [categories, setCategories] = useState<EnxovalCategory[]>([]);
  const [items, setItems] = useState<EnxovalItemWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [modalItem, setModalItem] = useState<EnxovalItemWithStatus | null>(null);
  const [modalCategoryName, setModalCategoryName] = useState<string>("");
  const [myReservationsPhone, setMyReservationsPhone] = useState("");
  const [myReservations, setMyReservations] = useState<
    { id: string; name: string; quantity: number; status: string; created_at: string; item?: { name?: string; link?: string; category?: { name?: string } } }[]
  >([]);
  const [loadingMyReservations, setLoadingMyReservations] = useState(false);
  const [myReservationsError, setMyReservationsError] = useState("");
  const [myReservationsOpen, setMyReservationsOpen] = useState(false);
  const [ranking, setRanking] = useState<{ name: string; total: number }[]>([]);

  function formatPhone(value: string): string {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (!digits.length) return "";
    if (digits.length <= 2) return `(${digits}`;
    const ddd = digits.slice(0, 2);
    const rest = digits.slice(2);
    if (rest[0] === "9") {
      if (rest.length <= 1) return `(${ddd}) ${rest}`;
      if (rest.length <= 5) return `(${ddd}) ${rest[0]} ${rest.slice(1)}`;
      return `(${ddd}) ${rest[0]} ${rest.slice(1, 5)}-${rest.slice(5, 9)}`;
    }
    if (rest.length <= 4) return `(${ddd}) ${rest}`;
    return `(${ddd}) ${rest.slice(0, 4)}-${rest.slice(4, 8)}`;
  }

  async function loadMyReservations(e?: React.FormEvent) {
    e?.preventDefault();
    if (!myReservationsPhone.trim()) return;
    setLoadingMyReservations(true);
    setMyReservationsError("");
    try {
      const res = await fetch(
        `/api/enxoval/my-reservations?phone=${encodeURIComponent(myReservationsPhone.trim())}`
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMyReservationsError(data.error || "Erro ao buscar.");
        setMyReservations([]);
        return;
      }
      setMyReservations(data.reservations ?? []);
      setMyReservationsOpen(true);
    } catch {
      setMyReservationsError("Erro ao buscar.");
      setMyReservations([]);
    } finally {
      setLoadingMyReservations(false);
    }
  }

  async function load() {
    setLoading(true);
    try {
      const [catRes, itemsRes, rankingRes] = await Promise.all([
        fetch("/api/enxoval/categories"),
        fetch("/api/enxoval/items"),
        fetch("/api/enxoval/ranking"),
      ]);
      const catData = await catRes.json();
      const itemsData = await itemsRes.json();
      const rankingData = await rankingRes.json().catch(() => ({ ranking: [] }));
      setCategories(catData.categories ?? []);
      setItems(itemsData.items ?? []);
      setRanking(rankingData.ranking ?? []);
    } catch {
      setCategories([]);
      setItems([]);
      setRanking([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filteredItems = useMemo(() => {
    let list = items;
    if (filterCategory) {
      list = list.filter((i) => i.category_id === filterCategory);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((i) => i.name.toLowerCase().includes(q));
    }
    return list;
  }, [items, filterCategory, search]);

  const byCategory = useMemo(() => {
    const map = new Map<string, EnxovalItemWithStatus[]>();
    for (const item of filteredItems) {
      const catId = item.category_id;
      if (!map.has(catId)) map.set(catId, []);
      map.get(catId)!.push(item);
    }
    return map;
  }, [filteredItems]);

  const sortedCategories = useMemo(() => {
    return categories
      .filter((c) => byCategory.has(c.id))
      .sort((a, b) => a.sort_order - b.sort_order);
  }, [categories, byCategory]);

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b border-white/60 bg-white/70 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-center gap-2 px-4 py-4 sm:px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-violet-400 shadow-md">
            <Baby className="h-5 w-5 text-white" />
          </div>
          <span className="text-base font-bold text-zinc-700">Lista de Enxoval</span>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <div className="mb-3 flex justify-center gap-1">
            {["✨", "🍼", "👶", "🍼", "✨"].map((e, i) => (
              <span key={i} className="text-xl">{e}</span>
            ))}
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-800 sm:text-4xl">
            Lista de Enxoval do Bebê
          </h1>
          <p className="mt-2 text-base text-zinc-500">
            Escolha o item que deseja dar, preencha seus dados e reserve com carinho. 💙
          </p>
        </motion.section>

        {/* Top 5 - Ranking (destaque) */}
        {ranking.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mb-8"
          >
            <div className="rounded-2xl border-2 border-amber-300 bg-gradient-to-br from-amber-100 via-yellow-50 to-amber-50 p-5 shadow-lg shadow-amber-200/30 sm:p-6">
              <h3 className="mb-4 flex items-center justify-center gap-2 text-lg font-bold text-zinc-800">
                <Trophy className="h-6 w-6 text-amber-500" />
                Top 5 parceiros do enxoval
              </h3>
              <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
                {ranking.map((p, i) => (
                  <li
                    key={`${p.name}-${i}`}
                    className={`flex flex-col items-center gap-1 rounded-xl border-2 px-4 py-3 ${
                      i === 0
                        ? "border-amber-400 bg-amber-100/80 shadow-md"
                        : i === 1
                          ? "border-zinc-300 bg-zinc-50"
                          : i === 2
                            ? "border-amber-800/50 bg-amber-900/10"
                            : "border-zinc-200 bg-white"
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                        i === 0
                          ? "bg-amber-400 text-white ring-2 ring-amber-500/50"
                          : i === 1
                            ? "bg-zinc-400 text-white"
                            : i === 2
                              ? "bg-amber-700 text-amber-100"
                              : "bg-zinc-200 text-zinc-600"
                      }`}
                    >
                      {i + 1}º
                    </span>
                    <span className="truncate text-center font-semibold text-zinc-800">
                      {p.name.split(" ")[0]}
                    </span>
                    <span className="text-sm font-bold text-amber-600">
                      {p.total} {p.total === 1 ? "item" : "itens"}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </motion.section>
        )}

        {/* Minhas reservas */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.03 }}
          className="mb-8"
        >
          <div className="overflow-hidden rounded-2xl border border-pink-200 bg-gradient-to-br from-pink-50 to-violet-50 shadow-sm">
            <button
              type="button"
              onClick={() => setMyReservationsOpen((v) => !v)}
              className="flex w-full items-center justify-between px-4 py-3 text-left transition hover:from-pink-100 hover:to-violet-100 sm:px-5"
            >
              <span className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
                <Gift className="h-4 w-4 text-pink-500" />
                Já reservou? Veja seus itens
              </span>
              <ChevronDown
                className={`h-4 w-4 text-zinc-400 transition-transform ${myReservationsOpen ? "rotate-180" : ""}`}
              />
            </button>
            {myReservationsOpen && (
              <div className="border-t border-pink-100/60 px-4 py-4 sm:px-5">
                <form onSubmit={loadMyReservations} className="flex flex-wrap items-end gap-2">
                  <div className="flex-1 min-w-[160px]">
                    <label htmlFor="my-phone" className="mb-1 block text-xs font-medium text-zinc-500">
                      Telefone (o mesmo da reserva)
                    </label>
                    <input
                      id="my-phone"
                      type="tel"
                      value={myReservationsPhone}
                      onChange={(e) => {
                        setMyReservationsPhone(formatPhone(e.target.value));
                        setMyReservationsError("");
                      }}
                      placeholder="(27) 9 9999-9999"
                      className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-700 placeholder-zinc-400 outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loadingMyReservations || !myReservationsPhone.trim()}
                    className="rounded-xl bg-gradient-to-r from-pink-400 to-violet-400 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-pink-500 hover:to-violet-500 disabled:opacity-50"
                  >
                    {loadingMyReservations ? (
                      <Loader2 className="inline h-4 w-4 animate-spin" />
                    ) : (
                      "Ver"
                    )}
                  </button>
                </form>
                {myReservationsError && (
                  <p className="mt-2 text-sm text-red-500">{myReservationsError}</p>
                )}
                {myReservations.length > 0 && !myReservationsError && (
                  <ul className="mt-4 space-y-2">
                    {myReservations.map((r) => (
                      <li
                        key={r.id}
                        className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white bg-white/80 p-3 shadow-sm"
                      >
                        <div>
                          <p className="font-medium text-zinc-800">
                            {(r.item as { name?: string })?.name ?? "Item"}
                          </p>
                          <p className="text-xs text-zinc-500">
                            {(r.item as { category?: { name?: string } })?.category?.name ?? ""} · Qtd: {r.quantity}
                            {r.status === "delivered" && (
                              <span className="ml-1 rounded-full bg-emerald-100 px-1.5 py-0.5 text-emerald-700">
                                Entregue
                              </span>
                            )}
                          </p>
                        </div>
                        {(r.item as { link?: string })?.link && (
                          <a
                            href={(r.item as { link?: string }).link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-lg border border-pink-200 bg-pink-50 px-3 py-1.5 text-xs font-semibold text-pink-600 hover:bg-pink-100"
                          >
                            Ver produto
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
                {myReservations.length === 0 && !loadingMyReservations && !myReservationsError && myReservationsPhone.trim() && (
                  <p className="mt-4 text-center text-sm text-zinc-500">
                    Nenhuma reserva encontrada com este telefone.
                  </p>
                )}
              </div>
            )}
          </div>
        </motion.section>

        {/* Busca e filtro */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-8 space-y-4"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar item..."
              className="w-full rounded-2xl border border-white/80 bg-white/90 py-3 pl-11 pr-4 text-sm text-zinc-700 placeholder-zinc-400 shadow-sm outline-none transition focus:border-pink-300 focus:ring-2 focus:ring-pink-200/60"
            />
          </div>
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setFilterCategory(null)}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold shadow-sm transition ${
                  !filterCategory
                    ? "bg-gradient-to-r from-pink-400 to-violet-400 text-white shadow-pink-200"
                    : "bg-white/80 text-zinc-500 ring-1 ring-zinc-200 hover:ring-pink-300"
                }`}
              >
                Todos
              </button>
              {categories.map((c) => {
                const color = getCategoryColor(c.name);
                const active = filterCategory === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setFilterCategory(active ? null : c.id)}
                    className={`rounded-full px-4 py-1.5 text-sm font-semibold shadow-sm transition ${
                      active
                        ? `${color.badge} ring-2 ring-offset-1 ring-current`
                        : "bg-white/80 text-zinc-500 ring-1 ring-zinc-200 hover:ring-pink-300"
                    }`}
                  >
                    {c.name}
                  </button>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Lista */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-3 w-3 animate-bounce rounded-full bg-pink-400"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
            <p className="mt-4 text-sm font-medium text-zinc-400">Carregando a lista...</p>
          </div>
        ) : sortedCategories.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-3xl border border-white/60 bg-white/70 p-12 text-center shadow-sm"
          >
            <span className="text-5xl">🎁</span>
            <p className="mt-4 text-zinc-500">
              {search || filterCategory
                ? "Nenhum item encontrado."
                : "A lista ainda não tem itens cadastrados."}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {sortedCategories.map((cat, idx) => {
              const catItems = byCategory.get(cat.id) ?? [];
              const Icon = getIcon(cat);
              const color = getCategoryColor(cat.name);
              return (
                <motion.section
                  key={cat.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * idx }}
                  className={`rounded-3xl border ${color.border} bg-white/80 p-5 shadow-sm backdrop-blur-sm sm:p-6`}
                >
                  {/* Cabeçalho da categoria */}
                  <div className="mb-5 flex items-center gap-3">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${color.bg} shadow-sm`}>
                      <Icon className={`h-5 w-5 ${color.icon}`} />
                    </div>
                    <h2 className="text-lg font-bold text-zinc-700">{cat.name}</h2>
                    <span className={`ml-auto rounded-full px-2.5 py-0.5 text-xs font-semibold ${color.badge}`}>
                      {catItems.length} {catItems.length === 1 ? "item" : "itens"}
                    </span>
                  </div>

                  <ul className="space-y-3">
                    {catItems.map((item) => {
                      const esgotado = item.status === "esgotado";
                      return (
                        <li
                          key={item.id}
                          className={`flex gap-4 rounded-2xl border bg-white p-4 transition sm:items-center ${
                            esgotado
                              ? "border-zinc-100 opacity-60"
                              : `border-zinc-100 hover:border-current hover:${color.border} hover:shadow-sm`
                          }`}
                        >
                          <ProductImage
                            item={item}
                            categoryName={cat.name}
                            color={color}
                            size="md"
                          />

                          {/* Conteúdo */}
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-zinc-800">{item.name}</p>
                            <div className="mt-1.5 flex flex-wrap items-center gap-2">
                              <StatusBadge status={item.status} />
                              <span className="text-xs text-zinc-400">
                                {item.disponivel} de {item.quantity_total} restante(s)
                              </span>
                            </div>
                            {item.link && (
                              <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`mt-2 inline-flex items-center gap-1 text-xs font-semibold ${color.icon} hover:underline`}
                              >
                                Ver produto
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>

                          {/* Botão Reservar */}
                          {!esgotado && (
                            <button
                              type="button"
                              onClick={() => {
                                setModalItem(item);
                                setModalCategoryName(cat.name);
                              }}
                              className={`shrink-0 rounded-lg border px-3 py-2 text-xs font-medium transition ${color.badge} ${color.border} hover:brightness-95`}
                            >
                              Reservar
                            </button>
                          )}
                          {esgotado && (
                            <span className="shrink-0 rounded-lg px-3 py-2 text-xs font-medium text-zinc-400">
                              Esgotado
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </motion.section>
              );
            })}
          </div>
        )}

        {/* Rodapé */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 flex items-center justify-center gap-1.5 text-xs text-zinc-400"
        >
          <Star className="h-3 w-3 text-yellow-400" fill="currentColor" />
          Feito com amor para o bebê que vem por aí
          <Star className="h-3 w-3 text-yellow-400" fill="currentColor" />
        </motion.p>
      </div>

      <AnimatePresence>
        {modalItem && (
          <ReservaModal
            item={modalItem}
            categoryName={modalCategoryName}
            onClose={() => {
              setModalItem(null);
              setModalCategoryName("");
            }}
            onSuccess={load}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
