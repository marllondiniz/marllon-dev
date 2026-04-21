const DEFAULT_API_VERSION = "v21.0";

export type TrafficClientConfig = {
  slug: string;
  name: string;
  adAccountId: string;
  secret: string;
  /**
   * Token com acesso a esta conta (ex.: app do cliente). Se omitido, usa `META_ACCESS_TOKEN`.
   */
  accessToken?: string;
  /**
   * App do cliente (Graph API). Se omitido, `debug_token` e troca long-lived usam `META_APP_ID` / `META_APP_SECRET`.
   */
  appId?: string;
  appSecret?: string;
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

/** App id/secret efetivos: por cliente ou globais do env. */
export function getMetaAppCredsForClient(client?: TrafficClientConfig): {
  appId?: string;
  appSecret?: string;
} {
  const appId = client?.appId?.trim() || getMetaAppId();
  const appSecret = client?.appSecret?.trim() || getMetaAppSecret();
  return { appId, appSecret };
}

/**
 * Descobre uma conta act_ via token. Se a lista vier vazia ou der erro,
 * devolve `detail` para mostrar no painel (permissões, token errado, etc.).
 */
export async function resolveAdAccountFromToken(
  userAccessToken: string,
  client?: TrafficClientConfig
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
  const { appId, appSecret } = getMetaAppCredsForClient(client);
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

function actIdFromEnv(id: string): string {
  const s = id.trim();
  return s.startsWith("act_") ? s : `act_${s}`;
}

function parseTrafficClientsJsonArray(parsed: unknown[]): TrafficClientConfig[] {
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
    .map((c) => {
      const row = c as TrafficClientConfig & {
        accessToken?: unknown;
        appId?: unknown;
        appSecret?: unknown;
      };
      const accessToken =
        typeof row.accessToken === "string" && row.accessToken.trim()
          ? row.accessToken.trim()
          : undefined;
      const appId =
        typeof row.appId === "string" && row.appId.trim() ? row.appId.trim() : undefined;
      const appSecret =
        typeof row.appSecret === "string" && row.appSecret.trim()
          ? row.appSecret.trim()
          : undefined;
      return {
        slug: c.slug,
        name: c.name,
        adAccountId: actIdFromEnv(c.adAccountId),
        secret: c.secret,
        ...(accessToken ? { accessToken } : {}),
        ...(appId ? { appId } : {}),
        ...(appSecret ? { appSecret } : {}),
      };
    });
}

/**
 * Clientes a partir de variáveis “flat” (mesmo estilo que META_APP_ID / META_ACCESS_TOKEN para a Luz do Luar).
 *
 * Easybee (portal): META_CLIENT_EASYBEE_* — sem token próprio → usa META_ACCESS_TOKEN.
 * Luz do Luar: META_LUZ_APP_ID, META_LUZ_APP_SECRET, META_LUZ_ACCESS_TOKEN, META_LUZ_AD_ACCOUNT_ID + META_CLIENT_LUZ_*.
 */
function buildTrafficClientsFromFlatEnv(): TrafficClientConfig[] {
  const out: TrafficClientConfig[] = [];

  const ezSlug = process.env.META_CLIENT_EASYBEE_SLUG?.trim();
  const ezName = process.env.META_CLIENT_EASYBEE_NAME?.trim();
  const ezSecret = process.env.META_CLIENT_EASYBEE_SECRET?.trim();
  const ezAct =
    process.env.META_CLIENT_EASYBEE_AD_ACCOUNT_ID?.trim() || getDefaultAdAccountId();

  if (ezSlug && ezName && ezSecret && ezAct) {
    out.push({
      slug: ezSlug,
      name: ezName,
      adAccountId: actIdFromEnv(ezAct),
      secret: ezSecret,
    });
  }

  const luzSlug = process.env.META_CLIENT_LUZ_SLUG?.trim();
  const luzName = process.env.META_CLIENT_LUZ_NAME?.trim();
  const luzSecret = process.env.META_CLIENT_LUZ_SECRET?.trim();
  const luzAct = process.env.META_LUZ_AD_ACCOUNT_ID?.trim();
  const luzTok = process.env.META_LUZ_ACCESS_TOKEN?.trim();
  const luzAppId = process.env.META_LUZ_APP_ID?.trim();
  const luzAppSec = process.env.META_LUZ_APP_SECRET?.trim();

  if (luzSlug && luzName && luzSecret && luzAct && luzTok) {
    out.push({
      slug: luzSlug,
      name: luzName,
      adAccountId: actIdFromEnv(luzAct),
      secret: luzSecret,
      accessToken: luzTok,
      ...(luzAppId ? { appId: luzAppId } : {}),
      ...(luzAppSec ? { appSecret: luzAppSec } : {}),
    });
  }

  return out;
}

/**
 * Clientes do painel / cliente tráfego.
 *
 * 1) Se `META_TRAFFIC_CLIENTS` tiver um array JSON válido e não vazio após o filtro, usa só ele (legado).
 * 2) Senão: `META_CLIENT_EASYBEE_*`, `META_CLIENT_LUZ_*` e `META_LUZ_*` (recomendado — igual ao bloco Meta da Easybee).
 */
export function getTrafficClientsFromEnv(): TrafficClientConfig[] {
  const raw = process.env.META_TRAFFIC_CLIENTS?.trim();
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed) && parsed.length > 0) {
        const fromJson = parseTrafficClientsJsonArray(parsed);
        if (fromJson.length > 0) return fromJson;
      }
    } catch {
      /* JSON inválido → cai no flat */
    }
  }
  return buildTrafficClientsFromFlatEnv();
}

