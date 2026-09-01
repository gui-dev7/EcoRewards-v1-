"use client";

import * as React from "react";
import { toast } from "sonner";
import { CheckCircle, Clock, Target, Users } from "@phosphor-icons/react";
import { PageContainer, PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/feedback";
import { ProgressBar } from "@/components/ui/data-display";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useChallenges } from "@/hooks/use-progress";
import { useProgressStore, useWalletStore } from "@/stores";
import { useHydrated } from "@/hooks/use-hydrated";
import { calculateChallengeProgress } from "@/lib/eco";
import { formatDate, formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Challenge, ChallengeCadence } from "@/types";

const CADENCIAS: { id: ChallengeCadence | "todos"; rotulo: string }[] = [
  { id: "todos", rotulo: "Todos" },
  { id: "diario", rotulo: "Diários" },
  { id: "semanal", rotulo: "Semanais" },
  { id: "mensal", rotulo: "Mensais" },
  { id: "comunitario", rotulo: "Comunitários" },
];

export default function DesafiosPage() {
  const hydrated = useHydrated();
  const desafios = useChallenges();
  const avancarDesafio = useProgressStore((s) => s.avancarDesafio);
  const creditarBonus = useWalletStore((s) => s.creditarBonus);

  const avancar = (desafio: Challenge) => {
    const atualizado = avancarDesafio(desafio.id);
    if (!atualizado) return;

    if (atualizado.concluido && !desafio.concluido) {
      creditarBonus(
        `Desafio concluído — ${desafio.titulo}`,
        "Desafios",
        desafio.recompensaPontos,
      );
      toast.success("Desafio concluído!", {
        description: `+${formatNumber(desafio.recompensaPontos)} EcoPontos creditados na sua carteira.`,
      });
      return;
    }

    toast.success("Progresso registrado", {
      description: `${atualizado.progresso} de ${atualizado.meta} ${atualizado.unidade}.`,
    });
  };

  const concluidos = hydrated ? desafios.filter((d) => d.concluido).length : 0;
  const pontosEmJogo = desafios
    .filter((d) => !d.concluido)
    .reduce((soma, d) => soma + d.recompensaPontos, 0);

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Gamificação"
        titulo="Desafios"
        descricao="Metas de curto e médio prazo que aceleram sua pontuação. Concluir um desafio credita os EcoPontos direto na carteira."
        acoes={
          <div className="flex items-center gap-5">
            <div className="text-right">
              <p className="text-[11.5px] text-[var(--fg-subtle)]">Concluídos</p>
              <p className="font-display text-[19px] font-semibold tabular text-[var(--fg)]">
                {concluidos}
                <span className="text-[13px] font-medium text-[var(--fg-muted)]">
                  /{desafios.length}
                </span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11.5px] text-[var(--fg-subtle)]">Em disputa</p>
              <p className="font-display text-[19px] font-semibold tabular text-[var(--accent)]">
                {formatNumber(pontosEmJogo)}
              </p>
            </div>
          </div>
        }
      />

      <Tabs defaultValue="todos">
        <TabsList className="fade-edges-x overflow-x-auto no-scrollbar">
          {CADENCIAS.map((cadencia) => (
            <TabsTrigger
              key={cadencia.id}
              value={cadencia.id}
              layoutId="desafios-tab"
              className="shrink-0"
            >
              {cadencia.rotulo}
            </TabsTrigger>
          ))}
        </TabsList>

        {CADENCIAS.map((cadencia) => {
          const lista =
            cadencia.id === "todos"
              ? desafios
              : desafios.filter((d) => d.cadencia === cadencia.id);

          return (
            <TabsContent key={cadencia.id} value={cadencia.id} className="pt-6">
              {lista.length === 0 ? (
                <EmptyState
                  className="rounded-[var(--radius-lg)] border border-[var(--border)]"
                  icon={<Target />}
                  title="Nenhum desafio ativo."
                  description="Novos desafios aparecem toda semana."
                />
              ) : (
                <ul className="grid gap-4 lg:grid-cols-2">
                  {lista.map((desafio) => (
                    <ChallengeCard
                      key={desafio.id}
                      desafio={desafio}
                      onAvancar={() => avancar(desafio)}
                    />
                  ))}
                </ul>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </PageContainer>
  );
}

function ChallengeCard({
  desafio,
  onAvancar,
}: {
  desafio: Challenge;
  onAvancar: () => void;
}) {
  const progresso = calculateChallengeProgress(desafio);

  return (
    <li
      className={cn(
        "flex flex-col rounded-[var(--radius-lg)] border bg-[var(--surface)] p-5 transition-colors",
        progresso.concluido
          ? "border-[var(--accent-line)]"
          : "border-[var(--border)]",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={progresso.concluido ? "good" : "neutral"} className="capitalize">
              {desafio.cadencia}
            </Badge>
            {desafio.participantes !== undefined && (
              <span className="flex items-center gap-1 text-[11.5px] text-[var(--fg-subtle)]">
                <Users className="size-3.5" />
                {formatNumber(desafio.participantes)} participantes
              </span>
            )}
          </div>

          <h3 className="mt-3 font-display text-[16px] font-semibold text-[var(--fg)]">
            {desafio.titulo}
          </h3>
          <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--fg-muted)]">
            {desafio.descricao}
          </p>
        </div>

        <span
          className={cn(
            "shrink-0 rounded-[var(--radius-sm)] px-2.5 py-1.5 text-center",
            progresso.concluido
              ? "bg-[var(--good-soft)] text-[var(--good)]"
              : "bg-[var(--accent-soft)] text-[var(--accent)]",
          )}
        >
          <span className="block font-display text-[15px] font-semibold tabular leading-none">
            +{formatNumber(desafio.recompensaPontos)}
          </span>
          <span className="mt-1 block text-[10px] uppercase tracking-[0.08em] opacity-75">
            pontos
          </span>
        </span>
      </div>

      <div className="mt-auto pt-6">
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <span className="text-[12.5px] tabular text-[var(--fg-muted)]">
            {progresso.rotulo}
          </span>
          <span className="text-[12.5px] font-medium tabular text-[var(--fg)]">
            {Math.round(progresso.percentual)}%
          </span>
        </div>
        <ProgressBar
          value={progresso.percentual}
          size="md"
          tone={progresso.concluido ? "good" : "accent"}
        />

        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="flex items-center gap-1.5 text-[11.5px] text-[var(--fg-subtle)]">
            <Clock className="size-3.5" />
            Até {formatDate(desafio.expiraEm)}
          </span>

          {progresso.concluido ? (
            <span className="flex items-center gap-1.5 text-[12.5px] font-medium text-[var(--good)]">
              <CheckCircle className="size-4" weight="fill" />
              Concluído
            </span>
          ) : (
            <Button size="xs" variant="secondary" onClick={onAvancar}>
              Registrar progresso
            </Button>
          )}
        </div>
      </div>
    </li>
  );
}
