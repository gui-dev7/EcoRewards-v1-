"use client";

import * as React from "react";
import { MagnifyingGlass, X } from "@phosphor-icons/react";
import { PageContainer, PageHeader } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/controls";
import { ChartFrame, construirSeries } from "@/components/charts/chart-kit";
import { Columns, Donut, TrendArea, TrendLines } from "@/components/charts/charts";
import { Delta } from "@/components/ui/data-display";
import { EmptyState } from "@/components/ui/feedback";
import {
  COMPANY,
  COMPANY_MATERIAL_SPLIT,
  COMPANY_MONTHLY,
  DEPARTMENTS,
  EMPLOYEES,
} from "@/mocks/company";
import { MATERIAL_BY_ID } from "@/mocks/materials";
import { useCampaignsStore } from "@/stores";
import { useHydrated } from "@/hooks/use-hydrated";
import { formatNumber } from "@/lib/format";

const PERIODOS = [
  { valor: "3", rotulo: "Últimos 3 meses" },
  { valor: "6", rotulo: "Últimos 6 meses" },
  { valor: "12", rotulo: "Últimos 12 meses" },
];

export default function CompanyAnalyticsPage() {
  const hydrated = useHydrated();
  const campanhas = useCampaignsStore((s) => s.itens);

  const [periodo, setPeriodo] = React.useState("12");
  const [unidade, setUnidade] = React.useState("todas");
  const [departamento, setDepartamento] = React.useState("todos");
  const [campanha, setCampanha] = React.useState("todas");
  const [busca, setBusca] = React.useState("");

  /**
   * Os filtros compõem um fator determinístico aplicado à série mensal.
   * A escala muda; o formato da curva permanece — é o mesmo programa
   * observado por um recorte menor, não outro conjunto de dados.
   */
  const fator = React.useMemo(() => {
    let resultado = 1;

    if (unidade !== "todas") {
      const daUnidade = DEPARTMENTS.filter((d) => d.unidade === unidade);
      const colaboradores = daUnidade.reduce((soma, d) => soma + d.colaboradores, 0);
      resultado *= colaboradores / COMPANY.colaboradores;
    }

    if (departamento !== "todos") {
      const alvo = DEPARTMENTS.find((d) => d.id === departamento);
      if (alvo) resultado *= alvo.colaboradores / COMPANY.colaboradores;
    }

    if (campanha !== "todas") {
      const alvo = campanhas.find((c) => c.id === campanha);
      if (alvo) resultado *= alvo.participantes / COMPANY.colaboradores;
    }

    return resultado;
  }, [unidade, departamento, campanha, campanhas]);

  const serieMensal = React.useMemo(() => {
    const meses = Number(periodo);
    return COMPANY_MONTHLY.slice(-meses).map((linha) => ({
      periodo: String(linha.periodo),
      reciclado: Number((Number(linha.reciclado) * fator).toFixed(0)),
      co2: Number((Number(linha.co2) * fator).toFixed(0)),
      participantes: Math.round(Number(linha.participantes) * fator),
      pontos: Math.round(Number(linha.pontos) * fator),
    }));
  }, [periodo, fator]);

  const totalReciclado = serieMensal.reduce((soma, linha) => soma + linha.reciclado, 0);
  const totalCo2 = serieMensal.reduce((soma, linha) => soma + linha.co2, 0);
  const mediaParticipantes = Math.round(
    serieMensal.reduce((soma, linha) => soma + linha.participantes, 0) /
      Math.max(serieMensal.length, 1),
  );

  const seriesVolume = React.useMemo(
    () => construirSeries([{ chave: "reciclado", rotulo: "Resíduo reciclado", unidade: " kg" }]),
    [],
  );

  const seriesParticipacao = React.useMemo(
    () =>
      construirSeries([
        { chave: "participantes", rotulo: "Participantes no mês", cor: "var(--series-2)" },
      ]),
    [],
  );

  const seriesIndexada = React.useMemo(
    () =>
      construirSeries([
        { chave: "recicladoIdx", rotulo: "Resíduo (base 100)" },
        { chave: "co2Idx", rotulo: "CO2 evitado (base 100)", cor: "var(--series-3)" },
        { chave: "participantesIdx", rotulo: "Participação (base 100)", cor: "var(--series-2)" },
      ]),
    [],
  );

  /**
   * Três medidas de escalas muito diferentes na mesma leitura.
   * Em vez de um segundo eixo — que distorce a comparação — todas
   * são indexadas ao primeiro mês do recorte.
   */
  const serieIndexada = React.useMemo(() => {
    const base = serieMensal[0];
    if (!base) return [];
    return serieMensal.map((linha) => ({
      periodo: linha.periodo,
      recicladoIdx: Number(((linha.reciclado / base.reciclado) * 100).toFixed(1)),
      co2Idx: Number(((linha.co2 / base.co2) * 100).toFixed(1)),
      participantesIdx: Number(
        ((linha.participantes / base.participantes) * 100).toFixed(1),
      ),
    }));
  }, [serieMensal]);

  const materiais = React.useMemo(
    () =>
      COMPANY_MATERIAL_SPLIT.map((item) => ({
        material: MATERIAL_BY_ID[item.materialId].nome,
        kg: Math.round(item.kg * fator),
        cor: MATERIAL_BY_ID[item.materialId].cor,
      })),
    [fator],
  );

  const seriesMaterial = [
    { chave: "kg", rotulo: "Reciclado", cor: "var(--series-1)", unidade: " kg" },
  ];

  const resultadosBusca = React.useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (termo.length < 2) return null;

    return {
      departamentos: DEPARTMENTS.filter((d) =>
        `${d.nome} ${d.unidade}`.toLowerCase().includes(termo),
      ),
      colaboradores: EMPLOYEES.filter((e) =>
        `${e.nome} ${e.cargo} ${e.unidade}`.toLowerCase().includes(termo),
      ).slice(0, 6),
      campanhas: campanhas.filter((c) =>
        `${c.nome} ${c.unidade}`.toLowerCase().includes(termo),
      ),
    };
  }, [busca, campanhas]);

  const limparFiltros = () => {
    setPeriodo("12");
    setUnidade("todas");
    setDepartamento("todos");
    setCampanha("todas");
  };

  const temFiltro =
    periodo !== "12" || unidade !== "todas" || departamento !== "todos" || campanha !== "todas";

  return (
    <PageContainer wide>
      <PageHeader
        eyebrow="Análise"
        titulo="Analytics"
        descricao="Recorte o programa por período, unidade, departamento e campanha. Os gráficos recalculam sobre o mesmo conjunto de dados."
      />

      {/* Busca global do ambiente */}
      <div className="relative mb-5">
        <MagnifyingGlass
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--fg-subtle)]"
          weight="bold"
        />
        <label htmlFor="busca-empresa" className="sr-only">
          Buscar departamentos, colaboradores e campanhas
        </label>
        <Input
          id="busca-empresa"
          value={busca}
          onChange={(evento) => setBusca(evento.target.value)}
          placeholder="Buscar departamento, colaborador ou campanha…"
          className="pl-9"
        />

        {resultadosBusca && (
          <div className="absolute inset-x-0 top-full z-20 mt-2 max-h-[380px] overflow-y-auto rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-2 shadow-[var(--shadow-lg)]">
            {resultadosBusca.departamentos.length === 0 &&
            resultadosBusca.colaboradores.length === 0 &&
            resultadosBusca.campanhas.length === 0 ? (
              <p className="px-3 py-6 text-center text-[13px] text-[var(--fg-muted)]">
                Nada encontrado para “{busca}”.
              </p>
            ) : (
              <>
                <ResultadoGrupo
                  titulo="Departamentos"
                  itens={resultadosBusca.departamentos.map((d) => ({
                    id: d.id,
                    principal: d.nome,
                    secundario: `${d.unidade} · ${d.colaboradores} pessoas`,
                    acao: () => {
                      setDepartamento(d.id);
                      setBusca("");
                    },
                  }))}
                />
                <ResultadoGrupo
                  titulo="Colaboradores"
                  itens={resultadosBusca.colaboradores.map((e) => ({
                    id: e.id,
                    principal: e.nome,
                    secundario: `${e.cargo} · ${formatNumber(e.pontos)} pts`,
                  }))}
                />
                <ResultadoGrupo
                  titulo="Campanhas"
                  itens={resultadosBusca.campanhas.map((c) => ({
                    id: c.id,
                    principal: c.nome,
                    secundario: `${c.unidade} · ${formatNumber(c.participantes)} participantes`,
                    acao: () => {
                      setCampanha(c.id);
                      setBusca("");
                    },
                  }))}
                />
              </>
            )}
          </div>
        )}
      </div>

      {/* Filtros numa única linha */}
      <div className="flex flex-wrap items-center gap-2.5 border-b border-[var(--border)] pb-5">
        <FiltroSelect
          rotulo="Período"
          valor={periodo}
          onChange={setPeriodo}
          opcoes={PERIODOS.map((p) => ({ valor: p.valor, rotulo: p.rotulo }))}
        />
        <FiltroSelect
          rotulo="Unidade"
          valor={unidade}
          onChange={setUnidade}
          opcoes={[
            { valor: "todas", rotulo: "Todas as unidades" },
            ...COMPANY.unidades.map((u) => ({ valor: u, rotulo: u })),
          ]}
        />
        <FiltroSelect
          rotulo="Departamento"
          valor={departamento}
          onChange={setDepartamento}
          opcoes={[
            { valor: "todos", rotulo: "Todos os departamentos" },
            ...DEPARTMENTS.map((d) => ({ valor: d.id, rotulo: d.nome })),
          ]}
        />
        <FiltroSelect
          rotulo="Campanha"
          valor={campanha}
          onChange={setCampanha}
          opcoes={[
            { valor: "todas", rotulo: "Todas as campanhas" },
            ...(hydrated ? campanhas : []).map((c) => ({ valor: c.id, rotulo: c.nome })),
          ]}
        />

        {temFiltro && (
          <Button variant="ghost" size="sm" onClick={limparFiltros}>
            <X weight="bold" />
            Limpar
          </Button>
        )}
      </div>

      {serieMensal.length === 0 ? (
        <EmptyState
          className="mt-8 rounded-[var(--radius-lg)] border border-[var(--border)]"
          title="Sem dados para este recorte."
          description="Amplie o período ou remova um dos filtros ativos."
          action={{ label: "Limpar filtros", onClick: limparFiltros }}
        />
      ) : (
        <>
          {/* Totais do recorte */}
          <dl className="mt-6 grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--border)] sm:grid-cols-3">
            {[
              {
                rotulo: "Resíduo reciclado no recorte",
                valor: `${formatNumber(totalReciclado / 1000, 1)} t`,
                delta: 12.4,
              },
              {
                rotulo: "CO2 evitado no recorte",
                valor: `${formatNumber(totalCo2 / 1000, 1)} t`,
                delta: 11.8,
              },
              {
                rotulo: "Participação média mensal",
                valor: formatNumber(mediaParticipantes),
                delta: 6.2,
              },
            ].map((item) => (
              <div key={item.rotulo} className="bg-[var(--surface)] px-5 py-4">
                <dt className="text-[12.5px] font-medium text-[var(--fg-muted)]">
                  {item.rotulo}
                </dt>
                <dd className="mt-2 font-display text-[26px] font-semibold leading-none tabular tracking-[-0.03em] text-[var(--fg)]">
                  {item.valor}
                </dd>
                <div className="mt-3">
                  <Delta value={item.delta} showSuffix />
                </div>
              </div>
            ))}
          </dl>

          <div className="mt-6 space-y-6">
            <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
              <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5 lg:p-6">
                <ChartFrame
                  titulo="Como o volume reciclado evoluiu?"
                  descricao="Total mensal em quilos, dentro do recorte selecionado."
                  series={seriesVolume}
                  dados={serieMensal}
                  chaveEixo="periodo"
                  altura={300}
                  formatarValor={(valor) => `${formatNumber(valor)} kg`}
                >
                  <TrendArea
                    dados={serieMensal}
                    series={seriesVolume}
                    chaveEixo="periodo"
                    formatarValor={(valor) => `${formatNumber(valor)} kg`}
                    formatarEixoY={(valor) => `${Math.round(valor / 1000)}t`}
                  />
                </ChartFrame>
              </div>

              <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5">
                <ChartFrame
                  titulo="Que materiais compõem o volume?"
                  descricao="Distribuição no recorte atual."
                  series={seriesMaterial}
                  dados={materiais}
                  chaveEixo="material"
                  altura={250}
                  formatarValor={(valor) => `${formatNumber(valor)} kg`}
                >
                  <Donut
                    dados={materiais}
                    series={seriesMaterial}
                    chaveEixo="material"
                    formatarValor={(valor) => `${formatNumber(valor)} kg`}
                    centro={
                      <>
                        <span className="font-display text-[22px] font-semibold leading-none tabular tracking-[-0.03em] text-[var(--fg)]">
                          {formatNumber(totalReciclado / 1000, 1)} t
                        </span>
                        <span className="mt-1 text-[11px] text-[var(--fg-subtle)]">
                          no recorte
                        </span>
                      </>
                    }
                  />
                </ChartFrame>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5">
                <ChartFrame
                  titulo="Quantas pessoas participaram por mês?"
                  descricao="Colaboradores com ao menos um descarte no mês."
                  series={seriesParticipacao}
                  dados={serieMensal}
                  chaveEixo="periodo"
                  altura={260}
                  formatarValor={(valor) => formatNumber(valor)}
                >
                  <Columns
                    dados={serieMensal}
                    series={seriesParticipacao}
                    chaveEixo="periodo"
                    formatarValor={(valor) => formatNumber(valor)}
                  />
                </ChartFrame>
              </div>

              <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5">
                <ChartFrame
                  titulo="Volume, emissão e participação crescem no mesmo passo?"
                  descricao="Três medidas de escalas diferentes, indexadas ao primeiro mês do recorte."
                  series={seriesIndexada}
                  dados={serieIndexada}
                  chaveEixo="periodo"
                  altura={260}
                  formatarValor={(valor) => formatNumber(valor, 1)}
                  rodape="Indexar a uma base comum evita o segundo eixo vertical, que faria duas escalas distintas parecerem comparáveis."
                >
                  <TrendLines
                    dados={serieIndexada}
                    series={seriesIndexada}
                    chaveEixo="periodo"
                    formatarValor={(valor) => formatNumber(valor, 1)}
                  />
                </ChartFrame>
              </div>
            </div>

            {/* Comparação entre departamentos */}
            <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5 lg:p-6">
              <ChartFrame
                titulo="Quanto cada departamento reciclou?"
                descricao="Volume anual acumulado por área, com a adesão correspondente."
                series={[
                  { chave: "kg", rotulo: "Reciclado", cor: "var(--series-1)", unidade: " kg" },
                ]}
                dados={DEPARTMENTS.map((d) => ({
                  nome: d.nome,
                  kg: d.kgReciclados,
                  adesao: d.adesaoPercentual,
                }))}
                chaveEixo="nome"
                altura={300}
                formatarValor={(valor) => formatNumber(valor)}
              >
                <Columns
                  dados={DEPARTMENTS.map((d) => ({
                    nome: d.nome,
                    kg: d.kgReciclados,
                  }))}
                  series={[
                    { chave: "kg", rotulo: "Reciclado", cor: "var(--series-1)", unidade: " kg" },
                  ]}
                  chaveEixo="nome"
                  formatarValor={(valor) => `${formatNumber(valor)} kg`}
                  formatarEixoY={(valor) => `${Math.round(valor / 1000)}t`}
                />
              </ChartFrame>
            </div>
          </div>
        </>
      )}
    </PageContainer>
  );
}

