"use client";

import { useEffect, useState } from "react";
import { formatDateTime, formatRelative } from "@/lib/format";

/**
 * Renderiza a data absoluta no servidor e troca para o tempo relativo
 * depois da hidratação — evita divergência entre HTML renderizado e cliente.
 */
export function RelativeTime({
  date,
  className,
  refreshMs,
}: {
  date: string;
  className?: string;
  /** Quando definido, recalcula periodicamente (feeds ao vivo). */
  refreshMs?: number;
}) {
  const [texto, setTexto] = useState<string | null>(null);

  useEffect(() => {
    const atualizar = () => setTexto(formatRelative(date));
    atualizar();
    if (!refreshMs) return;
    const timer = window.setInterval(atualizar, refreshMs);
    return () => window.clearInterval(timer);
  }, [date, refreshMs]);

  return (
    <time dateTime={date} title={formatDateTime(date)} className={className}>
      {texto ?? formatDateTime(date)}
    </time>
  );
}
