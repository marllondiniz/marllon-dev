/**
 * Troca um token de curta duração por um long-lived user access token (~60 dias).
 * Documentação: https://developers.facebook.com/docs/facebook-login/guides/access-tokens/get-long-lived
 *
 * Easybee (app padrão):
 *   npm run meta:long-lived
 *   Lê META_APP_ID, META_APP_SECRET, META_ACCESS_TOKEN.
 *
 * Luz do Luar (META_LUZ_* no .env, mesmo padrão):
 *   npm run meta:long-lived -- --slug=luz-do-luar
 *   Lê META_LUZ_APP_ID, META_LUZ_APP_SECRET, META_LUZ_ACCESS_TOKEN
 *   (slug deve ser igual a META_CLIENT_LUZ_SLUG).
 *
 * Legado: cliente só em META_TRAFFIC_CLIENTS (JSON):
 *   npm run meta:long-lived -- --slug=...
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function loadEnvLocal() {
  const p = path.join(root, ".env.local");
  if (!fs.existsSync(p)) {
    console.error("Arquivo .env.local não encontrado na raiz do projeto.");
    process.exit(1);
  }
  const raw = fs.readFileSync(p, "utf8");
  const out = {};
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

const env = loadEnvLocal();

const slugArg = process.argv.find((a) => a.startsWith("--slug="));
const slugFromCli = slugArg ? slugArg.slice("--slug=".length).trim() : "";
const slug = slugFromCli || String(env.META_LONG_LIVED_SLUG || "").trim();

let appId = env.META_APP_ID;
let appSecret = env.META_APP_SECRET;
let shortToken = env.META_ACCESS_TOKEN;

if (slug) {
  const luzSlug = String(env.META_CLIENT_LUZ_SLUG || "").trim();
  if (luzSlug && slug === luzSlug) {
    if (env.META_LUZ_APP_ID?.trim()) appId = env.META_LUZ_APP_ID.trim();
    if (env.META_LUZ_APP_SECRET?.trim()) appSecret = env.META_LUZ_APP_SECRET.trim();
    if (env.META_LUZ_ACCESS_TOKEN?.trim()) shortToken = env.META_LUZ_ACCESS_TOKEN.trim();
  } else if (env.META_TRAFFIC_CLIENTS) {
    try {
      const list = JSON.parse(env.META_TRAFFIC_CLIENTS);
      if (!Array.isArray(list)) throw new Error("META_TRAFFIC_CLIENTS deve ser um array JSON.");
      const c = list.find((x) => x && typeof x === "object" && x.slug === slug);
      if (!c) {
        console.error(`Slug "${slug}" não encontrado em META_TRAFFIC_CLIENTS.`);
        process.exit(1);
      }
      if (typeof c.appId === "string" && c.appId.trim()) appId = c.appId.trim();
      if (typeof c.appSecret === "string" && c.appSecret.trim())
        appSecret = c.appSecret.trim();
      if (typeof c.accessToken === "string" && c.accessToken.trim())
        shortToken = c.accessToken.trim();
    } catch (e) {
      console.error("Erro ao ler META_TRAFFIC_CLIENTS:", e.message || e);
      process.exit(1);
    }
  } else {
    console.error(
      `Slug "${slug}": defina META_CLIENT_LUZ_SLUG=${slug} e META_LUZ_APP_ID / META_LUZ_APP_SECRET / META_LUZ_ACCESS_TOKEN no .env, ou use META_TRAFFIC_CLIENTS (JSON).`
    );
    process.exit(1);
  }
}

if (!appId || !appSecret || !shortToken) {
  console.error(
    slug
      ? `Faltam app id, secret ou token para a troca (veja META_LUZ_* ou META_TRAFFIC_CLIENTS).`
      : "Defina META_APP_ID, META_APP_SECRET e META_ACCESS_TOKEN no .env.local."
  );
  process.exit(1);
}

const version = "v21.0";
const url = new URL(`https://graph.facebook.com/${version}/oauth/access_token`);
url.searchParams.set("grant_type", "fb_exchange_token");
url.searchParams.set("client_id", appId);
url.searchParams.set("client_secret", appSecret);
url.searchParams.set("fb_exchange_token", shortToken);

const res = await fetch(url.toString());
const json = await res.json();

if (!res.ok || json.error) {
  console.error("Falha na troca:", JSON.stringify(json, null, 2));
  process.exit(1);
}

console.log(JSON.stringify(json, null, 2));
if (json.expires_in != null) {
  const days = (json.expires_in / 86400).toFixed(1);
  console.error(`\n(expira em ~${days} dias — expires_in: ${json.expires_in}s)`);
}
if (slug) {
  const luzSlug = String(env.META_CLIENT_LUZ_SLUG || "").trim();
  if (luzSlug && slug === luzSlug) {
    console.error(`\nCopie access_token acima para META_LUZ_ACCESS_TOKEN no .env.local e na Vercel.`);
  } else {
    console.error(
      `\nCopie access_token para o campo "accessToken" do slug "${slug}" em META_TRAFFIC_CLIENTS.`
    );
  }
}
