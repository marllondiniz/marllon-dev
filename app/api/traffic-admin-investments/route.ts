import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

const ADMIN_SECRET = process.env.ADMIN_SECRET;

const MAX_NAME = 120;
const MAX_INVESTMENT = 120;

function requireAdmin(request: NextRequest): NextResponse | null {
  const authHeader = request.headers.get("x-admin-secret");
  if (!ADMIN_SECRET || authHeader !== ADMIN_SECRET) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  return null;
}

function normalizeSlug(raw: string | null | undefined): string {
  return String(raw ?? "").trim();
}

const isDev = process.env.NODE_ENV === "development";

type PgishError = { message?: string; code?: string };

function tableMissingHint(err: PgishError): string | undefined {
  const m = (err.message ?? "").toLowerCase();
  if (
    m.includes("does not exist") ||
    m.includes("could not find the table") ||
    m.includes("schema cache") ||
    err.code === "42P01" ||
    err.code === "PGRST205"
  ) {
    return "No Supabase, rode as migrations em supabase/migrations/ (011: tabela traffic_admin_investments; 012: coluna received_text).";
  }
  return undefined;
}

function fail(
  message: string,
  supabaseError?: PgishError,
  caught?: unknown
): NextResponse {
  const hint = supabaseError ? tableMissingHint(supabaseError) : undefined;
  let envHint: string | undefined;
  let details: string | undefined;

  if (caught instanceof Error) {
    if (caught.message.includes("Missing NEXT_PUBLIC_SUPABASE_URL") || caught.message.includes("SUPABASE_SERVICE_ROLE_KEY")) {
      envHint = "Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env.local e reinicie o servidor.";
    }
    if (isDev) details = caught.message;
  }
  if (supabaseError?.message && isDev) {
    details = details ? `${details} — ${supabaseError.message}` : supabaseError.message;
  }

  const finalHint = envHint ?? hint;

  return NextResponse.json(
    {
      error: message,
      ...(finalHint && { hint: finalHint }),
      ...(details && { details }),
    },
    { status: 500 }
  );
}

export async function GET(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const slug = normalizeSlug(request.nextUrl.searchParams.get("slug"));

  try {
    const supabase = getSupabaseAdmin();
    const q = supabase
      .from("traffic_admin_investments")
      .select("id, client_slug, person_name, investment_text, received_text, created_at")
      .eq("client_slug", slug)
      .order("created_at", { ascending: false });

    const { data, error } = await q;

    if (error) {
      console.error("[api/traffic-admin-investments] GET error:", error);
      return fail("Erro ao carregar registros.", error);
    }

    return NextResponse.json({ rows: data ?? [] });
  } catch (e) {
    console.error("[api/traffic-admin-investments] GET:", e);
    return fail("Erro interno.", undefined, e);
  }
}

export async function POST(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const body = await request.json();
    const client_slug = normalizeSlug(body.client_slug);
    const person_name = String(body.person_name ?? "").trim().slice(0, MAX_NAME);
    const investment_text = String(body.investment_text ?? "").trim();
    const received_text = String(body.received_text ?? "").trim();

    if (!investment_text || !received_text) {
      return NextResponse.json(
        { error: "Preencha o valor na Meta e quanto você recebeu." },
        { status: 400 }
      );
    }
    if (investment_text.length > MAX_INVESTMENT || received_text.length > MAX_INVESTMENT) {
      return NextResponse.json(
        { error: `Valores até ${MAX_INVESTMENT} caracteres cada.` },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("traffic_admin_investments")
      .insert({ client_slug, person_name, investment_text, received_text })
      .select("id, client_slug, person_name, investment_text, received_text, created_at")
      .single();

    if (error) {
      console.error("[api/traffic-admin-investments] POST insert:", error);
      return fail("Erro ao salvar.", error);
    }

    return NextResponse.json({ ok: true, row: data });
  } catch (e) {
    console.error("[api/traffic-admin-investments] POST:", e);
    return fail("Erro interno.", undefined, e);
  }
}

export async function PATCH(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const body = await request.json();
    const id = String(body.id ?? "").trim();
    if (!id) {
      return NextResponse.json({ error: "Envie id." }, { status: 400 });
    }

    const patch: { person_name?: string; investment_text?: string; received_text?: string } = {};
    if (body.person_name !== undefined) {
      const person_name = String(body.person_name).trim().slice(0, MAX_NAME);
      patch.person_name = person_name;
    }
    if (body.investment_text !== undefined) {
      const investment_text = String(body.investment_text).trim();
      if (!investment_text || investment_text.length > MAX_INVESTMENT) {
        return NextResponse.json({ error: "Valor na Meta inválido." }, { status: 400 });
      }
      patch.investment_text = investment_text;
    }
    if (body.received_text !== undefined) {
      const received_text = String(body.received_text).trim();
      if (!received_text || received_text.length > MAX_INVESTMENT) {
        return NextResponse.json({ error: "Valor recebido inválido." }, { status: 400 });
      }
      patch.received_text = received_text;
    }
    if (Object.keys(patch).length === 0) {
      return NextResponse.json({ error: "Nada para atualizar." }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("traffic_admin_investments")
      .update(patch)
      .eq("id", id)
      .select("id, client_slug, person_name, investment_text, received_text, created_at")
      .single();

    if (error) {
      console.error("[api/traffic-admin-investments] PATCH:", error);
      return fail("Erro ao atualizar.", error);
    }

    return NextResponse.json({ ok: true, row: data });
  } catch (e) {
    console.error("[api/traffic-admin-investments] PATCH:", e);
    return fail("Erro interno.", undefined, e);
  }
}

export async function DELETE(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const id = request.nextUrl.searchParams.get("id")?.trim();
  if (!id) {
    return NextResponse.json({ error: "Parâmetro id é obrigatório." }, { status: 400 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("traffic_admin_investments").delete().eq("id", id);

    if (error) {
      console.error("[api/traffic-admin-investments] DELETE:", error);
      return fail("Erro ao apagar.", error);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[api/traffic-admin-investments] DELETE:", e);
    return fail("Erro interno.", undefined, e);
  }
}
