import type { Metadata } from "next";
import { PublicRewards } from "@/features/content/public-rewards";
import { REWARDS, REWARD_CATEGORIES } from "@/mocks/rewards";

export const metadata: Metadata = {
  title: "Recompensas",
  description:
    "O catálogo completo do EcoRewards: mobilidade, alimentação, cultura, streaming, energia, produtos sustentáveis e experiências.",
};

export default function RecompensasPublicasPage() {
  return (
    <>
      <section className="border-b border-[var(--border)]">
        <div className="mx-auto max-w-[1360px] px-4 py-20 lg:px-6 lg:py-24">
          <div className="max-w-3xl">
            <p className="eyebrow">Catálogo</p>
            <h1 className="mt-5 text-balance font-display text-[clamp(2.25rem,5vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-[var(--fg)]">
              {REWARDS.length} recompensas em {REWARD_CATEGORIES.length} categorias.
            </h1>
            <p className="mt-6 max-w-[58ch] text-[17px] leading-relaxed text-[var(--fg-muted)]">
              Passe de transporte, crédito em mercado, ingresso, assinatura,
              desconto na conta de energia. O ponto sai da carteira, o voucher
              entra — e o resgate acontece dentro da demonstração.
            </p>
          </div>
        </div>
      </section>

      <PublicRewards />
    </>
  );
}
