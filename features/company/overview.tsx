"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Megaphone, Users } from "@phosphor-icons/react";
import { ChartFrame, construirSeries } from "@/components/charts/chart-kit";
import { Columns, Donut, TrendArea } from "@/components/charts/charts";
import { Delta, ProgressBar } from "@/components/ui/data-display";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RelativeTime } from "@/components/ui/relative-time";
import { AnimatedNumber } from "@/components/ui/animated-number";
import {
  COMPANY,
  COMPANY_ANNOUNCEMENTS,
  COMPANY_MATERIAL_SPLIT,
  COMPANY_MONTHLY,
  DEPARTMENTS,
  ESG_INDICATORS,
} from "@/mocks/company";
import { MATERIAL_BY_ID } from "@/mocks/materials";
import { useCampaignsStore } from "@/stores";
import { useHydrated } from "@/hooks/use-hydrated";
import {
  formatCurrencyCompact,
  formatNumber,
  formatPercent,
} from "@/lib/format";

/* ------------------------------------------------------------------ */
/* KPIs                                                                */
/* ------------------------------------------------------------------ */

export function CompanyKpis() {
  const adesao = (COMPANY.colaboradoresAtivos / COMPANY.colaboradores) * 100;
  const orcamento = (COMPANY.orcamentoUtilizado / COMPANY.orcamentoAnual) * 100;

  const itens = [
    {
      rotulo: "Colaboradores ativos",
      valor: <AnimatedNumber value={COMPANY.colaboradoresAtivos} />,
      nota: `${formatPercent(adesao)} de adesão · ${COMPANY.colaboradores} no total`,
      delta: 6.2,
    },
    {
      rotulo: "Resíduo desviado no ano",
      valor: (
        <>
          <AnimatedNumber value={COMPANY.toneladasRecicladas} formato="decimal" />
          <span className="ml-1 text-[15px] font-medium text-[var(--fg-muted)]">t</span>
        </>
      ),
      nota: `Meta anual de ${COMPANY.metaAnualToneladas} t`,
      delta: 12.4,
    },
    {
      rotulo: "CO2 evitado",
      valor: (
        <>
          <AnimatedNumber value={COMPANY.co2EvitadoToneladas} formato="decimal" />
          <span className="ml-1 text-[15px] font-medium text-[var(--fg-muted)]">t</span>
        </>
      ),
      nota: "Pelos fatores de cada material",
      delta: 11.8,
    },
    {
      rotulo: "Orçamento executado",
      valor: formatCurrencyCompact(COMPANY.orcamentoUtilizado),
      nota: `${formatPercent(orcamento)} de ${formatCurrencyCompact(COMPANY.orcamentoAnual)}`,
      delta: 4.1,
    },
  ];

  return (
    <dl className="grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2 xl:grid-cols-4">
      {itens.map((item) => (
        <div key={item.rotulo} className="bg-[var(--surface)] px-5 py-4">
          <dt className="text-[12.5px] font-medium text-[var(--fg-muted)]">
            {item.rotulo}
          </dt>
          <dd className="mt-2 font-display text-[28px] font-semibold leading-none tabular tracking-[-0.03em] text-[var(--fg)]">
            {item.valor}
          </dd>
          <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1">
            <Delta value={item.delta} />
            <span className="text-[11.5px] text-[var(--fg-subtle)]">{item.nota}</span>
          </div>
        </div>
      ))}
    </dl>
  );
}

/* ------------------------------------------------------------------ */
/* Gráfico principal — ritmo em relação à meta                         */
/* ------------------------------------------------------------------ */

