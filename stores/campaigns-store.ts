"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { demoStorage, storeKey } from "./persist-adapter";
import { CAMPAIGNS } from "@/mocks/company";
import type { Campaign, CampaignStatus } from "@/types";

export type CampaignDraft = Omit<Campaign, "id" | "progressoKg" | "participantes">;

interface CampaignsState {
  itens: Campaign[];
  criar: (draft: CampaignDraft) => Campaign;
  atualizar: (id: string, patch: Partial<Campaign>) => void;
  alterarStatus: (id: string, status: CampaignStatus) => void;
  excluir: (id: string) => void;
  restaurar: () => void;
}

export const useCampaignsStore = create<CampaignsState>()(
  persist(
    (set) => ({
      itens: CAMPAIGNS,

      criar: (draft) => {
        const campanha: Campaign = {
          ...draft,
          id: `cmp-${Date.now()}`,
          progressoKg: 0,
          participantes: 0,
        };
        set((state) => ({ itens: [campanha, ...state.itens] }));
        return campanha;
      },

      atualizar: (id, patch) =>
        set((state) => ({
          itens: state.itens.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        })),

      alterarStatus: (id, status) =>
        set((state) => ({
          itens: state.itens.map((c) => (c.id === id ? { ...c, status } : c)),
        })),

      excluir: (id) =>
        set((state) => ({ itens: state.itens.filter((c) => c.id !== id) })),

      restaurar: () => set({ itens: CAMPAIGNS }),
    }),
    { name: storeKey("campaigns"), storage: demoStorage() },
  ),
);
