"use client";

import { useSyncExternalStore } from "react";

const semInscricao = () => () => {};

/**
 * `true` somente depois da primeira renderização no cliente.
 * Usado para adiar leituras de estado persistido e evitar divergência
 * entre o HTML do servidor e o do navegador.
 *
 * Implementado com `useSyncExternalStore`: o snapshot do servidor é
 * `false` e o do cliente é `true`, então o React faz a transição no
 * momento certo, sem um efeito que dispara render em cascata.
 */
export function useHydrated() {
  return useSyncExternalStore(
    semInscricao,
    () => true,
    () => false,
  );
}