export function GoalPaceChart() {
  const series = React.useMemo(
    () =>
      construirSeries([
        { chave: "acumulado", rotulo: "Reciclado acumulado", unidade: " t" },
        { chave: "ritmoMeta", rotulo: "Ritmo necessário para a meta", unidade: " t", cor: "var(--series-3)" },
      ]),
    [],
  );

  // Acumula o volume mensal e projeta a linha que atinge a meta anual.
  const dados = React.useMemo(
    () =>
      COMPANY_MONTHLY.reduce<
        { periodo: string; acumulado: number; ritmoMeta: number }[]
      >((linhas, linha, indice) => {
        const anterior = linhas.at(-1)?.acumulado ?? 0;
        linhas.push({
          periodo: String(linha.periodo),
          acumulado: Number((anterior + Number(linha.reciclado) / 1000).toFixed(1)),
          ritmoMeta: Number(
            (
              (COMPANY.metaAnualToneladas / COMPANY_MONTHLY.length) *
              (indice + 1)
            ).toFixed(1),
          ),
        });
        return linhas;
      }, []),
    [],
  );

  const ultimo = dados[dados.length - 1];
  const desvio = ultimo.acumulado - ultimo.ritmoMeta;

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5 lg:p-6">
      <ChartFrame
        titulo="Estamos no ritmo da meta anual?"
        descricao="Volume acumulado contra o ritmo linear necessário para fechar o ano em 64 t."
        series={series}
        dados={dados}
        chaveEixo="periodo"
        altura={300}
        formatarValor={(valor) => `${formatNumber(valor, 1)} t`}
        rodape={
          desvio >= 0
            ? `O acumulado está ${formatNumber(desvio, 1)} t acima do ritmo necessário — a meta anual deve ser batida antes de dezembro.`
            : `O acumulado está ${formatNumber(Math.abs(desvio), 1)} t abaixo do ritmo necessário. Manter esta média não fecha a meta anual.`
        }
      >
        <TrendArea
          dados={dados}
          series={series}
          chaveEixo="periodo"
          formatarValor={(valor) => `${formatNumber(valor, 1)} t`}
          formatarEixoY={(valor) => `${valor}`}
        />
      </ChartFrame>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Adesão por departamento                                             */
/* ------------------------------------------------------------------ */

export function DepartmentAdoption() {
  const dados = React.useMemo(
    () =>
      [...DEPARTMENTS]
        .sort((a, b) => b.adesaoPercentual - a.adesaoPercentual)
        .map((departamento) => ({
          nome: departamento.nome,
          adesao: departamento.adesaoPercentual,
        })),
    [],
  );

  const series = [
    { chave: "adesao", rotulo: "Adesão", cor: "var(--series-1)", unidade: "%" },
  ];

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5">
      <ChartFrame
        titulo="Quais áreas aderiram ao programa?"
        descricao="Percentual de colaboradores ativos por departamento."
        series={series}
        dados={dados}
        chaveEixo="nome"
        altura={300}
        formatarValor={(valor) => `${valor}%`}
      >
        <HorizontalAdoption dados={dados} />
      </ChartFrame>
    </div>
  );
}

