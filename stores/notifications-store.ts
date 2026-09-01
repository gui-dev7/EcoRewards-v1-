"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { demoStorage, storeKey } from "./persist-adapter";
import { NOTIFICATIONS } from "@/mocks/notifications";
import type { AppNotification } from "@/types";

interface NotificationsState {
  itens: AppNotification[];
  marcarLida: (id: string) => void;
  marcarTodasLidas: () => void;
  remover: (id: string) => void;
  adicionar: (item: Omit<AppNotification, "id" | "data" | "lida">) => void;
  restaurar: () => void;
}

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set) => ({
      itens: NOTIFICATIONS,

      marcarLida: (id) =>
        set((state) => ({
          itens: state.itens.map((n) => (n.id === id ? { ...n, lida: true } : n)),
        })),

      marcarTodasLidas: () =>
        set((state) => ({
          itens: state.itens.map((n) => ({ ...n, lida: true })),
        })),

      remover: (id) =>
        set((state) => ({ itens: state.itens.filter((n) => n.id !== id) })),

      adicionar: (item) =>
        set((state) => ({
          itens: [
            {
              ...item,
              id: `ntf-${Date.now()}`,
              data: new Date().toISOString(),
              lida: false,
            },
            ...state.itens,
          ],
        })),

      restaurar: () => set({ itens: NOTIFICATIONS }),
    }),
    { name: storeKey("notifications"), storage: demoStorage() },
  ),
);
