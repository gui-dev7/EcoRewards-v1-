"use client";

import { Flame } from "@phosphor-icons/react";
import { Hint } from "@/components/ui/tooltip";
import { CITIZEN_STREAK_WEEKS } from "@/mocks/citizen";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * Sequência sustentável em 52 semanas.
 * A intensidade usa a rampa sequencial — uma única matiz, do claro ao
 * escuro — porque a grandeza é magnitude, não categoria.
 */
export function StreakCalendar({ semanas }: { semanas: number }) {
  const dados = CITIZEN_STREAK_WEEKS;

  return (
    <section
      aria-labelledby="streak"
      className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="eyebrow">Sequência sustentável</p>
          <h2 id="streak" className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-h3 tabular text-[var(--fg)]">
              {semanas} semanas
            </span>
            <span className="text-[13px] text-[var(--fg-muted)]">consecutivas</span>
          </h2>
        </div>
        <span className="flex items-center gap-1.5 rounded-[var(--radius-xs)] bg-[var(--accent-soft)] px-2 py-1 text-[11.5px] font-medium text-[var(--accent)]">
          <Flame className="size-3.5" weight="fill" />
          Multiplicador {(1 + Math.min(semanas * 0.01, 0.25)).toFixed(2)}x
        </span>
      </div>

      <div className="mt-5 overflow-x-auto pb-1 no-scrollbar">
        <div
          className="grid w-max grid-flow-col grid-rows-1 gap-[3px]"
          role="img"
          aria-label={`Atividade das últimas ${dados.length} semanas. Sequência atual de ${semanas} semanas.`}
        >
          {dados.map((semana) => (
            <Hint
              key={semana.semana}
              label={
                <span>
                  <span className="block font-medium">
                    {semana.descartes === 0
                      ? "Sem descartes"
                      : `${semana.descartes} ${semana.descartes === 1 ? "descarte" : "descartes"}`}
                  </span>
                  <span className="block text-[var(--fg-muted)]">
                    Semana de {formatDate(semana.semana)}
                  </span>
                </span>
              }
            >
              <span
                className={cn(
                  "block size-[13px] rounded-[3px] transition-transform hover:scale-125",
                  semana.intensidade === 0 && "bg-[var(--surface-3)]",
                )}
                style={
                  semana.intensidade > 0
                    ? { background: `var(--seq-${Math.min(semana.intensidade + 1, 6)})` }
                    : undefined
                }
              />
            </Hint>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 text-[11px] text-[var(--fg-subtle)]">
        <span>52 semanas atrás</span>
        <div className="flex items-center gap-1.5">
          <span>menos</span>
          <span className="size-[11px] rounded-[3px] bg-[var(--surface-3)]" />
          {[2, 3, 4, 5].map((nivel) => (
            <span
              key={nivel}
              className="size-[11px] rounded-[3px]"
              style={{ background: `var(--seq-${nivel})` }}
            />
          ))}
          <span>mais</span>
        </div>
        <span>hoje</span>
      </div>
    </section>
  );
}
