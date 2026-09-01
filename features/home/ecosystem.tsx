"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/data-display";
import { ENVIRONMENT_ICON } from "@/components/layout/nav-config";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { formatCompact, formatCurrencyCompact, formatNumber } from "@/lib/format";
import { CITIZEN } from "@/mocks/citizen";
import { COMPANY } from "@/mocks/company";
import { GOVERNMENT } from "@/mocks/government";
import { cn } from "@/lib/utils";
import type { Environment } from "@/types";

interface Ambiente {
  id: Environment;
  nome: string;
  chamada: string;
  texto: string;
  destino: string;
  metricas: { rotulo: string; valor: string; nota: string }[];
  preview: React.ReactNode;
}

const AMBIENTES: Ambiente[] = [
  {
    id: "cidadao",
    nome: "Cidadão",
    chamada: "Reciclar deixa de ser só obrigação.",
    texto:
      "O descarte vira pontuação, a pontuação vira recompensa e a recompensa vira hábito. Progressão em seis níveis, desafios semanais, ranking e um passaporte de impacto que dá para compartilhar.",
    destino: "/app",
    metricas: [
      { rotulo: "EcoPontos disponíveis", valor: formatNumber(CITIZEN.ecoPontos), nota: "Saldo da conta demo" },
      { rotulo: "Material reciclado", valor: `${formatNumber(CITIZEN.kgReciclados, 1)} kg`, nota: `${CITIZEN.descartes} descartes validados` },
      { rotulo: "Sequência", valor: `${CITIZEN.streakSemanas} semanas`, nota: "Consecutivas com atividade" },
    ],
    preview: <PreviewCidadao />,
  },
  {
    id: "empresa",
    nome: "Empresa",
    chamada: "Meta ESG com número que sustenta auditoria.",
    texto:
      "Adesão por departamento, campanhas internas com meta em tonelada, orçamento de recompensas e relatório pronto para exportar. O engajamento do time vira indicador, não estimativa.",
    destino: "/empresa",
    metricas: [
      { rotulo: "Colaboradores", valor: formatNumber(COMPANY.colaboradores), nota: `${COMPANY.colaboradoresAtivos} ativos no programa` },
      { rotulo: "Reciclado no ano", valor: `${formatNumber(COMPANY.toneladasRecicladas, 1)} t`, nota: `Meta anual de ${COMPANY.metaAnualToneladas} t` },
      { rotulo: "CO2 evitado", valor: `${formatNumber(COMPANY.co2EvitadoToneladas, 1)} t`, nota: "Pelos fatores de cada material" },
    ],
    preview: <PreviewEmpresa />,
  },
  {
    id: "governo",
    nome: "Governo",
    chamada: "Política pública com leitura territorial.",
    texto:
      "Mapa por camadas, ranking regional de adesão e custo, execução orçamentária e uma central de anomalias que sinaliza o que precisa de fiscalização antes do prejuízo.",
    destino: "/governo",
    metricas: [
      { rotulo: "Usuários ativos", valor: formatCompact(GOVERNMENT.usuariosAtivos), nota: `Em ${GOVERNMENT.municipios} municípios` },
      { rotulo: "Ecopontos na rede", valor: formatNumber(GOVERNMENT.ecopontosAtivos), nota: "Monitorados em tempo real" },
      { rotulo: "Economia com aterro", valor: formatCurrencyCompact(GOVERNMENT.economiaAterro), nota: "Custo evitado no exercício" },
    ],
    preview: <PreviewGoverno />,
  },
];

