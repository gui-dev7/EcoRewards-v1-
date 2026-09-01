"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Minus, Plus } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { calculateEcoPoints, estimateCarbonAvoided } from "@/lib/eco";
import { MATERIAL_BY_ID } from "@/mocks/materials";
import { REWARDS } from "@/mocks/rewards";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { MaterialId } from "@/types";

interface ItemSimulador {
  materialId: MaterialId;
  rotulo: string;
  unidade: string;
  /** Peso de uma unidade em kg, quando difere do padrão do material. */
  pesoUnitario?: number;
  passo: number;
  inicial: number;
}

const ITENS: ItemSimulador[] = [
  { materialId: "plastico", rotulo: "Garrafas PET", unidade: "garrafas", pesoUnitario: 0.032, passo: 5, inicial: 20 },
  { materialId: "metal", rotulo: "Latas de alumínio", unidade: "latas", pesoUnitario: 0.015, passo: 5, inicial: 15 },
  { materialId: "papel", rotulo: "Papel e papelão", unidade: "folhas/caixas", pesoUnitario: 0.08, passo: 5, inicial: 10 },
  { materialId: "vidro", rotulo: "Garrafas de vidro", unidade: "garrafas", pesoUnitario: 0.35, passo: 2, inicial: 6 },
  { materialId: "eletronico", rotulo: "Eletrônicos", unidade: "itens", pesoUnitario: 0.4, passo: 1, inicial: 2 },
];

/**
 * Simulador de impacto. Roda inteiro no cliente, usando os mesmos
 * `calculateEcoPoints` e `estimateCarbonAvoided` que o app usa de verdade —
 * o número que aparece aqui é o número que o usuário receberia.
 */