function FiltroSelect({
  rotulo,
  valor,
  onChange,
  opcoes,
}: {
  rotulo: string;
  valor: string;
  onChange: (valor: string) => void;
  opcoes: { valor: string; rotulo: string }[];
}) {
  return (
    <label className="flex items-center gap-2">
      <span className="text-[12px] font-medium text-[var(--fg-subtle)]">{rotulo}</span>
      <Select value={valor} onValueChange={onChange}>
        <SelectTrigger className="h-9 w-auto min-w-[168px] text-[13px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {opcoes.map((opcao) => (
            <SelectItem key={opcao.valor} value={opcao.valor}>
              {opcao.rotulo}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </label>
  );
}

function ResultadoGrupo({
  titulo,
  itens,
}: {
  titulo: string;
  itens: { id: string; principal: string; secundario: string; acao?: () => void }[];
}) {
  if (itens.length === 0) return null;

  return (
    <div className="mb-1 last:mb-0">
      <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.09em] text-[var(--fg-subtle)]">
        {titulo}
      </p>
      <ul>
        {itens.map((item) => (
          <li key={item.id}>
            {item.acao ? (
              <button
                type="button"
                onClick={item.acao}
                className="flex w-full items-center justify-between gap-3 rounded-[var(--radius-xs)] px-3 py-2 text-left transition-colors hover:bg-[var(--surface-2)]"
              >
                <span className="truncate text-[13px] text-[var(--fg)]">
                  {item.principal}
                </span>
                <span className="shrink-0 text-[11.5px] text-[var(--fg-subtle)]">
                  {item.secundario}
                </span>
              </button>
            ) : (
              <div className="flex items-center justify-between gap-3 px-3 py-2">
                <span className="truncate text-[13px] text-[var(--fg)]">
                  {item.principal}
                </span>
                <span className="shrink-0 text-[11.5px] text-[var(--fg-subtle)]">
                  {item.secundario}
                </span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
