"use client";

import * as React from "react";
import { Info } from "@phosphor-icons/react";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProgressRing } from "@/components/ui/data-display";
import { calculateEcoScore, type EcoScoreInput } from "@/lib/eco";

/**
 * Eco Score 0–100. O modal existe porque um número sem explicação vira
 * superstição: o usuário precisa saber exatamente o que o move.
 */
export function EcoScore({ entrada }: { entrada: EcoScoreInput }) {
  const [aberto, setAberto] = React.useState(false);
  const { total, fatores } = React.useMemo(
    () => calculateEcoScore(entrada),
    [entrada],
  );

  const tom = total >= 75 ? "good" : total >= 50 ? "accent" : "warning";

  return (
    <section
      aria-labelledby="eco-score"
      className="flex flex-col rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="eyebrow">Eco Score</p>
          <h2 id="eco-score" className="sr-only">
            Eco Score
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setAberto(true)}
          className="flex items-center gap-1.5 rounded-[var(--radius-xs)] px-1.5 py-1 text-[11.5px] text-[var(--fg-muted)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--fg)]"
        >
          <Info className="size-3.5" />
          Como é calculado?
        </button>
      </div>

      <div className="mt-4 flex flex-1 items-center gap-5">
        <ProgressRing value={total} size={96} strokeWidth={7} tone={tom}>
          <span className="font-display text-[26px] font-semibold leading-none tabular tracking-[-0.03em] text-[var(--fg)]">
            {total}
          </span>
          <span className="mt-1 text-[10px] uppercase tracking-[0.1em] text-[var(--fg-subtle)]">
            de 100
          </span>
        </ProgressRing>

        <ul className="min-w-0 flex-1 space-y-2">
          {fatores.map((fator) => (
            <li key={fator.id} className="flex items-center gap-2.5">
              <span className="w-[86px] shrink-0 truncate text-[11.5px] text-[var(--fg-muted)]">
                {fator.nome}
              </span>
              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--surface-3)]">
                <span
                  className="block h-full rounded-full bg-[var(--accent)]"
                  style={{ width: `${(fator.pontos / fator.maximo) * 100}%` }}
                />
              </span>
              <span className="w-9 shrink-0 text-right text-[11px] tabular text-[var(--fg-subtle)]">
                {fator.pontos}/{fator.maximo}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <Dialog open={aberto} onOpenChange={setAberto}>
        <DialogContent size="md">
          <DialogHeader>
            <DialogTitle>Como meu Eco Score é calculado?</DialogTitle>
            <DialogDescription>
              É uma soma ponderada de cinco fatores, cada um com teto próprio.
            </DialogDescription>
          </DialogHeader>

          <DialogBody>
            <ul className="space-y-4">
              {fatores.map((fator) => (
                <li
                  key={fator.id}
                  className="border-b border-[var(--border)] pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-[13.5px] font-medium text-[var(--fg)]">
                      {fator.nome}
                    </p>
                    <span className="shrink-0 text-[12.5px] font-medium tabular text-[var(--accent)]">
                      {fator.pontos} de {fator.maximo} pts
                    </span>
                  </div>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-[var(--fg-muted)]">
                    {fator.descricao}
                  </p>
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-2)] p-4">
              <p className="text-[12.5px] leading-relaxed text-[var(--fg-muted)]">
                O Eco Score é um{" "}
                <span className="font-medium text-[var(--fg)]">
                  indicador interno demonstrativo
                </span>
                . Não há modelo estatístico, aprendizado de máquina nem
                comparação com outros usuários por trás dele — apenas a soma
                acima, com pesos fixos e visíveis.
              </p>
            </div>
          </DialogBody>
        </DialogContent>
      </Dialog>
    </section>
  );
}