/** Token a usar para um cliente (próprio ou global). */
export function getAccessTokenForClient(client: TrafficClientConfig): string | undefined {
  const t = client.accessToken?.trim() || getMetaAccessToken();
  return t || undefined;
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

/** Campo `actions` retornado pela Graph API (não é só string). */
type FbActionItem = { action_type?: string; value?: string };

/**
 * “Conversas por mensagem iniciadas” — soma `actions` com tipo *messaging_conversation_started_7d*
 * (ex.: `onsite_conversion.messaging_conversation_started_7d`), alinhado ao Ads Manager.
 */
export function messagingConversationsFromActions(actions: unknown): number {
  if (!Array.isArray(actions)) return 0;
  let total = 0;
  for (const raw of actions) {
    if (!raw || typeof raw !== "object") continue;
    const at = String((raw as FbActionItem).action_type ?? "");
    if (!/messaging_conversation_started_7d/i.test(at)) continue;
    total += num(String((raw as FbActionItem).value ?? ""));
  }
  return total;
}

/** Leads de formulário / pixel — soma tipos comuns em `actions` (Meta Ads). */
export function leadsFromActions(actions: unknown): number {
  if (!Array.isArray(actions)) return 0;
  let total = 0;
  for (const raw of actions) {
    if (!raw || typeof raw !== "object") continue;
    const at = String((raw as FbActionItem).action_type ?? "");
    if (
      at === "lead" ||
      /offsite_conversion\.fb_pixel_lead/i.test(at) ||
      /onsite_conversion\.lead_grouped/i.test(at)
    ) {
      total += num(String((raw as FbActionItem).value ?? ""));
    }
  }
  return total;
}

/**
 * Leads “qualificados” quando a Meta expõe tipos dedicados em `actions`
 * (varia por conta/objetivo; pode ficar 0 se não houver tipo compatível).
 */
export function qualifiedLeadsFromActions(actions: unknown): number {
  if (!Array.isArray(actions)) return 0;
  let total = 0;
  for (const raw of actions) {
    if (!raw || typeof raw !== "object") continue;
    const at = String((raw as FbActionItem).action_type ?? "");
    const lower = at.toLowerCase();
    if (
      (lower.includes("qualified") && lower.includes("lead")) ||
      /quality_lead|lead_quality|graded_lead|lead.*qualified|qualified.*lead/i.test(at)
    ) {
      total += num(String((raw as FbActionItem).value ?? ""));
    }
  }
  return total;
}

export type AccountTotals = {
  accountName: string;
  impressions: number;
  clicks: number;
  spend: number;
  reach: number;
  /** Média de vezes que cada pessoa viu o anúncio (Meta). */
  frequency: number;
  /** Custo por mil pessoas alcançadas (Meta `cpp`). */
  cpp: number;
  /** Cliques no link (inline), distintos de “todos os cliques”. */
  inlineLinkClicks: number;
  /** Custo por clique no link (`cost_per_inline_link_click`). */
  costPerInlineLinkClick: number;
  /** Conversas por mensagem iniciadas (7d), via `actions` na API. */
  messagingConversationsStarted: number;
  /** Leads (formulário/pixel), via `actions`. */
  leads: number;
  /** Leads qualificados (quando a Meta reporta em `actions`). */
  qualifiedLeads: number;
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
  frequency: number;
  cpp: number;
  inlineLinkClicks: number;
  costPerInlineLinkClick: number;
  messagingConversationsStarted: number;
  leads: number;
  qualifiedLeads: number;
  cpm: number;
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
  frequency: number;
  cpp: number;
  inlineLinkClicks: number;
  costPerInlineLinkClick: number;
  messagingConversationsStarted: number;
  leads: number;
  qualifiedLeads: number;
  cpm: number;
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
  frequency: number;
  cpp: number;
  inlineLinkClicks: number;
  costPerInlineLinkClick: number;
  messagingConversationsStarted: number;
  leads: number;
  qualifiedLeads: number;
  cpm: number;
  ctr: number;
  cpc: number;
};

/**
 * Texto extra quando a Meta retorna erro (permissão, token expirado, etc.).
 */
export function metaInsightsPermissionHint(apiMessage: string): string | undefined {
  const s = String(apiMessage).toLowerCase();
  const tokenExpired =
    s.includes("session has expired") ||
    s.includes("error validating access token") ||
    (s.includes("access token") && s.includes("expired"));

  if (tokenExpired) {
    return [
      "O access token da Meta expirou ou foi invalidado. Tokens gerados no Graph API Explorer costumam durar só algumas horas.",
      "",
      "1) Graph API Explorer (developers.facebook.com/tools/explorer): gere um token NOVO com permissões de anúncios (ex.: ads_read).",
      "2) No projeto, com META_APP_ID e META_APP_SECRET no .env: rode na raiz `npm run meta:long-lived` e copie o `access_token` do JSON (válido ~60 dias).",
      "3) Atualize META_ACCESS_TOKEN no .env.local e no painel da Vercel (Environment Variables) e faça redeploy — produção não usa o arquivo local.",
      "",
      "Se o painel local funciona mas a URL em produção não, o env da Vercel está desatualizado.",
    ].join("\n");
  }

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

/** Data em UTC no formato YYYY-MM-DD (alinhado ao uso de time_range na Meta). */
function formatUtcDateYmd(d: Date): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

/** Calendário YYYY-MM-DD em um fuso (ex.: referência para “hoje/ontem” no painel). */
function formatDateYmdInTimeZone(d: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

const PRESET_UI_TIMEZONE = "America/Sao_Paulo";

/** Ontem no calendário do fuso do painel (Brasil), para exibir junto com preset `yesterday` da Meta. */
function yesterdayYmdForPresetUi(): string {
  const todayYmd = formatDateYmdInTimeZone(new Date(), PRESET_UI_TIMEZONE);
  const [y, m, d] = todayYmd.split("-").map(Number);
  const anchorUtc = Date.UTC(y, m - 1, d, 15, 0, 0);
  const prev = new Date(anchorUtc - 24 * 60 * 60 * 1000);
  return formatDateYmdInTimeZone(prev, PRESET_UI_TIMEZONE);
}

/** Intervalo [since, until] em UTC YYYY-MM-DD, N meses atrás até hoje. */
export function rollingMonthsDateRange(months: number): { since: string; until: string } {
  const until = new Date();
  const since = new Date(
    Date.UTC(until.getUTCFullYear(), until.getUTCMonth(), until.getUTCDate())
  );
  since.setUTCMonth(since.getUTCMonth() - months);
  return { since: formatUtcDateYmd(since), until: formatUtcDateYmd(until) };
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
  if (p === "today") {
    const ymd = formatDateYmdInTimeZone(new Date(), PRESET_UI_TIMEZONE);
    return {
      params: { date_preset: "today" },
      periodKey: "today",
      timeRange: { since: ymd, until: ymd },
    };
  }
  if (p === "yesterday") {
    const ymd = yesterdayYmdForPresetUi();
    return {
      params: { date_preset: "yesterday" },
      periodKey: "yesterday",
      timeRange: { since: ymd, until: ymd },
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

  const fieldsAccount =
    "account_name,impressions,clicks,spend,ctr,cpc,cpm,reach,frequency,cpp,inline_link_clicks,cost_per_inline_link_click,actions";

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

  const row = accJson.data?.[0] as (FbInsightRow & { actions?: FbActionItem[] }) | undefined;
  let account: AccountTotals | null = null;
  if (row) {
    const impressions = num(row.impressions as string | undefined);
    const clicks = num(row.clicks as string | undefined);
    const spend = num(row.spend as string | undefined);
    const reach = num(row.reach as string | undefined);
    const inlineLinkClicks = num(row.inline_link_clicks as string | undefined);
    const messagingConversationsStarted = messagingConversationsFromActions(row.actions);
    const leads = leadsFromActions(row.actions);
    const qualifiedLeads = qualifiedLeadsFromActions(row.actions);
    const frequency = num(row.frequency as string | undefined);
    const cpp =
      num(row.cpp as string | undefined) ||
      (reach > 0 ? (spend / reach) * 1000 : 0);
    const costPerInlineLinkClick =
      num(row.cost_per_inline_link_click as string | undefined) ||
      (inlineLinkClicks > 0 ? spend / inlineLinkClicks : 0);
    account = {
      accountName: String(row.account_name ?? "Conta de anúncios"),
      impressions,
      clicks,
      spend,
      reach,
      frequency,
      cpp,
      inlineLinkClicks,
      costPerInlineLinkClick,
      messagingConversationsStarted,
      leads,
      qualifiedLeads,
      ctr: num(row.ctr as string | undefined) || (impressions > 0 ? (clicks / impressions) * 100 : 0),
      cpc: num(row.cpc as string | undefined) || (clicks > 0 ? spend / clicks : 0),
      cpm: num(row.cpm as string | undefined) || (impressions > 0 ? (spend / impressions) * 1000 : 0),
    };
  }

  const fieldsCamp =
    "campaign_id,campaign_name,impressions,clicks,spend,reach,ctr,cpc,cpm,frequency,cpp,inline_link_clicks,cost_per_inline_link_click,actions";
  const fieldsAdset =
    "adset_id,adset_name,campaign_id,campaign_name,impressions,clicks,spend,reach,ctr,cpc,cpm,frequency,cpp,inline_link_clicks,cost_per_inline_link_click,actions";
  const fieldsAd =
    "ad_id,ad_name,adset_id,adset_name,campaign_name,impressions,clicks,spend,reach,ctr,cpc,cpm,frequency,cpp,inline_link_clicks,cost_per_inline_link_click,actions";

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
    const raw = r as FbInsightRow & { actions?: FbActionItem[] };
    const impressions = num(raw.impressions as string | undefined);
    const clicks = num(raw.clicks as string | undefined);
    const spend = num(raw.spend as string | undefined);
    const reach = num(raw.reach as string | undefined);
    const inlineLinkClicks = num(raw.inline_link_clicks as string | undefined);
    const frequency = num(raw.frequency as string | undefined);
    const cpp =
      num(raw.cpp as string | undefined) ||
      (reach > 0 ? (spend / reach) * 1000 : 0);
    const costPerInlineLinkClick =
      num(raw.cost_per_inline_link_click as string | undefined) ||
      (inlineLinkClicks > 0 ? spend / inlineLinkClicks : 0);
    return {
      campaignId: String(raw.campaign_id ?? ""),
      campaignName: String(raw.campaign_name ?? "—"),
      impressions,
      clicks,
      spend,
      frequency,
      cpp,
      inlineLinkClicks,
      costPerInlineLinkClick,
      messagingConversationsStarted: messagingConversationsFromActions(raw.actions),
      leads: leadsFromActions(raw.actions),
      qualifiedLeads: qualifiedLeadsFromActions(raw.actions),
      cpm:
        num(raw.cpm as string | undefined) ||
        (impressions > 0 ? (spend / impressions) * 1000 : 0),
      ctr: num(raw.ctr as string | undefined) || (impressions > 0 ? (clicks / impressions) * 100 : 0),
      cpc: num(raw.cpc as string | undefined) || (clicks > 0 ? spend / clicks : 0),
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
      const raw = r as FbInsightRow & { actions?: FbActionItem[] };
      const impressions = num(raw.impressions as string | undefined);
      const clicks = num(raw.clicks as string | undefined);
      const spend = num(raw.spend as string | undefined);
      const reach = num(raw.reach as string | undefined);
      const inlineLinkClicks = num(raw.inline_link_clicks as string | undefined);
      const frequency = num(raw.frequency as string | undefined);
      const cpp =
        num(raw.cpp as string | undefined) ||
        (reach > 0 ? (spend / reach) * 1000 : 0);
      const costPerInlineLinkClick =
        num(raw.cost_per_inline_link_click as string | undefined) ||
        (inlineLinkClicks > 0 ? spend / inlineLinkClicks : 0);
      return {
        adSetId: String(raw.adset_id ?? ""),
        adSetName: String(raw.adset_name ?? "—"),
        campaignId: String(raw.campaign_id ?? ""),
        campaignName: String(raw.campaign_name ?? "—"),
        impressions,
        clicks,
        spend,
        frequency,
        cpp,
        inlineLinkClicks,
        costPerInlineLinkClick,
        messagingConversationsStarted: messagingConversationsFromActions(raw.actions),
        leads: leadsFromActions(raw.actions),
        qualifiedLeads: qualifiedLeadsFromActions(raw.actions),
        cpm:
          num(raw.cpm as string | undefined) ||
          (impressions > 0 ? (spend / impressions) * 1000 : 0),
        ctr: num(raw.ctr as string | undefined) || (impressions > 0 ? (clicks / impressions) * 100 : 0),
        cpc: num(raw.cpc as string | undefined) || (clicks > 0 ? spend / clicks : 0),
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
      const raw = r as FbInsightRow & { actions?: FbActionItem[] };
      const impressions = num(raw.impressions as string | undefined);
      const clicks = num(raw.clicks as string | undefined);
      const spend = num(raw.spend as string | undefined);
      const reach = num(raw.reach as string | undefined);
      const inlineLinkClicks = num(raw.inline_link_clicks as string | undefined);
      const frequency = num(raw.frequency as string | undefined);
      const cpp =
        num(raw.cpp as string | undefined) ||
        (reach > 0 ? (spend / reach) * 1000 : 0);
      const costPerInlineLinkClick =
        num(raw.cost_per_inline_link_click as string | undefined) ||
        (inlineLinkClicks > 0 ? spend / inlineLinkClicks : 0);
      return {
        adId: String(raw.ad_id ?? ""),
        adName: String(raw.ad_name ?? "—"),
        adSetId: String(raw.adset_id ?? ""),
        adSetName: String(raw.adset_name ?? "—"),
        campaignName: String(raw.campaign_name ?? "—"),
        impressions,
        clicks,
        spend,
        frequency,
        cpp,
        inlineLinkClicks,
        costPerInlineLinkClick,
        messagingConversationsStarted: messagingConversationsFromActions(raw.actions),
        leads: leadsFromActions(raw.actions),
        qualifiedLeads: qualifiedLeadsFromActions(raw.actions),
        cpm:
          num(raw.cpm as string | undefined) ||
          (impressions > 0 ? (spend / impressions) * 1000 : 0),
        ctr: num(raw.ctr as string | undefined) || (impressions > 0 ? (clicks / impressions) * 100 : 0),
        cpc: num(raw.cpc as string | undefined) || (clicks > 0 ? spend / clicks : 0),
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

/**
 * Slug reservado no admin quando só existem META_AD_ACCOUNT_ID + META_ACCESS_TOKEN
 * (sem META_CLIENT_* na Vercel). Não usar em /cliente/trafego.
 */
export const META_TRAFFIC_ADMIN_DEFAULT_SLUG = "__meta_default__";

export function listClientsPublicInfo(): ClientListItem[] {
  const rows = getTrafficClientsFromEnv().map(({ slug, name }) => ({ slug, name }));
  if (rows.length > 0) return rows;
  if (getDefaultAdAccountId() && getMetaAccessToken()) {
    return [
      {
        slug: META_TRAFFIC_ADMIN_DEFAULT_SLUG,
        name: "Conta padrão (META_AD_ACCOUNT_ID)",
      },
    ];
  }
  return [];
}
