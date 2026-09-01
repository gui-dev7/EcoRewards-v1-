"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Gift,
  MapPin,
  Medal,
  Recycle,
  Target,
  Ticket,
  TrendUp,
} from "@phosphor-icons/react";
import { ChartFrame, construirSeries } from "@/components/charts/chart-kit";
import { Columns, Donut } from "@/components/charts/charts";
import { ProgressBar } from "@/components/ui/data-display";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/feedback";
import { RelativeTime } from "@/components/ui/relative-time";
import { useChallenges } from "@/hooks/use-progress";
import { calculateChallengeProgress } from "@/lib/eco";
import { formatNumber } from "@/lib/format";
import { CITIZEN_ACTIVITY, CITIZEN_MATERIAL_SPLIT, CITIZEN_MONTHLY } from "@/mocks/citizen";
import { MATERIAL_BY_ID } from "@/mocks/materials";
import { REWARDS } from "@/mocks/rewards";
import { COLLECTION_POINTS } from "@/mocks/collection-points";
import { DEFAULT_MAP_CENTER } from "@/mocks/collection-points";
import { distanciaKm } from "@/hooks/use-geolocation";
import { cn } from "@/lib/utils";

type IconeAtividade = React.ComponentType<{
  className?: string;
  weight?: "fill" | "bold" | "regular" | "duotone";
}>;

const ICONE_ATIVIDADE: Record<string, IconeAtividade> = {
  recycle: Recycle,
  ticket: Ticket,
  target: Target,
  "trend-up": TrendUp,
  medal: Medal,
};

/* ------------------------------------------------------------------ */
/* Evolução mensal                                                     */
/* ------------------------------------------------------------------ */

