"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const ETAPAS = [
  {
    numero: "01",
    titulo: "Você recicla.",
    texto:
      "Separa o material em casa e leva ao ecoponto mais próximo. Plástico, papel, vidro, metal, eletrônicos e óleo entram no mesmo fluxo.",
  },
  {
    numero: "02",
    titulo: "O EcoRewards valida.",
    texto:
      "A leitura do QR identifica o ecoponto, o material declarado é conferido e o peso registrado. Sem validação, não há pontuação.",
  },
  {
    numero: "03",
    titulo: "Você recebe EcoPontos.",
    texto:
      "Cada material tem um fator próprio por quilo. Um quilo de alumínio vale mais que um quilo de vidro porque evita mais emissão.",
  },
  {
    numero: "04",
    titulo: "Você troca por recompensas.",
    texto:
      "Passe de transporte, crédito em mercado, ingresso, assinatura, desconto na conta de energia. O ponto sai da conta, o voucher entra.",
  },
  {
    numero: "05",
    titulo: "A sociedade ganha impacto.",
    texto:
      "O que você fez vira linha em um painel público: tonelada desviada do aterro, CO2 evitado, custo poupado pelo município.",
  },
];

export function Scrollytelling() {
  const escopo = React.useRef<HTMLDivElement>(null);
  const [ativa, setAtiva] = React.useState(0);
  const reduzido = useReducedMotion();

  useGSAP(
    () => {
      if (reduzido) return;

      const painéis = gsap.utils.toArray<HTMLElement>("[data-etapa]");

      const triggers = painéis.map((painel, indice) =>
        ScrollTrigger.create({
          trigger: painel,
          start: "top 62%",
          end: "bottom 42%",
          onToggle: ({ isActive }) => {
            if (isActive) setAtiva(indice);
          },
        }),
      );

      return () => triggers.forEach((trigger) => trigger.kill());
    },
    { scope: escopo, dependencies: [reduzido] },
  );

  return (
    <section
      ref={escopo}
      aria-label="Como o EcoRewards funciona"
      className="border-b border-[var(--border)]"
    >
      <div className="mx-auto max-w-[1360px] px-4 lg:px-6">
        <div className="grid lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          {/* Coluna do texto */}
          <div className="py-16 lg:py-24">
            <p className="eyebrow">O ciclo completo</p>
            <h2 className="mt-4 max-w-[16ch] text-balance font-display text-h1 text-[var(--fg)]">
              Do saco de reciclagem ao indicador público.
            </h2>

            <ol className="mt-14 space-y-24 lg:space-y-40">
              {ETAPAS.map((etapa, indice) => (
                <li
                  key={etapa.numero}
                  data-etapa
                  className={cn(
                    "border-l-2 pl-6 transition-colors duration-500",
                    ativa === indice
                      ? "border-[var(--accent)]"
                      : "border-[var(--border)]",
                  )}
                >
                  <span
                    className={cn(
                      "font-mono text-[12px] font-medium tracking-[0.14em] transition-colors duration-500",
                      ativa === indice
                        ? "text-[var(--accent)]"
                        : "text-[var(--fg-subtle)]",
                    )}
                  >
                    {etapa.numero}
                  </span>
                  <h3
                    className={cn(
                      "mt-3 font-display text-h3 transition-colors duration-500",
                      ativa === indice ? "text-[var(--fg)]" : "text-[var(--fg-muted)]",
                    )}
                  >
                    {etapa.titulo}
                  </h3>
                  <p className="mt-3 max-w-[46ch] text-[14.5px] leading-relaxed text-[var(--fg-muted)]">
                    {etapa.texto}
                  </p>

                  {/* No mobile o visual acompanha cada etapa. */}
                  <div className="mt-6 lg:hidden">
                    <Cena indice={indice} />
                  </div>
                </li>
              ))}
            </ol>

            <p className="mt-24 border-l-2 border-[var(--accent)] pl-6 font-display text-h2 text-[var(--fg)] lg:mt-40">
              Seu impacto gera valor.
            </p>
          </div>

          {/* Visual fixo */}
          <div className="relative hidden lg:block">
            <div className="sticky top-[calc(var(--header-h)+3rem)] flex h-[min(560px,72vh)] items-center">
              <div className="relative w-full">
                <div className="relative aspect-square w-full overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)]">
                  <div
                    aria-hidden
                    className="dot-texture absolute inset-0 opacity-40"
                  />
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={ativa}
                      initial={reduzido ? false : { opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={reduzido ? undefined : { opacity: 0, scale: 1.02 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0 flex items-center justify-center p-10"
                    >
                      <Cena indice={ativa} />
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Trilho de progresso das etapas */}
                <div className="mt-5 flex items-center gap-2">
                  {ETAPAS.map((etapa, indice) => (
                    <div key={etapa.numero} className="flex flex-1 items-center gap-2">
                      <span
                        className={cn(
                          "h-[3px] flex-1 rounded-full transition-colors duration-500",
                          indice <= ativa
                            ? "bg-[var(--accent)]"
                            : "bg-[var(--border)]",
                        )}
                      />
                    </div>
                  ))}
                  <span className="ml-2 shrink-0 font-mono text-[11px] tabular text-[var(--fg-subtle)]">
                    {ETAPAS[ativa].numero} / 05
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Cenas                                                               */
/* ------------------------------------------------------------------ */

const CORES_MATERIAL = [
  "var(--series-2)",
  "var(--series-3)",
  "var(--series-1)",
  "var(--series-5)",
  "var(--series-4)",
];

function Cena({ indice }: { indice: number }) {
  const comum = "w-full max-w-[320px] mx-auto";

  if (indice === 0) {
    return (
      <svg viewBox="0 0 240 240" className={comum} role="img" aria-label="Materiais separados entrando no ecoponto">
        <rect x="70" y="118" width="100" height="98" rx="8" fill="none" stroke="var(--fg-subtle)" strokeWidth="1.5" />
        <path d="M70 140 H170" stroke="var(--border-strong)" strokeWidth="1.5" />
        <rect x="104" y="128" width="32" height="5" rx="2.5" fill="var(--fg-subtle)" />
        {CORES_MATERIAL.map((cor, i) => (
          <rect
            key={cor}
            x={82 + i * 15}
            y={40 + (i % 3) * 22}
            width="13"
            height="13"
            rx="3"
            fill={cor}
            opacity={0.9 - i * 0.08}
          />
        ))}
        <path d="M120 96 V112" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4" />
        <path d="M114 106 L120 113 L126 106" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (indice === 1) {
    return (
      <svg viewBox="0 0 240 240" className={comum} role="img" aria-label="Leitura do QR do ecoponto">
        <g stroke="var(--accent)" strokeWidth="2.5" fill="none" strokeLinecap="round">
          <path d="M56 84 V64 H76" />
          <path d="M164 84 V64 H144" />
          <path d="M56 156 V176 H76" />
          <path d="M164 156 V176 H144" />
        </g>
        <g fill="var(--fg)">
          {[
            [88, 92], [104, 92], [136, 92], [88, 108], [120, 108], [152, 108],
            [88, 124], [104, 124], [136, 124], [152, 124], [104, 140], [136, 140],
          ].map(([x, y]) => (
            <rect key={`${x}-${y}`} x={x} y={y} width="12" height="12" rx="2" />
          ))}
        </g>
        <rect x="56" y="116" width="128" height="2.5" rx="1.25" fill="var(--accent)" />
        <rect x="56" y="112" width="128" height="10" fill="var(--accent)" opacity="0.16" />
      </svg>
    );
  }

  if (indice === 2) {
    return (
      <svg viewBox="0 0 240 240" className={comum} role="img" aria-label="EcoPontos creditados">
        <circle cx="120" cy="120" r="62" fill="none" stroke="var(--border-strong)" strokeWidth="1.5" />
        <circle
          cx="120"
          cy="120"
          r="62"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="389.6"
          strokeDashoffset="97.4"
          transform="rotate(-90 120 120)"
        />
        <text x="120" y="114" textAnchor="middle" className="font-display" fill="var(--fg)" fontSize="30" fontWeight="600">
          +320
        </text>
        <text x="120" y="136" textAnchor="middle" fill="var(--fg-muted)" fontSize="12" letterSpacing="1.4">
          ECOPONTOS
        </text>
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const angulo = (i / 6) * Math.PI * 2 - Math.PI / 2;
          return (
            <circle
              key={i}
              cx={120 + Math.cos(angulo) * 92}
              cy={120 + Math.sin(angulo) * 92}
              r="3.5"
              fill={CORES_MATERIAL[i % CORES_MATERIAL.length]}
            />
          );
        })}
      </svg>
    );
  }

  if (indice === 3) {
    return (
      <svg viewBox="0 0 240 240" className={comum} role="img" aria-label="Voucher de recompensa emitido">
        <rect x="42" y="86" width="156" height="76" rx="8" fill="var(--surface-2)" stroke="var(--border-strong)" strokeWidth="1.5" />
        <path d="M148 86 V162" stroke="var(--border-strong)" strokeWidth="1.5" strokeDasharray="5 5" />
        <circle cx="148" cy="86" r="6" fill="var(--surface)" stroke="var(--border-strong)" strokeWidth="1.5" />
        <circle cx="148" cy="162" r="6" fill="var(--surface)" stroke="var(--border-strong)" strokeWidth="1.5" />
        <rect x="58" y="104" width="58" height="7" rx="3.5" fill="var(--fg-subtle)" />
        <rect x="58" y="120" width="76" height="10" rx="4" fill="var(--accent)" />
        <rect x="58" y="139" width="42" height="6" rx="3" fill="var(--border-strong)" />
        <g stroke="var(--fg)" strokeWidth="2.5">
          {[158, 164, 170, 176, 182, 188].map((x, i) => (
            <path key={x} d={`M${x} 106 V${i % 2 === 0 ? 142 : 134}`} />
          ))}
        </g>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 240 240" className={comum} role="img" aria-label="Impacto agregado no território">
      <g stroke="var(--border-strong)" strokeWidth="1" opacity="0.7">
        {[64, 104, 144, 184].map((v) => (
          <React.Fragment key={v}>
            <line x1={v} y1="40" x2={v} y2="200" />
            <line x1="40" y1={v} x2="200" y2={v} />
          </React.Fragment>
        ))}
      </g>
      {[
        [64, 64, 5], [104, 104, 9], [144, 64, 6], [184, 144, 7],
        [64, 144, 8], [104, 184, 5], [144, 144, 11], [184, 64, 4],
      ].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="var(--accent)" opacity={0.25 + (r as number) / 22} />
      ))}
      <g className="text-[var(--accent)]" transform="translate(96 96) scale(1)">
        <path
          d="M10 38 C10 22 22 10 38 10 C38 26 26 38 10 38 Z"
          fill="currentColor"
          fillOpacity="0.16"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path d="M10 38 L38 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </g>
    </svg>
  );
}
