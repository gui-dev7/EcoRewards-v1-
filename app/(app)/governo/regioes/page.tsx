"use client";

import * as React from "react";
import { PageContainer, PageHeader } from "@/components/layout/app-shell";
import { ChartFrame } from "@/components/charts/chart-kit";
import { Columns } from "@/components/charts/charts";
import { Delta, ProgressBar, Table, Td, Th, Tr } from "@/components/ui/data-display";
import { Badge } from "@/components/ui/badge";
import { Segmented } from "@/components/ui/tabs";
import { Sheet, SheetContent } from "@/components/ui/dialog";
import { REGIONS } from "@/mocks/government";
import {
  formatCompact,
  formatCurrencyCompact,
  formatNumber,
  formatPercent,
} from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Region } from "@/types";

type Metrica =
  | "perCapita"
  | "crescimento"
  | "adesao"
  | "custo"
  | "economia"
  | "desempenho";

const METRICAS: {
  id: Metrica;
  rotulo: string;
  pergunta: string;
  formato: (regiao: Region) => number;
  exibir: (valor: number) => string;
  /** Quando verdadeiro, menor é melhor. */
  invertido?: boolean;
}[] = [
  {
    id: "perCapita",
    rotulo: "Per capita",
    pergunta: "Quanto cada habitante recicla por ano?",
    formato: (r) => (r.toneladasRecicladas * 1000) / r.populacao,
    exibir: (v) => `${formatNumber(v, 1)} kg`,
  },
  {
    id: "crescimento",
    rotulo: "Crescimento",
    pergunta: "Onde o programa está acelerando?",
    formato: (r) => r.crescimentoPercentual,
    exibir: (v) => `${formatNumber(v, 1)}%`,
  },
  {
    id: "adesao",
    rotulo: "Adesão",
    pergunta: "Que fatia da população participa?",
    formato: (r) => r.adesaoPercentual,
    exibir: (v) => `${formatNumber(v, 1)}%`,
  },
  {
    id: "custo",
    rotulo: "Custo por tonelada",
    pergunta: "Quanto custa reciclar cada tonelada?",
    formato: (r) => r.custoOperacional / r.toneladasRecicladas,
    exibir: (v) => formatCurrencyCompact(v),
    invertido: true,
  },
  {
    id: "economia",
    rotulo: "Economia gerada",
    pergunta: "Quanto o município deixou de gastar?",
    formato: (r) => r.economiaEstimada,
    exibir: (v) => formatCurrencyCompact(v),
  },
  {
    id: "desempenho",
    rotulo: "Retorno operacional",
    pergunta: "Cada real investido devolve quanto?",
    formato: (r) => r.economiaEstimada / r.custoOperacional,
    exibir: (v) => `${formatNumber(v, 1)}x`,
  },
];

