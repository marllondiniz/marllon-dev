import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

function normalizePhone(phone: string): string {
  return String(phone ?? "").replace(/\D/g, "");
}

function isValidBrazilianPhone(phone: string): boolean {
  const digits = normalizePhone(phone);
  if (digits.length === 10) return /^[1-9]\d$/.test(digits.slice(0, 2));
  if (digits.length === 11) return /^[1-9]\d$/.test(digits.slice(0, 2)) && digits[2] === "9";
  return false;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get("phone")?.trim();
    if (!phone) {
      return NextResponse.json(
        { error: "Informe o telefone para ver suas reservas." },
        { status: 400 }
      );
    }
    if (!isValidBrazilianPhone(phone)) {
      return NextResponse.json(
        { error: "Telefone inválido. Use DDD + número." },
        { status: 400 }
      );
    }
    const digits = normalizePhone(phone);

    const supabase = getSupabaseAdmin();
    const { data: all, error } = await supabase
      .from("enxoval_reservations")
      .select(`
        id,
        name,
        phone,
        quantity,
        status,
        created_at,
        item:enxoval_items(id, name, link, category:enxoval_categories(name))
      `)
      .in("status", ["active", "delivered"])
      .order("created_at", { ascending: false });

    if (error) throw error;

    const mine = (all ?? []).filter((r) => {
      const stored = normalizePhone((r as { phone?: string }).phone ?? "");
      return stored === digits;
    });

    return NextResponse.json({
      reservations: mine,
    });
  } catch (err) {
    console.error("[api/enxoval/my-reservations] error:", err);
    return NextResponse.json(
      { error: "Erro ao buscar reservas." },
      { status: 500 }
    );
  }
}
