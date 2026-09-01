"use client";

import { useMediaQuery } from "./use-media-query";

/**
 * Respeita `prefers-reduced-motion`. Quando verdadeiro, animações
 * decorativas devem ser suprimidas — apenas o feedback funcional permanece.
 */
export function useReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
