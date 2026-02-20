import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Tag, ExternalLink } from "lucide-react";
import { getArticleBySlug, getAllSlugs } from "@/app/data/articles";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Artigo não encontrado" };
  return {
    title: `${article.title} — Marllon Diniz`,
    description: article.excerpt,
  };
}

export default async function ArtigoPage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  return (
    <div className="min-h-screen bg-[#0a0a0b]">
      {/* Top bar */}
      <header className="sticky top-0 z-10 border-b border-zinc-800/50 bg-[#0a0a0b]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link
            href="/#conteudo"
            className="inline-flex items-center gap-2 font-mono text-sm text-zinc-400 transition hover:text-[#22c55e]"
          >
            <ArrowLeft className="h-4 w-4" />
            Tech & IA
          </Link>
          <Link
            href="/"
            className="font-mono text-xs text-zinc-500 transition hover:text-white"
          >
            Início
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-6 py-12 md:py-16">
        {/* Theme + date */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <span className="inline-flex items-center gap-1.5 rounded border border-zinc-800 bg-[#111113] px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-[#22c55e]">
            <Tag className="h-3 w-3" />
            {article.theme}
          </span>
          <span className="inline-flex items-center gap-1.5 font-mono text-xs text-zinc-500">
            <Calendar className="h-3.5 w-3.5" />
            {article.date}
          </span>
        </div>

        <h1 className="font-[family-name:var(--font-space)] text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl">
          {article.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-zinc-400">
          {article.excerpt}
        </p>

        <div className="mt-10 border-t border-zinc-800/80 pt-10">
          <div className="article-prose space-y-6">
            {article.body.map((paragraph, i) => (
              <p
                key={i}
                className="text-base leading-[1.75] text-zinc-300 md:text-lg"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {article.sources && article.sources.length > 0 && (
          <div className="mt-12 border-t border-zinc-800/80 pt-8">
            <h2 className="font-mono text-xs font-medium uppercase tracking-widest text-zinc-500">
              Fontes e referências
            </h2>
            <ul className="mt-4 space-y-3">
              {article.sources.map((source, i) => (
                <li key={i}>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-[#22c55e] transition hover:underline"
                  >
                    <ExternalLink className="h-3.5 w-3.5 flex-shrink-0" />
                    {source.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <footer className="mt-16 border-t border-zinc-800/80 pt-8">
          <Link
            href="/#conteudo"
            className="inline-flex items-center gap-2 font-mono text-sm text-[#22c55e] transition hover:gap-3"
          >
            <ArrowLeft className="h-4 w-4" />
            Ver mais artigos
          </Link>
        </footer>
      </article>
    </div>
  );
}
