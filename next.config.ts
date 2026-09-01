import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  experimental: {
    // Recharts e Motion são importados por nome em dezenas de arquivos; sem
    // isso o bundle carrega a biblioteca inteira.
    // `@phosphor-icons/react` fica de fora de propósito: a otimização reescreve
    // os imports profundos de `/dist/ssr` para o barrel principal, que registra
    // um contexto de React e quebra a renderização no servidor.
    optimizePackageImports: ["recharts", "motion"],
  },

  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
    ];
  },
};

export default nextConfig;
