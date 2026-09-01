"use client";

import * as React from "react";
import { toast } from "sonner";
import { ArrowLeft, FilePdf, FileText, Sparkle } from "@phosphor-icons/react";
import { PageContainer, PageHeader } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/controls";
import { ProgressBar, Table, Td, Th, Tr } from "@/components/ui/data-display";
import { ChartFrame, construirSeries } from "@/components/charts/chart-kit";
import { Columns, TrendArea } from "@/components/charts/charts";
import { LeafMark } from "@/components/brand/leaf-mark";
import { exportarNoParaPdf } from "@/lib/pdf";
import {
  ANOMALIES,
  BUDGET_LINES,
  GOVERNMENT,
  GOVERNMENT_MONTHLY,
  REGIONS,
} from "@/mocks/government";
import {
  formatCompact,
  formatCurrencyCompact,
  formatDate,
  formatNumber,
  formatPercent,
} from "@/lib/format";

const TIPOS = [
  {
    id: "operacional",
    nome: "Relatório operacional",
    descricao: "Volume, aterro evitado, rede de ecopontos e ocorrências.",
  },
  {
    id: "regional",
    nome: "Panorama regional",
    descricao: "Comparação entre as oito regiões da rede metropolitana.",
  },
  {
    id: "orcamentario",
    nome: "Execução orçamentária",
    descricao: "Previsto contra executado por linha, com economia gerada.",
  },
] as const;

const PERIODOS = [
  { valor: "12", rotulo: "Últimos 12 meses" },
  { valor: "6", rotulo: "Últimos 6 meses" },
  { valor: "3", rotulo: "Último trimestre" },
];

type TipoId = (typeof TIPOS)[number]["id"];

