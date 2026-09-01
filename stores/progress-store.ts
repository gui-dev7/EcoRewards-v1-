"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { demoStorage, storeKey } from "./persist-adapter";
import { CHALLENGES, COMPLETED_CHALLENGE_IDS } from "@/mocks/challenges";
import { BADGES } from "@/mocks/badges";
import type { Badge, Challenge } from "@/types";

interface ProgressState {
  progressoDesafios: Record<string, number>;
  desafiosConcluidos: string[];
  medalhasDesbloqueadas: string[];
  /** Medalha recém-desbloqueada, consumida pela animação de conquista. */
  medalhaEmDestaque: string | null;

  avancarDesafio: (id: string, incremento?: number) => Challenge | null;
  concluirDesafio: (id: string) => void;
  desbloquearMedalha: (id: string) => Badge | null;
  limparDestaque: () => void;
  desafios: () => Challenge[];
  medalhas: () => Badge[];
  restaurar: () => void;
}

const progressoInicial = Object.fromEntries(
  CHALLENGES.map((c) => [c.id, c.progresso]),
);

const medalhasIniciais = BADGES.filter((b) => b.desbloqueada).map((b) => b.id);

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      progressoDesafios: progressoInicial,
      desafiosConcluidos: [...COMPLETED_CHALLENGE_IDS],
      medalhasDesbloqueadas: medalhasIniciais,
      medalhaEmDestaque: null,

      avancarDesafio: (id, incremento = 1) => {
        const base = CHALLENGES.find((c) => c.id === id);
        if (!base) return null;

        const atual = get().progressoDesafios[id] ?? base.progresso;
        const proximo = Math.min(atual + incremento, base.meta);
        const concluiu = proximo >= base.meta;

        set((state) => ({
          progressoDesafios: { ...state.progressoDesafios, [id]: proximo },
          desafiosConcluidos:
            concluiu && !state.desafiosConcluidos.includes(id)
              ? [...state.desafiosConcluidos, id]
              : state.desafiosConcluidos,
        }));

        return { ...base, progresso: proximo, concluido: concluiu };
      },

      concluirDesafio: (id) => {
        const base = CHALLENGES.find((c) => c.id === id);
        if (!base) return;
        set((state) => ({
          progressoDesafios: { ...state.progressoDesafios, [id]: base.meta },
          desafiosConcluidos: state.desafiosConcluidos.includes(id)
            ? state.desafiosConcluidos
            : [...state.desafiosConcluidos, id],
        }));
      },

      desbloquearMedalha: (id) => {
        const medalha = BADGES.find((b) => b.id === id);
        if (!medalha || get().medalhasDesbloqueadas.includes(id)) return null;
        set((state) => ({
          medalhasDesbloqueadas: [...state.medalhasDesbloqueadas, id],
          medalhaEmDestaque: id,
        }));
        return { ...medalha, desbloqueada: true };
      },

      limparDestaque: () => set({ medalhaEmDestaque: null }),

      desafios: () => {
        const { progressoDesafios, desafiosConcluidos } = get();
        return CHALLENGES.map((c) => ({
          ...c,
          progresso: progressoDesafios[c.id] ?? c.progresso,
          concluido: desafiosConcluidos.includes(c.id),
        }));
      },

      medalhas: () => {
        const { medalhasDesbloqueadas } = get();
        return BADGES.map((b) => ({
          ...b,
          desbloqueada: medalhasDesbloqueadas.includes(b.id),
        }));
      },

      restaurar: () =>
        set({
          progressoDesafios: progressoInicial,
          desafiosConcluidos: [...COMPLETED_CHALLENGE_IDS],
          medalhasDesbloqueadas: medalhasIniciais,
          medalhaEmDestaque: null,
        }),
    }),
    {
      name: storeKey("progress"),
      storage: demoStorage(),
      partialize: ({ medalhaEmDestaque: _destaque, ...rest }) => rest,
    },
  ),
);
