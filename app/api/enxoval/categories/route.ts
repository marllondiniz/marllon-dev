import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

const ADMIN_SECRET = process.env.ADMIN_SECRET;

function auth(request: NextRequest) {
  const header = request.headers.get("x-admin-secret");
  if (!ADMIN_SECRET || header !== ADMIN_SECRET) {
    return false;
  }
  return true;
}

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("enxoval_categories")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return NextResponse.json({ categories: data ?? [] });
  } catch (err) {
    console.error("[api/enxoval/categories] GET error:", err);
    return NextResponse.json(
      { error: "Erro ao carregar categorias." },
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
    const { name, sort_order = 0, icon } = body;
    if (!name?.trim()) {
      return NextResponse.json(
        { error: "Nome da categoria é obrigatório." },
        { status: 400 }
      );
    }
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("enxoval_categories")
      .insert({
        name: name.trim(),
        sort_order: Number(sort_order) || 0,
        icon: icon?.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .select("id, name, sort_order, icon, created_at")
      .single();

    if (error) throw error;
    return NextResponse.json({ category: data });
  } catch (err) {
    console.error("[api/enxoval/categories] POST error:", err);
    return NextResponse.json(
      { error: "Erro ao criar categoria." },
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
    const { id, name, sort_order, icon } = body;
    if (!id) {
      return NextResponse.json({ error: "ID é obrigatório." }, { status: 400 });
    }
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (name !== undefined) updates.name = name.trim();
    if (sort_order !== undefined) updates.sort_order = Number(sort_order) ?? 0;
    if (icon !== undefined) updates.icon = icon?.trim() || null;

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("enxoval_categories")
      .update(updates)
      .eq("id", id)
      .select("id, name, sort_order, icon")
      .single();

    if (error) throw error;
    return NextResponse.json({ category: data });
  } catch (err) {
    console.error("[api/enxoval/categories] PATCH error:", err);
    return NextResponse.json(
      { error: "Erro ao atualizar categoria." },
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
    const { data: items } = await supabase
      .from("enxoval_items")
      .select("id")
      .eq("category_id", id)
      .limit(1);
    if (items?.length) {
      return NextResponse.json(
        { error: "Exclua antes os itens desta categoria." },
        { status: 400 }
      );
    }
    const { error } = await supabase.from("enxoval_categories").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/enxoval/categories] DELETE error:", err);
    return NextResponse.json(
      { error: "Erro ao excluir categoria." },
      { status: 500 }
    );
  }
}
