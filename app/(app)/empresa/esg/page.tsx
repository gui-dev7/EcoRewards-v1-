"use client";

import * as React from "react";
import { Leaf, Scales, UsersThree } from "@phosphor-icons/react";
import { PageContainer, PageHeader } from "@/components/layout/app-shell";
import { ChartFrame, construirSeries } from "@/components/charts/chart-kit";
import { Columns, RadialProgress, TrendArea } from "@/components/charts/charts";
import { Delta, ProgressBar } from "@/components/ui/data-display";
import { Badge } from "@/components/ui/badge";
import { COMPANY, COMPANY_MONTHLY, ESG_INDICATORS } from "@/mocks/company";
import { formatNumber, formatPercent } from "@/lib/format";
import type { EsgIndicator } from "@/types";

const PILARES = [
  {
    id: "ambiental" as const,
    nome: "Ambiental",
    descricao: "Resíduo desviado, emissões evitadas e uso de recursos.",
    Icon: Leaf,
  },
  {
    id: "social" as const,
    nome: "Social",
    descricao: "Engajamento dos colaboradores e impacto na comunidade.",
    Icon: UsersThree,
  },
  {
    id: "governanca" as const,
    nome: "Governança",
    descricao: "Rastreabilidade, auditoria e transparência do programa.",
    Icon: Scales,
  },
];

