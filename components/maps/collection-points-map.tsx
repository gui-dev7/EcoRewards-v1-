"use client";

import * as React from "react";
import * as maplibregl from "maplibre-gl";
import type { Map as MapLibreMap, MapGeoJSONFeature } from "maplibre-gl";
import { BaseMap, paraGeoJSON } from "./base-map";
import type { CollectionPoint, CollectionPointStatus } from "@/types";

const CORES_STATUS: Record<CollectionPointStatus, string> = {
  operacional: "var(--good)",
  "quase-cheio": "var(--warning)",
  lotado: "var(--critical)",
  manutencao: "var(--fg-subtle)",
};

/** Converte um token CSS numa cor concreta — o MapLibre não lê variáveis. */
function resolverCor(token: string) {
  if (typeof window === "undefined") return "#0e9f6e";
  const nome = token.replace("var(", "").replace(")", "").trim();
  const valor = getComputedStyle(document.documentElement)
    .getPropertyValue(nome)
    .trim();
  return valor || "#0e9f6e";
}

interface CollectionPointsMapProps {
  pontos: CollectionPoint[];
  selecionado?: string | null;
  onSelecionar: (id: string) => void;
  centro?: { lat: number; lng: number };
  usuario?: { lat: number; lng: number; real: boolean } | null;
  className?: string;
  zoom?: number;
}

/**
 * Mapa de ecopontos com agrupamento nativo do MapLibre.
 * Todas as camadas são criadas em `desenhar`, que roda tanto na carga
 * inicial quanto após cada troca de tema — o `setStyle` do MapLibre
 * descarta as camadas do consumidor.
 */
