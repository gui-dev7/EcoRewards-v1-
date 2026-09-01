"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./use-reduced-motion";

interface CountUpOptions {
  duracao?: number;
  atraso?: number;
  /** Só inicia quando verdadeiro — combine com um observador de viewport. */
  ativo?: boolean;
  casas?: number;
}

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

/**
 * Contagem animada com requestAnimationFrame.
 * Com movimento reduzido não há animação alguma: o valor final é
 * devolvido direto, sem passar por estado.
 */
export function useCountUp(valor: number, options: CountUpOptions = {}) {
  const { duracao = 1600, atraso = 0, ativo = true, casas = 0 } = options;
  const reduced = useReducedMotion();
  const [animado, setAnimado] = useState(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (!ativo || reduced) return;

    let inicio: number | null = null;

    const timer = window.setTimeout(() => {
      const step = (timestamp: number) => {
        if (inicio === null) inicio = timestamp;
        const progresso = Math.min((timestamp - inicio) / duracao, 1);
        const fator = 10 ** casas;
        setAnimado(Math.round(valor * easeOutExpo(progresso) * fator) / fator);
        if (progresso < 1) frameRef.current = requestAnimationFrame(step);
      };
      frameRef.current = requestAnimationFrame(step);
    }, atraso);

    const frame = frameRef;
    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(frame.current);
    };
  }, [valor, duracao, atraso, ativo, reduced, casas]);

  // Sem animação, o valor exibido é sempre o final.
  if (reduced || !ativo) return reduced ? valor : 0;
  return animado;
}
