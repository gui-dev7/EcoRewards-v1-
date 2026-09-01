"use client";

import * as React from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * Atração magnética discreta: o conteúdo desloca no máximo 6px na
 * direção do ponteiro. Só vale para mouse — em toque e sob
 * `prefers-reduced-motion` o componente é um invólucro inerte.
 */
export function MagneticCta({
  children,
  className,
  alcance = 6,
}: {
  children: React.ReactNode;
  className?: string;
  alcance?: number;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const reduzido = useReducedMotion();

  const mover = (evento: React.PointerEvent<HTMLSpanElement>) => {
    if (reduzido || evento.pointerType !== "mouse") return;
    const no = ref.current;
    if (!no) return;
    const caixa = no.getBoundingClientRect();
    const x = (evento.clientX - (caixa.left + caixa.width / 2)) / (caixa.width / 2);
    const y = (evento.clientY - (caixa.top + caixa.height / 2)) / (caixa.height / 2);
    no.style.transform = `translate3d(${(x * alcance).toFixed(2)}px, ${(y * alcance).toFixed(2)}px, 0)`;
  };

  const soltar = () => {
    const no = ref.current;
    if (no) no.style.transform = "translate3d(0, 0, 0)";
  };

  return (
    <span
      ref={ref}
      onPointerMove={mover}
      onPointerLeave={soltar}
      onBlur={soltar}
      className={cn(
        "inline-flex will-change-transform transition-transform duration-300 ease-out",
        className,
      )}
    >
      {children}
    </span>
  );
}
