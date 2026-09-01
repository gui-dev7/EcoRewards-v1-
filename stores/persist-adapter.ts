import { createJSONStorage, type PersistStorage } from "zustand/middleware";

/**
 * Adaptador entre o `persist` do Zustand e a abstração de armazenamento
 * do projeto — mantém o prefixo `ecorewards:` e sobrevive a modo privado.
 */
export function demoStorage<T>(): PersistStorage<T> | undefined {
  return createJSONStorage<T>(() => {
    if (typeof window === "undefined") {
      return {
        getItem: () => null,
        setItem: () => undefined,
        removeItem: () => undefined,
      };
    }
    try {
      // Toque de leitura para detectar armazenamento bloqueado.
      window.localStorage.getItem("ecorewards:probe");
      return window.localStorage;
    } catch {
      const memory = new Map<string, string>();
      return {
        getItem: (name: string) => memory.get(name) ?? null,
        setItem: (name: string, value: string) => void memory.set(name, value),
        removeItem: (name: string) => void memory.delete(name),
      };
    }
  });
}

export const storeKey = (name: string) => `ecorewards:${name}`;
