import { ArrowRight, Coins, Gift, Leaf, Recycle, ShieldCheck } from "@phosphor-icons/react/dist/ssr";

const ETAPAS = [
  {
    id: "reciclagem",
    rotulo: "Reciclagem",
    detalhe: "Material separado e levado ao ecoponto",
    Icon: Recycle,
  },
  {
    id: "validacao",
    rotulo: "Validação",
    detalhe: "QR do ecoponto, material e peso conferidos",
    Icon: ShieldCheck,
  },
  {
    id: "ecopontos",
    rotulo: "EcoPontos",
    detalhe: "Pontuação creditada pelo fator do material",
    Icon: Coins,
  },
  {
    id: "recompensas",
    rotulo: "Recompensas",
    detalhe: "Troca por mobilidade, cultura, energia e mais",
    Icon: Gift,
  },
  {
    id: "impacto",
    rotulo: "Impacto",
    detalhe: "CO2 evitado e aterro poupado, auditáveis",
    Icon: Leaf,
  },
];

/**
 * O ciclo do produto em uma linha. Serve como índice visual do que o
 * scrollytelling desenvolve logo abaixo.
 */
export function FlowDiagram() {
  return (
    <section className="border-b border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto max-w-[1360px] px-4 py-14 lg:px-6">
        <ol className="grid gap-y-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-x-2">
          {ETAPAS.map((etapa, indice) => (
            <li key={etapa.id} className="relative flex items-start gap-4 lg:block">
              <div className="flex items-center gap-3 lg:gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg)] text-[var(--accent)]">
                  <etapa.Icon className="size-5" weight="duotone" />
                </span>
                {indice < ETAPAS.length - 1 && (
                  <span
                    aria-hidden
                    className="hidden flex-1 items-center lg:flex"
                  >
                    <span className="h-px flex-1 bg-[var(--border)]" />
                    <ArrowRight className="size-3.5 shrink-0 text-[var(--fg-subtle)]" />
                    <span className="mr-2 w-2" />
                  </span>
                )}
              </div>
              <div className="lg:mt-4">
                <p className="font-display text-[14px] font-semibold uppercase tracking-[0.06em] text-[var(--fg)]">
                  {etapa.rotulo}
                </p>
                <p className="mt-1.5 max-w-[26ch] text-[12.5px] leading-relaxed text-[var(--fg-muted)]">
                  {etapa.detalhe}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