export function CollectionPointsMap({
  pontos,
  selecionado,
  onSelecionar,
  centro,
  usuario,
  className,
  zoom,
}: CollectionPointsMapProps) {
  const mapaRef = React.useRef<MapLibreMap | null>(null);

  // O handler vive numa ref: os listeners do MapLibre são registrados uma
  // única vez e precisam enxergar sempre a versão mais recente.
  const onSelecionarRef = React.useRef(onSelecionar);
  React.useEffect(() => {
    onSelecionarRef.current = onSelecionar;
  }, [onSelecionar]);

  const dados = React.useMemo(
    () =>
      paraGeoJSON(
        pontos.map((ponto) => ({
          id: ponto.id,
          lat: ponto.lat,
          lng: ponto.lng,
          nome: ponto.nome,
          status: ponto.status,
          capacidade: ponto.capacidadePercentual,
        })),
      ),
    [pontos],
  );

  const desenhar = React.useCallback(
    (map: MapLibreMap) => {
      mapaRef.current = map;

      if (!map.getSource("ecopontos")) {
        map.addSource("ecopontos", {
          type: "geojson",
          data: dados,
          cluster: true,
          clusterMaxZoom: 13,
          clusterRadius: 46,
        });
      }

      const corAcento = resolverCor("var(--accent)");
      const corSuperficie = resolverCor("var(--surface)");
      const corTexto = resolverCor("var(--fg)");

      if (!map.getLayer("clusters")) {
        map.addLayer({
          id: "clusters",
          type: "circle",
          source: "ecopontos",
          filter: ["has", "point_count"],
          paint: {
            "circle-color": corAcento,
            "circle-opacity": 0.88,
            "circle-radius": ["step", ["get", "point_count"], 17, 5, 22, 12, 28],
            "circle-stroke-width": 2,
            "circle-stroke-color": corSuperficie,
          },
        });
      }

      if (!map.getLayer("clusters-contagem")) {
        map.addLayer({
          id: "clusters-contagem",
          type: "symbol",
          source: "ecopontos",
          filter: ["has", "point_count"],
          layout: {
            "text-field": ["get", "point_count_abbreviated"],
            "text-font": ["Noto Sans Bold"],
            "text-size": 12,
            "text-allow-overlap": true,
          },
          paint: { "text-color": corSuperficie },
        });
      }

      if (!map.getLayer("pontos")) {
        map.addLayer({
          id: "pontos",
          type: "circle",
          source: "ecopontos",
          filter: ["!", ["has", "point_count"]],
          paint: {
            "circle-color": [
              "match",
              ["get", "status"],
              "operacional",
              resolverCor(CORES_STATUS.operacional),
              "quase-cheio",
              resolverCor(CORES_STATUS["quase-cheio"]),
              "lotado",
              resolverCor(CORES_STATUS.lotado),
              resolverCor(CORES_STATUS.manutencao),
            ],
            "circle-radius": 7,
            "circle-stroke-width": 2.5,
            "circle-stroke-color": corSuperficie,
          },
        });
      }

      // Anel do ponto selecionado
      if (!map.getLayer("ponto-selecionado")) {
        map.addLayer({
          id: "ponto-selecionado",
          type: "circle",
          source: "ecopontos",
          filter: ["==", ["get", "nome"], "__nenhum__"],
          paint: {
            "circle-color": "transparent",
            "circle-radius": 14,
            "circle-stroke-width": 2.5,
            "circle-stroke-color": corTexto,
          },
        });
      }

      map.on("click", "clusters", (evento) => {
        const feature = map.queryRenderedFeatures(evento.point, {
          layers: ["clusters"],
        })[0] as MapGeoJSONFeature | undefined;
        if (!feature) return;

        const origem = map.getSource("ecopontos") as maplibregl.GeoJSONSource;
        const clusterId = feature.properties?.cluster_id as number;
        origem.getClusterExpansionZoom(clusterId).then((proximoZoom) => {
          const geometria = feature.geometry as GeoJSON.Point;
          map.easeTo({
            center: [geometria.coordinates[0], geometria.coordinates[1]],
            zoom: proximoZoom,
            duration: 500,
          });
        });
      });

      map.on("click", "pontos", (evento) => {
        const feature = evento.features?.[0];
        if (!feature) return;
        const id = feature.id ?? feature.properties?.id;
        if (typeof id === "string") onSelecionarRef.current(id);
      });

      for (const camada of ["clusters", "pontos"]) {
        map.on("mouseenter", camada, () => {
          map.getCanvas().style.cursor = "pointer";
        });
        map.on("mouseleave", camada, () => {
          map.getCanvas().style.cursor = "";
        });
      }
    },
    [dados],
  );

  // Atualiza a fonte quando a filtragem muda os pontos exibidos.
  React.useEffect(() => {
    const map = mapaRef.current;
    const origem = map?.getSource("ecopontos") as maplibregl.GeoJSONSource | undefined;
    origem?.setData(dados);
  }, [dados]);

  // Realça o ponto selecionado e aproxima a câmera.
  React.useEffect(() => {
    const map = mapaRef.current;
    if (!map || !map.getLayer("ponto-selecionado")) return;

    const ponto = pontos.find((item) => item.id === selecionado);
    map.setFilter("ponto-selecionado", [
      "==",
      ["get", "nome"],
      ponto?.nome ?? "__nenhum__",
    ]);

    if (ponto) {
      map.easeTo({
        center: [ponto.lng, ponto.lat],
        zoom: Math.max(map.getZoom(), 14),
        duration: 600,
      });
    }
  }, [selecionado, pontos]);

  // Marcador da posição do usuário.
  React.useEffect(() => {
    const map = mapaRef.current;
    if (!map || !usuario) return;

    const elemento = document.createElement("div");
    elemento.className =
      "size-3.5 rounded-full border-2 border-[var(--surface)] bg-[var(--info)] shadow-[0_0_0_5px_var(--info-soft)]";
    elemento.setAttribute("aria-label", "Sua localização");

    const marcador = new maplibregl.Marker({ element: elemento })
      .setLngLat([usuario.lng, usuario.lat])
      .addTo(map);

    return () => {
      marcador.remove();
    };
  }, [usuario]);

  return (
    <BaseMap
      className={className}
      center={centro}
      zoom={zoom}
      onReady={desenhar}
      onStyleReload={desenhar}
    />
  );
}

export { CORES_STATUS };
