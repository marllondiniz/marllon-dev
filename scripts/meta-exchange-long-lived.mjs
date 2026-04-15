/**
 * Troca um token de curta duração por um long-lived user access token (~60 dias).
 * Documentação: https://developers.facebook.com/docs/facebook-login/guides/access-tokens/get-long-lived
 *
 * Uso (na raiz do projeto):
 *   node scripts/meta-exchange-long-lived.mjs
 *
 * Lê META_APP_ID, META_APP_SECRET e META_ACCESS_TOKEN de .env.local
 * (o META_ACCESS_TOKEN deve ser o token curto obtido no Graph API Explorer ou no login).
 *
 * Imprime JSON com access_token e expires_in. Copie o novo access_token para META_ACCESS_TOKEN
 * e atualize também na Vercel.
 *
 * Observação: tokens de usuário long-lived da Meta costumam expirar em ~60 dias.
 * Para algo que não dependa desse ciclo, use um token de usuário do sistema no Business Manager.
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
const appId = env.META_APP_ID;
const appSecret = env.META_APP_SECRET;
const shortToken = env.META_ACCESS_TOKEN;

if (!appId || !appSecret || !shortToken) {
  console.error(
    "Defina META_APP_ID, META_APP_SECRET e META_ACCESS_TOKEN no .env.local."
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
