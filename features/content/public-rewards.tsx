"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Gift, MagnifyingGlass } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import { EmptyState } from "@/components/ui/feedback";
import { REWARDS, REWARD_CATEGORIES } from "@/mocks/rewards";
import { formatCurrency, formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { RewardCategory } from "@/types";

/**
 * Vitrine pública do catálogo. Mostra tudo, sem saldo nem resgate —
 * a ação leva para a demonstração, onde o fluxo funciona de verdade.
 */
export function PublicRewards() {
  const [busca, setBusca] = React.useState("");
  const [categoria, setCategoria] = React.useState<RewardCategory | "todas">("todas");

  const filtradas = React.useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return REWARDS.filter((reward) => {
      if (categoria !== "todas" && reward.categoria !== categoria) return false;
      if (!termo) return true;
      return `${reward.nome} ${reward.parceiro} ${reward.descricao}`
        .toLowerCase()
        .includes(termo);
    });
  }, [busca, categoria]);

  const porCategoria = React.useMemo(() => {
    return REWARD_CATEGORIES.map((cat) => ({
      ...cat,
      itens: filtradas.filter((reward) => reward.categoria === cat.id),
    })).filter((grupo) => grupo.itens.length > 0);
  }, [filtradas]);

  return (
    <div className="mx-auto max-w-[1360px] px-4 py-14 lg:px-6 lg:py-16">
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative min-w-[240px] flex-1">
          <MagnifyingGlass
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--fg-subtle)]"
            weight="bold"
          />
          <label htmlFor="busca-catalogo" className="sr-only">
            Buscar no catálogo
          </label>
          <Input
            id="busca-catalogo"
            value={busca}
            onChange={(evento) => setBusca(evento.target.value)}
            placeholder="Buscar por recompensa ou parceiro…"
            className="pl-9"
          />
        </div>
        <Button asChild>
          <Link href="/demo">
            Resgatar na demonstração
            <ArrowRight weight="bold" />
          </Link>
        </Button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => setCategoria("todas")}
          aria-pressed={categoria === "todas"}
          className={cn(
            "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12.5px] font-medium transition-colors",
            categoria === "todas"
              ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
              : "border-[var(--border)] text-[var(--fg-muted)] hover:border-[var(--border-strong)] hover:text-[var(--fg)]",
          )}
        >
          Todas
          <span className="tabular opacity-60">{REWARDS.length}</span>
        </button>
        {REWARD_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setCategoria(cat.id)}
            aria-pressed={categoria === cat.id}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12.5px] font-medium transition-colors",
              categoria === cat.id
                ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                : "border-[var(--border)] text-[var(--fg-muted)] hover:border-[var(--border-strong)] hover:text-[var(--fg)]",
            )}
          >
            {cat.nome}
            <span className="tabular opacity-60">
              {REWARDS.filter((r) => r.categoria === cat.id).length}
            </span>
          </button>
        ))}
      </div>

      {porCategoria.length === 0 ? (
        <EmptyState
          className="mt-10 rounded-[var(--radius-lg)] border border-[var(--border)]"
          icon={<Gift />}
          title="Nenhuma recompensa encontrada."
          description="Tente outro termo ou volte para o catálogo completo."
          action={{
            label: "Ver catálogo completo",
            onClick: () => {
              setBusca("");
              setCategoria("todas");
            },
          }}
        />
      ) : (
        <div className="mt-12 space-y-14">
          {porCategoria.map((grupo) => (
            <section key={grupo.id}>
              <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[var(--border)] pb-4">
                <div>
                  <h2 className="font-display text-h3 text-[var(--fg)]">
                    {grupo.nome}
                  </h2>
                  <p className="mt-1.5 max-w-[60ch] text-[13px] leading-relaxed text-[var(--fg-muted)]">
                    {grupo.descricao}
                  </p>
                </div>
                <span className="text-[12.5px] tabular text-[var(--fg-subtle)]">
                  {grupo.itens.length}{" "}
                  {grupo.itens.length === 1 ? "recompensa" : "recompensas"}
                </span>
              </div>

              <ul className="mt-6 grid gap-x-8 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
                {grupo.itens.map((reward) => (
                  <li key={reward.id} className="border-t border-[var(--border)] pt-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-[11.5px] text-[var(--fg-subtle)]">
                        {reward.parceiro}
                      </p>
                      {reward.destaque && <Badge tone="accent">Destaque</Badge>}
                    </div>

                    <h3 className="mt-2.5 font-display text-[16px] font-semibold leading-snug text-[var(--fg)]">
                      {reward.nome}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-[var(--fg-muted)]">
                      {reward.descricao}
                    </p>

                    <div className="mt-4 flex items-baseline justify-between gap-3">
                      <span className="font-display text-[19px] font-semibold tabular tracking-[-0.02em] text-[var(--accent)]">
                        {formatNumber(reward.pontos)}
                        <span className="ml-1 text-[11.5px] font-medium text-[var(--fg-muted)]">
                          EcoPontos
                        </span>
                      </span>
                      <span className="text-[11.5px] text-[var(--fg-subtle)]">
                        ≈ {formatCurrency(reward.valorEstimado)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
