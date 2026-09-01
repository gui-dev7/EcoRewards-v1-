"use client";

import * as React from "react";
import type { Map as MapLibreMap } from "maplibre-gl";
import { BaseMap, paraGeoJSON } from "./base-map";
import { COLLECTION_POINTS } from "@/mocks/collection-points";
import { REGIONS } from "@/mocks/government";
import type { CollectionPointStatus } from "@/types";

export type CamadaId =
  | "ecopontos"
  | "usuarios"
  | "lotados"
  | "manutencao"
  | "baixa-adesao";

export type HeatmapId = "reciclagem" | "adesao" | "risco" | "nenhum";

function resolverCor(token: string) {
  if (typeof window === "undefined") return "#0e9f6e";
  const nome = token.replace("var(", "").replace(")", "").trim();
  return (
    getComputedStyle(document.documentElement).getPropertyValue(nome).trim() ||
    "#0e9f6e"
  );
}

/** Peso de cada região no heatmap, normalizado de 0 a 1. */
function pesoRegiao(heatmap: HeatmapId) {
  return REGIONS.map((regiao) => {
    if (heatmap === "adesao") return regiao.adesaoPercentual;
    if (heatmap === "risco") return regiao.riscoOperacional;
    return regiao.toneladasRecicladas;
  });
}

interface GovernmentMapProps {
  camadas: CamadaId[];
  heatmap: HeatmapId;
  onSelecionarPonto: (id: string) => void;
  onSelecionarRegiao: (id: string) => void;
  className?: string;
}

/**
 * Mapa analítico do ambiente governamental.
 *
 * Todas as sources e layers são criadas em `desenhar`, chamada na carga e
 * novamente a cada troca de tema — o `setStyle` do MapLibre descarta o que
 * o consumidor adicionou, e sem isso o mapa ficaria vazio no modo escuro.
 */
