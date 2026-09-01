import type { Metadata } from "next";
import {
  Compass,
  HandHeart,
  Lightning,
  Plant,
  Scales,
  UsersThree,
} from "@phosphor-icons/react/dist/ssr";
import { CareersIndex } from "@/features/content/careers-index";
import { CULTURE_VALUES } from "@/mocks/careers";

export const metadata: Metadata = {
  title: "Carreiras",
  description:
    "Vagas abertas em engenharia, produto, design, dados, operações, comercial, sustentabilidade e marketing.",
};

const ICONES: Record<
  string,
  React.ComponentType<{ className?: string; weight?: "duotone" | "fill" | "bold" }>
> = {
  compass: Compass,
  plant: Plant,
  lightning: Lightning,
  scales: Scales,
  users: UsersThree,
  heart: HandHeart,
};

export default function CarreirasPage() {
  return (
    <>
      <section className="border-b border-[var(--border)]">
        <div className="mx-auto max-w-[1360px] px-4 py-20 lg:px-6 lg:py-24">
          <div className="max-w-3xl">
            <p className="eyebrow">Carreiras</p>
            <h1 className="mt-5 text-balance font-display text-[clamp(2.25rem,5vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-[var(--fg)]">
              Trabalhe onde o impacto ambiental é o indicador de sucesso.
            </h1>
            <p className="mt-7 max-w-[60ch] text-[17px] leading-relaxed text-[var(--fg-muted)]">
              Somos um time pequeno construindo infraestrutura para uma cadeia que
              movimenta milhões de toneladas por ano. Cada decisão de produto tem
              consequência mensurável fora da tela.
            </p>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-[1360px] px-4 py-16 lg:px-6 lg:py-20">
          <div className="max-w-2xl">
            <p className="eyebrow">Como trabalhamos</p>
            <h2 className="mt-4 text-balance font-display text-h1 text-[var(--fg)]">
              Seis princípios que aparecem nas decisões do dia a dia.
            </h2>
          </div>

          <ul className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {CULTURE_VALUES.map((valor) => {
              const Icon = ICONES[valor.icone] ?? Compass;
              return (
                <li key={valor.id} className="border-t border-[var(--border)] pt-5">
                  <Icon
                    className="size-6 text-[var(--accent)]"
                    weight="duotone"
                    aria-hidden
                  />
                  <h3 className="mt-4 font-display text-[16px] font-semibold text-[var(--fg)]">
                    {valor.titulo}
                  </h3>
                  <p className="mt-2 max-w-[38ch] text-[13.5px] leading-relaxed text-[var(--fg-muted)]">
                    {valor.descricao}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <CareersIndex />
    </>
  );
}
