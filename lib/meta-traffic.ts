const DEFAULT_API_VERSION = "v21.0";

export type TrafficClientConfig = {
  slug: string;
  name: string;
  adAccountId: string;
  secret: string;
};

export function getMetaApiVersion(): string {
  return process.env.META_API_VERSION?.trim() || DEFAULT_API_VERSION;
}

export function getMetaAccessToken(): string | undefined {
  const t = process.env.META_ACCESS_TOKEN?.trim();
  return t || undefined;
}

/** Conta de anúncios padrão (ex.: act_123456789) — uso quando não há clientes no JSON. */
export function getDefaultAdAccountId(): string | undefined {
  const id = process.env.META_AD_ACCOUNT_ID?.trim();
  return id || undefined;
}

/** App ID / secret (úteis para renovar token no servidor; opcional para só ler insights). */
export function getMetaAppId(): string | undefined {
  return process.env.META_APP_ID?.trim();
}

export function getMetaAppSecret(): string | undefined {
  return process.env.META_APP_SECRET?.trim();
}

export type ResolveAdAccountResult = {
  adAccountId?: string;
  /** Detalhe amigável ou mensagem bruta da Graph API */
  detail?: string;
};

/**
 * Descobre uma conta act_ via token. Se a lista vier vazia ou der erro,
 * devolve `detail` para mostrar no painel (permissões, token errado, etc.).
 */
export async function resolveAdAccountFromToken(
  userAccessToken: string
): Promise<ResolveAdAccountResult> {
  const v = getMetaApiVersion();
  const url = new URL(`https://graph.facebook.com/${v}/me/adaccounts`);
  url.searchParams.set("fields", "id,name");
  url.searchParams.set("limit", "50");
  url.searchParams.set("access_token", userAccessToken);

  const res = await fetch(url.toString(), { cache: "no-store" });
  const json = (await res.json()) as {
    data?: Array<{ id?: string; name?: string }>;
    error?: { message: string; code?: number };
  };

  if (json.error) {
    return {
      detail: `Graph API (adaccounts): ${json.error.message}${json.error.code != null ? ` (cód. ${json.error.code})` : ""}. Verifique se o token tem a permissão ads_read ou ads_management e se não expirou.`,
    };
  }

  const first = json.data?.[0]?.id;
  if (typeof first === "string") {
    return { adAccountId: first };
  }

  let scopeHint = "";
  const appId = getMetaAppId();
  const appSecret = getMetaAppSecret();
  if (appId && appSecret) {
    const dbg = await fetchDebugTokenInfo(userAccessToken, appId, appSecret);
    if (dbg) scopeHint = ` ${dbg}`;
  }

  return {
    detail: `A lista de contas do token está vazia (0 ad accounts). No Gerenciador de Anúncios, copie o ID da conta (começa com act_) e defina no .env: META_AD_ACCOUNT_ID=act_....${scopeHint}`,
  };
}

