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
  Check,
  AlertCircle,
  ExternalLink,
  Star,
  Gift,
  ChevronDown,
  Loader2,
  Trophy,
  Sparkles,
  Heart,
  Crown,
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
};

const CATEGORY_COLORS: Record<string, { bg: string; icon: string; border: string; badge: string; gradient: string }> = {
  Roupinhas:         { bg: "bg-teal-400/25",    icon: "text-teal-200",    border: "border-teal-400/30",    badge: "bg-teal-400/25 text-teal-100",   gradient: "from-teal-400/15 to-teal-500/5" },
  Passeio:           { bg: "bg-teal-500/25",    icon: "text-teal-200",    border: "border-teal-500/30",    badge: "bg-teal-500/25 text-teal-100",   gradient: "from-teal-500/15 to-teal-600/5" },
  Diversos:          { bg: "bg-cyan-400/25",    icon: "text-cyan-200",    border: "border-cyan-400/30",    badge: "bg-cyan-400/25 text-cyan-100",   gradient: "from-cyan-400/15 to-cyan-500/5" },
  "Banho e Toalete": { bg: "bg-teal-400/25", icon: "text-teal-200", border: "border-teal-400/30", badge: "bg-teal-400/25 text-teal-100", gradient: "from-teal-400/15 to-teal-500/5" },
  Quarto:            { bg: "bg-teal-600/25",    icon: "text-teal-200",    border: "border-teal-600/30",    badge: "bg-teal-600/25 text-teal-100",   gradient: "from-teal-600/15 to-teal-700/5" },
};

const DEFAULT_COLOR = { bg: "bg-teal-500/25", icon: "text-teal-200", border: "border-teal-500/30", badge: "bg-teal-500/25 text-teal-200", gradient: "from-teal-500/15 to-teal-600/5" };

function getCategoryColor(name: string) {
  return CATEGORY_COLORS[name] ?? DEFAULT_COLOR;
}

function getIcon(cat: EnxovalCategory) {
  return CATEGORY_ICONS[cat.name] ?? Baby;
}

function StatusBadge({ status }: { status: EnxovalItemWithStatus["status"] }) {
  if (status === "disponivel")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-teal-500/20 px-2.5 py-0.5 text-xs font-semibold text-teal-300">
        <Check className="h-3 w-3" />
        Disponível
      </span>
    );
  if (status === "parcialmente_reservado")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-semibold text-amber-300">
        <AlertCircle className="h-3 w-3" />
        Parcial
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-white/40">
      Esgotado
    </span>
  );
}

