"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { demoStorage, storeKey } from "./persist-adapter";
import { CITIZEN, CITIZEN_TRANSACTIONS } from "@/mocks/citizen";
import { INITIAL_REDEMPTIONS } from "@/mocks/rewards";
import { calculateEcoPoints, estimateCarbonAvoided } from "@/lib/eco";
import { generateVoucherCode } from "@/lib/utils";
import type {
  MaterialId,
  Redemption,
  Reward,
  WalletTransaction,
} from "@/types";

export interface DisposalResult {
  pontos: number;
  co2Kg: number;
  transacao: WalletTransaction;
}

interface WalletState {
  ecoPontos: number;
  xp: number;
  kgReciclados: number;
  co2EvitadoKg: number;
  descartes: number;
  transacoes: WalletTransaction[];
  resgates: Redemption[];
  favoritos: string[];
  /** Última movimentação, usada para disparar a animação de saldo. */
  ultimoGanho: number | null;

  registrarDescarte: (
    materialId: MaterialId,
    pesoKg: number,
    ecoponto: string,
  ) => DisposalResult;
  resgatar: (reward: Reward) => { ok: true; resgate: Redemption } | { ok: false; erro: string };
  marcarResgateUsado: (id: string) => void;
  alternarFavorito: (rewardId: string) => void;
  creditarBonus: (descricao: string, origem: string, pontos: number) => void;
  limparUltimoGanho: () => void;
  restaurar: () => void;
}

const estadoInicial = {
  ecoPontos: CITIZEN.ecoPontos,
  xp: CITIZEN.xp,
  kgReciclados: CITIZEN.kgReciclados,
  co2EvitadoKg: CITIZEN.co2EvitadoKg,
  descartes: CITIZEN.descartes,
  transacoes: CITIZEN_TRANSACTIONS,
  resgates: INITIAL_REDEMPTIONS,
  favoritos: [] as string[],
  ultimoGanho: null as number | null,
};

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      ...estadoInicial,

      registrarDescarte: (materialId, pesoKg, ecoponto) => {
        const pontos = calculateEcoPoints(materialId, pesoKg, CITIZEN.streakSemanas);
        const co2Kg = estimateCarbonAvoided(materialId, pesoKg);
        const transacao: WalletTransaction = {
          id: `trx-${Date.now()}`,
          data: new Date().toISOString(),
          descricao: "Descarte validado",
          origem: ecoponto,
          tipo: "ganho",
          pontos,
          status: "concluido",
          materialId,
          pesoKg,
        };

        set((state) => ({
          ecoPontos: state.ecoPontos + pontos,
          xp: state.xp + pontos,
          kgReciclados: Number((state.kgReciclados + pesoKg).toFixed(1)),
          co2EvitadoKg: Number((state.co2EvitadoKg + co2Kg).toFixed(1)),
          descartes: state.descartes + 1,
          transacoes: [transacao, ...state.transacoes],
          ultimoGanho: pontos,
        }));

        return { pontos, co2Kg, transacao };
      },

      resgatar: (reward) => {
        const { ecoPontos } = get();
        if (ecoPontos < reward.pontos) {
          return {
            ok: false,
            erro: `Faltam ${reward.pontos - ecoPontos} EcoPontos para este resgate.`,
          };
        }

        const agora = new Date();
        const validade = new Date(agora);
        validade.setDate(validade.getDate() + 60);

        const resgate: Redemption = {
          id: `rdm-${Date.now()}`,
          rewardId: reward.id,
          nome: reward.nome,
          parceiro: reward.parceiro,
          codigo: generateVoucherCode(),
          pontos: reward.pontos,
          resgatadoEm: agora.toISOString(),
          validade: validade.toISOString(),
          status: "ativo",
        };

        const transacao: WalletTransaction = {
          id: `trx-${Date.now()}`,
          data: agora.toISOString(),
          descricao: `Resgate — ${reward.nome}`,
          origem: reward.parceiro,
          tipo: "gasto",
          pontos: -reward.pontos,
          status: "concluido",
        };

        set((state) => ({
          ecoPontos: state.ecoPontos - reward.pontos,
          resgates: [resgate, ...state.resgates],
          transacoes: [transacao, ...state.transacoes],
        }));

        return { ok: true, resgate };
      },

      marcarResgateUsado: (id) =>
        set((state) => ({
          resgates: state.resgates.map((r) =>
            r.id === id ? { ...r, status: "usado" as const } : r,
          ),
        })),

      alternarFavorito: (rewardId) =>
        set((state) => ({
          favoritos: state.favoritos.includes(rewardId)
            ? state.favoritos.filter((id) => id !== rewardId)
            : [...state.favoritos, rewardId],
        })),

      creditarBonus: (descricao, origem, pontos) => {
        const transacao: WalletTransaction = {
          id: `trx-${Date.now()}`,
          data: new Date().toISOString(),
          descricao,
          origem,
          tipo: "bonus",
          pontos,
          status: "concluido",
        };
        set((state) => ({
          ecoPontos: state.ecoPontos + pontos,
          xp: state.xp + pontos,
          transacoes: [transacao, ...state.transacoes],
          ultimoGanho: pontos,
        }));
      },

      limparUltimoGanho: () => set({ ultimoGanho: null }),

      restaurar: () => set({ ...estadoInicial }),
    }),
    {
      name: storeKey("wallet"),
      storage: demoStorage(),
      partialize: ({ ultimoGanho: _ultimoGanho, ...rest }) => rest,
    },
  ),
);