/** Usa app id + secret para inspecionar escopos do token (só quando a lista de contas falha). */
async function fetchDebugTokenInfo(
  inputToken: string,
  appId: string,
  appSecret: string
): Promise<string | undefined> {
  try {
    const v = getMetaApiVersion();
    const url = new URL(`https://graph.facebook.com/${v}/debug_token`);
    url.searchParams.set("input_token", inputToken);
    url.searchParams.set("access_token", `${appId}|${appSecret}`);
    const res = await fetch(url.toString(), { cache: "no-store" });
    const json = (await res.json()) as {
      data?: {
        is_valid?: boolean;
        scopes?: string[];
        expires_at?: number;
        error?: { message: string };
      };
    };
    if (json.data?.error?.message) return `[debug_token: ${json.data.error.message}]`;
    const d = json.data;
    if (!d) return undefined;
    const parts: string[] = [];
    if (d.is_valid === false) parts.push("Token inválido ou expirado.");
    if (d.expires_at && d.expires_at > 0) {
      const exp = new Date(d.expires_at * 1000);
      parts.push(`Expira em ${exp.toLocaleString("pt-BR")}.`);
    }
    if (d.scopes?.length) {
      const hasAds = d.scopes.some((s) => s.includes("ads"));
      parts.push(`Escopos: ${d.scopes.join(", ")}.${hasAds ? "" : " Falta permissão de anúncios (ex.: ads_read)."}`);
    }
    return parts.length ? `[${parts.join(" ")}]` : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Lista de clientes: JSON no env META_TRAFFIC_CLIENTS
 * [{"slug":"loja-x","name":"Loja X","adAccountId":"act_...","secret":"senha-do-cliente"}]
 */
export function getTrafficClientsFromEnv(): TrafficClientConfig[] {
  const raw = process.env.META_TRAFFIC_CLIENTS?.trim();
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (x): x is TrafficClientConfig =>
          typeof x === "object" &&
          x !== null &&
          typeof (x as TrafficClientConfig).slug === "string" &&
          typeof (x as TrafficClientConfig).name === "string" &&
          typeof (x as TrafficClientConfig).adAccountId === "string" &&
          typeof (x as TrafficClientConfig).secret === "string"
      )
      .map((c) => ({
        slug: c.slug,
        name: c.name,
        adAccountId: c.adAccountId.startsWith("act_") ? c.adAccountId : `act_${c.adAccountId}`,
        secret: c.secret,
      }));
  } catch {
    return [];
  }
}

export function findClientBySlug(slug: string): TrafficClientConfig | undefined {
  return getTrafficClientsFromEnv().find((c) => c.slug === slug);
}

function normalizeActId(id: string): string {
  const s = id.trim();
  return s.startsWith("act_") ? s : `act_${s}`;
}

type FbInsightRow = Record<string, string | undefined>;

