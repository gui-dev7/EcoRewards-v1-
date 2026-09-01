"use client";

import * as React from "react";
import { CaretDown, CaretUp, Minus } from "@phosphor-icons/react";
import { PageContainer, PageHeader } from "@/components/layout/app-shell";
import { Avatar } from "@/components/ui/data-display";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { formatNumber } from "@/lib/format";
import {
  RANKING_CIDADE,
  RANKING_GLOBAL,
  RANKING_MENSAL,
  RANKING_SEMANAL,
} from "@/mocks/ranking";
import { ECO_LEVEL_BY_ID } from "@/mocks/levels";
import { CITIZEN } from "@/mocks/citizen";
import { cn } from "@/lib/utils";
import type { RankingEntry } from "@/types";

const ABAS = [
  {
    id: "global",
    rotulo: "Global",
    dados: RANKING_GLOBAL,
    descricao: `Entre ${formatNumber(CITIZEN.totalUsuariosGlobal)} recicladores em todo o país.`,
  },
  {
    id: "cidade",
    rotulo: "São Paulo",
    dados: RANKING_CIDADE,
    descricao: "Sua posição entre quem recicla na mesma cidade.",
  },
  {
    id: "semanal",
    rotulo: "Semanal",
    dados: RANKING_SEMANAL,
    descricao: "Pontuação acumulada nos últimos sete dias.",
  },
  {
    id: "mensal",
    rotulo: "Mensal",
    dados: RANKING_MENSAL,
    descricao: "Pontuação acumulada no mês corrente.",
  },
] as const;

export default function RankingPage() {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Comunidade"
        titulo="Ranking"
        descricao="A classificação considera os EcoPontos ganhos no período. Sua posição aparece destacada mesmo quando você está fora do Top 10."
      />

      <Tabs defaultValue="global">
        <TabsList>
          {ABAS.map((aba) => (
            <TabsTrigger key={aba.id} value={aba.id} layoutId="ranking-tab">
              {aba.rotulo}
            </TabsTrigger>
          ))}
        </TabsList>

        {ABAS.map((aba) => (
          <TabsContent key={aba.id} value={aba.id} className="pt-6">
            <RankingList entradas={aba.dados} descricao={aba.descricao} />
          </TabsContent>
        ))}
      </Tabs>
    </PageContainer>
  );
}

