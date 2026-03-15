"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ExternalLink, Gift, Loader2, Heart, AlertCircle } from "lucide-react";
import ProductImage from "./ProductImage";
import type { EnxovalItemWithStatus } from "./types";

function formatBrazilianPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (!digits.length) return "";
  if (digits.length <= 2) return `(${digits}`;
  const ddd = digits.slice(0, 2);
  const rest = digits.slice(2);
  const cel = rest[0] === "9";
  if (cel) {
    if (rest.length <= 1) return `(${ddd}) ${rest}`;
    if (rest.length <= 5) return `(${ddd}) ${rest[0]} ${rest.slice(1)}`;
    return `(${ddd}) ${rest[0]} ${rest.slice(1, 5)}-${rest.slice(5, 9)}`;
  }
  if (rest.length <= 4) return `(${ddd}) ${rest}`;
  return `(${ddd}) ${rest.slice(0, 4)}-${rest.slice(4, 8)}`;
}

function isValidBrazilianPhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 10) return /^[1-9]\d$/.test(digits.slice(0, 2));
  if (digits.length === 11) return /^[1-9]\d$/.test(digits.slice(0, 2)) && digits[2] === "9";
  return false;
}

const inputCls =
  "w-full rounded-2xl border border-zinc-200 bg-[#fafafa] px-4 py-3 text-sm text-zinc-700 placeholder-zinc-400 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100";
const inputErrorCls =
  "w-full rounded-2xl border border-red-300 bg-red-50/40 px-4 py-3 text-sm text-zinc-700 placeholder-zinc-400 outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100";

type Props = {
  item: EnxovalItemWithStatus;
  categoryName?: string;
  onClose: () => void;
  onSuccess: () => void;
};

const DEFAULT_COLOR = { bg: "bg-sky-50", icon: "text-sky-400" };

export default function ReservaModal({ item, categoryName = "", onClose, onSuccess }: Props) {
  const maxQty = item.disponivel;
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [quantity, setQuantity] = useState(Math.min(1, maxQty));
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; phone?: string; quantity?: string }>({});

  useEffect(() => {
    setQuantity((q) => Math.min(Math.max(1, q), maxQty));
  }, [maxQty]);

  function validate() {
    const e: typeof errors = {};
    if (!name.trim()) e.name = "Informe seu nome.";
    if (!phone.trim()) e.phone = "Informe seu telefone.";
    else if (!isValidBrazilianPhone(phone)) e.phone = "Telefone inválido. Use DDD + número.";
    if (quantity < 1 || quantity > maxQty) e.quantity = `Escolha entre 1 e ${maxQty}.`;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate() || submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/enxoval/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          item_id: item.id,
          name: name.trim(),
          phone: phone.trim(),
          quantity,
          message: message.trim() || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Erro ao reservar.");
      onSuccess();
      onClose();
    } catch (err) {
      setErrors({ quantity: err instanceof Error ? err.message : "Erro ao reservar." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-blue-900/20 backdrop-blur-sm" aria-hidden />

        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 12 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
          style={{ background: "linear-gradient(160deg, #eff6ff 0%, #f0f9ff 100%)" }}
        >
          {/* Barra decorativa topo */}
          <div className="h-1.5 w-full bg-gradient-to-r from-blue-400 via-sky-400 to-cyan-400" />

          <div className="p-6">
            {/* Header do modal */}
            <div className="mb-5 flex items-start gap-3">
              <ProductImage
                item={item}
                categoryName={categoryName}
                color={DEFAULT_COLOR}
                size="lg"
              />

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-blue-500">
                  <Gift className="h-3.5 w-3.5" />
                  <span>Reservar item</span>
                </div>
                <p className="mt-0.5 font-bold text-zinc-800">{item.name}</p>
                <p className="mt-0.5 text-xs text-emerald-600 font-medium">
                  {item.disponivel} disponível(is)
                </p>
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-sky-500 hover:underline"
                  >
                    Ver produto
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>

              <button
                type="button"
                onClick={onClose}
                className="shrink-0 rounded-xl p-2 text-zinc-400 transition hover:bg-sky-50 hover:text-blue-500"
                aria-label="Fechar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-zinc-600">
                  Nome completo *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
                  }}
                  placeholder="Seu nome"
                  className={errors.name ? inputErrorCls : inputCls}
                  autoFocus
                />
                {errors.name && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-zinc-600">
                  Telefone / WhatsApp *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(formatBrazilianPhone(e.target.value));
                    if (errors.phone) setErrors((p) => ({ ...p, phone: undefined }));
                  }}
                  placeholder="(27) 9 9999-9999"
                  className={errors.phone ? inputErrorCls : inputCls}
                />
                {errors.phone && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-zinc-600">
                  Quantidade
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border-2 border-blue-200 bg-white text-blue-500 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="flex h-11 min-w-[3.5rem] items-center justify-center rounded-2xl border-2 border-blue-200 bg-white text-lg font-bold text-zinc-800 shadow-sm">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                    disabled={quantity >= maxQty}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border-2 border-blue-200 bg-white text-blue-500 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <span className="text-sm text-zinc-400">de {maxQty}</span>
                </div>
                {errors.quantity && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {errors.quantity}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-zinc-500">
                  Mensagem <span className="font-normal text-zinc-400">(opcional)</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Alguma observação?"
                  rows={2}
                  className={inputCls}
                />
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-2xl border-2 border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-500 transition hover:border-zinc-300 hover:bg-zinc-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-sky-500 px-4 py-3 text-sm font-bold text-white shadow-md shadow-blue-200/60 transition hover:from-blue-600 hover:to-sky-600 active:scale-95 disabled:opacity-70"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Reservando...
                    </>
                  ) : (
                    <>
                      <Heart className="h-4 w-4 fill-current" />
                      Confirmar reserva
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
