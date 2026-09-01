"use client";

import * as React from "react";
import { useCountUp } from "@/hooks/use-count-up";
import { useInView } from "@/hooks/use-in-view";
import { formatCompact, formatCurrencyCompact, formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

type Formato = "numero" | "compacto" | "moeda" | "decimal";

/**
 * Contador que só anima quando entra no viewport.
 * O valor final é renderizado no HTML para leitores de tela.
 */
export function AnimatedNumber({
  value,
  formato = "numero",
  duracao = 1600,
  atraso = 0,
  className,
  prefixo,
  sufixo,
}: {
  value: number;
  formato?: Formato;
  duracao?: number;
  atraso?: number;
  className?: string;
  prefixo?: string;
  sufixo?: string;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  const atual = useCountUp(value, {
    ativo: inView,
    duracao,
    atraso,
    casas: formato === "decimal" ? 1 : 0,
  });

  const formatar = (n: number) => {
    if (formato === "compacto") return formatCompact(n);
    if (formato === "moeda") return formatCurrencyCompact(n);
    if (formato === "decimal") return formatNumber(n, 1);
    return formatNumber(n);
  };

  return (
    <span ref={ref} className={cn("tabular", className)}>
      <span aria-hidden>
        {prefixo}
        {formatar(atual)}
        {sufixo}
      </span>
      <span className="sr-only">
        {prefixo}
        {formatar(value)}
        {sufixo}
      </span>
    </span>
  );
}