function num(v: string | undefined): number {
  if (v === undefined || v === "") return 0;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export type AccountTotals = {
  accountName: string;
  impressions: number;
  clicks: number;
  spend: number;
  reach: number;
  ctr: number;
  cpc: number;
  cpm: number;
};

export type CampaignInsightRow = {
  campaignId: string;
  campaignName: string;
  impressions: number;
  clicks: number;
  spend: number;
  ctr: number;
  cpc: number;
};

export type AdSetInsightRow = {
  adSetId: string;
  adSetName: string;
  campaignId: string;
  campaignName: string;
  impressions: number;
  clicks: number;
  spend: number;
  ctr: number;
  cpc: number;
};

export type AdInsightRow = {
  adId: string;
  adName: string;
  adSetId: string;
  adSetName: string;
  campaignName: string;
  impressions: number;
  clicks: number;
  spend: number;
  ctr: number;
  cpc: number;
};

/** Texto extra quando a Meta bloqueia por permissão (#200 NOT grant ads_read). */
export function metaInsightsPermissionHint(apiMessage: string): string | undefined {
  const s = String(apiMessage).toLowerCase();
  if (!s.includes("not grant") || !s.includes("ads_read")) return undefined;
  return [
    "A Meta bloqueou o acesso: o token não tem permissão de anúncios aceita para esta conta (não é bug do site).",
    "",
    "1) developers.facebook.com → seu app → Casos de uso / Permissões: peça Acesso avançado (Advanced access) para ads_read.",
    "2) Gere um token NOVO no Graph API Explorer com ads_read marcado e substitua META_ACCESS_TOKEN.",
    "3) Gerenciador de Negócios → Usuários → o usuário que gerou o token deve ter acesso à conta act_…",
    "4) Se o app estiver só em Desenvolvimento, adicione a conta como teste ou publique o app conforme a Meta exige.",
    "",
    "Doc: https://developers.facebook.com/docs/marketing-api/get-started/authorization/#permissions-and-features",
  ].join("\n");
}

export type MetaInsightsResult = {
  adAccountId: string;
  /** Identificador do período (ex.: last_30d, last_37_months). */
  datePreset: string;
  /** Quando o período é um intervalo fixo (ex.: últimos N meses). */
  timeRange?: { since: string; until: string };
  account: AccountTotals | null;
  campaigns: CampaignInsightRow[];
  adsets: AdSetInsightRow[];
  ads: AdInsightRow[];
  /** Avisos quando conjuntos/anúncios não carregam mas campanha sim */
  warnings?: string[];
  error?: string;
  hint?: string;
};

const STANDARD_DATE_PRESETS = new Set([
  "last_7d",
  "last_14d",
  "last_30d",
  "last_90d",
  "this_month",
  "last_month",
]);

/** Meses de histórico para `last_37_months` (padrão 37, alinhado à retenção típica da Meta). */
export function getInsightsHistoryMonthCount(): number {
  const raw = process.env.META_INSIGHTS_HISTORY_MONTHS?.trim();
  const n = raw ? Number.parseInt(raw, 10) : 37;
  if (!Number.isFinite(n)) return 37;
  return Math.min(120, Math.max(1, Math.round(n)));
}

/** Intervalo [since, until] em UTC YYYY-MM-DD, N meses atrás até hoje. */
export function rollingMonthsDateRange(months: number): { since: string; until: string } {
  const until = new Date();
  const since = new Date(
    Date.UTC(until.getUTCFullYear(), until.getUTCMonth(), until.getUTCDate())
  );
  since.setUTCMonth(since.getUTCMonth() - months);
  const fmt = (d: Date) =>
    `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
  return { since: fmt(since), until: fmt(until) };
}

/**
 * Converte o preset da UI em parâmetros da API (`date_preset` ou `time_range`).
 * Presets desconhecidos viram last_30d.
 */
export function insightDateParamsFromPreset(preset: string): {
  params: Record<string, string>;
  periodKey: string;
  timeRange?: { since: string; until: string };
} {
  const p = preset.trim();
  if (p === "last_37_months") {
    const m = getInsightsHistoryMonthCount();
    const tr = rollingMonthsDateRange(m);
    return {
      params: { time_range: JSON.stringify(tr) },
      periodKey: "last_37_months",
      timeRange: tr,
    };
  }
  if (STANDARD_DATE_PRESETS.has(p)) {
    return { params: { date_preset: p }, periodKey: p };
  }
  return { params: { date_preset: "last_30d" }, periodKey: "last_30d" };
}

async function graphGet<T>(
  path: string,
  token: string,
  params: Record<string, string>
): Promise<{ data?: T; error?: { message: string } }> {
  const v = getMetaApiVersion();
  const url = new URL(`https://graph.facebook.com/${v}/${path.replace(/^\//, "")}`);
  for (const [k, val] of Object.entries(params)) {
    url.searchParams.set(k, val);
  }
  url.searchParams.set("access_token", token);

  const res = await fetch(url.toString(), { cache: "no-store" });
  const json = (await res.json()) as { data?: T; error?: { message: string } };
  return json;
}

/** Máximo de linhas por requisição na API de insights (documentação Meta). */
const INSIGHTS_PAGE_LIMIT = "500";

/**
 * Máximo de páginas por nível (500 × 500 = 250k linhas). Evita loop infinito.
 * Sobrescreva com META_INSIGHTS_MAX_PAGES no env (ex.: 1000).
 */
function getMaxInsightPages(): number {
  const raw = process.env.META_INSIGHTS_MAX_PAGES?.trim();
  if (!raw) return 500;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 && n <= 2000 ? n : 500;
}

type InsightsPageJson = {
  data?: FbInsightRow[];
  error?: { message: string };
  paging?: { next?: string };
};

/**
 * Percorre todas as páginas (`paging.next`) até acabar ou atingir o teto de páginas.
 * `rows` pode conter dados parciais se der erro no meio da paginação.
 */
async function fetchAllInsightPages(
  path: string,
  token: string,
  params: Record<string, string>
): Promise<{ rows: FbInsightRow[]; error?: string }> {
  const v = getMetaApiVersion();
  const firstUrl = new URL(`https://graph.facebook.com/${v}/${path.replace(/^\//, "")}`);
  for (const [k, val] of Object.entries(params)) {
    firstUrl.searchParams.set(k, val);
  }
  firstUrl.searchParams.set("access_token", token);
  firstUrl.searchParams.set("limit", INSIGHTS_PAGE_LIMIT);

  const rows: FbInsightRow[] = [];
  let url: string | null = firstUrl.toString();
  const maxPages = getMaxInsightPages();
  let page = 0;

  while (url && page < maxPages) {
    page += 1;
    const res = await fetch(url, { cache: "no-store" });
    const json = (await res.json()) as InsightsPageJson;
    if (json.error?.message) {
      return { rows, error: json.error.message };
    }
    if (json.data?.length) {
      rows.push(...json.data);
    }
    url = json.paging?.next ?? null;
  }

  if (url) {
    return {
      rows,
      error: `Limite de paginação atingido (${maxPages} páginas, até ~${maxPages * 500} linhas por nível). Defina META_INSIGHTS_MAX_PAGES no env (máx. 2000) ou use período menor.`,
    };
  }

  return { rows };
}

export async function fetchMetaInsights(
  adAccountId: string,
  token: string,
  preset: string
): Promise<MetaInsightsResult> {
  const { params: dateParams, periodKey, timeRange } = insightDateParamsFromPreset(preset);
  const act = normalizeActId(adAccountId);

  const fieldsAccount = "account_name,impressions,clicks,spend,ctr,cpc,cpm,reach";

  const accJson = await graphGet<FbInsightRow[]>(`${act}/insights`, token, {
    fields: fieldsAccount,
    ...dateParams,
  });

  if (accJson.error?.message) {
    const msg = accJson.error.message;
    return {
      adAccountId: act,
      datePreset: periodKey,
      timeRange,
      account: null,
      campaigns: [],
      adsets: [],
      ads: [],
      error: msg,
      hint: metaInsightsPermissionHint(msg),
    };
  }

  const row = accJson.data?.[0];
  let account: AccountTotals | null = null;
  if (row) {
    const impressions = num(row.impressions as string | undefined);
    const clicks = num(row.clicks as string | undefined);
    const spend = num(row.spend as string | undefined);
    const reach = num(row.reach as string | undefined);
    account = {
      accountName: String(row.account_name ?? "Conta de anúncios"),
      impressions,
      clicks,
      spend,
      reach,
      ctr: num(row.ctr as string | undefined) || (impressions > 0 ? (clicks / impressions) * 100 : 0),
      cpc: num(row.cpc as string | undefined) || (clicks > 0 ? spend / clicks : 0),
      cpm: num(row.cpm as string | undefined) || (impressions > 0 ? (spend / impressions) * 1000 : 0),
    };
  }

  const fieldsCamp = "campaign_id,campaign_name,impressions,clicks,spend,ctr,cpc";
  const fieldsAdset =
    "adset_id,adset_name,campaign_id,campaign_name,impressions,clicks,spend,ctr,cpc";
  const fieldsAd =
    "ad_id,ad_name,adset_id,adset_name,campaign_name,impressions,clicks,spend,ctr,cpc";

  const [campRes, adsetRes, adRes] = await Promise.all([
    fetchAllInsightPages(`${act}/insights`, token, {
      fields: fieldsCamp,
      ...dateParams,
      level: "campaign",
    }),
    fetchAllInsightPages(`${act}/insights`, token, {
      fields: fieldsAdset,
      ...dateParams,
      level: "adset",
    }),
    fetchAllInsightPages(`${act}/insights`, token, {
      fields: fieldsAd,
      ...dateParams,
      level: "ad",
    }),
  ]);

  const warnings: string[] = [];

  if (campRes.error && campRes.rows.length === 0) {
    const msg = campRes.error;
    return {
      adAccountId: act,
      datePreset: periodKey,
      timeRange,
      account,
      campaigns: [],
      adsets: [],
      ads: [],
      error: msg,
      hint: metaInsightsPermissionHint(msg),
    };
  }
  if (campRes.error) {
    warnings.push(`Campanhas: ${campRes.error}`);
  }

  const campaigns: CampaignInsightRow[] = campRes.rows.map((r) => {
    const impressions = num(r.impressions as string | undefined);
    const clicks = num(r.clicks as string | undefined);
    const spend = num(r.spend as string | undefined);
    return {
      campaignId: String(r.campaign_id ?? ""),
      campaignName: String(r.campaign_name ?? "—"),
      impressions,
      clicks,
      spend,
      ctr: num(r.ctr as string | undefined) || (impressions > 0 ? (clicks / impressions) * 100 : 0),
      cpc: num(r.cpc as string | undefined) || (clicks > 0 ? spend / clicks : 0),
    };
  });

  campaigns.sort((a, b) => b.spend - a.spend);

  let adsets: AdSetInsightRow[] = [];
  let ads: AdInsightRow[] = [];

  if (adsetRes.error && adsetRes.rows.length === 0) {
    warnings.push(`Conjuntos: ${adsetRes.error}`);
  } else {
    if (adsetRes.error) {
      warnings.push(`Conjuntos (possivelmente incompleto): ${adsetRes.error}`);
    }
    adsets = adsetRes.rows.map((r) => {
      const impressions = num(r.impressions as string | undefined);
      const clicks = num(r.clicks as string | undefined);
      const spend = num(r.spend as string | undefined);
      return {
        adSetId: String(r.adset_id ?? ""),
        adSetName: String(r.adset_name ?? "—"),
        campaignId: String(r.campaign_id ?? ""),
        campaignName: String(r.campaign_name ?? "—"),
        impressions,
        clicks,
        spend,
        ctr: num(r.ctr as string | undefined) || (impressions > 0 ? (clicks / impressions) * 100 : 0),
        cpc: num(r.cpc as string | undefined) || (clicks > 0 ? spend / clicks : 0),
      };
    });
    adsets.sort((a, b) => b.spend - a.spend);
  }

  if (adRes.error && adRes.rows.length === 0) {
    warnings.push(`Anúncios: ${adRes.error}`);
  } else {
    if (adRes.error) {
      warnings.push(`Anúncios (possivelmente incompleto): ${adRes.error}`);
    }
    ads = adRes.rows.map((r) => {
      const impressions = num(r.impressions as string | undefined);
      const clicks = num(r.clicks as string | undefined);
      const spend = num(r.spend as string | undefined);
      return {
        adId: String(r.ad_id ?? ""),
        adName: String(r.ad_name ?? "—"),
        adSetId: String(r.adset_id ?? ""),
        adSetName: String(r.adset_name ?? "—"),
        campaignName: String(r.campaign_name ?? "—"),
        impressions,
        clicks,
        spend,
        ctr: num(r.ctr as string | undefined) || (impressions > 0 ? (clicks / impressions) * 100 : 0),
        cpc: num(r.cpc as string | undefined) || (clicks > 0 ? spend / clicks : 0),
      };
    });
    ads.sort((a, b) => b.spend - a.spend);
  }

  return {
    adAccountId: act,
    datePreset: periodKey,
    timeRange,
    account,
    campaigns,
    adsets,
    ads,
    warnings: warnings.length ? warnings : undefined,
  };
}

export type ClientListItem = { slug: string; name: string };

export function listClientsPublicInfo(): ClientListItem[] {
  return getTrafficClientsFromEnv().map(({ slug, name }) => ({ slug, name }));
}