export default function RegionsPage() {
  const [metrica, setMetrica] = React.useState<Metrica>("perCapita");
  const [selecionada, setSelecionada] = React.useState<Region | null>(null);

  const config = METRICAS.find((m) => m.id === metrica)!;

  const ranking = React.useMemo(() => {
    return [...REGIONS]
      .map((regiao) => ({ regiao, valor: config.formato(regiao) }))
      .sort((a, b) => (config.invertido ? a.valor - b.valor : b.valor - a.valor));
  }, [config]);

  const dadosGrafico = ranking.map((item) => ({
    nome: item.regiao.nome,
    valor: Number(item.valor.toFixed(2)),
  }));

  const maximo = Math.max(...ranking.map((item) => item.valor));

  return (
    <PageContainer wide>
      <PageHeader
        eyebrow="Regional Intelligence"
        titulo="Comparação entre regiões"
        descricao="Oito regiões da rede metropolitana, ordenadas pela métrica selecionada. Clique numa linha para abrir o detalhe completo."
      />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Segmented
          ariaLabel="Escolher métrica de comparação"
          options={METRICAS.map((m) => ({ value: m.id, label: m.rotulo }))}
          value={metrica}
          onChange={setMetrica}
        />
        {config.invertido && (
          <Badge tone="neutral">Nesta métrica, menor é melhor</Badge>
        )}
      </div>

      <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5 lg:p-6">
        <ChartFrame
          titulo={config.pergunta}
          series={[
            { chave: "valor", rotulo: config.rotulo, cor: "var(--series-1)" },
          ]}
          dados={dadosGrafico}
          chaveEixo="nome"
          altura={280}
          formatarValor={(valor) => config.exibir(valor)}
        >
          <Columns
            dados={dadosGrafico}
            series={[
              { chave: "valor", rotulo: config.rotulo, cor: "var(--series-1)" },
            ]}
            chaveEixo="nome"
            formatarValor={(valor) => config.exibir(valor)}
          />
        </ChartFrame>
      </div>

      <div className="mt-6 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
        <Table>
          <thead>
            <tr>
              <Th className="w-12">#</Th>
              <Th>Região</Th>
              <Th numeric className="hidden sm:table-cell">
                População
              </Th>
              <Th numeric className="hidden md:table-cell">
                Usuários
              </Th>
              <Th numeric className="hidden lg:table-cell">
                Ecopontos
              </Th>
              <Th>{config.rotulo}</Th>
              <Th numeric className="hidden xl:table-cell">
                Crescimento
              </Th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((item, indice) => (
              <Tr
                key={item.regiao.id}
                interactive
                onClick={() => setSelecionada(item.regiao)}
              >
                <Td>
                  <span
                    className={cn(
                      "text-[12.5px] tabular",
                      indice === 0 ? "font-semibold text-[var(--accent)]" : "text-[var(--fg-subtle)]",
                    )}
                  >
                    {indice + 1}
                  </span>
                </Td>
                <Td>
                  <p className="text-[13.5px] font-medium text-[var(--fg)]">
                    {item.regiao.nome}
                  </p>
                  <p className="text-[11.5px] text-[var(--fg-subtle)]">
                    {item.regiao.municipio}
                  </p>
                </Td>
                <Td numeric className="hidden text-[13px] sm:table-cell">
                  {formatCompact(item.regiao.populacao)}
                </Td>
                <Td numeric className="hidden text-[13px] md:table-cell">
                  {formatCompact(item.regiao.usuariosAtivos)}
                </Td>
                <Td numeric className="hidden text-[13px] lg:table-cell">
                  {item.regiao.ecopontos}
                </Td>
                <Td>
                  <div className="flex items-center gap-3">
                    <div className="min-w-[70px] flex-1">
                      <ProgressBar
                        value={config.invertido ? maximo - item.valor : item.valor}
                        max={maximo}
                        size="xs"
                      />
                    </div>
                    <span className="shrink-0 text-[13px] font-medium tabular text-[var(--fg)]">
                      {config.exibir(item.valor)}
                    </span>
                  </div>
                </Td>
                <Td numeric className="hidden xl:table-cell">
                  <Delta value={item.regiao.crescimentoPercentual} />
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Sheet
        open={Boolean(selecionada)}
        onOpenChange={(aberto) => !aberto && setSelecionada(null)}
      >
        <SheetContent side="right" width="sm:max-w-lg" className="p-0">
          {selecionada && <RegionDetail regiao={selecionada} />}
        </SheetContent>
      </Sheet>
    </PageContainer>
  );
}

function RegionDetail({ regiao }: { regiao: Region }) {
  const perCapita = (regiao.toneladasRecicladas * 1000) / regiao.populacao;
  const custoTonelada = regiao.custoOperacional / regiao.toneladasRecicladas;
  const retorno = regiao.economiaEstimada / regiao.custoOperacional;

  return (
    <div className="flex h-full flex-col">
      <header className="border-b border-[var(--border)] px-6 py-5 pr-12">
        <p className="eyebrow">{regiao.municipio}</p>
        <h2 className="mt-2 font-display text-[21px] font-semibold tracking-[-0.015em] text-[var(--fg)]">
          {regiao.nome}
        </h2>
        <p className="mt-1.5 text-[13px] text-[var(--fg-muted)]">
          {formatCompact(regiao.populacao)} habitantes · {regiao.ecopontos} ecopontos
          na região
        </p>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-5">
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--border)]">
          {[
            { rotulo: "Reciclado no ano", valor: `${formatCompact(regiao.toneladasRecicladas)} t` },
            { rotulo: "Aterro evitado", valor: `${formatCompact(regiao.aterroEvitadoToneladas)} t` },
            { rotulo: "CO2 evitado", valor: `${formatCompact(regiao.co2EvitadoToneladas)} t` },
            { rotulo: "Usuários ativos", valor: formatCompact(regiao.usuariosAtivos) },
            { rotulo: "Reciclagem per capita", valor: `${formatNumber(perCapita, 1)} kg` },
            { rotulo: "Adesão populacional", valor: formatPercent(regiao.adesaoPercentual) },
          ].map((item) => (
            <div key={item.rotulo} className="bg-[var(--surface-2)] px-4 py-3.5">
              <dt className="text-[11.5px] text-[var(--fg-muted)]">{item.rotulo}</dt>
              <dd className="mt-1 font-display text-[18px] font-semibold tabular text-[var(--fg)]">
                {item.valor}
              </dd>
            </div>
          ))}
        </dl>

        <section className="mt-6">
          <h3 className="eyebrow mb-3">Economia do programa na região</h3>
          <dl className="space-y-px overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--border)]">
            {[
              {
                rotulo: "Custo operacional anual",
                valor: formatCurrencyCompact(regiao.custoOperacional),
              },
              {
                rotulo: "Economia com aterro",
                valor: formatCurrencyCompact(regiao.economiaEstimada),
              },
              {
                rotulo: "Custo por tonelada",
                valor: formatCurrencyCompact(custoTonelada),
              },
              {
                rotulo: "Retorno por real investido",
                valor: `${formatNumber(retorno, 1)}x`,
              },
            ].map((linha) => (
              <div
                key={linha.rotulo}
                className="flex items-center justify-between gap-4 bg-[var(--surface)] px-4 py-3"
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
        </section>

        <section className="mt-6">
          <h3 className="eyebrow mb-3">Crescimento e risco</h3>

          <div className="space-y-4">
            <div>
              <div className="mb-1.5 flex items-baseline justify-between gap-3">
                <span className="text-[12.5px] text-[var(--fg-muted)]">
                  Crescimento anual
                </span>
                <Delta value={regiao.crescimentoPercentual} />
              </div>
              <ProgressBar
                value={Math.min(regiao.crescimentoPercentual, 40)}
                max={40}
                size="sm"
                tone="good"
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-baseline justify-between gap-3">
                <span className="text-[12.5px] text-[var(--fg-muted)]">
                  Risco operacional
                </span>
                <span className="text-[12.5px] font-medium tabular text-[var(--fg)]">
                  {regiao.riscoOperacional} / 100
                </span>
              </div>
              <ProgressBar
                value={regiao.riscoOperacional}
                size="sm"
                tone={
                  regiao.riscoOperacional >= 70
                    ? "critical"
                    : regiao.riscoOperacional >= 40
                      ? "warning"
                      : "good"
                }
              />
              <p className="mt-2 text-[12px] leading-relaxed text-[var(--fg-muted)]">
                Índice composto por ocorrências operacionais, ocupação média dos
                equipamentos e anomalias abertas. É um indicador demonstrativo
                calculado por regras fixas.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