function ProgressBar({ reserved, total }: { reserved: number; total: number }) {
  const pct = total > 0 ? Math.round((reserved / total) * 100) : 0;
  return (
    <div className="mt-2 flex items-center gap-2">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full transition-all ${
            pct === 100 ? "bg-white/30" : "bg-teal-400"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[10px] font-medium text-white/40">{reserved}/{total}</span>
    </div>
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

  const totalItems = items.length;
  const totalReserved = items.reduce((s, i) => s + i.quantity_reserved, 0);
  const totalQty = items.reduce((s, i) => s + i.quantity_total, 0);

  return (
    <main className="min-h-screen pb-12">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#042f2e]/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-teal-600">
              <Baby className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-sm font-bold text-white">Lista de Enxoval</span>
              <span className="ml-2 hidden rounded-md bg-teal-500/20 px-1.5 py-0.5 text-[10px] font-bold text-teal-200 sm:inline">
                {totalItems} itens
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/50">
            <Sparkles className="h-3.5 w-3.5 text-teal-400" />
            <span className="hidden sm:inline">Feito com carinho</span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="pb-8 pt-10 text-center sm:pt-14"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2, stiffness: 200 }}
            className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-teal-400 to-teal-600 sm:h-24 sm:w-24"
          >
            <Baby className="h-10 w-10 text-white sm:h-12 sm:w-12" />
          </motion.div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Lista de Enxoval
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/50 sm:text-base">
            Escolha o item que deseja presentear, preencha seus dados e reserve.
            <Heart className="ml-1 inline h-4 w-4 text-teal-400 fill-teal-400" />
          </p>

          {/* Dica sobre links */}
          <p className="mx-auto mt-4 flex max-w-lg flex-wrap items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-xs text-white/60 sm:text-sm">
            <ExternalLink className="h-4 w-4 shrink-0 text-teal-400" />
            <span>
              Todos os itens têm link direto para você <strong className="text-white/80">ver a foto</strong> e
              <strong className="text-white/80"> comprar</strong> na loja. Clique em &quot;Ver produto&quot; em cada item.
            </span>
          </p>

          {/* Stats */}
          {!loading && totalItems > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mx-auto mt-6 flex max-w-xs justify-center gap-6 sm:gap-10"
            >
              <div className="text-center">
                <p className="text-2xl font-extrabold text-white">{totalItems}</p>
                <p className="text-[11px] font-medium uppercase tracking-wider text-white/30">Itens</p>
              </div>
              <div className="h-10 w-px bg-white/10" />
              <div className="text-center">
                <p className="text-2xl font-extrabold text-teal-400">{totalReserved}</p>
                <p className="text-[11px] font-medium uppercase tracking-wider text-white/30">Reservados</p>
              </div>
              <div className="h-10 w-px bg-white/10" />
              <div className="text-center">
                <p className="text-2xl font-extrabold text-teal-400">{totalQty - totalReserved}</p>
                <p className="text-[11px] font-medium uppercase tracking-wider text-white/30">Disponíveis</p>
              </div>
            </motion.div>
          )}
        </motion.section>

        {/* Top 5 - Ranking */}
        {ranking.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-6"
          >
            <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.04] ">
              <div className="flex items-center gap-2 border-b border-white/[0.06] px-5 py-3">
                <Trophy className="h-4.5 w-4.5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Top parceiros</h3>
              </div>
              <div className="grid grid-cols-2 gap-px bg-white/[0.04] sm:grid-cols-3 lg:grid-cols-5">
                {ranking.map((p, i) => (
                  <div
                    key={`${p.name}-${i}`}
                    className={`flex items-center gap-3 px-4 py-3 ${
                      i === 0 ? "bg-teal-500/10" : "bg-white/[0.02]"
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                        i === 0
                          ? "bg-gradient-to-br from-amber-400 to-amber-600 text-white "
                          : i === 1
                            ? "bg-white/10 text-white/60"
                            : i === 2
                              ? "bg-white/10 text-white/50"
                              : "bg-white/5 text-white/30"
                      }`}
                    >
                      {i === 0 ? <Crown className="h-4 w-4" /> : `${i + 1}º`}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className={`truncate text-sm font-semibold ${i === 0 ? "text-white" : "text-white/70"}`}>
                        {p.name.split(" ")[0]}
                      </p>
                      <p className="text-xs text-white/30">
                        {p.total} {p.total === 1 ? "item" : "itens"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* Minhas reservas */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.04] ">
            <button
              type="button"
              onClick={() => setMyReservationsOpen((v) => !v)}
              className="flex w-full items-center justify-between px-5 py-3.5 text-left transition hover:bg-white/[0.02]"
            >
              <span className="flex items-center gap-2 text-sm font-semibold text-white/80">
                <Gift className="h-4 w-4 text-teal-400" />
                Já reservou? Consulte aqui
              </span>
              <ChevronDown
                className={`h-4 w-4 text-white/30 transition-transform ${myReservationsOpen ? "rotate-180" : ""}`}
              />
            </button>
            {myReservationsOpen && (
              <div className="border-t border-white/[0.06] px-5 py-4">
                <form onSubmit={loadMyReservations} className="flex flex-wrap items-end gap-2">
                  <div className="min-w-[160px] flex-1">
                    <label htmlFor="my-phone" className="mb-1.5 block text-xs font-medium text-white/40">
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
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none transition focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loadingMyReservations || !myReservationsPhone.trim()}
                    className="rounded-xl bg-teal-500 px-5 py-2.5 text-sm font-semibold text-white  transition hover:bg-teal-400 disabled:opacity-50"
                  >
                    {loadingMyReservations ? <Loader2 className="inline h-4 w-4 animate-spin" /> : "Buscar"}
                  </button>
                </form>
                {myReservationsError && (
                  <p className="mt-2 text-sm text-red-400">{myReservationsError}</p>
                )}
                {myReservations.length > 0 && !myReservationsError && (
                  <ul className="mt-4 space-y-2">
                    {myReservations.map((r) => (
                      <li
                        key={r.id}
                        className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] p-3"
                      >
                        <div>
                          <p className="font-medium text-white">
                            {(r.item as { name?: string })?.name ?? "Item"}
                          </p>
                          <p className="text-xs text-white/40">
                            {(r.item as { category?: { name?: string } })?.category?.name ?? ""} · Qtd: {r.quantity}
                            {r.status === "delivered" && (
                              <span className="ml-1.5 rounded-full bg-teal-500/20 px-1.5 py-0.5 text-teal-300">
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
                            className="inline-flex items-center gap-1 rounded-lg border border-teal-500/30 bg-teal-500/10 px-3 py-1.5 text-xs font-semibold text-teal-300 transition hover:bg-teal-500/20"
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
                  <p className="mt-4 text-center text-sm text-white/30">
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
          transition={{ delay: 0.25 }}
          className="mb-8 space-y-3"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar item..."
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-3 pl-11 pr-4 text-sm text-white placeholder-white/25 outline-none  transition focus:border-teal-500/40 focus:ring-2 focus:ring-teal-500/20"
            />
          </div>
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setFilterCategory(null)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  !filterCategory
                    ? "bg-teal-500 text-white "
                    : "bg-white/[0.06] text-white/50 hover:bg-white/[0.1] hover:text-white/70"
                }`}
              >
                Todos
              </button>
              {categories.map((c) => {
                const color = getCategoryColor(c.name);
                const active = filterCategory === c.id;
                const Icon = getIcon(c);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setFilterCategory(active ? null : c.id)}
                    className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                      active
                        ? `${color.badge} ring-1 ring-current/30`
                        : "bg-white/[0.06] text-white/50 hover:bg-white/[0.1] hover:text-white/70"
                    }`}
                  >
                    <Icon className="h-3 w-3" />
                    {c.name}
                  </button>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Lista */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-2.5 w-2.5 animate-bounce rounded-full bg-teal-400"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
            <p className="mt-4 text-sm font-medium text-white/30">Carregando a lista...</p>
          </div>
        ) : sortedCategories.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-16 text-center"
          >
            <Gift className="mx-auto h-14 w-14 text-teal-400/50" />
            <p className="mt-4 text-white/40">
              {search || filterCategory
                ? "Nenhum item encontrado."
                : "A lista ainda não tem itens cadastrados."}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {sortedCategories.map((cat, idx) => {
              const catItems = byCategory.get(cat.id) ?? [];
              const Icon = getIcon(cat);
              const color = getCategoryColor(cat.name);
              return (
                <motion.section
                  key={cat.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * idx }}
                >
                  {/* Cabeçalho da categoria */}
                  <div className="mb-3 flex items-center gap-3 px-1">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color.bg}`}>
                      <Icon className={`h-5 w-5 ${color.icon}`} />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-base font-bold text-white">{cat.name}</h2>
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${color.badge}`}>
                      {catItems.length} {catItems.length === 1 ? "item" : "itens"}
                    </span>
                  </div>

                  {/* Grid de itens */}
                  <div className="grid gap-2 sm:grid-cols-2">
                    {catItems.map((item) => {
                      const esgotado = item.status === "esgotado";
                      return (
                        <motion.div
                          key={item.id}
                          whileHover={esgotado ? {} : { scale: 1.01 }}
                          className={`group flex gap-3 rounded-2xl border p-3.5 transition ${
                            esgotado
                              ? "border-white/[0.04] bg-white/[0.02] opacity-50"
                              : "border-white/[0.08] bg-white/[0.04] hover:border-white/[0.14] hover:bg-white/[0.06]"
                          }`}
                        >
                          <ProductImage
                            item={item}
                            categoryName={cat.name}
                            color={color}
                            size="md"
                          />

                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-white">{item.name}</p>
                            <div className="mt-1 flex flex-wrap items-center gap-1.5">
                              <StatusBadge status={item.status} />
                            </div>
                            <ProgressBar reserved={item.quantity_reserved} total={item.quantity_total} />
                            {item.link && (
                              <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold ${color.icon} hover:underline`}
                              >
                                Ver produto
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>

                          {/* Botão Reservar */}
                          <div className="flex items-center">
                            {!esgotado ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setModalItem(item);
                                  setModalCategoryName(cat.name);
                                }}
                                className="shrink-0 rounded-xl bg-teal-500 px-3.5 py-2 text-xs font-bold text-white  transition hover:bg-teal-400 active:scale-95"
                              >
                                Reservar
                              </button>
                            ) : (
                              <span className="shrink-0 rounded-xl px-3 py-2 text-xs font-medium text-white/20">
                                Esgotado
                              </span>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.section>
              );
            })}
          </div>
        )}

        {/* Rodapé */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-14 flex items-center justify-center gap-2 pb-4 text-xs text-white/20"
        >
          <Star className="h-3 w-3 text-teal-500/50" fill="currentColor" />
          Feito com amor para o bebê que vem por aí
          <Star className="h-3 w-3 text-teal-500/50" fill="currentColor" />
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