export default function EsgPage() {
  const progressoMeta =
    (COMPANY.toneladasRecicladas / COMPANY.metaAnualToneladas) * 100;

  /**
   * Projeção linear simples: média mensal do ano corrente estendida até
   * dezembro. Não é previsão — é a leitura do ritmo atual, e está rotulada
   * como tal para não ser confundida com modelo estatístico.
   */
  const projecao = React.useMemo(() => {
    const mesesDecorridos = 8; // Jan a Ago de 2026
    const mediaMensal = COMPANY.toneladasRecicladas / mesesDecorridos;
    const projetado = mediaMensal * 12;
    return {
      mediaMensal,
      projetado,
      diferenca: projetado - COMPANY.metaAnualToneladas,
    };
  }, []);

  const serieAcumulada = React.useMemo(
    () =>
      COMPANY_MONTHLY.reduce<{ periodo: string; acumulado: number }[]>(
        (linhas, linha) => {
          const anterior = linhas.at(-1)?.acumulado ?? 0;
          linhas.push({
            periodo: String(linha.periodo),
            acumulado: Number((anterior + Number(linha.reciclado) / 1000).toFixed(1)),
          });
          return linhas;
        },
        [],
      ),
    [],
  );

  const seriesAcumulado = React.useMemo(
    () => construirSeries([{ chave: "acumulado", rotulo: "Resíduo acumulado", unidade: " t" }]),
    [],
  );

  const seriesCo2 = React.useMemo(
    () =>
      construirSeries([
        { chave: "co2", rotulo: "CO2 evitado no mês", cor: "var(--series-3)", unidade: " kg" },
      ]),
    [],
  );

  const dadosCo2 = COMPANY_MONTHLY.map((linha) => ({
    periodo: String(linha.periodo),
    co2: Number(linha.co2),
  }));

  return (
    <PageContainer wide>
      <PageHeader
        eyebrow="Sustentabilidade"
        titulo="Módulo ESG"
        descricao="Indicadores dos três pilares, progresso da meta anual e projeção pelo ritmo atual do programa."
      />

      {/* Meta anual em destaque */}
      <section className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6">
          <p className="eyebrow">Meta anual de resíduo desviado</p>

          <div className="mt-5 h-[200px]">
            <RadialProgress
              valor={progressoMeta}
              cor="var(--accent)"
              centro={
                <>
                  <span className="font-display text-[34px] font-semibold leading-none tabular tracking-[-0.035em] text-[var(--fg)]">
                    {Math.round(progressoMeta)}%
                  </span>
                  <span className="mt-1.5 text-[12px] text-[var(--fg-muted)]">
                    da meta anual
                  </span>
                </>
              }
            />
          </div>

          <dl className="mt-5 space-y-px overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--border)]">
            {[
              {
                rotulo: "Realizado no ano",
                valor: `${formatNumber(COMPANY.toneladasRecicladas, 1)} t`,
              },
              { rotulo: "Meta anual", valor: `${COMPANY.metaAnualToneladas} t` },
              {
                rotulo: "Falta para a meta",
                valor: `${formatNumber(COMPANY.metaAnualToneladas - COMPANY.toneladasRecicladas, 1)} t`,
              },
            ].map((linha) => (
              <div
                key={linha.rotulo}
                className="flex items-center justify-between gap-4 bg-[var(--surface-2)] px-4 py-3"
              >
                <dt className="text-[12.5px] text-[var(--fg-muted)]">
                  {linha.rotulo}
                </dt>
                <dd className="text-[13.5px] font-medium tabular text-[var(--fg)]">
                  {linha.valor}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="space-y-6">
          <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5 lg:p-6">
            <ChartFrame
              titulo="Como o acumulado do ano se comporta?"
              descricao="Resíduo desviado de aterro, somado mês a mês."
              series={seriesAcumulado}
              dados={serieAcumulada}
              chaveEixo="periodo"
              altura={240}
              formatarValor={(valor) => `${formatNumber(valor, 1)} t`}
            >
              <TrendArea
                dados={serieAcumulada}
                series={seriesAcumulado}
                chaveEixo="periodo"
                formatarValor={(valor) => `${formatNumber(valor, 1)} t`}
                formatarEixoY={(valor) => `${valor}t`}
              />
            </ChartFrame>
          </div>

          {/* Projeção */}
          <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5 lg:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-[14.5px] font-semibold text-[var(--fg)]">
                  Projeção pelo ritmo atual
                </h2>
                <p className="mt-1 max-w-[52ch] text-[12.5px] leading-relaxed text-[var(--fg-muted)]">
                  Média mensal de {formatNumber(projecao.mediaMensal, 1)} t
                  estendida até dezembro. É uma extrapolação linear do que já
                  aconteceu, não uma previsão estatística.
                </p>
              </div>
              <Badge tone={projecao.diferenca >= 0 ? "good" : "warning"}>
                {projecao.diferenca >= 0 ? "Meta alcançável" : "Abaixo da meta"}
              </Badge>
            </div>

            <dl className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-3">
              {[
                {
                  rotulo: "Projetado para o ano",
                  valor: `${formatNumber(projecao.projetado, 1)} t`,
                },
                {
                  rotulo: "Meta anual",
                  valor: `${COMPANY.metaAnualToneladas} t`,
                },
                {
                  rotulo: projecao.diferenca >= 0 ? "Excedente projetado" : "Déficit projetado",
                  valor: `${formatNumber(Math.abs(projecao.diferenca), 1)} t`,
                },
              ].map((item) => (
                <div key={item.rotulo} className="border-t border-[var(--border)] pt-3">
                  <dt className="text-[11.5px] text-[var(--fg-subtle)]">
                    {item.rotulo}
                  </dt>
                  <dd className="mt-1.5 font-display text-[22px] font-semibold tabular tracking-[-0.025em] text-[var(--fg)]">
                    {item.valor}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <div className="mt-6 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5 lg:p-6">
        <ChartFrame
          titulo="Quanto CO2 foi evitado a cada mês?"
          descricao="Emissões não lançadas, calculadas pelo fator de cada material reciclado."
          series={seriesCo2}
          dados={dadosCo2}
          chaveEixo="periodo"
          altura={260}
          formatarValor={(valor) => `${formatNumber(valor)} kg`}
        >
          <Columns
            dados={dadosCo2}
            series={seriesCo2}
            chaveEixo="periodo"
            formatarValor={(valor) => `${formatNumber(valor)} kg`}
            formatarEixoY={(valor) => `${Math.round(valor / 1000)}t`}
          />
        </ChartFrame>
      </div>

      {/* Indicadores por pilar */}
      <div className="mt-10 space-y-10">
        {PILARES.map((pilar) => {
          const indicadores = ESG_INDICATORS.filter((i) => i.pilar === pilar.id);
          if (indicadores.length === 0) return null;

          return (
            <section key={pilar.id}>
              <div className="flex items-start gap-3 border-b border-[var(--border)] pb-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--accent-soft)] text-[var(--accent)]">
                  <pilar.Icon className="size-[18px]" weight="duotone" />
                </span>
                <div>
                  <h2 className="font-display text-h4 text-[var(--fg)]">
                    {pilar.nome}
                  </h2>
                  <p className="mt-0.5 text-[12.5px] text-[var(--fg-muted)]">
                    {pilar.descricao}
                  </p>
                </div>
              </div>

              <ul className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {indicadores.map((indicador) => (
                  <IndicatorCard key={indicador.id} indicador={indicador} />
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <p className="mt-10 border-t border-[var(--border)] pt-5 text-[12px] leading-relaxed text-[var(--fg-subtle)]">
        Todos os indicadores desta página são demonstrativos e não substituem
        inventário de emissões certificado por terceira parte.
      </p>
    </PageContainer>
  );
}

function IndicatorCard({ indicador }: { indicador: EsgIndicator }) {
  const progresso = (indicador.valor / indicador.meta) * 100;

  return (
    <li className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5">
      <p className="text-[13px] font-medium text-[var(--fg)]">{indicador.nome}</p>
      <p className="mt-1.5 text-[12px] leading-relaxed text-[var(--fg-muted)]">
        {indicador.descricao}
      </p>

      <p className="mt-4 font-display text-[26px] font-semibold leading-none tabular tracking-[-0.03em] text-[var(--fg)]">
        {formatNumber(indicador.valor, indicador.valor % 1 === 0 ? 0 : 1)}
        <span className="ml-1 text-[13px] font-medium text-[var(--fg-muted)]">
          {indicador.unidade}
        </span>
      </p>

      <div className="mt-3.5">
        <ProgressBar
          value={progresso}
          size="xs"
          tone={progresso >= 100 ? "good" : progresso >= 60 ? "accent" : "warning"}
        />
      </div>

      <div className="mt-2.5 flex items-center justify-between gap-3">
        <Delta value={indicador.variacao} />
        <span className="text-[11.5px] tabular text-[var(--fg-subtle)]">
          {formatPercent(progresso)} da meta de{" "}
          {formatNumber(indicador.meta, indicador.meta % 1 === 0 ? 0 : 1)}{" "}
          {indicador.unidade}
        </span>
      </div>
    </li>
  );
}
