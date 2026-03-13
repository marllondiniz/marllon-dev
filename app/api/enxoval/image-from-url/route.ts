import { NextRequest, NextResponse } from "next/server";

const ALLOWED_DOMAINS = [
  "amazon.com.br",
  "amazon.com",
  "mercadolivre.com.br",
  "mercadolibre.com.br",
  "magazineluiza.com.br",
  "americanas.com.br",
  "submarino.com.br",
  "carrefour.com.br",
  "ricardo.com.br",
];

function isValidUrl(url: string): boolean {
  try {
    const u = new URL(url);
    if (u.protocol !== "https:" && u.protocol !== "http:") return false;
    const host = u.hostname.replace(/^www\./, "");
    return ALLOWED_DOMAINS.some((d) => host === d || host.endsWith(`.${d}`));
  } catch {
    return false;
  }
}

function extractImageFromHtml(html: string, url: string): string | null {
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

  if (url.includes("amazon") && url.includes("/s")) {
    const patterns = [
      /https:\/\/m\.media-amazon\.com\/images\/I\/[A-Za-z0-9_-]{8,}[^"'\s]*\.(jpg|jpeg|png|webp)/i,
      /https:\/\/[a-z0-9.-]*\.media-amazon\.com\/images\/I\/[A-Za-z0-9_-]{8,}[^"'\s]*\.(jpg|jpeg|png|webp)/i,
      /https:\/\/images-[a-z0-9-]+\.ssl-images-amazon\.com\/images\/I\/[A-Za-z0-9_-]{8,}[^"'\s]*\.(jpg|jpeg|png|webp)/i,
    ];
    for (const re of patterns) {
      const match = html.match(re);
      if (match?.[0]) return match[0].replace(/&amp;/g, "&");
    }
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json({ image_url: null, error: "URL é obrigatória." }, { status: 400 });
    }

    const trimmed = url.trim();
    if (!isValidUrl(trimmed)) {
      return NextResponse.json(
        { image_url: null, error: "Domínio não permitido. Use Amazon, Magazine Luiza, etc." },
        { status: 400 }
      );
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(trimmed, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      redirect: "follow",
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return NextResponse.json({ image_url: null, error: "Não foi possível acessar a página." }, { status: 200 });
    }

    const html = await res.text();
    const imageUrl = extractImageFromHtml(html, trimmed);

    if (!imageUrl) {
      return NextResponse.json({ image_url: null, error: "Nenhuma imagem encontrada." }, { status: 200 });
    }

    const absoluteUrl = imageUrl.startsWith("http")
      ? imageUrl
      : new URL(imageUrl, trimmed).href;

    return NextResponse.json({ image_url: absoluteUrl });
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      return NextResponse.json({ image_url: null, error: "Tempo esgotado." }, { status: 200 });
    }
    console.error("[api/enxoval/image-from-url] error:", err);
    return NextResponse.json({ image_url: null, error: "Erro ao buscar imagem." }, { status: 200 });
  }
}