export function Ecosystem() {
  const [ativo, setAtivo] = React.useState<Environment>("cidadao");
  const reduzido = useReducedMotion();
  const ambiente = AMBIENTES.find((a) => a.id === ativo)!;

  return (
    <section
      data-env={ativo}
      className="border-b border-[var(--border)] transition-colors duration-500"
    >
      <div className="mx-auto max-w-[1360px] px-4 py-16 lg:px-6 lg:py-24">
        <div className="max-w-2xl">
          <p className="eyebrow">Um produto, três leituras</p>
          <h2 className="mt-4 text-balance font-display text-h1 text-[var(--fg)]">
            O mesmo dado atende quem recicla, quem financia e quem fiscaliza.
          </h2>
        </div>

        {/* Seletor: abas com trilho contínuo, não três cards iguais */}
        <div
          role="tablist"
          aria-label="Ambientes do EcoRewards"
          className="mt-10 flex gap-1 border-b border-[var(--border)]"
        >
          {AMBIENTES.map((item) => {
            const Icon = ENVIRONMENT_ICON[item.id];
            const selecionado = item.id === ativo;
            return (
              <button
                key={item.id}
                role="tab"
                aria-selected={selecionado}
                onClick={() => setAtivo(item.id)}
                className={cn(
                  "relative -mb-px flex items-center gap-2 px-4 py-3 text-[14px] font-medium transition-colors",
                  selecionado
                    ? "text-[var(--fg)]"
                    : "text-[var(--fg-muted)] hover:text-[var(--fg)]",
                )}
              >
                <Icon className="size-[18px]" weight={selecionado ? "fill" : "regular"} />
                {item.nome}
                {selecionado && (
                  <motion.span
                    layoutId="ecosystem-rail"
                    className="absolute inset-x-0 bottom-0 h-[2px] bg-[var(--accent)]"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={ativo}
            initial={reduzido ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduzido ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="grid gap-12 pt-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16"
          >
            <div>
              <h3 className="max-w-[18ch] text-balance font-display text-h2 text-[var(--fg)]">
                {ambiente.chamada}
              </h3>
              <p className="mt-5 max-w-[52ch] text-[15px] leading-relaxed text-[var(--fg-muted)]">
                {ambiente.texto}
              </p>

              <dl className="mt-9 space-y-px overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--border)]">
                {ambiente.metricas.map((metrica) => (
                  <div
                    key={metrica.rotulo}
                    className="flex items-baseline justify-between gap-4 bg-[var(--surface)] px-4 py-3.5"
                  >
                    <div className="min-w-0">
                      <dt className="text-[13px] font-medium text-[var(--fg)]">
                        {metrica.rotulo}
                      </dt>
                      <p className="mt-0.5 text-[12px] text-[var(--fg-subtle)]">
                        {metrica.nota}
                      </p>
                    </div>
                    <dd className="shrink-0 font-display text-[17px] font-semibold tabular text-[var(--accent)]">
                      {metrica.valor}
                    </dd>
                  </div>
                ))}
              </dl>

              <Button asChild className="mt-8">
                <Link href={ambiente.destino}>
                  Abrir ambiente {ambiente.nome.toLowerCase()}
                  <ArrowRight weight="bold" />
                </Link>
              </Button>
            </div>

            <div className="relative overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-6 lg:p-8">
              <div aria-hidden className="dot-texture absolute inset-0 opacity-30" />
              <div className="relative">{ambiente.preview}</div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Previews — esboços da interface real de cada ambiente               */
/* ------------------------------------------------------------------ */

function PreviewCidadao() {
  return (
    <div className="space-y-4">
      <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg)] p-5">
        <p className="text-[11.5px] font-medium text-[var(--fg-subtle)]">
          Saldo disponível
        </p>
        <p className="mt-2 font-display text-[34px] font-semibold leading-none tabular tracking-[-0.03em] text-[var(--fg)]">
          {formatNumber(CITIZEN.ecoPontos)}
          <span className="ml-2 text-[14px] font-medium text-[var(--fg-muted)]">
            EcoPontos
          </span>
        </p>
        <div className="mt-5">
          <div className="mb-2 flex items-baseline justify-between">
            <span className="text-[12px] text-[var(--fg-muted)]">
              Nível Árvore → Floresta
            </span>
            <span className="text-[12px] font-medium tabular text-[var(--fg)]">
              1.280 XP restantes
            </span>
          </div>
          <ProgressBar value={73} size="sm" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-px overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--border)]">
        {[
          { rotulo: "Eco Score", valor: String(CITIZEN.ecoScore) },
          { rotulo: "Sequência", valor: `${CITIZEN.streakSemanas} sem` },
          { rotulo: "Ranking", valor: `#${CITIZEN.posicaoRankingGlobal}` },
        ].map((item) => (
          <div key={item.rotulo} className="bg-[var(--bg)] px-3 py-3.5">
            <p className="text-[10.5px] text-[var(--fg-subtle)]">{item.rotulo}</p>
            <p className="mt-1 font-display text-[18px] font-semibold tabular text-[var(--fg)]">
              {item.valor}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg)] p-4">
        <p className="text-[11.5px] font-medium text-[var(--fg-subtle)]">
          Desafio da semana
        </p>
        <p className="mt-1.5 text-[13.5px] font-medium text-[var(--fg)]">
          Semana sem plástico
        </p>
        <div className="mt-3">
          <ProgressBar value={3} max={5} size="sm" />
        </div>
        <p className="mt-2 text-[11.5px] tabular text-[var(--fg-muted)]">
          3 / 5 descartes · +750 EcoPontos
        </p>
      </div>
    </div>
  );
}

function PreviewEmpresa() {
  const meta = (COMPANY.toneladasRecicladas / COMPANY.metaAnualToneladas) * 100;

  return (
    <div className="space-y-4">
      <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg)] p-5">
        <div className="flex items-baseline justify-between">
          <p className="text-[11.5px] font-medium text-[var(--fg-subtle)]">
            Meta anual de reciclagem
          </p>
          <span className="text-[12px] font-medium tabular text-[var(--accent)]">
            {Math.round(meta)}%
          </span>
        </div>
        <p className="mt-2 font-display text-[30px] font-semibold leading-none tabular tracking-[-0.03em] text-[var(--fg)]">
          {formatNumber(COMPANY.toneladasRecicladas, 1)}
          <span className="ml-1.5 text-[14px] font-medium text-[var(--fg-muted)]">
            de {COMPANY.metaAnualToneladas} t
          </span>
        </p>
        <div className="mt-4">
          <ProgressBar value={meta} size="sm" />
        </div>
      </div>

      {/* Esboço de barras por departamento — a leitura é a comparação */}
      <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg)] p-5">
        <p className="text-[11.5px] font-medium text-[var(--fg-subtle)]">
          Adesão por departamento
        </p>
        <ul className="mt-4 space-y-3">
          {[
            { nome: "Engenharia", valor: 92 },
            { nome: "Operações", valor: 81 },
            { nome: "Comercial", valor: 67 },
            { nome: "Financeiro", valor: 54 },
          ].map((dep) => (
            <li key={dep.nome} className="flex items-center gap-3">
              <span className="w-24 shrink-0 truncate text-[12px] text-[var(--fg-muted)]">
                {dep.nome}
              </span>
              <span className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--surface-3)]">
                <span
                  className="block h-full rounded-full bg-[var(--accent)]"
                  style={{ width: `${dep.valor}%` }}
                />
              </span>
              <span className="w-9 shrink-0 text-right text-[12px] font-medium tabular text-[var(--fg)]">
                {dep.valor}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function PreviewGoverno() {
  return (
    <div className="space-y-4">
      <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg)] p-5">
        <p className="text-[11.5px] font-medium text-[var(--fg-subtle)]">
          Execução orçamentária
        </p>
        <p className="mt-2 font-display text-[30px] font-semibold leading-none tabular tracking-[-0.03em] text-[var(--fg)]">
          {formatCurrencyCompact(GOVERNMENT.orcamentoExecutado)}
          <span className="ml-1.5 text-[14px] font-medium text-[var(--fg-muted)]">
            de {formatCurrencyCompact(GOVERNMENT.orcamentoAnual)}
          </span>
        </p>
        <div className="mt-4">
          <ProgressBar
            value={(GOVERNMENT.orcamentoExecutado / GOVERNMENT.orcamentoAnual) * 100}
            size="sm"
          />
        </div>
      </div>

      {/* Esboço do mapa por regiões — intensidade pela rampa sequencial */}
      <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg)] p-5">
        <div className="flex items-baseline justify-between">
          <p className="text-[11.5px] font-medium text-[var(--fg-subtle)]">
            Volume reciclado por região
          </p>
          <span className="text-[11px] text-[var(--fg-subtle)]">menor → maior</span>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-1.5">
          {[3, 5, 2, 6, 4, 6, 3, 5, 1, 4, 5, 2].map((nivel, indice) => (
            <span
              key={indice}
              className="aspect-square rounded-[3px]"
              style={{ background: `var(--seq-${nivel})` }}
            />
          ))}
        </div>
        <div className="mt-4 flex items-center gap-1">
          {[1, 2, 3, 4, 5, 6].map((nivel) => (
            <span
              key={nivel}
              className="h-1.5 flex-1 rounded-full"
              style={{ background: `var(--seq-${nivel})` }}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg)] px-4 py-3.5">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--critical-soft)] font-display text-[13px] font-semibold text-[var(--critical)]">
          92
        </span>
        <div className="min-w-0">
          <p className="truncate text-[13px] font-medium text-[var(--fg)]">
            Possível duplicação de QR
          </p>
          <p className="truncate text-[11.5px] text-[var(--fg-muted)]">
            São Paulo — Ecoponto 038
          </p>
        </div>
      </div>
    </div>
  );
}
