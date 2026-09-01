"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Newspaper } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/feedback";
import { PRESS_ARTICLES, PRESS_CATEGORIES } from "@/mocks/press";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export function PressIndex() {
  const [categoria, setCategoria] = React.useState("Todas");

  const destaque = PRESS_ARTICLES.find((artigo) => artigo.destaque);
  const demais = PRESS_ARTICLES.filter((artigo) => !artigo.destaque);

  const filtrados =
    categoria === "Todas"
      ? demais
      : demais.filter((artigo) => artigo.categoria === categoria);

  return (
    <div className="mx-auto max-w-[1360px] px-4 py-14 lg:px-6 lg:py-16">
      {/* Destaque */}
      {destaque && categoria === "Todas" && (
        <Link
          href={`/imprensa/${destaque.slug}`}
          className="group block border-b border-[var(--border)] pb-12"
        >
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-12">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <Badge tone="accent">Destaque</Badge>
                <Badge tone="neutral">{destaque.categoria}</Badge>
              </div>
              <h2 className="mt-5 max-w-[22ch] text-balance font-display text-[clamp(1.75rem,3.4vw,2.5rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-[var(--fg)] transition-colors group-hover:text-[var(--accent)]">
                {destaque.titulo}
              </h2>
              <p className="mt-5 max-w-[60ch] text-[16px] leading-relaxed text-[var(--fg-muted)]">
                {destaque.resumo}
              </p>
              <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] text-[var(--fg-subtle)]">
                <span className="font-medium text-[var(--fg-muted)]">
                  {destaque.autor}
                </span>
                <span aria-hidden>·</span>
                <span>{destaque.cargoAutor}</span>
                <span aria-hidden>·</span>
                <time dateTime={destaque.data}>{formatDate(destaque.data, "longo")}</time>
                <span aria-hidden>·</span>
                <span>{destaque.tempoLeitura} min de leitura</span>
              </p>
              <span className="mt-6 inline-flex items-center gap-1.5 text-[13.5px] font-medium text-[var(--accent)]">
                Ler artigo completo
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" weight="bold" />
              </span>
            </div>

            {/* Composição gráfica no lugar de foto genérica */}
            <div className="relative hidden overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] lg:block">
              <div aria-hidden className="dot-texture absolute inset-0 opacity-40" />
              <div className="relative flex h-full items-center justify-center p-10">
                <Newspaper
                  className="size-16 text-[var(--accent)]"
                  weight="duotone"
                  aria-hidden
                />
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* Filtros */}
      <div className="mt-10 flex flex-wrap items-center gap-1.5">
        {["Todas", ...PRESS_CATEGORIES].map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setCategoria(item)}
            aria-pressed={categoria === item}
            className={cn(
              "rounded-full border px-3 py-1.5 text-[12.5px] font-medium transition-colors",
              categoria === item
                ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                : "border-[var(--border)] text-[var(--fg-muted)] hover:border-[var(--border-strong)] hover:text-[var(--fg)]",
            )}
          >
            {item}
          </button>
        ))}
      </div>

      {filtrados.length === 0 ? (
        <EmptyState
          className="mt-10 rounded-[var(--radius-lg)] border border-[var(--border)]"
          icon={<Newspaper />}
          title="Nenhum artigo nesta categoria."
          description="Escolha outra categoria para ver o que já publicamos."
          action={{ label: "Ver todas", onClick: () => setCategoria("Todas") }}
        />
      ) : (
        <ul className="mt-10 grid gap-x-10 gap-y-12 md:grid-cols-2 xl:grid-cols-3">
          {filtrados.map((artigo) => (
            <li key={artigo.id}>
              <Link href={`/imprensa/${artigo.slug}`} className="group block">
                <Badge tone="neutral">{artigo.categoria}</Badge>
                <h3 className="mt-4 text-balance font-display text-[19px] font-semibold leading-snug tracking-[-0.015em] text-[var(--fg)] transition-colors group-hover:text-[var(--accent)]">
                  {artigo.titulo}
                </h3>
                <p className="mt-3 line-clamp-3 text-[13.5px] leading-relaxed text-[var(--fg-muted)]">
                  {artigo.resumo}
                </p>
                <p className="mt-4 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[12px] text-[var(--fg-subtle)]">
                  <span>{artigo.autor}</span>
                  <span aria-hidden>·</span>
                  <time dateTime={artigo.data}>{formatDate(artigo.data)}</time>
                  <span aria-hidden>·</span>
                  <span>{artigo.tempoLeitura} min</span>
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
