import type { StyleSpecification } from "maplibre-gl";

const ATTRIBUTION =
  '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> · © <a href="https://carto.com/attributions">CARTO</a>';

/**
 * Estilo base do mapa sem chave de API.
 * Tiles raster da CARTO, com uma camada de fundo nas cores do design
 * system por baixo — se a rede falhar, o mapa continua legível e os
 * marcadores permanecem posicionados corretamente.
 */
export function baseMapStyle(modo: "light" | "dark"): StyleSpecification {
  const variante = modo === "dark" ? "dark_all" : "light_all";

  return {
    version: 8,
    glyphs: "https://fonts.openmaptiles.org/{fontstack}/{range}.pbf",
    sources: {
      carto: {
        type: "raster",
        tiles: [
          `https://a.basemaps.cartocdn.com/rastertiles/${variante}/{z}/{x}/{y}{ratio}.png`,
          `https://b.basemaps.cartocdn.com/rastertiles/${variante}/{z}/{x}/{y}{ratio}.png`,
          `https://c.basemaps.cartocdn.com/rastertiles/${variante}/{z}/{x}/{y}{ratio}.png`,
        ].map((url) => url.replace("{ratio}", "")),
        tileSize: 256,
        attribution: ATTRIBUTION,
        maxzoom: 19,
      },
    },
    layers: [
      {
        id: "fundo",
        type: "background",
        paint: {
          "background-color": modo === "dark" ? "#0d1214" : "#eef1ee",
        },
      },
      {
        id: "basemap",
        type: "raster",
        source: "carto",
        paint: {
          "raster-opacity": modo === "dark" ? 0.82 : 0.92,
          "raster-saturation": modo === "dark" ? -0.35 : -0.55,
          "raster-contrast": modo === "dark" ? 0.05 : -0.05,
        },
      },
    ],
  };
}

export const SP_BOUNDS: [[number, number], [number, number]] = [
  [-46.95, -23.85],
  [-46.3, -23.35],
];
