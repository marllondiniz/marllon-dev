import { NextRequest, NextResponse } from "next/server";
import {
  fetchMetaInsights,
  findClientBySlug,
  getDefaultAdAccountId,
  getMetaAccessToken,
  listClientsPublicInfo,
  resolveAdAccountFromToken,
} from "@/lib/meta-traffic";

export const dynamic = "force-dynamic";

/** Contas muito grandes: paginação pode demorar (Vercel: configure limite no plano). */
export const maxDuration = 60;

const ADMIN_SECRET = process.env.ADMIN_SECRET;

const DATE_PRESETS = new Set([
  "last_7d",
  "last_14d",
  "last_30d",
  "last_90d",
  "this_month",
  "last_month",
  /** ~37 meses (ou META_INSIGHTS_HISTORY_MONTHS) via time_range. */
  "last_37_months",
]);

function parseDatePreset(request: NextRequest): string {
  const p = request.nextUrl.searchParams.get("preset")?.trim() ?? "last_30d";
  return DATE_PRESETS.has(p) ? p : "last_30d";
}

export async function GET(request: NextRequest) {
  const token = getMetaAccessToken();
  if (!token) {
    return NextResponse.json(
      { error: "META_ACCESS_TOKEN não configurado no servidor." },
      { status: 503 }
    );
  }

  const adminHeader = request.headers.get("x-admin-secret");
  const clientSlug = request.headers.get("x-trafego-slug")?.trim();
  const clientSecret = request.headers.get("x-trafego-secret")?.trim();
  const preset = parseDatePreset(request);

  const clients = listClientsPublicInfo();

  // Cliente (slug + senha própria)
  if (clientSlug && clientSecret) {
    const client = findClientBySlug(clientSlug);
    if (!client || client.secret !== clientSecret) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    const result = await fetchMetaInsights(client.adAccountId, token, preset);
    if (result.error) {
      return NextResponse.json(
        {
          error: result.error,
          hint: result.hint,
          adAccountId: result.adAccountId,
        },
        { status: 502 }
      );
    }
    return NextResponse.json({
      role: "client",
      label: client.name,
      preset,
      ...result,
    });
  }

  // Admin
  if (ADMIN_SECRET && adminHeader === ADMIN_SECRET) {
    const slugParam = request.nextUrl.searchParams.get("slug")?.trim();
    let adAccountId: string | undefined;

    if (slugParam) {
      const c = findClientBySlug(slugParam);
      if (!c) {
        return NextResponse.json({ error: "Cliente (slug) não encontrado." }, { status: 404 });
      }
      adAccountId = c.adAccountId;
    } else {
      adAccountId = getDefaultAdAccountId();
      if (!adAccountId && clients.length > 0) {
        const first = findClientBySlug(clients[0].slug);
        adAccountId = first?.adAccountId;
      }
    }

    if (!adAccountId) {
      const resolved = await resolveAdAccountFromToken(token);
      adAccountId = resolved.adAccountId;
      if (!adAccountId) {
        return NextResponse.json(
          {
            error:
              resolved.detail ??
              "Não foi possível obter a conta de anúncios. Defina META_AD_ACCOUNT_ID no .env (ID act_ no Gerenciador de Anúncios).",
          },
          { status: 400 }
        );
      }
    }

    const result = await fetchMetaInsights(adAccountId, token, preset);
    if (result.error) {
      return NextResponse.json(
        {
          error: result.error,
          hint: result.hint,
          adAccountId: result.adAccountId,
          clients,
        },
        { status: 502 }
      );
    }
    return NextResponse.json({
      role: "admin",
      clients,
      preset,
      ...result,
    });
  }

  return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
}
