import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { EnxovalItemWithStatus } from "@/app/enxoval/types";

const ADMIN_SECRET = process.env.ADMIN_SECRET;

function auth(request: NextRequest) {
  const header = request.headers.get("x-admin-secret");
  if (!ADMIN_SECRET || header !== ADMIN_SECRET) return false;
  return true;
}

function addStatus(item: { quantity_total: number; quantity_reserved: number }): EnxovalItemWithStatus["status"] {
  const reserved = item.quantity_reserved ?? 0;
  const total = item.quantity_total ?? 0;
  const disponivel = Math.max(0, total - reserved);
  if (disponivel === 0) return "esgotado";
  if (reserved === 0) return "disponivel";
  return "parcialmente_reservado";
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");

    const supabase = getSupabaseAdmin();
    let query = supabase
      .from("enxoval_items")
      .select(`
        *,
        category:enxoval_categories(*)
      `)
      .eq("active", true);

    if (categoryId) query = query.eq("category_id", categoryId);
    const { data: items, error } = await query.order("name", { ascending: true });

    if (error) throw error;

    const withStatus: EnxovalItemWithStatus[] = (items ?? []).map((it) => {
      const reserved = it.quantity_reserved ?? 0;
      const total = it.quantity_total ?? 0;
      const disponivel = Math.max(0, total - reserved);
      return {
        ...it,
        disponivel,
        status: addStatus(it),
      };
    });

    return NextResponse.json({ items: withStatus });
  } catch (err) {
    console.error("[api/enxoval/items] GET error:", err);
    return NextResponse.json(
      { error: "Erro ao carregar itens." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!auth(request)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { category_id, name, quantity_total = 1, link, image_url } = body;
    if (!category_id || !name?.trim()) {
      return NextResponse.json(
        { error: "Categoria e nome são obrigatórios." },
        { status: 400 }
      );
    }
    const qty = Math.max(0, Number(quantity_total) || 1);

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("enxoval_items")
      .insert({
        category_id,
        name: name.trim(),
        quantity_total: qty,
        quantity_reserved: 0,
        link: link?.trim() || null,
        image_url: image_url?.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .select("id, name, category_id, quantity_total, quantity_reserved")
      .single();

    if (error) throw error;
    return NextResponse.json({ item: data });
  } catch (err) {
    console.error("[api/enxoval/items] POST error:", err);
    return NextResponse.json(
      { error: "Erro ao criar item." },
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
    const { id, name, category_id, quantity_total, active, link, image_url } = body;
    if (!id) {
      return NextResponse.json({ error: "ID é obrigatório." }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data: current } = await supabase
      .from("enxoval_items")
      .select("quantity_total, quantity_reserved")
      .eq("id", id)
      .single();

    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (name !== undefined) updates.name = name.trim();
    if (category_id !== undefined) updates.category_id = category_id;
    if (active !== undefined) updates.active = !!active;
    if (link !== undefined) updates.link = link?.trim() || null;
    if (image_url !== undefined) updates.image_url = image_url?.trim() || null;
    if (quantity_total !== undefined) {
      const qty = Math.max(0, Number(quantity_total));
      if (current && qty < (current.quantity_reserved ?? 0)) {
        return NextResponse.json(
          { error: "Quantidade total não pode ser menor que a já reservada." },
          { status: 400 }
        );
      }
      updates.quantity_total = qty;
    }

    const { data, error } = await supabase
      .from("enxoval_items")
      .update(updates)
      .eq("id", id)
      .select("id, name, quantity_total, quantity_reserved")
      .single();

    if (error) throw error;
    return NextResponse.json({ item: data });
  } catch (err) {
    console.error("[api/enxoval/items] PATCH error:", err);
    return NextResponse.json(
      { error: "Erro ao atualizar item." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (!auth(request)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID é obrigatório." }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from("enxoval_items")
      .update({ active: false, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/enxoval/items] DELETE error:", err);
    return NextResponse.json(
      { error: "Erro ao excluir item." },
      { status: 500 }
    );
  }
}
