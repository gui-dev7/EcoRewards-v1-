"use client";

import * as React from "react";
import { toast } from "sonner";
import { ArrowLeft, FilePdf, FileText, Sparkle } from "@phosphor-icons/react";
import { PageContainer, PageHeader } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/controls";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/controls";
import { Label } from "@/components/ui/field";
import { Table, Td, Th, Tr, ProgressBar } from "@/components/ui/data-display";
import { ChartFrame, construirSeries } from "@/components/charts/chart-kit";
import { Columns, Donut, TrendArea } from "@/components/charts/charts";
import { LeafMark } from "@/components/brand/leaf-mark";
import { exportarNoParaPdf } from "@/lib/pdf";
import {
  COMPANY,
  COMPANY_MATERIAL_SPLIT,
  COMPANY_MONTHLY,
  DEPARTMENTS,
  ESG_INDICATORS,
} from "@/mocks/company";
import { MATERIAL_BY_ID } from "@/mocks/materials";
import { formatCurrencyCompact, formatDate, formatNumber, formatPercent } from "@/lib/format";

const METRICAS = [
  { id: "residuo", rotulo: "Resíduo desviado de aterro" },
  { id: "co2", rotulo: "CO2 evitado" },
  { id: "participacao", rotulo: "Participação dos colaboradores" },
  { id: "pontos", rotulo: "EcoPontos distribuídos" },
  { id: "orcamento", rotulo: "Execução orçamentária" },
] as const;

const GRAFICOS = [
  { id: "evolucao", rotulo: "Evolução mensal do volume" },
  { id: "materiais", rotulo: "Composição por material" },
  { id: "departamentos", rotulo: "Comparação entre departamentos" },
] as const;

const PERIODOS = [
  { valor: "12", rotulo: "Últimos 12 meses" },
  { valor: "6", rotulo: "Últimos 6 meses" },
  { valor: "3", rotulo: "Último trimestre" },
];

type MetricaId = (typeof METRICAS)[number]["id"];
type GraficoId = (typeof GRAFICOS)[number]["id"];

