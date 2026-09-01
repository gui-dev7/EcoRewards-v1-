import { AnimatedNumber } from "@/components/ui/animated-number";
import { PLATFORM_STATS } from "@/mocks/platform";

/**
 * Quatro números, sem gráfico. Quando o dado é uma única grandeza,
 * o número grande lê melhor que qualquer plotagem.
 */
export function ImpactCounters() {
  return (
    <section className="border-b border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto max-w-[1360px] px-4 py-16 lg:px-6 lg:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--border)] pb-6">
          <div>
            <p className="eyebrow">Impacto acumulado</p>
            <h2 className="mt-3 max-w-[20ch] text-balance font-display text-h2 text-[var(--fg)]">
              O que a rede já movimentou.
            </h2>
          </div>
          <p className="max-w-sm text-[13px] leading-relaxed text-[var(--fg-subtle)]">
            Números demonstrativos, calculados sobre os fatores de material da
            plataforma. Não há banco de dados por trás desta demonstração.
          </p>
        </div>

        <dl className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {PLATFORM_STATS.map((stat, indice) => (
            <div key={stat.id} className="border-t border-[var(--border)] pt-5">
              <dd className="font-display text-[clamp(2rem,4vw,2.75rem)] font-semibold leading-none tracking-[-0.035em] text-[var(--fg)]">
                <AnimatedNumber
                  value={stat.valor}
                  formato={stat.id === "economia-estimada" ? "moeda" : "compacto"}
                  atraso={indice * 110}
                />
                {stat.id !== "economia-estimada" && stat.sufixo && (
                  <span className="ml-1 text-[18px] font-medium text-[var(--fg-muted)]">
                    {stat.sufixo}
                  </span>
                )}
              </dd>
              <dt className="mt-3 text-[13.5px] font-medium text-[var(--fg)]">
                {stat.rotulo}
              </dt>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-[var(--fg-muted)]">
                {stat.descricao}
              </p>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
