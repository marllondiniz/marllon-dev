import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

const ADMIN_SECRET = process.env.ADMIN_SECRET;

function auth(request: NextRequest) {
  const header = request.headers.get("x-admin-secret");
  if (!ADMIN_SECRET || header !== ADMIN_SECRET) return false;
  return true;
}

function isValidBrazilianPhone(phone: string): boolean {
  const digits = String(phone ?? "").replace(/\D/g, "");
  if (digits.length === 10)
    return /^[1-9]\d$/.test(digits.slice(0, 2));
  if (digits.length === 11)
    return /^[1-9]\d$/.test(digits.slice(0, 2)) && digits[2] === "9";
  return false;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { item_id, name, phone, quantity, message } = body;

    if (!item_id || !name?.trim() || !phone?.trim()) {
      return NextResponse.json(
        { error: "Preencha nome e telefone." },
        { status: 400 }
      );
    }

    const qty = Math.max(1, Math.floor(Number(quantity) || 1));
    if (!isValidBrazilianPhone(phone)) {
      return NextResponse.json(
        { error: "Telefone inválido. Use DDD + número. Ex.: (27) 9 9999-9999" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const { data: item, error: itemError } = await supabase
      .from("enxoval_items")
      .select("id, quantity_total, quantity_reserved")
      .eq("id", item_id)
      .eq("active", true)
      .single();

    if (itemError || !item) {
      return NextResponse.json(
        { error: "Item não encontrado ou inativo." },
        { status: 404 }
      );
    }

    const total = item.quantity_total ?? 0;
    const reserved = item.quantity_reserved ?? 0;
    const disponivel = Math.max(0, total - reserved);

    if (qty > disponivel) {
      return NextResponse.json(
        {
          error:
            disponivel === 0
              ? "Este item está esgotado."
              : `Há apenas ${disponivel} unidade(s) disponível(is).`,
        },
        { status: 400 }
      );
    }

    const { data: reservation, error: resError } = await supabase
      .from("enxoval_reservations")
      .insert({
        item_id,
        name: name.trim(),
        phone: phone.trim(),
        quantity: qty,
        message: message?.trim() || null,
        status: "active",
        updated_at: new Date().toISOString(),
      })
      .select("id, created_at")
      .single();

    if (resError) {
      console.error("[api/enxoval/reservations] POST insert error:", resError);
      return NextResponse.json(
        { error: "Erro ao registrar reserva. Tente novamente." },
        { status: 500 }
      );
    }

    const { error: updateError } = await supabase
      .from("enxoval_items")
      .update({
        quantity_reserved: reserved + qty,
        updated_at: new Date().toISOString(),
      })
      .eq("id", item_id);

    if (updateError) {
      console.error("[api/enxoval/reservations] POST update item error:", updateError);
      return NextResponse.json(
        { error: "Erro ao atualizar item. Tente novamente." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, id: reservation.id });
  } catch (err) {
    console.error("[api/enxoval/reservations] POST error:", err);
    return NextResponse.json(
      { error: "Erro ao registrar reserva." },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  if (!auth(request)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const status = searchParams.get("status");

    const supabase = getSupabaseAdmin();
    let query = supabase
      .from("enxoval_reservations")
      .select(`
        *,
        item:enxoval_items(
          id,
          name,
          quantity_total,
          quantity_reserved,
          category_id,
          category:enxoval_categories(id, name)
        )
      `)
      .order("created_at", { ascending: false });

    if (status) query = query.eq("status", status);

    const { data: reservations, error } = await query;

    if (error) throw error;

    let filtered = reservations ?? [];
    if (categoryId) {
      filtered = filtered.filter(
        (r: { item?: { category_id?: string } }) => r.item?.category_id === categoryId
      );
    }

    return NextResponse.json({ reservations: filtered });
  } catch (err) {
    console.error("[api/enxoval/reservations] GET error:", err);
    return NextResponse.json(
      { error: "Erro ao carregar reservas." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  if (!auth(request)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "ID e status são obrigatórios." },
        { status: 400 }
      );
    }

    if (!["cancelled", "delivered"].includes(status)) {
      return NextResponse.json(
        { error: "Status inválido." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    const { data: res, error: fetchError } = await supabase
      .from("enxoval_reservations")
      .select("id, item_id, quantity, status")
      .eq("id", id)
      .single();

    if (fetchError || !res) {
      return NextResponse.json({ error: "Reserva não encontrada." }, { status: 404 });
    }

    if (status === "cancelled" && res.status === "active") {
      const { data: item } = await supabase
        .from("enxoval_items")
        .select("quantity_reserved")
        .eq("id", res.item_id)
        .single();

      const currentReserved = item?.quantity_reserved ?? 0;
      const newReserved = Math.max(0, currentReserved - (res.quantity ?? 0));

      await supabase
        .from("enxoval_items")
        .update({
          quantity_reserved: newReserved,
          updated_at: new Date().toISOString(),
        })
        .eq("id", res.item_id);
    }

    const { error: updateError } = await supabase
      .from("enxoval_reservations")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (updateError) throw updateError;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/enxoval/reservations] PATCH error:", err);
    return NextResponse.json(
      { error: "Erro ao atualizar reserva." },
      { status: 500 }
    );
  }
}