export default function GovernmentReportsPage() {
  const [tipo, setTipo] = React.useState<TipoId>("operacional");
  const [periodo, setPeriodo] = React.useState("12");
  const [gerado, setGerado] = React.useState(false);
  const [gerando, setGerando] = React.useState(false);
  const [exportando, setExportando] = React.useState(false);

  const documentoRef = React.useRef<HTMLDivElement>(null);

  const gerar = async () => {
    setGerando(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setGerando(false);
    setGerado(true);
    toast.success("Relatório gerado");
  };

  const exportar = async () => {
    const no = documentoRef.current;
    if (!no) return;

    setExportando(true);
    try {
      await exportarNoParaPdf(no, {
        nome: `relatorio-${tipo}-${new Date().toISOString().slice(0, 10)}`,
      });
      toast.success("PDF exportado", {
        description: "O arquivo foi gerado no navegador e baixado.",
      });
    } catch {
      toast.error("Não foi possível gerar o PDF");
    } finally {
      setExportando(false);
    }
  };

  if (gerado) {
    return (
      <PageContainer>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Button variant="ghost" onClick={() => setGerado(false)}>
            <ArrowLeft weight="bold" />
            Voltar à central
          </Button>
          <Button onClick={exportar} loading={exportando}>
            {!exportando && <FilePdf weight="bold" />}
            Exportar PDF
          </Button>
        </div>

        <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)]">
          <ReportDocument ref={documentoRef} tipo={tipo} periodo={periodo} />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Documentos"
        titulo="Central de relatórios"
        descricao="Escolha o tipo de documento e o período. A pré-visualização é o próprio arquivo exportado em PDF."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          <h2 className="font-display text-h4 text-[var(--fg)]">Tipo de relatório</h2>
          <ul className="mt-4 space-y-2.5">
            {TIPOS.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setTipo(item.id)}
                  aria-pressed={tipo === item.id}
                  className={
                    tipo === item.id
                      ? "flex w-full items-start gap-3 rounded-[var(--radius-lg)] border border-[var(--accent)] bg-[var(--accent-soft)] p-4 text-left"
                      : "flex w-full items-start gap-3 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-4 text-left transition-colors hover:border-[var(--border-strong)]"
                  }
                >
                  <FileText
                    className={
                      tipo === item.id
                        ? "mt-0.5 size-5 shrink-0 text-[var(--accent)]"
                        : "mt-0.5 size-5 shrink-0 text-[var(--fg-subtle)]"
                    }
                    weight="duotone"
                  />
                  <div>
                    <p className="text-[14px] font-medium text-[var(--fg)]">
                      {item.nome}
                    </p>
                    <p className="mt-1 text-[12.5px] leading-relaxed text-[var(--fg-muted)]">
                      {item.descricao}
                    </p>
                  </div>
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-8 max-w-xs">
            <Label className="mb-1.5 block">Período de referência</Label>
            <Select value={periodo} onValueChange={setPeriodo}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PERIODOS.map((item) => (
                  <SelectItem key={item.valor} value={item.valor}>
                    {item.rotulo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <aside className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:self-start">
          <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5">
            <h2 className="font-display text-[14px] font-semibold text-[var(--fg)]">
              {TIPOS.find((t) => t.id === tipo)?.nome}
            </h2>

            <dl className="mt-4 space-y-3 border-t border-[var(--border)] pt-4">
              {[
                { rotulo: "Órgão", valor: GOVERNMENT.orgao },
                {
                  rotulo: "Período",
                  valor: PERIODOS.find((p) => p.valor === periodo)?.rotulo ?? "",
                },
                { rotulo: "Abrangência", valor: `${GOVERNMENT.municipios} municípios` },
              ].map((linha) => (
                <div key={linha.rotulo}>
                  <dt className="text-[11.5px] text-[var(--fg-subtle)]">
                    {linha.rotulo}
                  </dt>
                  <dd className="mt-0.5 text-[12.5px] font-medium text-[var(--fg)]">
                    {linha.valor}
                  </dd>
                </div>
              ))}
            </dl>

            <Button className="mt-5 w-full" onClick={gerar} loading={gerando}>
              {!gerando && <Sparkle weight="fill" />}
              Gerar relatório
            </Button>

            <p className="mt-3 text-[11.5px] leading-relaxed text-[var(--fg-subtle)]">
              Documento demonstrativo. Não substitui prestação de contas oficial.
            </p>
          </div>
        </aside>
      </div>
    </PageContainer>
  );
}

/* ------------------------------------------------------------------ */

const ReportDocument = React.forwardRef<
  HTMLDivElement,
  { tipo: TipoId; periodo: string }
>(function ReportDocument({ tipo, periodo }, ref) {
  const serie = GOVERNMENT_MONTHLY.slice(-Number(periodo));
  const totalReciclado = serie.reduce((soma, l) => soma + Number(l.reciclado), 0);
  const totalAterro = serie.reduce((soma, l) => soma + Number(l.aterroEvitado), 0);
  const totalCo2 = serie.reduce((soma, l) => soma + Number(l.co2), 0);
  const execucao = (GOVERNMENT.orcamentoExecutado / GOVERNMENT.orcamentoAnual) * 100;

  const dadosSerie = serie.map((linha) => ({
    periodo: String(linha.periodo),
    reciclado: Number(linha.reciclado),
    aterroEvitado: Number(linha.aterroEvitado),
  }));

  const titulo = TIPOS.find((t) => t.id === tipo)!.nome;

  return (
    <div ref={ref} className="bg-[var(--surface)] p-8 lg:p-12">
      <header className="flex items-start justify-between gap-6 border-b-2 border-[var(--fg)] pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <LeafMark className="size-7 text-[var(--accent)]" />
            <span className="font-display text-[17px] font-semibold text-[var(--fg)]">
              Eco<span className="text-[var(--accent)]">Rewards</span>
            </span>
          </div>
          <h1 className="mt-6 font-display text-h1 text-[var(--fg)]">{titulo}</h1>
          <p className="mt-2 text-[15px] text-[var(--fg-muted)]">
            {GOVERNMENT.orgao}
          </p>
        </div>

        <dl className="shrink-0 space-y-2 text-right">
          {[
            { rotulo: "Emitido em", valor: formatDate(new Date().toISOString()) },
            {
              rotulo: "Período",
              valor: `${serie[0].periodo} — ${serie[serie.length - 1].periodo}`,
            },
            { rotulo: "Responsável", valor: GOVERNMENT.responsavel },
          ].map((linha) => (
            <div key={linha.rotulo}>
              <dt className="text-[10.5px] uppercase tracking-[0.09em] text-[var(--fg-subtle)]">
                {linha.rotulo}
              </dt>
              <dd className="text-[12.5px] text-[var(--fg)]">{linha.valor}</dd>
            </div>
          ))}
        </dl>
      </header>

      <section className="mt-10">
        <h2 className="eyebrow">Sumário do período</h2>
        <dl className="mt-5 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { rotulo: "Resíduo reciclado", valor: `${formatCompact(totalReciclado)} t` },
            { rotulo: "Aterro evitado", valor: `${formatCompact(totalAterro)} t` },
            { rotulo: "CO2 evitado", valor: `${formatCompact(totalCo2)} t` },
            {
              rotulo: "Usuários ativos",
              valor: formatCompact(GOVERNMENT.usuariosAtivos),
            },
          ].map((item) => (
            <div key={item.rotulo} className="border-t border-[var(--border)] pt-4">
              <dt className="text-[12.5px] text-[var(--fg-muted)]">{item.rotulo}</dt>
              <dd className="mt-2 font-display text-[28px] font-semibold leading-none tabular tracking-[-0.03em] text-[var(--fg)]">
                {item.valor}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {tipo === "operacional" && (
        <>
          <section className="mt-10 border-t border-[var(--border)] pt-8">
            <ChartFrame
              titulo="Volume reciclado e aterro evitado"
              series={construirSeries([
                { chave: "reciclado", rotulo: "Resíduo reciclado", unidade: " t" },
                {
                  chave: "aterroEvitado",
                  rotulo: "Aterro evitado",
                  unidade: " t",
                  cor: "var(--series-2)",
                },
              ])}
              dados={dadosSerie}
              chaveEixo="periodo"
              altura={260}
              formatarValor={(valor) => `${formatNumber(valor)} t`}
            >
              <TrendArea
                dados={dadosSerie}
                series={construirSeries([
                  { chave: "reciclado", rotulo: "Resíduo reciclado", unidade: " t" },
                  {
                    chave: "aterroEvitado",
                    rotulo: "Aterro evitado",
                    unidade: " t",
                    cor: "var(--series-2)",
                  },
                ])}
                chaveEixo="periodo"
                formatarValor={(valor) => `${formatNumber(valor)} t`}
                formatarEixoY={(valor) => `${Math.round(valor / 1000)}k`}
              />
            </ChartFrame>
          </section>

          <section className="mt-10 border-t border-[var(--border)] pt-8">
            <h2 className="eyebrow">Ocorrências sinalizadas</h2>
            <p className="mt-2 max-w-[80ch] text-[12.5px] leading-relaxed text-[var(--fg-muted)]">
              Eventos identificados pelo sistema de detecção de anomalias
              demonstrativo, baseado em regras determinísticas sobre os registros
              de validação.
            </p>
            <div className="mt-4">
              <Table>
                <thead>
                  <tr>
                    <Th numeric className="w-16">
                      Score
                    </Th>
                    <Th>Ocorrência</Th>
                    <Th className="hidden sm:table-cell">Local</Th>
                    <Th>Status</Th>
                  </tr>
                </thead>
                <tbody>
                  {ANOMALIES.slice(0, 8).map((anomalia) => (
                    <Tr key={anomalia.id}>
                      <Td numeric className="text-[13px] font-medium">
                        {anomalia.riskScore}
                      </Td>
                      <Td className="text-[13px]">{anomalia.titulo}</Td>
                      <Td className="hidden text-[12.5px] text-[var(--fg-muted)] sm:table-cell">
                        {anomalia.ecoponto}
                      </Td>
                      <Td className="text-[12.5px] capitalize text-[var(--fg-muted)]">
                        {anomalia.status.replace("-", " ")}
                      </Td>
                    </Tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </section>
        </>
      )}

      {tipo === "regional" && (
        <section className="mt-10 border-t border-[var(--border)] pt-8">
          <h2 className="eyebrow">Desempenho por região</h2>
          <div className="mt-4">
            <Table>
              <thead>
                <tr>
                  <Th>Região</Th>
                  <Th numeric>População</Th>
                  <Th numeric>Usuários</Th>
                  <Th numeric>Adesão</Th>
                  <Th numeric>Reciclado</Th>
                  <Th numeric className="hidden sm:table-cell">
                    Economia
                  </Th>
                </tr>
              </thead>
              <tbody>
                {[...REGIONS]
                  .sort((a, b) => b.toneladasRecicladas - a.toneladasRecicladas)
                  .map((regiao) => (
                    <Tr key={regiao.id}>
                      <Td className="text-[13px] font-medium">{regiao.nome}</Td>
                      <Td numeric className="text-[13px]">
                        {formatCompact(regiao.populacao)}
                      </Td>
                      <Td numeric className="text-[13px]">
                        {formatCompact(regiao.usuariosAtivos)}
                      </Td>
                      <Td numeric className="text-[13px]">
                        {regiao.adesaoPercentual}%
                      </Td>
                      <Td numeric className="text-[13px]">
                        {formatCompact(regiao.toneladasRecicladas)} t
                      </Td>
                      <Td numeric className="hidden text-[13px] sm:table-cell">
                        {formatCurrencyCompact(regiao.economiaEstimada)}
                      </Td>
                    </Tr>
                  ))}
              </tbody>
            </Table>
          </div>
        </section>
      )}

      {tipo === "orcamentario" && (
        <>
          <section className="mt-10 border-t border-[var(--border)] pt-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="eyebrow">Execução consolidada</h2>
                <p className="mt-3 font-display text-[26px] font-semibold tabular text-[var(--fg)]">
                  {formatCurrencyCompact(GOVERNMENT.orcamentoExecutado)}
                  <span className="ml-2 text-[15px] font-medium text-[var(--fg-muted)]">
                    de {formatCurrencyCompact(GOVERNMENT.orcamentoAnual)}
                  </span>
                </p>
              </div>
              <Badge tone="accent">{formatPercent(execucao)} executado</Badge>
            </div>
            <div className="mt-4">
              <ProgressBar value={execucao} />
            </div>
          </section>

          <section className="mt-10 border-t border-[var(--border)] pt-8">
            <ChartFrame
              titulo="Previsto contra executado por linha"
              series={construirSeries([
                { chave: "previsto", rotulo: "Previsto", cor: "var(--series-2)" },
                { chave: "executado", rotulo: "Executado", cor: "var(--series-1)" },
              ])}
              dados={BUDGET_LINES.map((l) => ({
                categoria: l.categoria.split(" ").slice(0, 2).join(" "),
                previsto: l.previsto,
                executado: l.executado,
              }))}
              chaveEixo="categoria"
              altura={260}
              formatarValor={(valor) => formatCurrencyCompact(valor)}
            >
              <Columns
                dados={BUDGET_LINES.map((l) => ({
                  categoria: l.categoria.split(" ").slice(0, 2).join(" "),
                  previsto: l.previsto,
                  executado: l.executado,
                }))}
                series={construirSeries([
                  { chave: "previsto", rotulo: "Previsto", cor: "var(--series-2)" },
                  { chave: "executado", rotulo: "Executado", cor: "var(--series-1)" },
                ])}
                chaveEixo="categoria"
                formatarValor={(valor) => formatCurrencyCompact(valor)}
                formatarEixoY={(valor) => `${Math.round(valor / 1_000_000)}M`}
              />
            </ChartFrame>
          </section>
        </>
      )}

      <footer className="mt-10 border-t border-[var(--border)] pt-6">
        <p className="text-[11.5px] leading-relaxed text-[var(--fg-subtle)]">
          Documento gerado pela plataforma EcoRewards em{" "}
          {formatDate(new Date().toISOString(), "longo")}. Todos os dados são
          demonstrativos e não constituem prestação de contas oficial. O sistema
          de detecção de anomalias opera por regras determinísticas, sem modelos
          de inteligência artificial.
        </p>
      </footer>
    </div>
  );
});