function HorizontalAdoption({
  dados,
}: {
  dados: { nome: string; adesao: number }[];
}) {
  return (
    <ul className="flex h-full flex-col justify-between py-1">
      {dados.map((item) => (
        <li key={item.nome} className="flex items-center gap-3">
          <span className="w-28 shrink-0 truncate text-[12.5px] text-[var(--fg-muted)]">
            {item.nome}
          </span>
          <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-[var(--surface-3)]">
            <span
              className="block h-full rounded-full bg-[var(--series-1)] transition-[width] duration-700"
              style={{ width: `${item.adesao}%` }}
            />
          </span>
          <span className="w-10 shrink-0 text-right text-[12.5px] font-medium tabular text-[var(--fg)]">
            {item.adesao}%
          </span>
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* Composição por material                                             */
/* ------------------------------------------------------------------ */

export function CompanyMaterialSplit() {
  const dados = React.useMemo(
    () =>
      COMPANY_MATERIAL_SPLIT.map((item) => ({
        material: MATERIAL_BY_ID[item.materialId].nome,
        kg: item.kg,
        cor: MATERIAL_BY_ID[item.materialId].cor,
      })),
    [],
  );

  const total = dados.reduce((soma, item) => soma + item.kg, 0);
  const series = [
    { chave: "kg", rotulo: "Reciclado", cor: "var(--series-1)", unidade: " kg" },
  ];

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5">
      <ChartFrame
        titulo="O que a empresa mais recicla?"
        descricao="Composição do volume anual por tipo de material."
        series={series}
        dados={dados}
        chaveEixo="material"
        altura={240}
        formatarValor={(valor) => `${formatNumber(valor)} kg`}
      >
        <Donut
          dados={dados}
          series={series}
          chaveEixo="material"
          formatarValor={(valor) => `${formatNumber(valor)} kg`}
          centro={
            <>
              <span className="font-display text-[22px] font-semibold leading-none tabular tracking-[-0.03em] text-[var(--fg)]">
                {formatNumber(total / 1000, 1)} t
              </span>
              <span className="mt-1 text-[11px] text-[var(--fg-subtle)]">no ano</span>
            </>
          }
        />
      </ChartFrame>

      <ul className="mt-4 space-y-2 border-t border-[var(--border)] pt-4">
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
              {formatNumber(item.kg)} kg
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Pontos distribuídos                                                 */
/* ------------------------------------------------------------------ */

export function PointsDistributed() {
  const series = React.useMemo(
    () => construirSeries([{ chave: "pontos", rotulo: "EcoPontos distribuídos" }]),
    [],
  );

  const dados = COMPANY_MONTHLY.map((linha) => ({
    periodo: String(linha.periodo),
    pontos: Number(linha.pontos),
  }));

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5">
      <ChartFrame
        titulo="Quantos EcoPontos foram distribuídos por mês?"
        descricao="Pontuação creditada aos colaboradores pelo programa interno."
        series={series}
        dados={dados}
        chaveEixo="periodo"
        altura={240}
        formatarValor={(valor) => formatNumber(valor)}
      >
        <Columns
          dados={dados}
          series={series}
          chaveEixo="periodo"
          formatarValor={(valor) => formatNumber(valor)}
          formatarEixoY={(valor) => `${Math.round(valor / 1000)}k`}
        />
      </ChartFrame>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Campanhas ativas                                                    */
/* ------------------------------------------------------------------ */

export function ActiveCampaigns() {
  const hydrated = useHydrated();
  const campanhas = useCampaignsStore((s) => s.itens);
  const ativas = (hydrated ? campanhas : []).filter((c) => c.status === "ativa").slice(0, 3);

  return (
    <section className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
      <header className="flex items-center justify-between gap-3 border-b border-[var(--border)] px-5 py-4">
        <h2 className="font-display text-[15px] font-semibold text-[var(--fg)]">
          Campanhas ativas
        </h2>
        <Link
          href="/empresa/campanhas"
          className="flex items-center gap-1 text-[12.5px] font-medium text-[var(--accent)] hover:underline"
        >
          Gerenciar
          <ArrowRight className="size-3.5" weight="bold" />
        </Link>
      </header>

      <ul className="divide-y divide-[var(--border)]">
        {ativas.map((campanha) => {
          const progresso = (campanha.progressoKg / campanha.metaKg) * 100;
          return (
            <li key={campanha.id} className="px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[13.5px] font-medium text-[var(--fg)]">
                    {campanha.nome}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-[11.5px] text-[var(--fg-subtle)]">
                    <Users className="size-3.5" />
                    {formatNumber(campanha.participantes)} participantes
                  </p>
                </div>
                <Badge tone="accent" className="shrink-0">
                  {Math.round(progresso)}%
                </Badge>
              </div>
              <div className="mt-3">
                <ProgressBar value={progresso} size="sm" />
              </div>
              <p className="mt-2 text-[11.5px] tabular text-[var(--fg-muted)]">
                {formatNumber(campanha.progressoKg)} de{" "}
                {formatNumber(campanha.metaKg)} kg
              </p>
            </li>
          );
        })}

        {ativas.length === 0 && (
          <li className="px-5 py-8 text-center">
            <p className="text-[13px] text-[var(--fg-muted)]">
              Nenhuma campanha ativa no momento.
            </p>
            <Button asChild size="sm" variant="secondary" className="mt-4">
              <Link href="/empresa/campanhas">
                <Megaphone weight="bold" />
                Criar campanha
              </Link>
            </Button>
          </li>
        )}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Indicadores ESG resumidos                                           */
/* ------------------------------------------------------------------ */

export function EsgSummary() {
  const ambientais = ESG_INDICATORS.filter((i) => i.pilar === "ambiental").slice(0, 4);

  return (
    <section className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
      <header className="flex items-center justify-between gap-3 border-b border-[var(--border)] px-5 py-4">
        <h2 className="font-display text-[15px] font-semibold text-[var(--fg)]">
          Indicadores ambientais
        </h2>
        <Link
          href="/empresa/esg"
          className="flex items-center gap-1 text-[12.5px] font-medium text-[var(--accent)] hover:underline"
        >
          Ver módulo ESG
          <ArrowRight className="size-3.5" weight="bold" />
        </Link>
      </header>

      <ul className="divide-y divide-[var(--border)]">
        {ambientais.map((indicador) => (
          <li key={indicador.id} className="px-5 py-4">
            <div className="flex items-baseline justify-between gap-3">
              <p className="min-w-0 truncate text-[13px] text-[var(--fg)]">
                {indicador.nome}
              </p>
              <span className="shrink-0 font-display text-[16px] font-semibold tabular text-[var(--fg)]">
                {formatNumber(indicador.valor, 1)}
                <span className="ml-0.5 text-[11.5px] font-medium text-[var(--fg-muted)]">
                  {indicador.unidade}
                </span>
              </span>
            </div>
            <div className="mt-2.5">
              <ProgressBar value={indicador.valor} max={indicador.meta} size="xs" />
            </div>
            <div className="mt-2 flex items-center justify-between gap-3">
              <Delta value={indicador.variacao} />
              <span className="text-[11px] tabular text-[var(--fg-subtle)]">
                meta {formatNumber(indicador.meta, 1)} {indicador.unidade}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Comunicados                                                         */
/* ------------------------------------------------------------------ */

export function Announcements() {
  return (
    <section className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
      <header className="border-b border-[var(--border)] px-5 py-4">
        <h2 className="font-display text-[15px] font-semibold text-[var(--fg)]">
          Comunicados internos
        </h2>
      </header>

      <ol className="divide-y divide-[var(--border)]">
        {COMPANY_ANNOUNCEMENTS.map((comunicado) => (
          <li key={comunicado.id} className="px-5 py-4">
            <div className="flex items-start justify-between gap-3">
              <p className="text-[13.5px] font-medium text-[var(--fg)]">
                {comunicado.titulo}
              </p>
              {comunicado.fixado && (
                <Badge tone="accent" className="shrink-0">
                  Fixado
                </Badge>
              )}
            </div>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-[var(--fg-muted)]">
              {comunicado.corpo}
            </p>
            <p className="mt-2 flex items-center gap-2 text-[11.5px] text-[var(--fg-subtle)]">
              {comunicado.autor}
              <span aria-hidden>·</span>
              <RelativeTime date={comunicado.data} />
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
