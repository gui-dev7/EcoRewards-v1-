"use client";

import * as React from "react";
import { Table as TableIcon, ChartBar } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Table, Td, Th, Tr } from "@/components/ui/data-display";

/**
 * Paleta categórica do EcoRewards.
 * Validada nos dois modos (faixa de luminosidade, piso de croma, separação
 * para daltonismo e contraste com a superfície). A ordem é fixa: a série 4
 * nunca vira a série 1 porque um filtro removeu as anteriores.
 */
export const SERIES = [
  "var(--series-1)",
  "var(--series-2)",
  "var(--series-3)",
  "var(--series-4)",
  "var(--series-5)",
  "var(--series-6)",
] as const;

/** Rampa sequencial: uma única matiz, do claro ao escuro. */
export const SEQUENTIAL = [
  "var(--seq-1)",
  "var(--seq-2)",
  "var(--seq-3)",
  "var(--seq-4)",
  "var(--seq-5)",
  "var(--seq-6)",
] as const;

/** Divergente: dois polos e um cinza neutro no meio. */
export const DIVERGING = [
  "var(--div-neg-2)",
  "var(--div-neg-1)",
  "var(--div-mid)",
  "var(--div-pos-1)",
  "var(--div-pos-2)",
] as const;

export const AXIS_PROPS = {
  tick: { fill: "var(--fg-subtle)", fontSize: 11 },
  tickLine: false,
  axisLine: false,
  tickMargin: 10,
} as const;

export const GRID_PROPS = {
  stroke: "var(--grid)",
  strokeDasharray: "0",
  vertical: false,
} as const;

export interface SerieConfig {
  chave: string;
  rotulo: string;
  cor: string;
  /** Sufixo aplicado ao valor no tooltip e na tabela (ex.: " kg"). */
  unidade?: string;
}

/* ------------------------------------------------------------------ */
/* Tooltip                                                             */
/* ------------------------------------------------------------------ */

interface TooltipPayloadItem {
  name?: string;
  dataKey?: string | number;
  value?: number | string;
  color?: string;
  payload?: Record<string, unknown>;
}

/**
 * Tooltip único para todos os gráficos. O texto usa tokens de tinta;
 * a cor da série aparece apenas no marcador ao lado do rótulo.
 */
