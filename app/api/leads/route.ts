import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

const ADMIN_SECRET = process.env.ADMIN_SECRET;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, whatsapp, email, goal, source = "demo-alta-conversao" } = body;

    if (!name || !whatsapp || !email || !goal) {
      return NextResponse.json(
        { error: "Campos obrigatórios: name, whatsapp, email, goal" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("form_submissions")
      .insert({ name, whatsapp, email, goal, source })
      .select("id, created_at")
      .single();

    if (error) {
      console.error("[api/leads] Supabase insert error:", error);
      return NextResponse.json(
        { error: "Erro ao salvar. Tente novamente." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, id: data.id });
  } catch (e) {
    console.error("[api/leads] POST error:", e);
    return NextResponse.json(
      { error: "Erro interno." },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("x-admin-secret");
  if (!ADMIN_SECRET || authHeader !== ADMIN_SECRET) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("form_submissions")
      .select("id, name, whatsapp, email, goal, source, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[api/leads] Supabase select error:", error);
      return NextResponse.json(
        { error: "Erro ao carregar leads." },
        { status: 500 }
      );
    }

    return NextResponse.json({ leads: data ?? [] });
  } catch (e) {
    console.error("[api/leads] GET error:", e);
    return NextResponse.json(
      { error: "Erro interno." },
      { status: 500 }
    );
  }
}