export function ImpactSimulator() {
  const [quantidades, setQuantidades] = React.useState<Record<string, number>>(
    Object.fromEntries(ITENS.map((item) => [item.materialId, item.inicial])),
  );

  const resultado = React.useMemo(() => {
    let pesoKg = 0;
    let pontos = 0;
    let co2 = 0;

    for (const item of ITENS) {
      const material = MATERIAL_BY_ID[item.materialId];
      const peso =
        (quantidades[item.materialId] ?? 0) *
        (item.pesoUnitario ?? material.pesoUnitarioKg);
      pesoKg += peso;
      pontos += calculateEcoPoints(item.materialId, peso);
      co2 += estimateCarbonAvoided(item.materialId, peso);
    }

    const alcancavel = REWARDS.filter((r) => r.pontos <= pontos).sort(
      (a, b) => b.pontos - a.pontos,
    )[0];

    return { pesoKg, pontos, co2, recompensa: alcancavel ?? null };
  }, [quantidades]);

  const ajustar = (materialId: MaterialId, delta: number) =>
    setQuantidades((atual) => ({
      ...atual,
      [materialId]: Math.max(0, Math.min(999, (atual[materialId] ?? 0) + delta)),
    }));

  const vazio = resultado.pesoKg === 0;

  return (
    <section className="border-b border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto max-w-[1360px] px-4 py-16 lg:px-6 lg:py-24">
        <div className="max-w-2xl">
          <p className="eyebrow">Calcule antes de começar</p>
          <h2 className="mt-4 text-balance font-display text-h1 text-[var(--fg)]">
            Simule seu impacto.
          </h2>
          <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-[var(--fg-muted)]">
            Informe o que costuma descartar em um mês. O cálculo usa os mesmos
            fatores de pontuação e de CO2 aplicados dentro da plataforma.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
          {/* Entradas */}
          <ul className="space-y-px overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--border)]">
            {ITENS.map((item) => {
              const material = MATERIAL_BY_ID[item.materialId];
              const quantidade = quantidades[item.materialId] ?? 0;
              const peso = quantidade * (item.pesoUnitario ?? material.pesoUnitarioKg);

              return (
                <li
                  key={item.materialId}
                  className="flex items-center gap-4 bg-[var(--bg)] px-4 py-4"
                >
                  <span
                    aria-hidden
                    className="size-2.5 shrink-0 rounded-[2px]"
                    style={{ background: material.cor }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[13.5px] font-medium text-[var(--fg)]">
                      {item.rotulo}
                    </p>
                    <p className="mt-0.5 text-[11.5px] tabular text-[var(--fg-subtle)]">
                      {formatNumber(peso, 1)} kg · {material.pontosPorKg} pts/kg
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => ajustar(item.materialId, -item.passo)}
                      disabled={quantidade === 0}
                      aria-label={`Diminuir ${item.rotulo}`}
                      className="flex size-8 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--border)] text-[var(--fg-muted)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--fg)] disabled:pointer-events-none disabled:opacity-35"
                    >
                      <Minus className="size-3.5" weight="bold" />
                    </button>

                    <label className="sr-only" htmlFor={`sim-${item.materialId}`}>
                      Quantidade de {item.rotulo} em {item.unidade}
                    </label>
                    <input
                      id={`sim-${item.materialId}`}
                      type="number"
                      min={0}
                      max={999}
                      value={quantidade}
                      onChange={(evento) =>
                        setQuantidades((atual) => ({
                          ...atual,
                          [item.materialId]: Math.max(
                            0,
                            Math.min(999, Number(evento.target.value) || 0),
                          ),
                        }))
                      }
                      className="h-8 w-14 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] text-center text-[13px] font-medium tabular text-[var(--fg)] outline-none focus:border-[var(--accent)] focus:ring-[3px] focus:ring-[var(--accent-glow)] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />

                    <button
                      type="button"
                      onClick={() => ajustar(item.materialId, item.passo)}
                      aria-label={`Aumentar ${item.rotulo}`}
                      className="flex size-8 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--border)] text-[var(--fg-muted)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--fg)]"
                    >
                      <Plus className="size-3.5" weight="bold" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Resultado */}
          <Panel className="flex flex-col self-start bg-[var(--bg)] p-6 lg:p-7">
            <p className="eyebrow">Resultado estimado por mês</p>

            <dl className="mt-6 space-y-6">
              <div>
                <dt className="text-[12.5px] text-[var(--fg-muted)]">
                  EcoPontos gerados
                </dt>
                <dd className="mt-1.5 font-display text-[40px] font-semibold leading-none tabular tracking-[-0.035em] text-[var(--accent)]">
                  {formatNumber(resultado.pontos)}
                </dd>
              </div>

              <div className="grid grid-cols-2 gap-6 border-t border-[var(--border)] pt-5">
                <div>
                  <dt className="text-[12.5px] text-[var(--fg-muted)]">
                    Peso total
                  </dt>
                  <dd className="mt-1.5 font-display text-[22px] font-semibold tabular tracking-[-0.02em] text-[var(--fg)]">
                    {formatNumber(resultado.pesoKg, 1)}
                    <span className="ml-1 text-[13px] font-medium text-[var(--fg-muted)]">
                      kg
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-[12.5px] text-[var(--fg-muted)]">
                    CO2 evitado
                  </dt>
                  <dd className="mt-1.5 font-display text-[22px] font-semibold tabular tracking-[-0.02em] text-[var(--fg)]">
                    {formatNumber(resultado.co2, 1)}
                    <span className="ml-1 text-[13px] font-medium text-[var(--fg-muted)]">
                      kg
                    </span>
                  </dd>
                </div>
              </div>
            </dl>

            <div
              className={cn(
                "mt-6 rounded-[var(--radius-md)] border p-4",
                resultado.recompensa
                  ? "border-[var(--accent-line)] bg-[var(--accent-soft)]"
                  : "border-[var(--border)] bg-[var(--surface-2)]",
              )}
            >
              <p className="text-[11.5px] font-medium uppercase tracking-[0.08em] text-[var(--fg-subtle)]">
                {resultado.recompensa ? "Já dá para resgatar" : "Recompensa possível"}
              </p>
              {resultado.recompensa ? (
                <>
                  <p className="mt-2 text-[14px] font-medium text-[var(--fg)]">
                    {resultado.recompensa.nome}
                  </p>
                  <p className="mt-0.5 text-[12.5px] tabular text-[var(--fg-muted)]">
                    {resultado.recompensa.parceiro} ·{" "}
                    {formatNumber(resultado.recompensa.pontos)} EcoPontos
                  </p>
                </>
              ) : (
                <p className="mt-2 text-[13px] leading-relaxed text-[var(--fg-muted)]">
                  {vazio
                    ? "Escolha o que você descarta para ver o que dá para trocar."
                    : "Ainda não é suficiente para o catálogo. Some mais alguns itens."}
                </p>
              )}
            </div>

            <Button asChild className="mt-6 w-full">
              <Link href="/demo">
                Ver o catálogo completo
                <ArrowRight weight="bold" />
              </Link>
            </Button>

            <p className="mt-4 text-[11.5px] leading-relaxed text-[var(--fg-subtle)]">
              Estimativa demonstrativa. Os fatores de CO2 por material são
              médias de referência e o cálculo não substitui inventário
              certificado.
            </p>
          </Panel>
        </div>
      </div>
    </section>
  );
}
