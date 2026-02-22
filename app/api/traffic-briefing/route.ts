import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

const ADMIN_SECRET = process.env.ADMIN_SECRET;

/** Valida número de telefone brasileiro: 10 dígitos (fixo) ou 11 (celular com 9). Igual ao briefing de site. */
function isValidBrazilianPhone(whatsapp: string): boolean {
  const digits = String(whatsapp ?? "").replace(/\D/g, "");
  if (digits.length === 10) {
    const ddd = digits.slice(0, 2);
    return /^[1-9]\d$/.test(ddd);
  }
  if (digits.length === 11) {
    const ddd = digits.slice(0, 2);
    const nine = digits[2] === "9";
    return /^[1-9]\d$/.test(ddd) && nine;
  }
  return false;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
}

/** Orçamento só em formato de dinheiro: números, R$, vírgula, ponto e "a" para intervalo. */
function isValidBudget(budget: string): boolean {
  const s = String(budget ?? "").trim();
  if (!s) return true;
  const cleaned = s.replace(/\s+/g, " ");
  if (cleaned.length > 80) return false;
  const onlyMoney = /^[\d\sR$.,a]+$/i.test(cleaned);
  const hasDigit = /\d/.test(cleaned);
  return onlyMoney && hasDigit;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, whatsapp, email, current_situation, goals, budget = "" } = body;

    if (!name || !whatsapp || !email || !current_situation || !goals) {
      return NextResponse.json(
        { error: "Preencha todos os campos obrigatórios: nome, WhatsApp, e-mail, cenário atual e objetivos." },
        { status: 400 }
      );
    }

    if (!isValidBrazilianPhone(whatsapp)) {
      return NextResponse.json(
        { error: "WhatsApp inválido. Use DDD + número. Ex.: (27) 9 9999-9999" },
        { status: 400 }
      );
    }
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "E-mail inválido. Use um e-mail com @ (ex.: nome@dominio.com)." },
        { status: 400 }
      );
    }
    const budgetStr = typeof budget === "string" ? budget : String(budget ?? "");
    if (!isValidBudget(budgetStr)) {
      return NextResponse.json(
        { error: "Orçamento inválido. Informe apenas em formato de dinheiro (ex.: R$ 2.000 ou R$ 2.000 a R$ 5.000)." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("traffic_briefings")
      .insert({ name, whatsapp, email, current_situation, goals, budget: budgetStr.trim() || null })
      .select("id, created_at")
      .single();

    if (error) {
      console.error("[api/traffic-briefing] Supabase insert error:", error);
      return NextResponse.json(
        { error: "Erro ao salvar. Tente novamente." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, id: data.id });
  } catch (e) {
    console.error("[api/traffic-briefing] POST error:", e);
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
      .from("traffic_briefings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[api/traffic-briefing] Supabase select error:", error);
      return NextResponse.json(
        { error: "Erro ao carregar briefings." },
        { status: 500 }
      );
    }

    return NextResponse.json({ briefings: data ?? [] });
  } catch (e) {
    console.error("[api/traffic-briefing] GET error:", e);
    return NextResponse.json(
      { error: "Erro interno." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const authHeader = request.headers.get("x-admin-secret");
  if (!ADMIN_SECRET || authHeader !== ADMIN_SECRET) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, attended } = body;
    if (!id || typeof attended !== "boolean") {
      return NextResponse.json(
        { error: "Envie id e attended (boolean)." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from("traffic_briefings")
      .update({ attended })
      .eq("id", id);

    if (error) {
      console.error("[api/traffic-briefing] PATCH error:", error);
      return NextResponse.json(
        { error: "Erro ao atualizar." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[api/traffic-briefing] PATCH error:", e);
    return NextResponse.json(
      { error: "Erro interno." },
      { status: 500 }
    );
  }
}
