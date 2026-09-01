"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AXIS_PROPS,
  ChartTooltip,
  GRID_PROPS,
  type SerieConfig,
} from "./chart-kit";

type Linha = Record<string, string | number>;

interface BaseProps {
  dados: Linha[];
  series: SerieConfig[];
  chaveEixo: string;
  formatarValor?: (valor: number, chave: string) => string;
  formatarEixoY?: (valor: number) => string;
  totalLabel?: string;
}

const tooltipCursorLinha = {
  stroke: "var(--axis)",
  strokeWidth: 1,
  strokeDasharray: "3 3",
};

const tooltipCursorBarra = { fill: "var(--surface-2)", opacity: 0.6 };

/* ------------------------------------------------------------------ */
/* Área — evolução de uma ou duas grandezas ao longo do tempo          */
/* ------------------------------------------------------------------ */

export function TrendArea({
  dados,
  series,
  chaveEixo,
  formatarValor,
  formatarEixoY,
  empilhado,
}: BaseProps & { empilhado?: boolean }) {
  const id = React.useId();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={dados} margin={{ top: 6, right: 8, bottom: 0, left: -12 }}>
        <defs>
          {series.map((serie, index) => (
            <linearGradient
              key={serie.chave}
              id={`${id}-${index}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor={serie.cor} stopOpacity={0.22} />
              <stop offset="100%" stopColor={serie.cor} stopOpacity={0.02} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid {...GRID_PROPS} />
        <XAxis dataKey={chaveEixo} {...AXIS_PROPS} />
        <YAxis {...AXIS_PROPS} width={56} tickFormatter={formatarEixoY} />
        <Tooltip
          cursor={tooltipCursorLinha}
          content={
            <ChartTooltip series={series} formatarValor={formatarValor} />
          }
        />
        {series.map((serie, index) => (
          <Area
            key={serie.chave}
            type="monotone"
            dataKey={serie.chave}
            name={serie.rotulo}
            stroke={serie.cor}
            strokeWidth={2}
            fill={`url(#${id}-${index})`}
            stackId={empilhado ? "total" : undefined}
            dot={false}
            activeDot={{
              r: 4.5,
              strokeWidth: 2,
              stroke: "var(--surface)",
              fill: serie.cor,
            }}
            animationDuration={900}
            animationEasing="ease-out"
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}

/* ------------------------------------------------------------------ */
/* Linhas — comparação entre séries de mesma unidade                   */
/* ------------------------------------------------------------------ */

export function TrendLines({
  dados,
  series,
  chaveEixo,
  formatarValor,
  formatarEixoY,
}: BaseProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={dados} margin={{ top: 6, right: 8, bottom: 0, left: -12 }}>
        <CartesianGrid {...GRID_PROPS} />
        <XAxis dataKey={chaveEixo} {...AXIS_PROPS} />
        <YAxis {...AXIS_PROPS} width={56} tickFormatter={formatarEixoY} />
        <Tooltip
          cursor={tooltipCursorLinha}
          content={<ChartTooltip series={series} formatarValor={formatarValor} />}
        />
        {series.map((serie) => (
          <Line
            key={serie.chave}
            type="monotone"
            dataKey={serie.chave}
            name={serie.rotulo}
            stroke={serie.cor}
            strokeWidth={2}
            dot={false}
            activeDot={{
              r: 4.5,
              strokeWidth: 2,
              stroke: "var(--surface)",
              fill: serie.cor,
            }}
            animationDuration={900}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

/* ------------------------------------------------------------------ */
/* Colunas — magnitude por categoria                                   */
/* ------------------------------------------------------------------ */

export function Columns({
  dados,
  series,
  chaveEixo,
  formatarValor,
  formatarEixoY,
  empilhado,
  totalLabel,
  destaque,
}: BaseProps & { empilhado?: boolean; destaque?: string }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={dados}
        margin={{ top: 6, right: 8, bottom: 0, left: -12 }}
        barCategoryGap="26%"
      >
        <CartesianGrid {...GRID_PROPS} />
        <XAxis dataKey={chaveEixo} {...AXIS_PROPS} />
        <YAxis {...AXIS_PROPS} width={56} tickFormatter={formatarEixoY} />
        <Tooltip
          cursor={tooltipCursorBarra}
          content={
            <ChartTooltip
              series={series}
              formatarValor={formatarValor}
              totalLabel={empilhado ? totalLabel : undefined}
            />
          }
        />
        {series.map((serie, index) => {
          const ultimaSerie = index === series.length - 1;
          return (
            <Bar
              key={serie.chave}
              dataKey={serie.chave}
              name={serie.rotulo}
              stackId={empilhado ? "total" : undefined}
              fill={serie.cor}
              /* Vão de 2px entre segmentos empilhados e barras vizinhas. */
              stroke="var(--surface)"
              strokeWidth={empilhado ? 2 : 0}
              radius={
                empilhado
                  ? ultimaSerie
                    ? [4, 4, 0, 0]
                    : [0, 0, 0, 0]
                  : [4, 4, 0, 0]
              }
              animationDuration={800}
            >
              {!empilhado && destaque
                ? dados.map((linha) => (
                    <Cell
                      key={String(linha[chaveEixo])}
                      fill={serie.cor}
                      fillOpacity={linha[chaveEixo] === destaque ? 1 : 0.32}
                    />
                  ))
                : null}
            </Bar>
          );
        })}
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ------------------------------------------------------------------ */
/* Barras horizontais — ranking por categoria com rótulos longos       */
/* ------------------------------------------------------------------ */

export function HorizontalBars({
  dados,
  series,
  chaveEixo,
  formatarValor,
  larguraRotulo = 132,
}: BaseProps & { larguraRotulo?: number }) {
  const serie = series[0];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={dados}
        layout="vertical"
        margin={{ top: 0, right: 16, bottom: 0, left: 0 }}
        barCategoryGap="24%"
      >
        <CartesianGrid {...GRID_PROPS} vertical horizontal={false} />
        <XAxis type="number" {...AXIS_PROPS} hide />
        <YAxis
          type="category"
          dataKey={chaveEixo}
          {...AXIS_PROPS}
          width={larguraRotulo}
          tick={{ fill: "var(--fg-muted)", fontSize: 12 }}
        />
        <Tooltip
          cursor={tooltipCursorBarra}
          content={<ChartTooltip series={series} formatarValor={formatarValor} />}
        />
        <Bar
          dataKey={serie.chave}
          name={serie.rotulo}
          fill={serie.cor}
          radius={[0, 4, 4, 0]}
          animationDuration={800}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ------------------------------------------------------------------ */
/* Donut — composição de um total                                      */
/* ------------------------------------------------------------------ */

export function Donut({
  dados,
  series,
  chaveEixo,
  formatarValor,
  centro,
  raioInterno = 62,
}: BaseProps & { centro?: React.ReactNode; raioInterno?: number }) {
  const serie = series[0];
  const cores = dados.map(
    (linha, index) =>
      (linha.cor as string) ?? `var(--series-${(index % 6) + 1})`,
  );

  return (
    <div className="relative h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip
            content={<ChartTooltip series={series} formatarValor={formatarValor} />}
          />
          <Pie
            data={dados}
            dataKey={serie.chave}
            nameKey={chaveEixo}
            innerRadius={raioInterno}
            outerRadius="88%"
            paddingAngle={2}
            stroke="var(--surface)"
            strokeWidth={2}
            animationDuration={800}
          >
            {dados.map((linha, index) => (
              <Cell key={String(linha[chaveEixo])} fill={cores[index]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      {centro && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          {centro}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Radial — progresso de uma meta única                                */
/* ------------------------------------------------------------------ */

export function RadialProgress({
  valor,
  maximo = 100,
  cor = "var(--accent)",
  centro,
  espessura = 14,
}: {
  valor: number;
  maximo?: number;
  cor?: string;
  centro?: React.ReactNode;
  espessura?: number;
}) {
  const percentual = Math.min(Math.max((valor / maximo) * 100, 0), 100);

  return (
    <div className="relative h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          data={[{ nome: "progresso", valor: percentual }]}
          innerRadius="72%"
          outerRadius="100%"
          startAngle={90}
          endAngle={-270}
          barSize={espessura}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, 100]}
            angleAxisId={0}
            tick={false}
          />
          <RadialBar
            dataKey="valor"
            background={{ fill: "var(--surface-3)" }}
            cornerRadius={espessura / 2}
            fill={cor}
            animationDuration={900}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      {centro && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          {centro}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sparkline — tendência mínima, sem eixos                             */
/* ------------------------------------------------------------------ */

export function Sparkline({
  dados,
  chave,
  cor = "var(--accent)",
  altura = 40,
}: {
  dados: Linha[];
  chave: string;
  cor?: string;
  altura?: number;
}) {
  const id = React.useId();

  return (
    <div style={{ height: altura }} aria-hidden>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={dados} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={cor} stopOpacity={0.24} />
              <stop offset="100%" stopColor={cor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey={chave}
            stroke={cor}
            strokeWidth={1.75}
            fill={`url(#${id})`}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
