"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, ShieldWarning } from "@phosphor-icons/react";
import { PageContainer, PageHeader } from "@/components/layout/app-shell";
import { ChartFrame, construirSeries } from "@/components/charts/chart-kit";
import { Columns, Donut, TrendArea } from "@/components/charts/charts";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { Delta, ProgressBar } from "@/components/ui/data-display";
import { Badge } from "@/components/ui/badge";
import { LiveFeed } from "@/features/government/live-feed";
import {
  ANOMALIES,
  BUDGET_LINES,
  GOVERNMENT,
  GOVERNMENT_MATERIAL_SPLIT,
  GOVERNMENT_MONTHLY,
  REGIONS,
} from "@/mocks/government";
import { MATERIAL_BY_ID } from "@/mocks/materials";
import {
  formatCompact,
  formatCurrencyCompact,
  formatNumber,
  formatPercent,
} from "@/lib/format";
import { cn } from "@/lib/utils";

export default function GovernmentDashboardPage() {
  const execucao = (GOVERNMENT.orcamentoExecutado / GOVERNMENT.orcamentoAnual) * 100;

  const seriesVolume = React.useMemo(
    () =>
      construirSeries([
        { chave: "reciclado", rotulo: "Resíduo reciclado", unidade: " t" },
        { chave: "aterroEvitado", rotulo: "Aterro evitado", unidade: " t", cor: "var(--series-2)" },
      ]),
    [],
  );

  const seriesUsuarios = React.useMemo(
    () =>
      construirSeries([
        { chave: "novosUsuarios", rotulo: "Novos usuários no mês", cor: "var(--series-2)" },
      ]),
    [],
  );

  const dadosMensais = GOVERNMENT_MONTHLY.map((linha) => ({
    periodo: String(linha.periodo),
    reciclado: Number(linha.reciclado),
    aterroEvitado: Number(linha.aterroEvitado),
    novosUsuarios: Number(linha.novosUsuarios),
  }));

  const dadosMateriais = GOVERNMENT_MATERIAL_SPLIT.map((item) => ({
    material: MATERIAL_BY_ID[item.materialId].nome,
    toneladas: item.toneladas,
    cor: MATERIAL_BY_ID[item.materialId].cor,
  }));

  const totalToneladas = dadosMateriais.reduce((soma, i) => soma + i.toneladas, 0);

  const alertasCriticos = ANOMALIES.filter(
    (a) => a.status === "aberto" && a.riskScore >= 70,
  ).slice(0, 4);

  const topRegioes = [...REGIONS]
    .sort((a, b) => b.toneladasRecicladas - a.toneladasRecicladas)
    .slice(0, 5);

  return (
    <PageContainer wide>
      <PageHeader
        eyebrow={GOVERNMENT.abrangencia}
        titulo="Painel executivo"
        descricao={`${GOVERNMENT.orgao} · ${GOVERNMENT.municipios} municípios, ${formatCompact(GOVERNMENT.populacaoAtendida)} habitantes atendidos e ${GOVERNMENT.ecopontosAtivos} ecopontos monitorados.`}
      />

      <div className="space-y-6">
        {/* KPIs */}
        <dl className="grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              rotulo: "Usuários ativos",
              valor: <AnimatedNumber value={GOVERNMENT.usuariosAtivos} formato="compacto" />,
              nota: `Em ${GOVERNMENT.municipios} municípios`,
              delta: 9.4,
            },
            {
              rotulo: "Resíduo reciclado no ano",
              valor: (
                <>
                  <AnimatedNumber value={totalToneladas} formato="compacto" />
                  <span className="ml-1 text-[15px] font-medium text-[var(--fg-muted)]">t</span>
                </>
              ),
              nota: "Somando as 8 regiões da rede",
              delta: 14.2,
            },
            {
              rotulo: "Economia com aterro",
              valor: formatCurrencyCompact(GOVERNMENT.economiaAterro),
              nota: "Custo de destinação evitado",
              delta: 12.8,
            },
            {
              rotulo: "Orçamento executado",
              valor: formatCurrencyCompact(GOVERNMENT.orcamentoExecutado),
              nota: `${formatPercent(execucao)} de ${formatCurrencyCompact(GOVERNMENT.orcamentoAnual)}`,
              delta: 5.1,
            },
          ].map((item) => (
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

        {/* Leitura principal */}
        <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
          <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5 lg:p-6">
            <ChartFrame
              titulo="Quanto resíduo deixou de ir para o aterro a cada mês?"
              descricao="Volume reciclado e a parcela correspondente de aterro evitado, em toneladas."
              series={seriesVolume}
              dados={dadosMensais}
              chaveEixo="periodo"
              altura={300}
              formatarValor={(valor) => `${formatNumber(valor)} t`}
              rodape="A diferença entre as duas linhas corresponde ao rejeito e às perdas do processo de triagem."
            >
              <TrendArea
                dados={dadosMensais}
                series={seriesVolume}
                chaveEixo="periodo"
                formatarValor={(valor) => `${formatNumber(valor)} t`}
                formatarEixoY={(valor) => `${Math.round(valor / 1000)}k`}
              />
            </ChartFrame>
          </div>

          <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5">
            <ChartFrame
              titulo="Que materiais compõem o volume?"
              descricao="Distribuição anual da rede, em toneladas."
              series={[
                { chave: "toneladas", rotulo: "Reciclado", cor: "var(--series-1)", unidade: " t" },
              ]}
              dados={dadosMateriais}
              chaveEixo="material"
              altura={250}
              formatarValor={(valor) => `${formatNumber(valor)} t`}
            >
              <Donut
                dados={dadosMateriais}
                series={[
                  { chave: "toneladas", rotulo: "Reciclado", cor: "var(--series-1)", unidade: " t" },
                ]}
                chaveEixo="material"
                formatarValor={(valor) => `${formatNumber(valor)} t`}
                centro={
                  <>
                    <span className="font-display text-[22px] font-semibold leading-none tabular tracking-[-0.03em] text-[var(--fg)]">
                      {formatCompact(totalToneladas)} t
                    </span>
                    <span className="mt-1 text-[11px] text-[var(--fg-subtle)]">no ano</span>
                  </>
                }
              />
            </ChartFrame>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5">
            <ChartFrame
              titulo="Quantos novos usuários entraram por mês?"
              descricao="Contas criadas e ativadas na rede metropolitana."
              series={seriesUsuarios}
              dados={dadosMensais}
              chaveEixo="periodo"
              altura={260}
              formatarValor={(valor) => formatNumber(valor)}
            >
              <Columns
                dados={dadosMensais}
                series={seriesUsuarios}
                chaveEixo="periodo"
                formatarValor={(valor) => formatNumber(valor)}
                formatarEixoY={(valor) => `${Math.round(valor / 1000)}k`}
              />
            </ChartFrame>
          </div>

          {/* Ranking regional resumido */}
          <section className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
            <header className="flex items-center justify-between gap-3 border-b border-[var(--border)] px-5 py-4">
              <h2 className="font-display text-[15px] font-semibold text-[var(--fg)]">
                Regiões por volume reciclado
              </h2>
              <Link
                href="/governo/regioes"
                className="flex items-center gap-1 text-[12.5px] font-medium text-[var(--accent)] hover:underline"
              >
                Ver todas
                <ArrowRight className="size-3.5" weight="bold" />
              </Link>
            </header>

            <ol className="divide-y divide-[var(--border)]">
              {topRegioes.map((regiao, indice) => (
                <li key={regiao.id} className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <span className="w-5 shrink-0 text-[12px] tabular text-[var(--fg-subtle)]">
                      {indice + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13.5px] font-medium text-[var(--fg)]">
                        {regiao.nome}
                      </p>
                      <p className="truncate text-[11.5px] text-[var(--fg-subtle)]">
                        {regiao.municipio} · {regiao.ecopontos} ecopontos
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-[13px] font-medium tabular text-[var(--fg)]">
                        {formatCompact(regiao.toneladasRecicladas)} t
                      </p>
                      <Delta value={regiao.crescimentoPercentual} className="text-[11px]" />
                    </div>
                  </div>
                  <div className="mt-2.5 pl-8">
                    <ProgressBar
                      value={regiao.toneladasRecicladas}
                      max={topRegioes[0].toneladasRecicladas}
                      size="xs"
                    />
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>

        {/* Alertas + Live + Orçamento */}
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          <section className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
            <header className="flex items-center justify-between gap-3 border-b border-[var(--border)] px-5 py-4">
              <div className="flex items-center gap-2">
                <ShieldWarning className="size-4 text-[var(--critical)]" weight="duotone" />
                <h2 className="font-display text-[15px] font-semibold text-[var(--fg)]">
                  Anomalias em aberto
                </h2>
              </div>
              <Link
                href="/governo/fraudes"
                className="flex items-center gap-1 text-[12.5px] font-medium text-[var(--accent)] hover:underline"
              >
                Abrir central
                <ArrowRight className="size-3.5" weight="bold" />
              </Link>
            </header>

            <ul className="divide-y divide-[var(--border)]">
              {alertasCriticos.map((anomalia) => (
                <li key={anomalia.id}>
                  <Link
                    href={`/governo/fraudes?evento=${anomalia.id}`}
                    className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-[var(--surface-2)]"
                  >
                    <span
                      className={cn(
                        "flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-sm)] font-display text-[14px] font-semibold tabular",
                        anomalia.riskScore >= 85
                          ? "bg-[var(--critical-soft)] text-[var(--critical)]"
                          : "bg-[var(--warning-soft)] text-[var(--warning)]",
                      )}
                    >
                      {anomalia.riskScore}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-medium text-[var(--fg)]">
                        {anomalia.titulo}
                      </p>
                      <p className="truncate text-[11.5px] text-[var(--fg-muted)]">
                        {anomalia.cidade} — {anomalia.ecoponto}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <LiveFeed />

          <section className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
            <header className="flex items-center justify-between gap-3 border-b border-[var(--border)] px-5 py-4">
              <h2 className="font-display text-[15px] font-semibold text-[var(--fg)]">
                Execução orçamentária
              </h2>
              <Badge tone="accent">{formatPercent(execucao)}</Badge>
            </header>

            <ul className="divide-y divide-[var(--border)]">
              {BUDGET_LINES.slice(0, 5).map((linha) => {
                const percentual = (linha.executado / linha.previsto) * 100;
                return (
                  <li key={linha.id} className="px-5 py-3.5">
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="min-w-0 truncate text-[12.5px] text-[var(--fg)]">
                        {linha.categoria}
                      </p>
                      <span className="shrink-0 text-[12px] font-medium tabular text-[var(--fg-muted)]">
                        {Math.round(percentual)}%
                      </span>
                    </div>
                    <div className="mt-2">
                      <ProgressBar
                        value={percentual}
                        size="xs"
                        tone={percentual > 90 ? "warning" : "accent"}
                      />
                    </div>
                    <p className="mt-1.5 text-[11px] tabular text-[var(--fg-subtle)]">
                      {formatCurrencyCompact(linha.executado)} de{" "}
                      {formatCurrencyCompact(linha.previsto)}
                    </p>
                  </li>
                );
              })}
            </ul>

            <div className="border-t border-[var(--border)] px-5 py-3">
              <Link
                href="/governo/orcamento"
                className="flex items-center gap-1 text-[12.5px] font-medium text-[var(--accent)] hover:underline"
              >
                Ver balanço completo
                <ArrowRight className="size-3.5" weight="bold" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </PageContainer>
  );
}
