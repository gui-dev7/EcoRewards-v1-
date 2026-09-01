"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

const MARCOS = [
  {
    ano: "2023",
    titulo: "Piloto em três ecopontos",
    resumo: "A validação por QR nasce como um teste de campo em Pinheiros.",
    texto:
      "O primeiro protótipo não tinha aplicativo: um operador registrava o descarte numa planilha e o participante recebia um cupom impresso. Em oito semanas, 340 pessoas usaram o sistema. O que ficou claro logo no início foi o ponto que definiria o produto — a validação no local, e não a autodeclaração, era o que dava credibilidade ao número.",
    indicador: { valor: "340", rotulo: "participantes no piloto" },
  },
  {
    ano: "2024",
    titulo: "Plataforma do cidadão",
    resumo: "Pontuação por material, níveis de progressão e o primeiro catálogo.",
    texto:
      "A pontuação passou a variar por material, refletindo a emissão evitada em cada cadeia. Entraram os seis níveis de progressão, os desafios semanais e o primeiro catálogo de recompensas, com quatro parceiros de mobilidade e alimentação. A retenção mensal saltou quando a sequência semanal foi introduzida — a constância era mesmo o gargalo.",
    indicador: { valor: "6", rotulo: "níveis de progressão" },
  },
  {
    ano: "2025",
    titulo: "Ambiente corporativo",
    resumo: "Empresas passam a acompanhar adesão e meta anual em tonelada.",
    texto:
      "A demanda veio das próprias empresas participantes: elas queriam comprovar a logística reversa e o engajamento interno com o mesmo dado que já existia. Surgiram os departamentos, as campanhas com meta coletiva e o relatório ESG exportável. O programa deixou de ser individual e passou a ter uma camada organizacional.",
    indicador: { valor: "182", rotulo: "colaboradores na conta demo" },
  },
  {
    ano: "2026",
    titulo: "Camada pública",
    resumo: "Mapas por região, execução orçamentária e detecção de anomalias.",
    texto:
      "A leitura territorial fechou o ciclo. O poder público passou a enxergar reciclagem per capita por região, custo por tonelada e retorno por real investido. Junto veio a central de anomalias, baseada em regras determinísticas, para sinalizar o que precisa de fiscalização antes que vire prejuízo.",
    indicador: { valor: "42", rotulo: "ecopontos monitorados" },
  },
];

/**
 * Timeline interativa. Selecionar um marco troca o conteúdo à direita;
 * o trilho à esquerda mostra o percurso inteiro para dar contexto.
 */
export function Timeline() {
  const [ativo, setAtivo] = React.useState(MARCOS.length - 1);
  const reduzido = useReducedMotion();
  const marco = MARCOS[ativo];

  return (
    <section className="border-b border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto max-w-[1360px] px-4 py-16 lg:px-6 lg:py-24">
        <div className="max-w-2xl">
          <p className="eyebrow">Percurso</p>
          <h2 className="mt-4 text-balance font-display text-h1 text-[var(--fg)]">
            De um teste de campo a três ambientes integrados.
          </h2>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[320px_1fr] lg:gap-16">
          {/* Trilho */}
          <ol className="relative" role="tablist" aria-label="Marcos do projeto">
            <span
              aria-hidden
              className="absolute left-[7px] top-2 bottom-2 w-px bg-[var(--border)]"
            />

            {MARCOS.map((item, indice) => {
              const selecionado = indice === ativo;
              return (
                <li key={item.ano} className="relative pb-8 last:pb-0">
                  <button
                    role="tab"
                    aria-selected={selecionado}
                    onClick={() => setAtivo(indice)}
                    className="group flex w-full gap-4 text-left"
                  >
                    <span
                      className={cn(
                        "relative z-10 mt-1 size-[15px] shrink-0 rounded-full border-2 transition-colors",
                        selecionado
                          ? "border-[var(--accent)] bg-[var(--accent)]"
                          : "border-[var(--border-strong)] bg-[var(--surface)] group-hover:border-[var(--accent)]",
                      )}
                    />
                    <span className="min-w-0">
                      <span
                        className={cn(
                          "block font-mono text-[12px] font-medium tracking-[0.1em] transition-colors",
                          selecionado ? "text-[var(--accent)]" : "text-[var(--fg-subtle)]",
                        )}
                      >
                        {item.ano}
                      </span>
                      <span
                        className={cn(
                          "mt-1.5 block font-display text-[15px] font-semibold transition-colors",
                          selecionado
                            ? "text-[var(--fg)]"
                            : "text-[var(--fg-muted)] group-hover:text-[var(--fg)]",
                        )}
                      >
                        {item.titulo}
                      </span>
                      <span className="mt-1 block text-[12.5px] leading-relaxed text-[var(--fg-subtle)]">
                        {item.resumo}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          {/* Conteúdo */}
          <div className="lg:sticky lg:top-[calc(var(--header-h)+3rem)] lg:self-start">
            <AnimatePresence mode="wait">
              <motion.article
                key={marco.ano}
                initial={reduzido ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduzido ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--bg)] p-7 lg:p-9"
              >
                <div className="flex flex-wrap items-start justify-between gap-6">
                  <div>
                    <p className="font-mono text-[13px] font-medium tracking-[0.12em] text-[var(--accent)]">
                      {marco.ano}
                    </p>
                    <h3 className="mt-3 font-display text-h2 text-[var(--fg)]">
                      {marco.titulo}
                    </h3>
                  </div>

                  <div className="shrink-0 border-l border-[var(--border)] pl-6">
                    <p className="font-display text-[32px] font-semibold leading-none tabular tracking-[-0.035em] text-[var(--fg)]">
                      {marco.indicador.valor}
                    </p>
                    <p className="mt-2 max-w-[16ch] text-[12px] leading-snug text-[var(--fg-subtle)]">
                      {marco.indicador.rotulo}
                    </p>
                  </div>
                </div>

                <p className="mt-7 max-w-[64ch] text-[16px] leading-[1.75] text-[var(--fg-muted)]">
                  {marco.texto}
                </p>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
