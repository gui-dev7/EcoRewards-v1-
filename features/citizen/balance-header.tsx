"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, QrCode, TrendUp } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/data-display";
import { useWalletStore } from "@/stores";
import { useHydrated } from "@/hooks/use-hydrated";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { formatNumber } from "@/lib/format";
import { CITIZEN } from "@/mocks/citizen";

/**
 * Cabeçalho do painel. O saldo pulsa uma vez quando cresce — o
 * `ultimoGanho` do store é consumido aqui e limpo em seguida, para que a
 * animação não se repita ao navegar de volta.
 */
export function BalanceHeader() {
  const hydrated = useHydrated();
  const reduzido = useReducedMotion();
  const saldo = useWalletStore((s) => s.ecoPontos);
  const ultimoGanho = useWalletStore((s) => s.ultimoGanho);
  const limparUltimoGanho = useWalletStore((s) => s.limparUltimoGanho);

  /**
   * O pulso é derivado do próprio `ultimoGanho`: enquanto ele existe, a
   * animação roda. O efeito serve apenas para limpá-lo depois — nada de
   * estado espelhado.
   */
  const pulsando = ultimoGanho !== null;

  React.useEffect(() => {
    if (ultimoGanho === null) return;
    const timer = window.setTimeout(() => limparUltimoGanho(), 1400);
    return () => window.clearTimeout(timer);
  }, [ultimoGanho, limparUltimoGanho]);

  const valor = hydrated ? saldo : CITIZEN.ecoPontos;

  return (
    <header className="flex flex-wrap items-end justify-between gap-6 border-b border-[var(--border)] pb-7">
      <div className="flex items-center gap-4">
        <Avatar iniciais={CITIZEN.avatarIniciais} size="lg" />
        <div className="min-w-0">
          <p className="text-[13px] text-[var(--fg-muted)]">Bom te ver de volta,</p>
          <h1 className="mt-0.5 font-display text-h2 text-[var(--fg)]">
            {CITIZEN.nome.split(" ")[0]}
          </h1>
          <p className="mt-1 text-[12.5px] text-[var(--fg-subtle)]">
            {CITIZEN.cidade}, {CITIZEN.estado} · membro desde{" "}
            {new Date(CITIZEN.membroDesde).getFullYear()}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-6">
        <div className="relative">
          <p className="text-[12px] font-medium text-[var(--fg-subtle)]">
            Saldo disponível
          </p>
          <motion.p
            animate={
              pulsando && !reduzido
                ? { scale: [1, 1.045, 1], color: ["var(--fg)", "var(--accent)", "var(--fg)"] }
                : {}
            }
            transition={{ duration: 1.1, ease: "easeOut" }}
            className="mt-1.5 font-display text-[40px] font-semibold leading-none tabular tracking-[-0.035em] text-[var(--fg)]"
          >
            {formatNumber(valor)}
          </motion.p>
          <p className="mt-1.5 text-[12px] text-[var(--fg-muted)]">EcoPontos</p>

          {pulsando && ultimoGanho && !reduzido && (
            <motion.span
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: [0, 1, 1, 0], y: [6, -6, -14, -22] }}
              transition={{ duration: 1.4, times: [0, 0.2, 0.7, 1] }}
              className="pointer-events-none absolute -right-2 top-4 text-[14px] font-semibold tabular text-[var(--accent)]"
            >
              +{formatNumber(ultimoGanho)}
            </motion.span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button asChild size="lg">
            <Link href="/app/scanner">
              <QrCode weight="bold" />
              Registrar descarte
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="hidden sm:inline-flex">
            <Link href="/app/recompensas">
              Recompensas
              <ArrowRight weight="bold" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

/** Faixa de indicadores logo abaixo do cabeçalho. */
export function QuickStats() {
  const hydrated = useHydrated();
  const kg = useWalletStore((s) => s.kgReciclados);
  const co2 = useWalletStore((s) => s.co2EvitadoKg);
  const descartes = useWalletStore((s) => s.descartes);

  const itens = [
    {
      rotulo: "Material reciclado",
      valor: `${formatNumber(hydrated ? kg : CITIZEN.kgReciclados, 1)} kg`,
      nota: `${hydrated ? descartes : CITIZEN.descartes} descartes validados`,
    },
    {
      rotulo: "CO2 evitado",
      valor: `${formatNumber(hydrated ? co2 : CITIZEN.co2EvitadoKg)} kg`,
      nota: "Pelos fatores de cada material",
    },
    {
      rotulo: "Ranking global",
      valor: `#${CITIZEN.posicaoRankingGlobal}`,
      nota: `Entre ${formatNumber(CITIZEN.totalUsuariosGlobal)} recicladores`,
    },
    {
      rotulo: "Ranking em São Paulo",
      valor: `#${CITIZEN.posicaoRankingCidade}`,
      nota: "Subiu 14 posições na semana",
      destaque: true,
    },
  ];

  return (
    <dl className="grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-4">
      {itens.map((item) => (
        <div key={item.rotulo} className="bg-[var(--surface)] px-5 py-4">
          <dt className="text-[12px] font-medium text-[var(--fg-muted)]">
            {item.rotulo}
          </dt>
          <dd className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-[26px] font-semibold leading-none tabular tracking-[-0.03em] text-[var(--fg)]">
              {item.valor}
            </span>
            {item.destaque && (
              <TrendUp className="size-4 text-[var(--good)]" weight="bold" aria-hidden />
            )}
          </dd>
          <p className="mt-2 text-[11.5px] text-[var(--fg-subtle)]">{item.nota}</p>
        </div>
      ))}
    </dl>
  );
}
