"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { demoStorage, storeKey } from "./persist-adapter";

interface PreferencesState {
  sidebarRecolhida: boolean;
  densidade: "confortavel" | "compacta";
  emailNotificacoes: boolean;
  pushNotificacoes: boolean;
  resumoSemanal: boolean;
  perfilPublico: boolean;
  mostrarNoRanking: boolean;
  alternarSidebar: () => void;
  definir: <K extends keyof PreferencesState>(
    chave: K,
    valor: PreferencesState[K],
  ) => void;
  restaurar: () => void;
}

const padrao = {
  sidebarRecolhida: false,
  densidade: "confortavel" as const,
  emailNotificacoes: true,
  pushNotificacoes: true,
  resumoSemanal: true,
  perfilPublico: true,
  mostrarNoRanking: true,
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      ...padrao,
      alternarSidebar: () =>
        set((state) => ({ sidebarRecolhida: !state.sidebarRecolhida })),
      definir: (chave, valor) => set({ [chave]: valor } as never),
      restaurar: () => set({ ...padrao }),
    }),
    { name: storeKey("preferences"), storage: demoStorage() },
  ),
);
