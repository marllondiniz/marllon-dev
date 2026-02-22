import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

const ADMIN_SECRET = process.env.ADMIN_SECRET;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      whatsapp,
      product,
      audience,
      benefit,
      cta,
      pricing,
      objections = "",
      materials = "",
      brandLinks = "",
      pageLocation,
      deadline,
      traffic,
      integration = "",
      references: refs = "",
      restrictions = "",
      plan = "",
    } = body;

    if (!name || !whatsapp || !product || !audience || !benefit || !cta || !pricing || !pageLocation || !deadline || !traffic) {
      return NextResponse.json(
        { error: "Campos obrigatórios faltando." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("briefing_submissions")
      .insert({
        name,
        whatsapp,
        product,
        audience,
        benefit,
        cta,
        pricing,
        objections,
        materials,
        brand_links: brandLinks,
        page_location: pageLocation,
        deadline,
        traffic,
        integration,
        refs,
        restrictions,
        plan: plan || null,
      })
      .select("id, created_at")
      .single();

    if (error) {
      console.error("[api/briefing] Supabase insert error:", error);
      const message =
        process.env.NODE_ENV === "development" && error?.message
          ? error.message
          : "Erro ao salvar. Tente novamente.";
      return NextResponse.json(
        { error: message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, id: data.id });
  } catch (e) {
    console.error("[api/briefing] POST error:", e);
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
      .from("briefing_submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[api/briefing] Supabase select error:", error);
      return NextResponse.json(
        { error: "Erro ao carregar briefings." },
        { status: 500 }
      );
    }

    return NextResponse.json({ briefings: data ?? [] });
  } catch (e) {
    console.error("[api/briefing] GET error:", e);
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
      .from("briefing_submissions")
      .update({ attended })
      .eq("id", id);

    if (error) {
      console.error("[api/briefing] PATCH error:", error);
      return NextResponse.json(
        { error: "Erro ao atualizar." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[api/briefing] PATCH error:", e);
    return NextResponse.json(
      { error: "Erro interno." },
      { status: 500 }
    );
  }
}
