import { NextRequest, NextResponse } from "next/server";

const ADMIN_SECRET = process.env.ADMIN_SECRET;

function auth(request: NextRequest) {
  const header = request.headers.get("x-admin-secret");
  if (!ADMIN_SECRET || header !== ADMIN_SECRET) return false;
  return true;
}

function isValidUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

function extractImageFromHtml(html: string): string | null {
  const ogImage = html.match(
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i
  );
  if (ogImage?.[1]) return ogImage[1];

  const ogImageContent = html.match(
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i
  );
  if (ogImageContent?.[1]) return ogImageContent[1];

  const twitterImage = html.match(
    /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i
  );
  if (twitterImage?.[1]) return twitterImage[1];

  const twitterImageContent = html.match(
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i
  );
  if (twitterImageContent?.[1]) return twitterImageContent[1];

  return null;
}

export async function POST(request: NextRequest) {
  if (!auth(request)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "URL é obrigatória." },
        { status: 400 }
      );
    }

    const trimmed = url.trim();
    if (!isValidUrl(trimmed)) {
      return NextResponse.json(
        { error: "URL inválida. Use http ou https." },
        { status: 400 }
      );
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(trimmed, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; EnxovalBot/1.0; +https://zinid.tech/enxoval)",
      },
      redirect: "follow",
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return NextResponse.json(
        { error: "Não foi possível acessar a página." },
        { status: 400 }
      );
    }

    const html = await res.text();
    const imageUrl = extractImageFromHtml(html);

    if (!imageUrl) {
      return NextResponse.json(
        { image_url: null, error: "Nenhuma imagem encontrada na página." },
        { status: 200 }
      );
    }

    const absoluteUrl = imageUrl.startsWith("http")
      ? imageUrl
      : new URL(imageUrl, trimmed).href;

    return NextResponse.json({ image_url: absoluteUrl });
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      return NextResponse.json(
        { error: "Tempo esgotado ao acessar a página." },
        { status: 408 }
      );
    }
    console.error("[api/enxoval/fetch-image] error:", err);
    return NextResponse.json(
      { error: "Erro ao buscar imagem. Verifique o link." },
      { status: 500 }
    );
  }
}
