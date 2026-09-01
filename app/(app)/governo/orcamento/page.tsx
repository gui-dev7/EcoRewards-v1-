"use client";

import * as React from "react";
import { PageContainer, PageHeader } from "@/components/layout/app-shell";
import { ChartFrame, construirSeries } from "@/components/charts/chart-kit";
import { Columns } from "@/components/charts/charts";
import { Badge } from "@/components/ui/badge";
import { ProgressBar, Table, Td, Th, Tr } from "@/components/ui/data-display";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { BUDGET_LINES, GOVERNMENT } from "@/mocks/government";
import { formatCurrency, formatCurrencyCompact, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function BudgetPage() {
  const execucao = (GOVERNMENT.orcamentoExecutado / GOVERNMENT.orcamentoAnual) * 100;
  const saldo = GOVERNMENT.orcamentoAnual - GOVERNMENT.orcamentoExecutado;
  const retorno = GOVERNMENT.economiaAterro / GOVERNMENT.orcamentoExecutado;

  const series = React.useMemo(
    () =>
      construirSeries([
        { chave: "previsto", rotulo: "Previsto", cor: "var(--series-2)" },
        { chave: "executado", rotulo: "Executado", cor: "var(--series-1)" },
      ]),
    [],
  );

  const dados = BUDGET_LINES.map((linha) => ({
    categoria: linha.categoria.split(" ").slice(0, 2).join(" "),
    previsto: linha.previsto,
    executado: linha.executado,
  }));

  const ordenadas = [...BUDGET_LINES].sort(
    (a, b) => b.executado / b.previsto - a.executado / a.previsto,
  );

  return (
    <PageContainer wide>
      <PageHeader
        eyebrow="Exercício 2026"
        titulo="Balanço e orçamento"
        descricao="Execução por linha orçamentária e a economia gerada pelo desvio de resíduo do aterro sanitário."
      />

      <div className="space-y-6">
        <dl className="grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              rotulo: "Orçamento anual",
              valor: <AnimatedNumber value={GOVERNMENT.orcamentoAnual} formato="moeda" />,
              nota: "Dotação aprovada para o exercício",
            },
            {
              rotulo: "Executado",
              valor: (
                <AnimatedNumber value={GOVERNMENT.orcamentoExecutado} formato="moeda" />
              ),
              nota: `${formatPercent(execucao)} da dotação`,
            },
            {
              rotulo: "Saldo disponível",
              valor: <AnimatedNumber value={saldo} formato="moeda" />,
              nota: "Ainda não empenhado",
            },
            {
              rotulo: "Economia com aterro",
              valor: <AnimatedNumber value={GOVERNMENT.economiaAterro} formato="moeda" />,
              nota: `${retorno.toFixed(1)}x o valor executado`,
            },
          ].map((item) => (
            <div key={item.rotulo} className="bg-[var(--surface)] px-5 py-4">
              <dt className="text-[12.5px] font-medium text-[var(--fg-muted)]">
                {item.rotulo}
              </dt>
              <dd className="mt-2 font-display text-[26px] font-semibold leading-none tabular tracking-[-0.03em] text-[var(--fg)]">
                {item.valor}
              </dd>
              <p className="mt-2.5 text-[11.5px] text-[var(--fg-subtle)]">{item.nota}</p>
            </div>
          ))}
        </dl>

        {/* Execução geral */}
        <section className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5 lg:p-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-[14.5px] font-semibold text-[var(--fg)]">
                Execução consolidada
              </h2>
              <p className="mt-1 text-[12.5px] text-[var(--fg-muted)]">
                {formatCurrency(GOVERNMENT.orcamentoExecutado)} de{" "}
                {formatCurrency(GOVERNMENT.orcamentoAnual)}
              </p>
            </div>
            <Badge tone={execucao > 85 ? "warning" : "accent"}>
              {formatPercent(execucao)} executado
            </Badge>
          </div>
          <div className="mt-4">
            <ProgressBar value={execucao} tone={execucao > 85 ? "warning" : "accent"} />
          </div>
        </section>

        <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5 lg:p-6">
          <ChartFrame
            titulo="Onde o previsto e o executado divergem?"
            descricao="Comparação por linha orçamentária, em reais."
            series={series}
            dados={dados}
            chaveEixo="categoria"
            altura={300}
            formatarValor={(valor) => formatCurrencyCompact(valor)}
            rodape="Barras lado a lado, com o mesmo eixo — a comparação direta só é legítima porque as duas medidas compartilham a unidade."
          >
            <Columns
              dados={dados}
              series={series}
              chaveEixo="categoria"
              formatarValor={(valor) => formatCurrencyCompact(valor)}
              formatarEixoY={(valor) => `${Math.round(valor / 1_000_000)}M`}
            />
          </ChartFrame>
        </div>

        {/* Tabela detalhada */}
        <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
          <div className="border-b border-[var(--border)] px-5 py-4">
            <h2 className="font-display text-[15px] font-semibold text-[var(--fg)]">
              Detalhamento por linha
            </h2>
            <p className="mt-0.5 text-[12px] text-[var(--fg-subtle)]">
              Ordenado pelo percentual de execução
            </p>
          </div>

          <Table>
            <thead>
              <tr>
                <Th>Linha orçamentária</Th>
                <Th numeric className="hidden sm:table-cell">
                  Previsto
                </Th>
                <Th numeric>Executado</Th>
                <Th>Execução</Th>
                <Th numeric className="hidden lg:table-cell">
                  Saldo
                </Th>
              </tr>
            </thead>
            <tbody>
              {ordenadas.map((linha) => {
                const percentual = (linha.executado / linha.previsto) * 100;
                return (
                  <Tr key={linha.id}>
                    <Td>
                      <p className="text-[13.5px] font-medium text-[var(--fg)]">
                        {linha.categoria}
                      </p>
                      <p className="mt-0.5 max-w-[52ch] text-[11.5px] leading-relaxed text-[var(--fg-subtle)]">
                        {linha.descricao}
                      </p>
                    </Td>
                    <Td numeric className="hidden text-[13px] text-[var(--fg-muted)] sm:table-cell">
                      {formatCurrencyCompact(linha.previsto)}
                    </Td>
                    <Td numeric className="text-[13px] font-medium">
                      {formatCurrencyCompact(linha.executado)}
                    </Td>
                    <Td>
                      <div className="flex items-center gap-3">
                        <div className="min-w-[70px] flex-1">
                          <ProgressBar
                            value={percentual}
                            size="xs"
                            tone={
                              percentual > 95
                                ? "critical"
                                : percentual > 85
                                  ? "warning"
                                  : "accent"
                            }
                          />
                        </div>
                        <span
                          className={cn(
                            "shrink-0 text-[12.5px] font-medium tabular",
                            percentual > 95 ? "text-[var(--critical)]" : "text-[var(--fg)]",
                          )}
                        >
                          {Math.round(percentual)}%
                        </span>
                      </div>
                    </Td>
                    <Td numeric className="hidden text-[13px] text-[var(--fg-muted)] lg:table-cell">
                      {formatCurrencyCompact(linha.previsto - linha.executado)}
                    </Td>
                  </Tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-[var(--surface-2)]">
                <Td className="text-[13px] font-semibold text-[var(--fg)]">Total</Td>
                <Td numeric className="hidden text-[13px] font-semibold sm:table-cell">
                  {formatCurrencyCompact(GOVERNMENT.orcamentoAnual)}
                </Td>
                <Td numeric className="text-[13px] font-semibold">
                  {formatCurrencyCompact(GOVERNMENT.orcamentoExecutado)}
                </Td>
                <Td className="text-[13px] font-semibold tabular">
                  {formatPercent(execucao)}
                </Td>
                <Td numeric className="hidden text-[13px] font-semibold lg:table-cell">
                  {formatCurrencyCompact(saldo)}
                </Td>
              </tr>
            </tfoot>
          </Table>
        </div>

        <p className="text-[12px] leading-relaxed text-[var(--fg-subtle)]">
          Valores demonstrativos. A economia com aterro considera o custo médio de
          destinação final por tonelada praticado na Região Metropolitana e não
          substitui demonstrativo contábil oficial.
        </p>
      </div>
    </PageContainer>
  );
}
