import { NextRequest, NextResponse } from "next/server";
import {
  getTrafficClientsFromEnv,
  listClientsPublicInfo,
  META_TRAFFIC_ADMIN_DEFAULT_SLUG,
} from "@/lib/meta-traffic";

const ADMIN_SECRET = process.env.ADMIN_SECRET;

function adminClientEnvHint(publicClients: { slug: string; name: string }[]): string | undefined {
  if (getTrafficClientsFromEnv().length > 0) return undefined;
  if (
    publicClients.length === 1 &&
    publicClients[0]?.slug === META_TRAFFIC_ADMIN_DEFAULT_SLUG
  ) {
    return "Ambiente sem META_CLIENT_EASYBEE_* / META_CLIENT_LUZ_* / META_LUZ_* — só a conta padrão aparece. Na Vercel, copie essas variáveis do .env.local e redeploy.";
  }
  return undefined;
}

/**
 * Lista clientes do painel de tráfego (slugs/nomes) sem chamar a Meta — para /admin/trafego/financeiro.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("x-admin-secret");
  if (!ADMIN_SECRET || authHeader !== ADMIN_SECRET) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const clients = listClientsPublicInfo();
  const clientEnvHint = adminClientEnvHint(clients);
  return NextResponse.json({ clients, clientEnvHint });
}