export function ChartTooltip({
  active,
  payload,
  label,
  series,
  formatarValor,
  totalLabel,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string | number;
  series?: SerieConfig[];
  formatarValor?: (valor: number, chave: string) => string;
  totalLabel?: string;
}) {
  if (!active || !payload?.length) return null;

  const configPorChave = new Map((series ?? []).map((s) => [s.chave, s]));
  const total = payload.reduce(
    (soma, item) => soma + (typeof item.value === "number" ? item.value : 0),
    0,
  );

  return (
    <div className="pointer-events-none min-w-[168px] rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-3 shadow-[var(--shadow-lg)]">
      {label !== undefined && (
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--fg-subtle)]">
          {label}
        </p>
      )}
      <ul className="space-y-1.5">
        {payload.map((item, index) => {
          const chave = String(item.dataKey ?? item.name ?? index);
          const config = configPorChave.get(chave);
          const valor = typeof item.value === "number" ? item.value : 0;
          return (
            <li key={chave} className="flex items-center gap-2.5 text-[12.5px]">
              <span
                className="size-2 shrink-0 rounded-[2px]"
                style={{ background: config?.cor ?? item.color }}
                aria-hidden
              />
              <span className="flex-1 text-[var(--fg-muted)]">
                {config?.rotulo ?? item.name ?? chave}
              </span>
              <span className="font-medium tabular text-[var(--fg)]">
                {formatarValor
                  ? formatarValor(valor, chave)
                  : valor.toLocaleString("pt-BR")}
                {config?.unidade ?? ""}
              </span>
            </li>
          );
        })}
      </ul>
      {totalLabel && payload.length > 1 && (
        <div className="mt-2 flex items-center justify-between border-t border-[var(--border)] pt-2 text-[12.5px]">
          <span className="text-[var(--fg-muted)]">{totalLabel}</span>
          <span className="font-semibold tabular text-[var(--fg)]">
            {formatarValor ? formatarValor(total, "total") : total.toLocaleString("pt-BR")}
          </span>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Legenda                                                             */
/* ------------------------------------------------------------------ */

export function ChartLegend({
  series,
  ativa,
  onToggle,
  className,
}: {
  series: SerieConfig[];
  ativa?: string[];
  onToggle?: (chave: string) => void;
  className?: string;
}) {
  if (series.length < 2) return null;

  return (
    <ul className={cn("flex flex-wrap items-center gap-x-4 gap-y-1.5", className)}>
      {series.map((serie) => {
        const visivel = !ativa || ativa.includes(serie.chave);
        const conteudo = (
          <>
            <span
              className="size-2 shrink-0 rounded-[2px]"
              style={{ background: serie.cor, opacity: visivel ? 1 : 0.3 }}
              aria-hidden
            />
            <span className={cn(!visivel && "line-through opacity-50")}>
              {serie.rotulo}
            </span>
          </>
        );

        return (
          <li key={serie.chave}>
            {onToggle ? (
              <button
                type="button"
                onClick={() => onToggle(serie.chave)}
                aria-pressed={visivel}
                className="flex items-center gap-1.5 text-[12px] text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)]"
              >
                {conteudo}
              </button>
            ) : (
              <span className="flex items-center gap-1.5 text-[12px] text-[var(--fg-muted)]">
                {conteudo}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* Moldura                                                             */
/* ------------------------------------------------------------------ */

type LinhaDados = Record<string, string | number>;

/**
 * Moldura de um gráfico: título, legenda, controles e alternância para
 * tabela. A visão em tabela não é enfeite — é o caminho de leitura para
 * quem não distingue as cores e para quem precisa do número exato.
 */
export function ChartFrame({
  titulo,
  descricao,
  series,
  dados,
  chaveEixo,
  acoes,
  altura = 300,
  children,
  className,
  formatarValor,
  rodape,
}: {
  titulo?: string;
  descricao?: string;
  series: SerieConfig[];
  dados: LinhaDados[];
  chaveEixo: string;
  acoes?: React.ReactNode;
  altura?: number;
  children: React.ReactNode;
  className?: string;
  formatarValor?: (valor: number, chave: string) => string;
  rodape?: React.ReactNode;
}) {
  const [modo, setModo] = React.useState<"grafico" | "tabela">("grafico");
  const tituloId = React.useId();

  return (
    <figure className={cn("m-0", className)}>
      {(titulo || acoes) && (
        <figcaption className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            {titulo && (
              <h3
                id={tituloId}
                className="font-display text-[14.5px] font-semibold tracking-[-0.01em] text-[var(--fg)]"
              >
                {titulo}
              </h3>
            )}
            {descricao && (
              <p className="mt-1 text-[12.5px] leading-relaxed text-[var(--fg-muted)]">
                {descricao}
              </p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {acoes}
            <button
              type="button"
              onClick={() => setModo(modo === "grafico" ? "tabela" : "grafico")}
              className="flex items-center gap-1.5 rounded-[var(--radius-xs)] border border-[var(--border)] px-2 py-1 text-[11.5px] text-[var(--fg-muted)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--fg)]"
              aria-label={
                modo === "grafico" ? "Ver dados em tabela" : "Voltar ao gráfico"
              }
            >
              {modo === "grafico" ? (
                <>
                  <TableIcon className="size-3.5" weight="bold" /> Tabela
                </>
              ) : (
                <>
                  <ChartBar className="size-3.5" weight="bold" /> Gráfico
                </>
              )}
            </button>
          </div>
        </figcaption>
      )}

      {series.length >= 2 && modo === "grafico" && (
        <ChartLegend series={series} className="mb-3" />
      )}

      {modo === "grafico" ? (
        <div style={{ height: altura }} aria-labelledby={titulo ? tituloId : undefined}>
          {children}
        </div>
      ) : (
        <div
          className="max-h-[360px] overflow-auto rounded-[var(--radius-md)] border border-[var(--border)]"
          style={{ minHeight: Math.min(altura, 240) }}
        >
          <Table>
            <thead className="sticky top-0 bg-[var(--surface)]">
              <tr>
                <Th>{chaveEixo}</Th>
                {series.map((serie) => (
                  <Th key={serie.chave} numeric>
                    {serie.rotulo}
                  </Th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dados.map((linha, index) => (
                <Tr key={index}>
                  <Td>{String(linha[chaveEixo] ?? "—")}</Td>
                  {series.map((serie) => {
                    const bruto = linha[serie.chave];
                    const valor = typeof bruto === "number" ? bruto : 0;
                    return (
                      <Td key={serie.chave} numeric>
                        {formatarValor
                          ? formatarValor(valor, serie.chave)
                          : valor.toLocaleString("pt-BR")}
                        {serie.unidade ?? ""}
                      </Td>
                    );
                  })}
                </Tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {rodape && (
        <p className="mt-3 text-[11.5px] leading-relaxed text-[var(--fg-subtle)]">
          {rodape}
        </p>
      )}
    </figure>
  );
}

/** Constrói a configuração de séries atribuindo cores na ordem fixa. */
export function construirSeries(
  entradas: { chave: string; rotulo: string; unidade?: string; cor?: string }[],
): SerieConfig[] {
  return entradas.map((entrada, index) => ({
    ...entrada,
    cor: entrada.cor ?? SERIES[index % SERIES.length],
  }));
}
