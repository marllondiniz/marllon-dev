import { NextRequest, NextResponse } from "next/server";
import {
  fetchMetaInsights,
  findClientBySlug,
  getAccessTokenForClient,
  getDefaultAdAccountId,
  getMetaAccessToken,
  getTrafficClientsFromEnv,
  listClientsPublicInfo,
  META_TRAFFIC_ADMIN_DEFAULT_SLUG,
  resolveAdAccountFromToken,
  type TrafficClientConfig,
} from "@/lib/meta-traffic";

export const dynamic = "force-dynamic";

/** Contas muito grandes: paginação pode demorar (Vercel: configure limite no plano). */
export const maxDuration = 60;

const ADMIN_SECRET = process.env.ADMIN_SECRET;

const DATE_PRESETS = new Set([
  "today",
  "yesterday",
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

function adminClientEnvHint(
  publicClients: { slug: string; name: string }[]
): string | undefined {
  if (getTrafficClientsFromEnv().length > 0) return undefined;
  if (
    publicClients.length === 1 &&
    publicClients[0]?.slug === META_TRAFFIC_ADMIN_DEFAULT_SLUG
  ) {
    return "Ambiente sem META_CLIENT_EASYBEE_* / META_CLIENT_LUZ_* / META_LUZ_* — só a conta padrão aparece. Na Vercel, copie essas variáveis do .env.local e redeploy.";
  }
  return undefined;
}

/** Avisa quando havia intenção de configurar clientes mas a lista ficou vazia. */
function metaTrafficClientsEnvWarning(clientsCount: number): string | undefined {
  if (clientsCount > 0) return undefined;
  const raw = process.env.META_TRAFFIC_CLIENTS?.trim();
  const hasFlat =
    !!process.env.META_CLIENT_EASYBEE_SLUG?.trim() ||
    !!process.env.META_CLIENT_LUZ_SLUG?.trim();
  if (raw) {
    return "META_TRAFFIC_CLIENTS não carregou nenhum cliente (JSON vazio ou inválido). Remova a linha e use META_CLIENT_* + META_LUZ_*, ou corrija o JSON.";
  }
  if (hasFlat) {
    return "Variáveis META_CLIENT_* / META_LUZ_* incompletas — confira slug, nome, senha do link, act_ e token da Luz do Luar.";
  }
  return undefined;
}

function mergeWarnings(
  base: string[] | undefined,
  extra: string | undefined
): string[] | undefined {
  const out = [...(base ?? [])];
  if (extra) out.push(extra);
  return out.length ? out : undefined;
}

export async function GET(request: NextRequest) {
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
    const token = getAccessTokenForClient(client);
    if (!token) {
      return NextResponse.json(
        {
          error:
            "Token Meta ausente. Defina `accessToken` neste cliente em META_TRAFFIC_CLIENTS ou META_ACCESS_TOKEN no servidor.",
        },
        { status: 503 }
      );
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
    let token: string | undefined;
    /** Para debug_token com app id/secret do cliente. */
    let clientContext: TrafficClientConfig | undefined;

    if (slugParam && slugParam !== META_TRAFFIC_ADMIN_DEFAULT_SLUG) {
      const c = findClientBySlug(slugParam);
      if (!c) {
        return NextResponse.json({ error: "Cliente (slug) não encontrado." }, { status: 404 });
      }
      adAccountId = c.adAccountId;
      token = getAccessTokenForClient(c);
      clientContext = c;
    } else {
      token = getMetaAccessToken();
      adAccountId = getDefaultAdAccountId();
      if (!adAccountId && clients.length > 0) {
        const firstSlug = clients[0].slug;
        if (firstSlug !== META_TRAFFIC_ADMIN_DEFAULT_SLUG) {
          const first = findClientBySlug(firstSlug);
          if (first) {
            adAccountId = first.adAccountId;
            token = getAccessTokenForClient(first) ?? token;
            clientContext = first;
          }
        }
      }
    }

    if (!token) {
      return NextResponse.json(
        {
          error:
            "META_ACCESS_TOKEN não configurado (ou falta `accessToken` no cliente selecionado).",
        },
        { status: 503 }
      );
    }

    if (!adAccountId) {
      const resolved = await resolveAdAccountFromToken(token, clientContext);
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

    const parseWarn = metaTrafficClientsEnvWarning(clients.length);
    const clientEnvHint = adminClientEnvHint(clients);

    const result = await fetchMetaInsights(adAccountId, token, preset);
    if (result.error) {
      return NextResponse.json(
        {
          error: result.error,
          hint: result.hint,
          adAccountId: result.adAccountId,
          clients,
          clientEnvHint,
          warnings: mergeWarnings(undefined, parseWarn),
        },
        { status: 502 }
      );
    }
    return NextResponse.json({
      role: "admin",
      clients,
      clientEnvHint,
      preset,
      ...result,
      warnings: mergeWarnings(result.warnings, parseWarn),
    });
  }

  return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
}
