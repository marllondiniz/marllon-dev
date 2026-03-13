import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

function normalizePhone(phone: string): string {
  return String(phone ?? "").replace(/\D/g, "");
}

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data: reservations, error } = await supabase
      .from("enxoval_reservations")
      .select("name, phone, quantity")
      .in("status", ["active", "delivered"])
      .order("created_at", { ascending: false });

    if (error) throw error;

    const byPhone = new Map<
      string,
      { name: string; phone: string; total: number }
    >();

    for (const r of reservations ?? []) {
      const digits = normalizePhone((r as { phone?: string }).phone ?? "");
      if (!digits) continue;
      const existing = byPhone.get(digits);
      const qty = Number((r as { quantity?: number }).quantity) || 0;
      const name = String((r as { name?: string }).name ?? "").trim();
      if (existing) {
        existing.total += qty;
        if (name) existing.name = name;
      } else {
        byPhone.set(digits, {
          name: name || "Anônimo",
          phone: (r as { phone?: string }).phone ?? "",
          total: qty,
        });
      }
    }

    const ranking = Array.from(byPhone.values())
      .filter((p) => p.total > 0)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    return NextResponse.json({ ranking });
  } catch (err) {
    console.error("[api/enxoval/ranking] error:", err);
    return NextResponse.json(
      { error: "Erro ao carregar ranking." },
      { status: 500 }
    );
  }
}
