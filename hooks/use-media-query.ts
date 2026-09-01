"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Assina uma media query pelo `useSyncExternalStore`, que é a API feita
 * para ler estado de fora do React. No servidor devolve `false`, então o
 * primeiro render do cliente confere com o HTML entregue.
 */
export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (aoMudar: () => void) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", aoMudar);
      return () => media.removeEventListener("change", aoMudar);
    },
    [query],
  );

  const ler = useCallback(() => window.matchMedia(query).matches, [query]);

  return useSyncExternalStore(subscribe, ler, () => false);
}

export const useIsMobile = () => useMediaQuery("(max-width: 767px)");
export const useIsTablet = () =>
  useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
export const useIsDesktop = () => useMediaQuery("(min-width: 1024px)");
