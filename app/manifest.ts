import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "EcoRewards — Transforme impacto em recompensa",
    short_name: "EcoRewards",
    description:
      "Recicle, acumule EcoPontos e troque por recompensas. Demonstração completa da plataforma.",
    start_url: "/app",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#fbfbfa",
    theme_color: "#0e9f6e",
    lang: "pt-BR",
    dir: "ltr",
    categories: ["lifestyle", "utilities", "productivity"],
    icons: [
      { src: "/icon", sizes: "64x64", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
      {
        src: "/icons/icon-512.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Escanear ecoponto",
        short_name: "Escanear",
        url: "/app/scanner",
        description: "Registrar um novo descarte",
      },
      {
        name: "Minha carteira",
        short_name: "Carteira",
        url: "/app/carteira",
        description: "Saldo e extrato de EcoPontos",
      },
      {
        name: "Mapa de ecopontos",
        short_name: "Ecopontos",
        url: "/app/ecopontos",
        description: "Encontrar um ponto de coleta",
      },
    ],
  };
}
