"use client";

import * as React from "react";
import * as maplibregl from "maplibre-gl";
import type { Map as MapLibreMap } from "maplibre-gl";
import { useTheme } from "next-themes";
import { baseMapStyle } from "./map-style";
import { DEFAULT_MAP_CENTER } from "@/mocks/collection-points";
import { cn } from "@/lib/utils";
import "maplibre-gl/dist/maplibre-gl.css";

export interface BaseMapProps {
  className?: string;
  center?: { lat: number; lng: number };
  zoom?: number;
  /** Executado quando o mapa está pronto e o estilo carregado. */
  onReady?: (map: MapLibreMap) => void;
  /** Reexecutado após cada troca de tema, para redesenhar camadas próprias. */
  onStyleReload?: (map: MapLibreMap) => void;
  interativo?: boolean;
  children?: React.ReactNode;
}

/**
 * Contêiner do MapLibre. Carrega o basemap de acordo com o tema e
 * reaplica as camadas do consumidor quando o estilo é trocado —
 * o MapLibre descarta camadas próprias em `setStyle`.
 */
export function BaseMap({
  className,
  center = DEFAULT_MAP_CENTER,
  zoom = 11.2,
  onReady,
  onStyleReload,
  interativo = true,
  children,
}: BaseMapProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const mapRef = React.useRef<MapLibreMap | null>(null);
  const { resolvedTheme } = useTheme();
  const [pronto, setPronto] = React.useState(false);

  // Os callbacks ficam em refs para que trocá-los não recrie o mapa.
  const onReadyRef = React.useRef(onReady);
  const onStyleReloadRef = React.useRef(onStyleReload);

  React.useEffect(() => {
    onReadyRef.current = onReady;
    onStyleReloadRef.current = onStyleReload;
  }, [onReady, onStyleReload]);

  React.useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: baseMapStyle(resolvedTheme === "dark" ? "dark" : "light"),
      center: [center.lng, center.lat],
      zoom,
      attributionControl: false,
      interactive: interativo,
      dragRotate: false,
      pitchWithRotate: false,
    });

    map.touchZoomRotate.disableRotation();

    if (interativo) {
      map.addControl(
        new maplibregl.NavigationControl({ showCompass: false }),
        "top-right",
      );
      map.addControl(
        new maplibregl.AttributionControl({ compact: true }),
        "bottom-right",
      );
    }

    map.on("load", () => {
      mapRef.current = map;
      setPronto(true);
      onReadyRef.current?.(map);
    });

    return () => {
      map.remove();
      mapRef.current = null;
      setPronto(false);
    };
    // Intencionalmente montado uma única vez: centro e zoom viram
    // comandos imperativos abaixo, não recriam o mapa.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Troca de tema: o estilo é substituído e as camadas próprias reaplicadas.
  React.useEffect(() => {
    const map = mapRef.current;
    if (!map || !pronto) return;

    const modo = resolvedTheme === "dark" ? "dark" : "light";
    map.setStyle(baseMapStyle(modo));
    const reaplicar = () => onStyleReloadRef.current?.(map);
    map.once("styledata", reaplicar);
  }, [resolvedTheme, pronto]);

  React.useEffect(() => {
    const map = mapRef.current;
    if (!map || !pronto) return;
    map.easeTo({ center: [center.lng, center.lat], duration: 600 });
  }, [center.lat, center.lng, pronto]);

  return (
    <div className={cn("relative isolate overflow-hidden", className)}>
      <div ref={containerRef} className="absolute inset-0" />
      {children}
    </div>
  );
}

/** Converte uma lista de pontos num FeatureCollection para o MapLibre. */
export function paraGeoJSON<T extends { lat: number; lng: number; id: string }>(
  itens: T[],
): GeoJSON.FeatureCollection<GeoJSON.Point> {
  return {
    type: "FeatureCollection",
    features: itens.map((item) => {
      const { lat, lng, ...resto } = item;
      return {
        type: "Feature",
        id: item.id,
        geometry: { type: "Point", coordinates: [lng, lat] },
        properties: resto as unknown as GeoJSON.GeoJsonProperties,
      };
    }),
  };
}