function RankingList({
  entradas,
  descricao,
}: {
  entradas: readonly RankingEntry[];
  descricao: string;
}) {
  const usuario = entradas.find((entrada) => entrada.ehUsuarioAtual);
  const topo = entradas.filter((entrada) => entrada.posicao <= 3);
  const restante = entradas.filter((entrada) => entrada.posicao > 3);

  // Detecta o salto de posições para inserir o separador visual.
  const indiceSalto = restante.findIndex(
    (entrada, indice) =>
      indice > 0 && entrada.posicao - restante[indice - 1].posicao > 1,
  );

  return (
    <div>
      <p className="text-[13px] text-[var(--fg-muted)]">{descricao}</p>

      {/* Pódio */}
      <ol className="mt-6 grid gap-4 sm:grid-cols-3">
        {topo.map((entrada) => (
          <li
            key={entrada.posicao}
            className={cn(
              "flex flex-col items-center rounded-[var(--radius-lg)] border bg-[var(--surface)] p-5 text-center",
              entrada.posicao === 1
                ? "border-[var(--accent-line)] sm:order-2"
                : entrada.posicao === 2
                  ? "border-[var(--border)] sm:order-1"
                  : "border-[var(--border)] sm:order-3",
            )}
          >
            <span
              className={cn(
                "font-display text-[13px] font-semibold tabular",
                entrada.posicao === 1 ? "text-[var(--accent)]" : "text-[var(--fg-subtle)]",
              )}
            >
              #{entrada.posicao}
            </span>
            <Avatar
              iniciais={entrada.iniciais}
              size={entrada.posicao === 1 ? "lg" : "md"}
              tone={entrada.posicao === 1 ? "accent" : "neutral"}
              className="mt-3"
            />
            <p className="mt-3 truncate text-[13.5px] font-medium text-[var(--fg)]">
              {entrada.nome}
            </p>
            <p className="mt-0.5 text-[11.5px] text-[var(--fg-subtle)]">
              {entrada.cidade}
            </p>
            <p className="mt-3 font-display text-[20px] font-semibold tabular tracking-[-0.02em] text-[var(--fg)]">
              {formatNumber(entrada.pontos)}
            </p>
            <Badge tone="neutral" className="mt-2">
              {ECO_LEVEL_BY_ID[entrada.nivel].nome}
            </Badge>
          </li>
        ))}
      </ol>

      {/* Demais posições */}
      <ol className="mt-5 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
        {restante.map((entrada, indice) => (
          <React.Fragment key={`${entrada.posicao}-${entrada.nome}`}>
            {indice === indiceSalto && (
              <li
                aria-hidden
                className="flex items-center gap-2 border-b border-[var(--border)] bg-[var(--surface-2)] px-5 py-2"
              >
                <span className="h-px flex-1 bg-[var(--border)]" />
                <span className="text-[11px] text-[var(--fg-subtle)]">
                  posições intermediárias omitidas
                </span>
                <span className="h-px flex-1 bg-[var(--border)]" />
              </li>
            )}
            <RankingRow entrada={entrada} />
          </React.Fragment>
        ))}
      </ol>

      {/* Barra fixa com a posição do usuário */}
      {usuario && (
        <div className="sticky bottom-[calc(env(safe-area-inset-bottom)+80px)] z-20 mt-5 lg:bottom-6">
          <div className="flex items-center gap-4 rounded-[var(--radius-lg)] border border-[var(--accent-line)] bg-[var(--accent-soft)] px-5 py-3.5 shadow-[var(--shadow-md)]">
            <span className="font-display text-[17px] font-semibold tabular text-[var(--accent)]">
              #{usuario.posicao}
            </span>
            <Avatar iniciais={usuario.iniciais} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13.5px] font-medium text-[var(--fg)]">
                {usuario.nome}
                <span className="ml-2 text-[11.5px] font-normal text-[var(--fg-muted)]">
                  você
                </span>
              </p>
              <p className="truncate text-[11.5px] text-[var(--fg-muted)]">
                {usuario.cidade} · {ECO_LEVEL_BY_ID[usuario.nivel].nome}
              </p>
            </div>
            <Variacao valor={usuario.variacao} />
            <span className="shrink-0 font-display text-[16px] font-semibold tabular text-[var(--fg)]">
              {formatNumber(usuario.pontos)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function RankingRow({ entrada }: { entrada: RankingEntry }) {
  return (
    <li
      className={cn(
        "flex items-center gap-4 border-b border-[var(--border)] px-5 py-3.5 last:border-0",
        entrada.ehUsuarioAtual && "bg-[var(--accent-soft)]",
      )}
    >
      <span
        className={cn(
          "w-9 shrink-0 text-[13px] font-medium tabular",
          entrada.ehUsuarioAtual ? "text-[var(--accent)]" : "text-[var(--fg-subtle)]",
        )}
      >
        #{entrada.posicao}
      </span>

      <Avatar
        iniciais={entrada.iniciais}
        size="sm"
        tone={entrada.ehUsuarioAtual ? "accent" : "neutral"}
      />

      <div className="min-w-0 flex-1">
        <p className="truncate text-[13.5px] font-medium text-[var(--fg)]">
          {entrada.nome}
          {entrada.ehUsuarioAtual && (
            <span className="ml-2 text-[11.5px] font-normal text-[var(--fg-muted)]">
              você
            </span>
          )}
        </p>
        <p className="truncate text-[11.5px] text-[var(--fg-subtle)]">
          {entrada.cidade}
        </p>
      </div>

      <span className="hidden shrink-0 text-[11.5px] text-[var(--fg-subtle)] sm:block">
        {ECO_LEVEL_BY_ID[entrada.nivel].nome}
      </span>

      <Variacao valor={entrada.variacao} />

      <span className="w-20 shrink-0 text-right text-[13.5px] font-medium tabular text-[var(--fg)]">
        {formatNumber(entrada.pontos)}
      </span>
    </li>
  );
}

/** Variação de posições: ícone e sinal, nunca só a cor. */
function Variacao({ valor }: { valor: number }) {
  if (valor === 0) {
    return (
      <span className="flex w-12 shrink-0 items-center justify-end gap-0.5 text-[12px] text-[var(--fg-subtle)]">
        <Minus className="size-3" weight="bold" aria-hidden />
        <span className="sr-only">Sem variação de posição</span>
      </span>
    );
  }

  const subiu = valor > 0;
  return (
    <span
      className={cn(
        "flex w-12 shrink-0 items-center justify-end gap-0.5 text-[12px] font-medium tabular",
        subiu ? "text-[var(--good)]" : "text-[var(--critical)]",
      )}
    >
      {subiu ? (
        <CaretUp className="size-3" weight="fill" aria-hidden />
      ) : (
        <CaretDown className="size-3" weight="fill" aria-hidden />
      )}
      {Math.abs(valor)}
      <span className="sr-only">
        {subiu ? `Subiu ${valor} posições` : `Caiu ${Math.abs(valor)} posições`}
      </span>
    </span>
  );
}
