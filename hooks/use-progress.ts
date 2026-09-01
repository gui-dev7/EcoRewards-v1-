"use client";

import { useMemo } from "react";
import { CHALLENGES } from "@/mocks/challenges";
import { BADGES } from "@/mocks/badges";
import { useProgressStore } from "@/stores/progress-store";
import type { Badge, Challenge } from "@/types";

/**
 * Deriva desafios e medalhas a partir do estado persistido.
 * Feito com `useMemo` para preservar a identidade referencial —
 * seletores que criam arrays a cada chamada causariam re-render infinito.
 */
export function useChallenges(): Challenge[] {
  const progresso = useProgressStore((s) => s.progressoDesafios);
  const concluidos = useProgressStore((s) => s.desafiosConcluidos);

  return useMemo(
    () =>
      CHALLENGES.map((c) => ({
        ...c,
        progresso: progresso[c.id] ?? c.progresso,
        concluido: concluidos.includes(c.id),
      })),
    [progresso, concluidos],
  );
}

export function useBadges(): Badge[] {
  const desbloqueadas = useProgressStore((s) => s.medalhasDesbloqueadas);

  return useMemo(
    () =>
      BADGES.map((b) => ({
        ...b,
        desbloqueada: desbloqueadas.includes(b.id),
      })),
    [desbloqueadas],
  );
}
