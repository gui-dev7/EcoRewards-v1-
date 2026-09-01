"use client";

import * as React from "react";
import { Lock, Trophy } from "@phosphor-icons/react";
import { PageContainer, PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/data-display";
import { Segmented } from "@/components/ui/tabs";
import { EmptyState } from "@/components/ui/feedback";
import { useBadges } from "@/hooks/use-progress";
import { useProgressStore } from "@/stores";
import { useHydrated } from "@/hooks/use-hydrated";
import { formatDate, formatNumber } from "@/lib/format";
import {
  BadgeUnlockOverlay,
} from "@/features/citizen/badge-unlock";
import {
  RARIDADE_ORDEM,
  RARIDADE_ROTULO,
  RARIDADE_TOM,
} from "@/features/citizen/badge-tone";
import { cn } from "@/lib/utils";
import type { Badge as BadgeType } from "@/types";

type Filtro = "todas" | "desbloqueadas" | "bloqueadas";

export default function ConquistasPage() {
  const hydrated = useHydrated();
  const medalhas = useBadges();
  const desbloquearMedalha = useProgressStore((s) => s.desbloquearMedalha);
  const [filtro, setFiltro] = React.useState<Filtro>("todas");

  const desbloqueadas = hydrated ? medalhas.filter((m) => m.desbloqueada) : [];
  const xpTotal = desbloqueadas.reduce((soma, m) => soma + m.xp, 0);

  const visiveis = medalhas.filter((medalha) => {
    if (filtro === "desbloqueadas") return medalha.desbloqueada;
    if (filtro === "bloqueadas") return !medalha.desbloqueada;
    return true;
  });

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Conquistas"
        titulo="Galeria de medalhas"
        descricao="Cada medalha marca um marco real do seu histórico. As bloqueadas mostram exatamente o que falta para conquistá-las."
        acoes={
          <div className="flex items-center gap-5">
            <div className="text-right">
              <p className="text-[11.5px] text-[var(--fg-subtle)]">Desbloqueadas</p>
              <p className="font-display text-[19px] font-semibold tabular text-[var(--fg)]">
                {desbloqueadas.length}
                <span className="text-[13px] font-medium text-[var(--fg-muted)]">
                  /{medalhas.length}
                </span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11.5px] text-[var(--fg-subtle)]">XP acumulado</p>
              <p className="font-display text-[19px] font-semibold tabular text-[var(--accent)]">
                {formatNumber(xpTotal)}
              </p>
            </div>
          </div>
        }
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Segmented
          ariaLabel="Filtrar medalhas"
          options={[
            { value: "todas", label: "Todas" },
            { value: "desbloqueadas", label: "Desbloqueadas" },
            { value: "bloqueadas", label: "Bloqueadas" },
          ]}
          value={filtro}
          onChange={setFiltro}
        />
        <ProgressBar
          value={desbloqueadas.length}
          max={medalhas.length}
          size="sm"
          className="max-w-[220px]"
          showValue
        />
      </div>

      {visiveis.length === 0 ? (
        <EmptyState
          className="mt-8 rounded-[var(--radius-lg)] border border-[var(--border)]"
          icon={<Trophy />}
          title="Nenhuma medalha neste filtro."
          description="Alterne o filtro para ver as demais conquistas da galeria."
        />
      ) : (
        <div className="mt-8 space-y-10">
          {RARIDADE_ORDEM.map((raridade) => {
            const grupo = visiveis.filter((m) => m.raridade === raridade);
            if (grupo.length === 0) return null;

            return (
              <section key={raridade}>
                <div className="flex items-center gap-3 border-b border-[var(--border)] pb-3">
                  <span
                    aria-hidden
                    className="size-2 rounded-full"
                    style={{ background: RARIDADE_TOM[raridade] }}
                  />
                  <h2 className="font-display text-[15px] font-semibold text-[var(--fg)]">
                    {RARIDADE_ROTULO[raridade]}
                  </h2>
                  <span className="text-[12px] tabular text-[var(--fg-subtle)]">
                    {grupo.filter((m) => m.desbloqueada).length} de {grupo.length}
                  </span>
                </div>

                <ul className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {grupo.map((medalha) => (
                    <BadgeCard
                      key={medalha.id}
                      medalha={medalha}
                      onDesbloquear={() => desbloquearMedalha(medalha.id)}
                    />
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}

      <BadgeUnlockOverlay />
    </PageContainer>
  );
}

function BadgeCard({
  medalha,
  onDesbloquear,
}: {
  medalha: BadgeType;
  onDesbloquear: () => void;
}) {
  const tom = RARIDADE_TOM[medalha.raridade];
  const temProgresso = medalha.progresso !== undefined && medalha.meta !== undefined;

  return (
    <li
      className={cn(
        "flex gap-4 rounded-[var(--radius-lg)] border bg-[var(--surface)] p-5",
        medalha.desbloqueada ? "border-[var(--border)]" : "border-dashed border-[var(--border)]",
      )}
    >
      {medalha.desbloqueada ? (
        <span
          className="flex size-14 shrink-0 items-center justify-center rounded-full border-2 font-display text-[19px] font-semibold"
          style={{
            borderColor: tom,
            color: tom,
            background: `color-mix(in srgb, ${tom} 10%, transparent)`,
          }}
        >
          {medalha.nome.charAt(0)}
        </span>
      ) : (
        <span className="flex size-14 shrink-0 items-center justify-center rounded-full border border-dashed border-[var(--border-strong)] text-[var(--fg-subtle)]">
          <Lock className="size-5" weight="duotone" />
        </span>
      )}

      <div className="min-w-0 flex-1">
        <h3
          className={cn(
            "text-[14px] font-semibold",
            medalha.desbloqueada ? "text-[var(--fg)]" : "text-[var(--fg-muted)]",
          )}
        >
          {medalha.nome}
        </h3>
        <p className="mt-1 text-[12.5px] leading-relaxed text-[var(--fg-muted)]">
          {medalha.descricao}
        </p>

        {medalha.desbloqueada ? (
          <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11.5px] text-[var(--fg-subtle)]">
            <Badge tone="good">+{formatNumber(medalha.xp)} XP</Badge>
            {medalha.desbloqueadaEm && (
              <span>conquistada em {formatDate(medalha.desbloqueadaEm)}</span>
            )}
          </p>
        ) : (
          <div className="mt-3">
            <p className="text-[11.5px] text-[var(--fg-subtle)]">
              {medalha.requisito}
            </p>

            {temProgresso && (
              <>
                <div className="mt-2">
                  <ProgressBar
                    value={medalha.progresso!}
                    max={medalha.meta!}
                    size="xs"
                  />
                </div>
                <p className="mt-1.5 text-[11px] tabular text-[var(--fg-subtle)]">
                  {formatNumber(medalha.progresso!)} de {formatNumber(medalha.meta!)}
                </p>
              </>
            )}

            <Button
              size="xs"
              variant="ghost"
              className="mt-3 -ml-1.5"
              onClick={onDesbloquear}
            >
              Simular desbloqueio
            </Button>
          </div>
        )}
      </div>
    </li>
  );
}
