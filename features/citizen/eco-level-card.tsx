"use client";

import { LeafMark } from "@/components/brand/leaf-mark";
import { ProgressBar } from "@/components/ui/data-display";
import { Hint } from "@/components/ui/tooltip";
import { calculateEcoLevel } from "@/lib/eco";
import { ECO_LEVELS } from "@/mocks/levels";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * Progressão em seis estágios. A trilha mostra todos os níveis para que
 * o usuário veja onde está no percurso inteiro, não só o próximo passo.
 */
export function EcoLevelCard({ xp }: { xp: number }) {
  const { atual, proximo, xpNoNivel, xpParaProximo, progresso } =
    calculateEcoLevel(xp);

  return (
    <section
      aria-labelledby="eco-level"
      className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="eyebrow">Nível EcoRewards</p>
          <h2
            id="eco-level"
            className="mt-2 font-display text-h3 text-[var(--fg)]"
          >
            {atual.nome}
          </h2>
          <p className="mt-1.5 max-w-[42ch] text-[12.5px] leading-relaxed text-[var(--fg-muted)]">
            {atual.descricao}
          </p>
        </div>
        <span className="flex size-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--accent-soft)]">
          <LeafMark className="size-6 text-[var(--accent)]" />
        </span>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <span className="text-[12.5px] text-[var(--fg-muted)]">
            {proximo ? `Próximo nível: ${proximo.nome}` : "Progressão concluída"}
          </span>
          <span className="text-[12.5px] font-medium tabular text-[var(--fg)]">
            {proximo
              ? `${formatNumber(xpNoNivel)} / ${formatNumber(xpParaProximo)} XP`
              : `${formatNumber(xp)} XP`}
          </span>
        </div>
        <ProgressBar value={progresso} size="md" />
        {proximo && (
          <p className="mt-2 text-[12px] text-[var(--fg-subtle)]">
            Faltam{" "}
            <span className="font-medium tabular text-[var(--fg-muted)]">
              {formatNumber(xpParaProximo - xpNoNivel)} XP
            </span>{" "}
            para alcançar {proximo.nome}.
          </p>
        )}
      </div>

      {/* Trilha completa dos níveis */}
      <ol className="mt-6 flex items-center gap-1.5 border-t border-[var(--border)] pt-5">
        {ECO_LEVELS.map((nivel) => {
          const alcancado = nivel.ordem <= atual.ordem;
          const ehAtual = nivel.id === atual.id;

          return (
            <li key={nivel.id} className="flex-1">
              <Hint
                label={
                  <span>
                    <span className="block font-medium">{nivel.nome}</span>
                    <span className="block text-[var(--fg-muted)]">
                      A partir de {formatNumber(nivel.xpMinimo)} XP
                    </span>
                  </span>
                }
              >
                <div className="w-full cursor-default">
                  <span
                    className={cn(
                      "block h-1 w-full rounded-full transition-colors",
                      ehAtual
                        ? "bg-[var(--accent)]"
                        : alcancado
                          ? "bg-[var(--accent)] opacity-45"
                          : "bg-[var(--surface-3)]",
                    )}
                  />
                  <span
                    className={cn(
                      "mt-2 block truncate text-center text-[10px] font-medium",
                      ehAtual
                        ? "text-[var(--accent)]"
                        : alcancado
                          ? "text-[var(--fg-muted)]"
                          : "text-[var(--fg-subtle)]",
                    )}
                  >
                    {nivel.nome}
                  </span>
                </div>
              </Hint>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