export function GovernmentMap({
  camadas,
  heatmap,
  onSelecionarPonto,
  onSelecionarRegiao,
  className,
}: GovernmentMapProps) {
  const mapaRef = React.useRef<MapLibreMap | null>(null);
  // Handlers em refs: os listeners do MapLibre são registrados uma única
  // vez e precisam enxergar sempre a versão mais recente.
  const pontoRef = React.useRef(onSelecionarPonto);
  const regiaoRef = React.useRef(onSelecionarRegiao);

  React.useEffect(() => {
    pontoRef.current = onSelecionarPonto;
    regiaoRef.current = onSelecionarRegiao;
  }, [onSelecionarPonto, onSelecionarRegiao]);

  const dadosPontos = React.useMemo(
    () =>
      paraGeoJSON(
        COLLECTION_POINTS.map((ponto) => ({
          id: ponto.id,
          lat: ponto.lat,
          lng: ponto.lng,
          nome: ponto.nome,
          status: ponto.status,
          capacidade: ponto.capacidadePercentual,
          descartes: ponto.descartesMes,
        })),
      ),
    [],
  );

  const dadosRegioes = React.useMemo(() => {
    const pesos = pesoRegiao(heatmap);
    const maximo = Math.max(...pesos, 1);

    return paraGeoJSON(
      REGIONS.map((regiao, indice) => ({
        id: regiao.id,
        lat: regiao.lat,
        lng: regiao.lng,
        nome: regiao.nome,
        peso: pesos[indice] / maximo,
        usuarios: regiao.usuariosAtivos,
        adesao: regiao.adesaoPercentual,
      })),
    );
  }, [heatmap]);

  const desenhar = React.useCallback(
    (map: MapLibreMap) => {
      mapaRef.current = map;

      const surface = resolverCor("var(--surface)");

      /* ---------------------------- Heatmap ---------------------------- */
      if (!map.getSource("regioes")) {
        map.addSource("regioes", { type: "geojson", data: dadosRegioes });
      }

      if (!map.getLayer("heatmap")) {
        map.addLayer({
          id: "heatmap",
          type: "heatmap",
          source: "regioes",
          paint: {
            "heatmap-weight": ["get", "peso"],
            "heatmap-intensity": 1.1,
            "heatmap-radius": 78,
            "heatmap-opacity": 0.72,
            // Rampa sequencial: uma única matiz, do claro ao escuro.
            "heatmap-color": [
              "interpolate",
              ["linear"],
              ["heatmap-density"],
              0,
              "rgba(0,0,0,0)",
              0.2,
              resolverCor("var(--seq-2)"),
              0.4,
              resolverCor("var(--seq-3)"),
              0.6,
              resolverCor("var(--seq-4)"),
              0.8,
              resolverCor("var(--seq-5)"),
              1,
              resolverCor("var(--seq-6)"),
            ],
          },
        });
      }

      /* ------------------------- Centros regionais --------------------- */
      if (!map.getLayer("regioes-centro")) {
        map.addLayer({
          id: "regioes-centro",
          type: "circle",
          source: "regioes",
          paint: {
            "circle-color": resolverCor("var(--accent)"),
            "circle-opacity": 0.9,
            "circle-radius": ["interpolate", ["linear"], ["get", "peso"], 0, 8, 1, 20],
            "circle-stroke-width": 2,
            "circle-stroke-color": surface,
          },
        });
      }

      if (!map.getLayer("regioes-rotulo")) {
        map.addLayer({
          id: "regioes-rotulo",
          type: "symbol",
          source: "regioes",
          layout: {
            "text-field": ["get", "nome"],
            "text-font": ["Noto Sans Regular"],
            "text-size": 11,
            "text-offset": [0, 1.9],
            "text-anchor": "top",
          },
          paint: {
            "text-color": resolverCor("var(--fg)"),
            "text-halo-color": surface,
            "text-halo-width": 1.6,
          },
        });
      }

      /* ---------------------------- Ecopontos -------------------------- */
      if (!map.getSource("pontos")) {
        map.addSource("pontos", { type: "geojson", data: dadosPontos });
      }

      const camadasPonto: {
        id: CamadaId;
        filtro: unknown[];
        cor: string;
      }[] = [
        {
          id: "ecopontos",
          filtro: ["!=", ["get", "status"], "__nenhum__"],
          cor: resolverCor("var(--good)"),
        },
        {
          id: "lotados",
          filtro: ["==", ["get", "status"], "lotado" as CollectionPointStatus],
          cor: resolverCor("var(--critical)"),
        },
        {
          id: "manutencao",
          filtro: ["==", ["get", "status"], "manutencao" as CollectionPointStatus],
          cor: resolverCor("var(--fg-subtle)"),
        },
        {
          id: "baixa-adesao",
          filtro: ["<", ["get", "descartes"], 220],
          cor: resolverCor("var(--warning)"),
        },
      ];

      for (const camada of camadasPonto) {
        const layerId = `camada-${camada.id}`;
        if (map.getLayer(layerId)) continue;

        map.addLayer({
          id: layerId,
          type: "circle",
          source: "pontos",
          filter: camada.filtro as never,
          paint: {
            "circle-color": camada.cor,
            "circle-radius": camada.id === "ecopontos" ? 5.5 : 8,
            "circle-stroke-width": 2,
            "circle-stroke-color": surface,
            "circle-opacity": camada.id === "ecopontos" ? 0.9 : 1,
          },
          layout: { visibility: "none" },
        });

        map.on("click", layerId, (evento) => {
          const feature = evento.features?.[0];
          const id = feature?.id ?? feature?.properties?.id;
          if (typeof id === "string") pontoRef.current(id);
        });

        map.on("mouseenter", layerId, () => {
          map.getCanvas().style.cursor = "pointer";
        });
        map.on("mouseleave", layerId, () => {
          map.getCanvas().style.cursor = "";
        });
      }

      /* -------------------- Densidade de usuários ---------------------- */
      if (!map.getLayer("camada-usuarios")) {
        map.addLayer({
          id: "camada-usuarios",
          type: "circle",
          source: "regioes",
          paint: {
            "circle-color": resolverCor("var(--series-2)"),
            "circle-opacity": 0.22,
            "circle-radius": [
              "interpolate",
              ["linear"],
              ["get", "usuarios"],
              20000,
              22,
              120000,
              62,
            ],
            "circle-stroke-width": 1.5,
            "circle-stroke-color": resolverCor("var(--series-2)"),
          },
          layout: { visibility: "none" },
        });
      }

      map.on("click", "regioes-centro", (evento) => {
        const feature = evento.features?.[0];
        const id = feature?.id ?? feature?.properties?.id;
        if (typeof id === "string") regiaoRef.current(id);
      });

      map.on("mouseenter", "regioes-centro", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "regioes-centro", () => {
        map.getCanvas().style.cursor = "";
      });

      aplicarVisibilidade(map, camadas, heatmap);
    },
    [dadosPontos, dadosRegioes, camadas, heatmap],
  );

  // Alterna visibilidade sem recriar as camadas.
  React.useEffect(() => {
    const map = mapaRef.current;
    if (!map) return;
    aplicarVisibilidade(map, camadas, heatmap);
  }, [camadas, heatmap]);

  // Troca de heatmap: só os pesos da fonte mudam.
  React.useEffect(() => {
    const map = mapaRef.current;
    const origem = map?.getSource("regioes");
    if (origem && "setData" in origem) {
      (origem as { setData: (dados: unknown) => void }).setData(dadosRegioes);
    }
  }, [dadosRegioes]);

  return (
    <BaseMap
      className={className}
      zoom={9.6}
      onReady={desenhar}
      onStyleReload={desenhar}
    />
  );
}

function aplicarVisibilidade(
  map: MapLibreMap,
  camadas: CamadaId[],
  heatmap: HeatmapId,
) {
  const definir = (id: string, visivel: boolean) => {
    if (map.getLayer(id)) {
      map.setLayoutProperty(id, "visibility", visivel ? "visible" : "none");
    }
  };

  definir("heatmap", heatmap !== "nenhum");
  definir("camada-ecopontos", camadas.includes("ecopontos"));
  definir("camada-lotados", camadas.includes("lotados"));
  definir("camada-manutencao", camadas.includes("manutencao"));
  definir("camada-baixa-adesao", camadas.includes("baixa-adesao"));
  definir("camada-usuarios", camadas.includes("usuarios"));
}
