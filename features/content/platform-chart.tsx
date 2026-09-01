"use client";

import * as React from "react";
import { ChartFrame, construirSeries } from "@/components/charts/chart-kit";
import { Columns, TrendArea } from "@/components/charts/charts";
import { Segmented } from "@/components/ui/tabs";
import { PLATFORM_MONTHLY } from "@/mocks/platform";
import { formatNumber } from "@/lib/format";

type Visao = "volume" | "usuarios";

/**
 * Duas leituras da mesma série, alternadas por um controle.
 * Volume e usuários têm escalas incompatíveis — em vez de um segundo
 * eixo, cada um ganha o próprio gráfico.
 */
export function PlatformChart() {
  const [visao, setVisao] = React.useState<Visao>("volume");

  const seriesVolume = React.useMemo(
    () =>
      construirSeries([
        { chave: "reciclado", rotulo: "Resíduo reciclado", unidade: " t" },
        { chave: "co2", rotulo: "CO2 evitado", unidade: " t", cor: "var(--series-3)" },
      ]),
    [],
  );

  const seriesUsuarios = React.useMemo(
    () =>
      construirSeries([
        { chave: "usuarios", rotulo: "Usuários ativos", cor: "var(--series-2)" },
      ]),
    [],
  );

  const dados = PLATFORM_MONTHLY.map((linha) => ({
    periodo: String(linha.periodo),
    reciclado: Number(linha.reciclado),
    co2: Number(linha.co2),
    usuarios: Number(linha.usuarios),
    acoes: Number(linha.acoes),
  }));

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg)] p-5 lg:p-7">
      {visao === "volume" ? (
        <ChartFrame
          titulo="Como o volume da plataforma evoluiu?"
          descricao="Resíduo reciclado e emissão evitada, em toneladas, nos últimos 12 meses."
          series={seriesVolume}
          dados={dados}
          chaveEixo="periodo"
          altura={320}
          formatarValor={(valor) => `${formatNumber(valor)} t`}
          acoes={
            <Segmented
              size="sm"
              ariaLabel="Escolher visão do gráfico"
              options={[
                { value: "volume", label: "Volume" },
                { value: "usuarios", label: "Usuários" },
              ]}
              value={visao}
              onChange={setVisao}
            />
          }
          rodape="Janeiro recua todo ano por causa do recesso e das férias escolares — é a sazonalidade esperada do programa."
        >
          <TrendArea
            dados={dados}
            series={seriesVolume}
            chaveEixo="periodo"
            formatarValor={(valor) => `${formatNumber(valor)} t`}
            formatarEixoY={(valor) => `${Math.round(valor / 1000)}k`}
          />
        </ChartFrame>
      ) : (
        <ChartFrame
          titulo="Quantas pessoas usaram a plataforma por mês?"
          descricao="Contas com ao menos um descarte validado no mês."
          series={seriesUsuarios}
          dados={dados}
          chaveEixo="periodo"
          altura={320}
          formatarValor={(valor) => formatNumber(valor)}
          acoes={
            <Segmented
              size="sm"
              ariaLabel="Escolher visão do gráfico"
              options={[
                { value: "volume", label: "Volume" },
                { value: "usuarios", label: "Usuários" },
              ]}
              value={visao}
              onChange={setVisao}
            />
          }
        >
          <Columns
            dados={dados}
            series={seriesUsuarios}
            chaveEixo="periodo"
            formatarValor={(valor) => formatNumber(valor)}
            formatarEixoY={(valor) => `${Math.round(valor / 1000)}k`}
          />
        </ChartFrame>
      )}
    </div>
  );
}
