import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/data-display";
import { PRESS_ARTICLES } from "@/mocks/press";
import { formatDate } from "@/lib/format";
import { initials } from "@/lib/utils";

export function generateStaticParams() {
  return PRESS_ARTICLES.map((artigo) => ({ slug: artigo.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const artigo = PRESS_ARTICLES.find((item) => item.slug === slug);
  if (!artigo) return { title: "Artigo não encontrado" };

  return {
    title: artigo.titulo,
    description: artigo.resumo,
    openGraph: {
      title: artigo.titulo,
      description: artigo.resumo,
      type: "article",
      publishedTime: artigo.data,
      authors: [artigo.autor],
    },
  };
}

export default async function ArtigoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const artigo = PRESS_ARTICLES.find((item) => item.slug === slug);
  if (!artigo) notFound();

  const relacionados = PRESS_ARTICLES.filter(
    (item) => item.slug !== artigo.slug && item.categoria === artigo.categoria,
  ).slice(0, 3);

  const outros =
    relacionados.length > 0
      ? relacionados
      : PRESS_ARTICLES.filter((item) => item.slug !== artigo.slug).slice(0, 3);

  return (
    <>
      <article className="mx-auto max-w-[1360px] px-4 py-14 lg:px-6 lg:py-20">
        <Link
          href="/imprensa"
          className="inline-flex items-center gap-1.5 text-[13px] text-[var(--fg-muted)] transition-colors hover:text-[var(--accent)]"
        >
          <ArrowLeft className="size-4" weight="bold" />
          Todos os artigos
        </Link>

        <header className="mx-auto mt-10 max-w-[68ch]">
          <Badge tone="accent">{artigo.categoria}</Badge>
          <h1 className="mt-5 text-balance font-display text-[clamp(2rem,4.5vw,3rem)] font-semibold leading-[1.08] tracking-[-0.032em] text-[var(--fg)]">
            {artigo.titulo}
          </h1>
          <p className="mt-6 text-[18px] leading-relaxed text-[var(--fg-muted)]">
            {artigo.resumo}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4 border-y border-[var(--border)] py-5">
            <Avatar iniciais={initials(artigo.autor)} size="md" />
            <div className="min-w-0 flex-1">
              <p className="text-[13.5px] font-medium text-[var(--fg)]">
                {artigo.autor}
              </p>
              <p className="text-[12.5px] text-[var(--fg-muted)]">
                {artigo.cargoAutor}
              </p>
            </div>
            <div className="text-right">
              <time
                dateTime={artigo.data}
                className="block text-[12.5px] text-[var(--fg-muted)]"
              >
                {formatDate(artigo.data, "longo")}
              </time>
              <span className="text-[12px] text-[var(--fg-subtle)]">
                {artigo.tempoLeitura} min de leitura
              </span>
            </div>
          </div>
        </header>

        {/* Medida de linha confortável para leitura longa */}
        <div className="mx-auto mt-10 max-w-[68ch] space-y-6">
          {artigo.conteudo.map((paragrafo, indice) => (
            <p
              key={indice}
              className="text-[17px] leading-[1.78] text-[var(--fg-muted)] [&:first-child]:text-[18px] [&:first-child]:text-[var(--fg)]"
            >
              {paragrafo}
            </p>
          ))}
        </div>

        <footer className="mx-auto mt-12 max-w-[68ch] border-t border-[var(--border)] pt-6">
          <p className="text-[12.5px] leading-relaxed text-[var(--fg-subtle)]">
            Conteúdo produzido para a demonstração do EcoRewards. Dados e números
            citados são fictícios e servem para ilustrar o funcionamento da
            plataforma.
          </p>
        </footer>
      </article>

      {/* Relacionados */}
      <section className="border-t border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-[1360px] px-4 py-14 lg:px-6 lg:py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-h3 text-[var(--fg)]">
              Continue lendo
            </h2>
            <Link
              href="/imprensa"
              className="flex items-center gap-1.5 text-[13px] font-medium text-[var(--accent)] hover:underline"
            >
              Ver todos os artigos
              <ArrowRight className="size-3.5" weight="bold" />
            </Link>
          </div>

          <ul className="mt-8 grid gap-x-10 gap-y-8 md:grid-cols-3">
            {outros.map((item) => (
              <li key={item.id}>
                <Link href={`/imprensa/${item.slug}`} className="group block">
                  <Badge tone="neutral">{item.categoria}</Badge>
                  <h3 className="mt-3.5 text-balance font-display text-[17px] font-semibold leading-snug text-[var(--fg)] transition-colors group-hover:text-[var(--accent)]">
                    {item.titulo}
                  </h3>
                  <p className="mt-2.5 line-clamp-2 text-[13px] leading-relaxed text-[var(--fg-muted)]">
                    {item.resumo}
                  </p>
                  <p className="mt-3 text-[12px] text-[var(--fg-subtle)]">
                    {formatDate(item.data)} · {item.tempoLeitura} min
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
