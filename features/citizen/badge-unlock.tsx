"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { Lock } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { LeafMark } from "@/components/brand/leaf-mark";
import { useProgressStore } from "@/stores";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { BADGES } from "@/mocks/badges";
import { formatNumber } from "@/lib/format";
import { RARIDADE_TOM } from "./badge-tone";

/**
 * Desbloqueio de medalha.
 *
 * Deliberadamente não é um `Dialog`: a composição ocupa a tela inteira e
 * encadeia folha → brilho → medalha → nome → XP. O foco volta para o
 * documento ao fechar, e a tecla Esc encerra a cena.
 */
export function BadgeUnlockOverlay() {
  const medalhaId = useProgressStore((s) => s.medalhaEmDestaque);
  const limparDestaque = useProgressStore((s) => s.limparDestaque);
  const reduzido = useReducedMotion();

  const medalha = medalhaId ? BADGES.find((b) => b.id === medalhaId) : null;

  React.useEffect(() => {
    if (!medalha) return;
    const onKeyDown = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") limparDestaque();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [medalha, limparDestaque]);

  return (
    <AnimatePresence>
      {medalha && (
        <motion.div
          role="alertdialog"
          aria-modal="true"
          aria-label={`Conquista desbloqueada: ${medalha.nome}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-[var(--overlay)] p-6 backdrop-blur-sm"
          onClick={limparDestaque}
        >
          <motion.div
            onClick={(evento) => evento.stopPropagation()}
            initial={reduzido ? false : { scale: 0.94, y: 16 }}
            animate={{ scale: 1, y: 0 }}
            exit={reduzido ? undefined : { scale: 0.97, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-sm overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-8 text-center shadow-[var(--shadow-lg)]"
          >
            {/* Brilho radial atrás da medalha */}
            {!reduzido && (
              <motion.span
                aria-hidden
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: [0.4, 1.5, 1.2], opacity: [0, 0.5, 0.22] }}
                transition={{ duration: 1.4, delay: 0.3, ease: "easeOut" }}
                className="pointer-events-none absolute left-1/2 top-24 size-56 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${RARIDADE_TOM[medalha.raridade]} 0%, transparent 68%)`,
                }}
              />
            )}

            <div className="relative">
              {/* 1. A folha */}
              <motion.div
                initial={reduzido ? false : { opacity: 0, scale: 0.6 }}
                animate={{ opacity: [0, 1, 0], scale: [0.6, 1.15, 1.6] }}
                transition={{ duration: 1.1, times: [0, 0.45, 1], ease: "easeOut" }}
                className="pointer-events-none absolute inset-x-0 top-2 flex justify-center"
              >
                <LeafMark className="size-14 text-[var(--accent)]" />
              </motion.div>

              {/* 2. A medalha */}
              <motion.div
                initial={reduzido ? false : { opacity: 0, scale: 0.5, rotate: -18 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{
                  delay: reduzido ? 0 : 0.75,
                  duration: 0.6,
                  ease: [0.22, 1.3, 0.4, 1],
                }}
                className="mx-auto flex size-24 items-center justify-center rounded-full border-2"
                style={{
                  borderColor: RARIDADE_TOM[medalha.raridade],
                  background: `color-mix(in srgb, ${RARIDADE_TOM[medalha.raridade]} 12%, transparent)`,
                }}
              >
                <span
                  className="font-display text-[30px] font-semibold"
                  style={{ color: RARIDADE_TOM[medalha.raridade] }}
                >
                  {medalha.nome.charAt(0)}
                </span>
              </motion.div>

              {/* 3. Nome, descrição e XP */}
              <motion.div
                initial={reduzido ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduzido ? 0 : 1.15, duration: 0.45 }}
              >
                <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--fg-subtle)]">
                  Conquista desbloqueada
                </p>
                <h2 className="mt-2 font-display text-h3 text-[var(--fg)]">
                  {medalha.nome}
                </h2>
                <p className="mt-2.5 text-[13px] leading-relaxed text-[var(--fg-muted)]">
                  {medalha.descricao}
                </p>

                <p
                  className="mt-5 font-display text-[22px] font-semibold tabular"
                  style={{ color: RARIDADE_TOM[medalha.raridade] }}
                >
                  +{formatNumber(medalha.xp)} XP
                </p>

                <Button className="mt-7 w-full" onClick={limparDestaque}>
                  Continuar
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Selo usado nas medalhas ainda bloqueadas da galeria. */
export function LockedBadgeIcon() {
  return (
    <span className="flex size-16 items-center justify-center rounded-full border border-dashed border-[var(--border-strong)] text-[var(--fg-subtle)]">
      <Lock className="size-6" weight="duotone" />
    </span>
  );
}
