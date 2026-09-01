import type { Metadata } from "next";
import { PublicPoints } from "@/features/content/public-points";
import { COLLECTION_POINTS } from "@/mocks/collection-points";

export const metadata: Metadata = {
  title: "Ecopontos",
  description:
    "A rede de pontos de coleta do EcoRewards na Região Metropolitana de São Paulo, com materiais aceitos e horários.",
};

export default function EcopontosPublicosPage() {
  const cidades = new Set(COLLECTION_POINTS.map((ponto) => ponto.cidade));

  return (
    <>
      <section className="border-b border-[var(--border)]">
        <div className="mx-auto max-w-[1360px] px-4 py-20 lg:px-6 lg:py-24">
          <div className="max-w-3xl">
            <p className="eyebrow">Rede de coleta</p>
            <h1 className="mt-5 text-balance font-display text-[clamp(2.25rem,5vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-[var(--fg)]">
              {COLLECTION_POINTS.length} ecopontos em {cidades.size} cidades.
            </h1>
            <p className="mt-6 max-w-[58ch] text-[17px] leading-relaxed text-[var(--fg-muted)]">
              Cada equipamento aceita um conjunto próprio de materiais e informa a
              ocupação em tempo real. Encontre o mais próximo antes de sair de
              casa.
            </p>
          </div>
        </div>
      </section>

      <PublicPoints />
    </>
  );
}