export function MonthlyChart() {
  const series = React.useMemo(
    () =>
      construirSeries([
        { chave: "plastico", rotulo: "Plástico", unidade: " kg" },
        { chave: "papel", rotulo: "Papel", unidade: " kg" },
        { chave: "vidro", rotulo: "Vidro", unidade: " kg" },
        { chave: "metal", rotulo: "Metal", unidade: " kg" },
      ]),
    [],
  );

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5">
      <ChartFrame
        titulo="Quanto você reciclou por mês?"
        descricao="Volume mensal por material, nos últimos 12 meses."
        series={series}
        dados={CITIZEN_MONTHLY}
        chaveEixo="periodo"
        altura={280}
        formatarValor={(valor) => formatNumber(valor, 1)}
        rodape="Somando os quatro materiais, agosto foi o mês de maior volume do período."
      >
        <Columns
          dados={CITIZEN_MONTHLY}
          series={series}
          chaveEixo="periodo"
          empilhado
          totalLabel="Total do mês"
          formatarValor={(valor) => `${formatNumber(valor, 1)} kg`}
          formatarEixoY={(valor) => `${valor}`}
        />
      </ChartFrame>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Composição por material                                             */
/* ------------------------------------------------------------------ */

export function MaterialBreakdown() {
  const dados = React.useMemo(
    () =>
      CITIZEN_MATERIAL_SPLIT.map((item) => ({
        material: MATERIAL_BY_ID[item.materialId].nome,
        kg: item.kg,
        cor: MATERIAL_BY_ID[item.materialId].cor,
      })),
    [],
  );

  const total = dados.reduce((soma, item) => soma + item.kg, 0);
  const series = [{ chave: "kg", rotulo: "Reciclado", cor: "var(--series-1)", unidade: " kg" }];

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5">
      <ChartFrame
        titulo="De que é feito o seu impacto?"
        descricao="Composição acumulada por tipo de material."
        series={series}
        dados={dados}
        chaveEixo="material"
        altura={230}
        formatarValor={(valor) => `${formatNumber(valor, 1)} kg`}
      >
        <Donut
          dados={dados}
          series={series}
          chaveEixo="material"
          formatarValor={(valor) => `${formatNumber(valor, 1)} kg`}
          centro={
            <>
              <span className="font-display text-[24px] font-semibold leading-none tabular tracking-[-0.03em] text-[var(--fg)]">
                {formatNumber(total, 1)}
              </span>
              <span className="mt-1 text-[11px] text-[var(--fg-subtle)]">kg no total</span>
            </>
          }
        />
      </ChartFrame>

      <ul className="mt-5 space-y-2 border-t border-[var(--border)] pt-4">
        {dados.map((item) => (
          <li key={item.material} className="flex items-center gap-2.5 text-[12.5px]">
            <span
              aria-hidden
              className="size-2 shrink-0 rounded-[2px]"
              style={{ background: item.cor }}
            />
            <span className="min-w-0 flex-1 truncate text-[var(--fg-muted)]">
              {item.material}
            </span>
            <span className="shrink-0 font-medium tabular text-[var(--fg)]">
              {formatNumber(item.kg, 1)} kg
            </span>
            <span className="w-10 shrink-0 text-right tabular text-[var(--fg-subtle)]">
              {Math.round((item.kg / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Desafios ativos                                                     */
/* ------------------------------------------------------------------ */

export function ActiveChallenges() {
  const desafios = useChallenges();
  const ativos = desafios.filter((d) => !d.concluido).slice(0, 3);

  return (
    <section className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
      <header className="flex items-center justify-between gap-3 border-b border-[var(--border)] px-5 py-4">
        <h2 className="font-display text-[15px] font-semibold text-[var(--fg)]">
          Desafios ativos
        </h2>
        <Link
          href="/app/desafios"
          className="flex items-center gap-1 text-[12.5px] font-medium text-[var(--accent)] hover:underline"
        >
          Ver todos
          <ArrowRight className="size-3.5" weight="bold" />
        </Link>
      </header>

      {ativos.length === 0 ? (
        <EmptyState
          compact
          icon={<Target />}
          title="Nenhum desafio ativo."
          description="Novos desafios aparecem toda semana."
          action={{ label: "Explorar desafios", href: "/app/desafios" }}
        />
      ) : (
        <ul className="divide-y divide-[var(--border)]">
          {ativos.map((desafio) => {
            const progresso = calculateChallengeProgress(desafio);
            return (
              <li key={desafio.id} className="px-5 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[13.5px] font-medium text-[var(--fg)]">
                      {desafio.titulo}
                    </p>
                    <p className="mt-0.5 text-[12px] capitalize text-[var(--fg-subtle)]">
                      {desafio.cadencia}
                    </p>
                  </div>
                  <Badge tone="accent" className="shrink-0">
                    +{formatNumber(desafio.recompensaPontos)}
                  </Badge>
                </div>
                <div className="mt-3">
                  <ProgressBar value={progresso.percentual} size="sm" />
                </div>
                <p className="mt-2 text-[11.5px] tabular text-[var(--fg-muted)]">
                  {progresso.rotulo}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Recompensas em destaque                                             */
/* ------------------------------------------------------------------ */

export function FeaturedRewards({ saldo }: { saldo: number }) {
  const destaques = REWARDS.filter((r) => r.destaque).slice(0, 3);

  return (
    <section className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
      <header className="flex items-center justify-between gap-3 border-b border-[var(--border)] px-5 py-4">
        <h2 className="font-display text-[15px] font-semibold text-[var(--fg)]">
          Recompensas em destaque
        </h2>
        <Link
          href="/app/recompensas"
          className="flex items-center gap-1 text-[12.5px] font-medium text-[var(--accent)] hover:underline"
        >
          Ver catálogo
          <ArrowRight className="size-3.5" weight="bold" />
        </Link>
      </header>

      <ul className="divide-y divide-[var(--border)]">
        {destaques.map((reward) => {
          const alcancavel = saldo >= reward.pontos;
          return (
            <li key={reward.id}>
              <Link
                href={`/app/recompensas?item=${reward.id}`}
                className="flex items-center gap-3 px-5 py-4 transition-colors hover:bg-[var(--surface-2)]"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--surface-2)] text-[var(--fg-subtle)]">
                  <Gift className="size-[18px]" weight="duotone" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-medium text-[var(--fg)]">
                    {reward.nome}
                  </p>
                  <p className="truncate text-[12px] text-[var(--fg-subtle)]">
                    {reward.parceiro}
                  </p>
                </div>
                <span
                  className={cn(
                    "shrink-0 text-[12.5px] font-medium tabular",
                    alcancavel ? "text-[var(--accent)]" : "text-[var(--fg-subtle)]",
                  )}
                >
                  {formatNumber(reward.pontos)}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Ecopontos próximos                                                  */
/* ------------------------------------------------------------------ */

export function NearbyPoints() {
  const proximos = React.useMemo(
    () =>
      COLLECTION_POINTS.map((ponto) => ({
        ...ponto,
        distancia: distanciaKm(DEFAULT_MAP_CENTER, ponto),
      }))
        .filter((ponto) => ponto.status !== "manutencao")
        .sort((a, b) => a.distancia - b.distancia)
        .slice(0, 4),
    [],
  );

  return (
    <section className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
      <header className="flex items-center justify-between gap-3 border-b border-[var(--border)] px-5 py-4">
        <div>
          <h2 className="font-display text-[15px] font-semibold text-[var(--fg)]">
            Ecopontos próximos
          </h2>
          <p className="mt-0.5 text-[11.5px] text-[var(--fg-subtle)]">
            A partir da Av. Paulista, localização padrão da demonstração
          </p>
        </div>
        <Link
          href="/app/ecopontos"
          className="flex shrink-0 items-center gap-1 text-[12.5px] font-medium text-[var(--accent)] hover:underline"
        >
          Abrir mapa
          <ArrowRight className="size-3.5" weight="bold" />
        </Link>
      </header>

      <ul className="divide-y divide-[var(--border)]">
        {proximos.map((ponto) => (
          <li key={ponto.id}>
            <Link
              href={`/app/ecopontos?ponto=${ponto.id}`}
              className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-[var(--surface-2)]"
            >
              <MapPin className="size-4 shrink-0 text-[var(--fg-subtle)]" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-[var(--fg)]">
                  {ponto.nome}
                </p>
                <p className="truncate text-[11.5px] text-[var(--fg-subtle)]">
                  {ponto.bairro} · {ponto.horario}
                </p>
              </div>
              <span className="shrink-0 text-[12px] tabular text-[var(--fg-muted)]">
                {ponto.distancia} km
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Atividade recente                                                   */
/* ------------------------------------------------------------------ */

export function RecentActivity() {
  return (
    <section className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
      <header className="flex items-center justify-between gap-3 border-b border-[var(--border)] px-5 py-4">
        <h2 className="font-display text-[15px] font-semibold text-[var(--fg)]">
          Atividade recente
        </h2>
        <Button asChild variant="ghost" size="xs">
          <Link href="/app/carteira">Ver extrato</Link>
        </Button>
      </header>

      <ol className="divide-y divide-[var(--border)]">
        {CITIZEN_ACTIVITY.map((item) => {
          const Icon = ICONE_ATIVIDADE[item.icone] ?? Recycle;
          return (
            <li key={item.id} className="flex gap-3 px-5 py-4">
              <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--surface-2)] text-[var(--fg-subtle)]">
                <Icon className="size-4" weight="duotone" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] leading-snug text-[var(--fg)]">
                  {item.descricao}
                </p>
                <p className="mt-0.5 text-[12px] text-[var(--fg-muted)]">
                  {item.detalhe}
                </p>
                <RelativeTime
                  date={item.data}
                  className="mt-1 block text-[11px] text-[var(--fg-subtle)]"
                />
              </div>
              {item.pontos !== undefined && (
                <span
                  className={cn(
                    "shrink-0 text-[12.5px] font-medium tabular",
                    item.pontos > 0 ? "text-[var(--good)]" : "text-[var(--fg-muted)]",
                  )}
                >
                  {item.pontos > 0 ? "+" : ""}
                  {formatNumber(item.pontos)}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
