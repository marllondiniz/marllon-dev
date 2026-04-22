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
      const hint =
        /row-level security|rls|42501|permission denied/i.test(
          String(error.message || error)
        ) || (error as { code?: string }).code === "42501"
          ? " Verifique se SUPABASE_SERVICE_ROLE_KEY é a chave service_role (em Settings → API), não a chave anon/public."
          : "";
      const publicMessage =
        process.env.NODE_ENV === "development"
          ? `${error.message}${hint ? ` —${hint}` : ""}`
          : "Erro ao salvar. Tente novamente.";
      return NextResponse.json({ error: publicMessage }, { status: 500 });
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
      const msg = String((error as { message?: string }).message || error);
      const rls =
        /row-level security|rls|42501|permission denied|permission denied for table/i.test(msg) ||
        (error as { code?: string }).code === "42501";
      const hint = rls
        ? " Verifique se SUPABASE_SERVICE_ROLE_KEY é a chave service_role (Settings → API), não a chave anon. A tabela form_submissions precisa existir (migration 001)."
        : "";
      const publicMessage =
        process.env.NODE_ENV === "development" ? `${msg}${hint ? ` —${hint}` : ""}` : "Erro ao carregar leads.";
      return NextResponse.json({ error: publicMessage }, { status: 500 });
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

export async function DELETE(request: NextRequest) {
  const authHeader = request.headers.get("x-admin-secret");
  if (!ADMIN_SECRET || authHeader !== ADMIN_SECRET) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const id = request.nextUrl.searchParams.get("id");
  if (!id?.trim()) {
    return NextResponse.json({ error: "Parâmetro id é obrigatório." }, { status: 400 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("form_submissions").delete().eq("id", id);

    if (error) {
      console.error("[api/leads] Supabase delete error:", error);
      return NextResponse.json(
        { error: "Erro ao apagar. Tente novamente." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[api/leads] DELETE error:", e);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