export default function ReportsPage() {
  const [periodo, setPeriodo] = React.useState("12");
  const [unidade, setUnidade] = React.useState("todas");
  const [metricas, setMetricas] = React.useState<MetricaId[]>([
    "residuo",
    "co2",
    "participacao",
  ]);
  const [graficos, setGraficos] = React.useState<GraficoId[]>([
    "evolucao",
    "materiais",
  ]);
  const [gerado, setGerado] = React.useState(false);
  const [gerando, setGerando] = React.useState(false);
  const [exportando, setExportando] = React.useState(false);

  const relatorioRef = React.useRef<HTMLDivElement>(null);

  const alternar = <T extends string>(
    valor: T,
    lista: T[],
    setLista: React.Dispatch<React.SetStateAction<T[]>>,
  ) =>
    setLista(
      lista.includes(valor) ? lista.filter((item) => item !== valor) : [...lista, valor],
    );

  const gerar = async () => {
    if (metricas.length === 0) {
      toast.error("Selecione ao menos uma métrica");
      return;
    }
    setGerando(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    setGerando(false);
    setGerado(true);
    toast.success("Relatório gerado");
  };

  const exportar = async () => {
    const no = relatorioRef.current;
    if (!no) return;

    setExportando(true);
    try {
      await exportarNoParaPdf(no, {
        nome: `relatorio-esg-ecotech-${new Date().toISOString().slice(0, 10)}`,
      });
      toast.success("PDF exportado", {
        description: "O arquivo foi gerado no seu navegador e baixado.",
      });
    } catch {
      toast.error("Não foi possível gerar o PDF", {
        description: "Tente novamente em alguns instantes.",
      });
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
            Voltar ao construtor
          </Button>
          <Button onClick={exportar} loading={exportando}>
            {!exportando && <FilePdf weight="bold" />}
            Exportar PDF
          </Button>
        </div>

        <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)]">
          <ReportDocument
            ref={relatorioRef}
            periodo={periodo}
            unidade={unidade}
            metricas={metricas}
            graficos={graficos}
          />
        </div>

        <p className="mt-4 text-[12px] leading-relaxed text-[var(--fg-subtle)]">
          O PDF é montado no navegador a partir desta mesma tela. Nenhum dado sai
          do seu dispositivo.
        </p>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Documentos"
        titulo="Gerar Relatório ESG"
        descricao="Monte o relatório escolhendo período, unidade, métricas e gráficos. A pré-visualização é o próprio documento exportado."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          <section>
            <h2 className="font-display text-h4 text-[var(--fg)]">Recorte</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="mb-1.5 block">Período</Label>
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

              <div>
                <Label className="mb-1.5 block">Unidade</Label>
                <Select value={unidade} onValueChange={setUnidade}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas as unidades</SelectItem>
                    {COMPANY.unidades.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-display text-h4 text-[var(--fg)]">Métricas</h2>
            <p className="mt-1 text-[12.5px] text-[var(--fg-muted)]">
              Aparecem no sumário executivo do documento.
            </p>
            <ul className="mt-4 space-y-px overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--border)]">
              {METRICAS.map((metrica) => (
                <li
                  key={metrica.id}
                  className="flex items-center gap-3 bg-[var(--surface)] px-4 py-3"
                >
                  <Checkbox
                    id={`met-${metrica.id}`}
                    checked={metricas.includes(metrica.id)}
                    onCheckedChange={() => alternar(metrica.id, metricas, setMetricas)}
                  />
                  <Label htmlFor={`met-${metrica.id}`} className="flex-1 text-[13.5px] text-[var(--fg)]">
                    {metrica.rotulo}
                  </Label>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-display text-h4 text-[var(--fg)]">Gráficos</h2>
            <ul className="mt-4 space-y-px overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--border)]">
              {GRAFICOS.map((grafico) => (
                <li
                  key={grafico.id}
                  className="flex items-center gap-3 bg-[var(--surface)] px-4 py-3"
                >
                  <Checkbox
                    id={`gra-${grafico.id}`}
                    checked={graficos.includes(grafico.id)}
                    onCheckedChange={() => alternar(grafico.id, graficos, setGraficos)}
                  />
                  <Label htmlFor={`gra-${grafico.id}`} className="flex-1 text-[13.5px] text-[var(--fg)]">
                    {grafico.rotulo}
                  </Label>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Resumo da seleção */}
        <aside className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:self-start">
          <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5">
            <div className="flex items-center gap-2">
              <FileText className="size-4 text-[var(--accent)]" weight="duotone" />
              <h2 className="font-display text-[14px] font-semibold text-[var(--fg)]">
                Relatório ESG
              </h2>
            </div>

            <dl className="mt-4 space-y-3 border-t border-[var(--border)] pt-4">
              {[
                {
                  rotulo: "Período",
                  valor: PERIODOS.find((p) => p.valor === periodo)?.rotulo ?? "",
                },
                {
                  rotulo: "Unidade",
                  valor: unidade === "todas" ? "Todas as unidades" : unidade,
                },
                { rotulo: "Métricas", valor: `${metricas.length} selecionadas` },
                { rotulo: "Gráficos", valor: `${graficos.length} selecionados` },
              ].map((linha) => (
                <div key={linha.rotulo} className="flex items-baseline justify-between gap-3">
                  <dt className="text-[12.5px] text-[var(--fg-muted)]">
                    {linha.rotulo}
                  </dt>
                  <dd className="truncate text-[12.5px] font-medium text-[var(--fg)]">
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
              Documento demonstrativo. Não substitui inventário de emissões
              certificado.
            </p>
          </div>
        </aside>
      </div>
    </PageContainer>
  );
}

/* ------------------------------------------------------------------ */
/* Documento                                                           */
/* ------------------------------------------------------------------ */

interface ReportDocumentProps {
  periodo: string;
  unidade: string;
  metricas: MetricaId[];
  graficos: GraficoId[];
}

const ReportDocument = React.forwardRef<HTMLDivElement, ReportDocumentProps>(
  function ReportDocument({ periodo, unidade, metricas, graficos }, ref) {
    const meses = Number(periodo);
    const serie = COMPANY_MONTHLY.slice(-meses);

    const totalReciclado = serie.reduce((soma, l) => soma + Number(l.reciclado), 0);
    const totalCo2 = serie.reduce((soma, l) => soma + Number(l.co2), 0);
    const totalPontos = serie.reduce((soma, l) => soma + Number(l.pontos), 0);
    const mediaParticipantes = Math.round(
      serie.reduce((soma, l) => soma + Number(l.participantes), 0) / serie.length,
    );

    const valores: Record<MetricaId, { rotulo: string; valor: string; nota: string }> = {
      residuo: {
        rotulo: "Resíduo desviado de aterro",
        valor: `${formatNumber(totalReciclado / 1000, 1)} t`,
        nota: `Meta anual de ${COMPANY.metaAnualToneladas} t`,
      },
      co2: {
        rotulo: "CO2 evitado",
        valor: `${formatNumber(totalCo2 / 1000, 1)} t`,
        nota: "Pelos fatores de cada material",
      },
      participacao: {
        rotulo: "Participação média mensal",
        valor: formatNumber(mediaParticipantes),
        nota: `${formatPercent((mediaParticipantes / COMPANY.colaboradores) * 100)} do quadro`,
      },
      pontos: {
        rotulo: "EcoPontos distribuídos",
        valor: formatNumber(totalPontos),
        nota: "Creditados aos colaboradores",
      },
      orcamento: {
        rotulo: "Orçamento executado",
        valor: formatCurrencyCompact(COMPANY.orcamentoUtilizado),
        nota: `de ${formatCurrencyCompact(COMPANY.orcamentoAnual)} previstos`,
      },
    };

    const dadosEvolucao = serie.map((linha) => ({
      periodo: String(linha.periodo),
      reciclado: Number(linha.reciclado),
    }));

    const dadosMateriais = COMPANY_MATERIAL_SPLIT.map((item) => ({
      material: MATERIAL_BY_ID[item.materialId].nome,
      kg: item.kg,
      cor: MATERIAL_BY_ID[item.materialId].cor,
    }));

    const dadosDepartamentos = [...DEPARTMENTS]
      .sort((a, b) => b.kgReciclados - a.kgReciclados)
      .map((d) => ({ nome: d.nome, kg: d.kgReciclados }));

    return (
      <div ref={ref} className="bg-[var(--surface)] p-8 lg:p-12">
        {/* Cabeçalho */}
        <header className="flex items-start justify-between gap-6 border-b-2 border-[var(--fg)] pb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <LeafMark className="size-7 text-[var(--accent)]" />
              <span className="font-display text-[17px] font-semibold text-[var(--fg)]">
                Eco<span className="text-[var(--accent)]">Rewards</span>
              </span>
            </div>
            <h1 className="mt-6 font-display text-h1 text-[var(--fg)]">
              Relatório ESG
            </h1>
            <p className="mt-2 text-[15px] text-[var(--fg-muted)]">
              {COMPANY.nome} · {unidade === "todas" ? "Todas as unidades" : unidade}
            </p>
          </div>

          <dl className="shrink-0 space-y-2 text-right">
            {[
              { rotulo: "Emitido em", valor: formatDate(new Date().toISOString()) },
              {
                rotulo: "Período",
                valor: `${serie[0].periodo} — ${serie[serie.length - 1].periodo}`,
              },
              { rotulo: "CNPJ", valor: COMPANY.cnpj },
            ].map((linha) => (
              <div key={linha.rotulo}>
                <dt className="text-[10.5px] uppercase tracking-[0.09em] text-[var(--fg-subtle)]">
                  {linha.rotulo}
                </dt>
                <dd className="text-[12.5px] tabular text-[var(--fg)]">
                  {linha.valor}
                </dd>
              </div>
            ))}
          </dl>
        </header>

        {/* Sumário executivo */}
        <section className="mt-10">
          <h2 className="eyebrow">Sumário executivo</h2>
          <dl className="mt-5 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {metricas.map((id) => (
              <div key={id} className="border-t border-[var(--border)] pt-4">
                <dt className="text-[12.5px] text-[var(--fg-muted)]">
                  {valores[id].rotulo}
                </dt>
                <dd className="mt-2 font-display text-[30px] font-semibold leading-none tabular tracking-[-0.03em] text-[var(--fg)]">
                  {valores[id].valor}
                </dd>
                <p className="mt-2 text-[11.5px] text-[var(--fg-subtle)]">
                  {valores[id].nota}
                </p>
              </div>
            ))}
          </dl>
        </section>

        {/* Progresso da meta */}
        <section className="mt-10 border-t border-[var(--border)] pt-8">
          <h2 className="eyebrow">Meta anual</h2>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
            <p className="font-display text-[22px] font-semibold tabular text-[var(--fg)]">
              {formatNumber(COMPANY.toneladasRecicladas, 1)} t
              <span className="ml-2 text-[14px] font-medium text-[var(--fg-muted)]">
                de {COMPANY.metaAnualToneladas} t
              </span>
            </p>
            <Badge tone="accent">
              {Math.round(
                (COMPANY.toneladasRecicladas / COMPANY.metaAnualToneladas) * 100,
              )}
              % concluído
            </Badge>
          </div>
          <div className="mt-3">
            <ProgressBar
              value={COMPANY.toneladasRecicladas}
              max={COMPANY.metaAnualToneladas}
            />
          </div>
        </section>

        {/* Gráficos */}
        {graficos.includes("evolucao") && (
          <section className="mt-10 border-t border-[var(--border)] pt-8">
            <ChartFrame
              titulo="Evolução mensal do volume reciclado"
              series={construirSeries([
                { chave: "reciclado", rotulo: "Resíduo reciclado", unidade: " kg" },
              ])}
              dados={dadosEvolucao}
              chaveEixo="periodo"
              altura={260}
              formatarValor={(valor) => `${formatNumber(valor)} kg`}
            >
              <TrendArea
                dados={dadosEvolucao}
                series={construirSeries([
                  { chave: "reciclado", rotulo: "Resíduo reciclado", unidade: " kg" },
                ])}
                chaveEixo="periodo"
                formatarValor={(valor) => `${formatNumber(valor)} kg`}
                formatarEixoY={(valor) => `${Math.round(valor / 1000)}t`}
              />
            </ChartFrame>
          </section>
        )}

        {graficos.includes("materiais") && (
          <section className="mt-10 border-t border-[var(--border)] pt-8">
            <ChartFrame
              titulo="Composição por material"
              series={[
                { chave: "kg", rotulo: "Reciclado", cor: "var(--series-1)", unidade: " kg" },
              ]}
              dados={dadosMateriais}
              chaveEixo="material"
              altura={240}
              formatarValor={(valor) => `${formatNumber(valor)} kg`}
            >
              <Donut
                dados={dadosMateriais}
                series={[
                  { chave: "kg", rotulo: "Reciclado", cor: "var(--series-1)", unidade: " kg" },
                ]}
                chaveEixo="material"
                formatarValor={(valor) => `${formatNumber(valor)} kg`}
              />
            </ChartFrame>
          </section>
        )}

        {graficos.includes("departamentos") && (
          <section className="mt-10 border-t border-[var(--border)] pt-8">
            <ChartFrame
              titulo="Volume por departamento"
              series={[
                { chave: "kg", rotulo: "Reciclado", cor: "var(--series-1)", unidade: " kg" },
              ]}
              dados={dadosDepartamentos}
              chaveEixo="nome"
              altura={260}
              formatarValor={(valor) => `${formatNumber(valor)} kg`}
            >
              <Columns
                dados={dadosDepartamentos}
                series={[
                  { chave: "kg", rotulo: "Reciclado", cor: "var(--series-1)", unidade: " kg" },
                ]}
                chaveEixo="nome"
                formatarValor={(valor) => `${formatNumber(valor)} kg`}
                formatarEixoY={(valor) => `${Math.round(valor / 1000)}t`}
              />
            </ChartFrame>
          </section>
        )}

        {/* Indicadores */}
        <section className="mt-10 border-t border-[var(--border)] pt-8">
          <h2 className="eyebrow">Indicadores ESG</h2>
          <div className="mt-4">
            <Table>
              <thead>
                <tr>
                  <Th>Indicador</Th>
                  <Th className="hidden sm:table-cell">Pilar</Th>
                  <Th numeric>Realizado</Th>
                  <Th numeric>Meta</Th>
                  <Th numeric>Variação</Th>
                </tr>
              </thead>
              <tbody>
                {ESG_INDICATORS.map((indicador) => (
                  <Tr key={indicador.id}>
                    <Td className="text-[13px]">{indicador.nome}</Td>
                    <Td className="hidden text-[12.5px] capitalize text-[var(--fg-muted)] sm:table-cell">
                      {indicador.pilar}
                    </Td>
                    <Td numeric className="text-[13px]">
                      {formatNumber(indicador.valor, 1)} {indicador.unidade}
                    </Td>
                    <Td numeric className="text-[13px] text-[var(--fg-muted)]">
                      {formatNumber(indicador.meta, 1)} {indicador.unidade}
                    </Td>
                    <Td numeric className="text-[13px]">
                      {indicador.variacao > 0 ? "+" : ""}
                      {formatNumber(indicador.variacao, 1)}%
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          </div>
        </section>

        <footer className="mt-10 border-t border-[var(--border)] pt-6">
          <p className="text-[11.5px] leading-relaxed text-[var(--fg-subtle)]">
            Documento gerado pela plataforma EcoRewards em{" "}
            {formatDate(new Date().toISOString(), "longo")}. Todos os números são
            demonstrativos e não substituem inventário de emissões certificado por
            terceira parte. A metodologia de cálculo de CO2 usa fatores médios de
            referência por tipo de material.
          </p>
        </footer>
      </div>
    );
  },
);
