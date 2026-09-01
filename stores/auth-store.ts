"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { demoStorage, storeKey } from "./persist-adapter";
import { DEMO_ACCOUNTS, findDemoAccount } from "@/lib/demo-accounts";
import type { Environment } from "@/types";

interface AuthState {
  environment: Environment | null;
  email: string | null;
  autenticadoEm: string | null;
  entrarComoDemo: (environment: Environment) => string;
  entrarComCredenciais: (
    email: string,
    senha: string,
  ) => { ok: true; destino: string } | { ok: false; erro: string };
  trocarAmbiente: (environment: Environment) => string;
  sair: () => void;
}

/**
 * Autenticação simulada. Não existe back-end: a sessão vive apenas
 * no navegador e serve para dar contexto à demonstração.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      environment: null,
      email: null,
      autenticadoEm: null,

      entrarComoDemo: (environment) => {
        const conta = DEMO_ACCOUNTS[environment];
        set({
          environment,
          email: conta.email,
          autenticadoEm: new Date().toISOString(),
        });
        return conta.home;
      },

      entrarComCredenciais: (email, senha) => {
        const conta = findDemoAccount(email, senha);
        if (!conta) {
          return {
            ok: false,
            erro: "Credenciais não reconhecidas. Use uma das contas demo.",
          };
        }
        set({
          environment: conta.environment,
          email: conta.email,
          autenticadoEm: new Date().toISOString(),
        });
        return { ok: true, destino: conta.home };
      },

      trocarAmbiente: (environment) => {
        const conta = DEMO_ACCOUNTS[environment];
        set({ environment, email: conta.email });
        return conta.home;
      },

      sair: () => set({ environment: null, email: null, autenticadoEm: null }),
    }),
    { name: storeKey("auth"), storage: demoStorage() },
  ),
);
