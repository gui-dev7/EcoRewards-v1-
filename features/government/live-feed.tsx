"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Gift,
  MapPin,
  Medal,
  Recycle,
  Target,
} from "@phosphor-icons/react";
import { StatusDot } from "@/components/ui/badge";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { LIVE_EVENTS } from "@/mocks/live-feed";
import { formatNumber } from "@/lib/format";
import type { LiveEvent } from "@/types";

const ICONE: Record<
  LiveEvent["tipo"],
  React.ComponentType<{ className?: string; weight?: "duotone" | "fill" | "bold" }>
> = {
  descarte: Recycle,
  meta: Target,
  ecoponto: MapPin,
  resgate: Gift,
  conquista: Medal,
};

/** Intervalo fixo entre eventos — a demonstração precisa ser previsível. */
const INTERVALO_MS = 4200;

interface EventoVisivel extends LiveEvent {
  chave: string;
  segundos: number;
}

/**
 * EcoRewards Live.
 *
 * Percorre `LIVE_EVENTS` em ordem, num intervalo fixo. Não há sorteio nem
 * dado gerado em tempo real: é o mesmo conjunto demonstrativo, apresentado
 * como um fluxo. Com `prefers-reduced-motion` a rotação automática é
 * desligada e a lista aparece estática.
 */
export function LiveFeed() {
  const reduzido = useReducedMotion();
  const indiceRef = React.useRef(0);
  const [totalEventos, setTotalEventos] = React.useState(4_532_291);

  // Os cinco primeiros eventos já entram no estado inicial, com idades
  // escalonadas — não há efeito de montagem só para semear a lista.
  const [visiveis, setVisiveis] = React.useState<EventoVisivel[]>(() =>
    LIVE_EVENTS.slice(0, 5).map((evento, posicao) => ({
      ...evento,
      chave: `${evento.id}-inicial`,
      segundos: 18 + posicao * 24,
    })),
  );

  React.useEffect(() => {
    if (reduzido) return;

    const timer = window.setInterval(() => {
      const proximo = (indiceRef.current + 5) % LIVE_EVENTS.length;
      indiceRef.current = proximo;
      const evento = LIVE_EVENTS[proximo];

      setVisiveis((lista) =>
        [
          { ...evento, chave: `${evento.id}-${Date.now()}`, segundos: 0 },
          ...lista.map((item) => ({
            ...item,
            segundos: item.segundos + INTERVALO_MS / 1000,
          })),
        ].slice(0, 5),
      );

      setTotalEventos((valor) => valor + 1);
    }, INTERVALO_MS);

    return () => window.clearInterval(timer);
  }, [reduzido]);

  return (
    <section className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
      <header className="flex items-center justify-between gap-3 border-b border-[var(--border)] px-5 py-4">
        <div>
          <h2 className="font-display text-[15px] font-semibold text-[var(--fg)]">
            EcoRewards Live
          </h2>
          <p className="mt-0.5 text-[11.5px] text-[var(--fg-subtle)]">
            {formatNumber(totalEventos)} ações registradas na plataforma
          </p>
        </div>
        <StatusDot
          tone="good"
          label={reduzido ? "Feed pausado" : "Ao vivo"}
          pulse={!reduzido}
        />
      </header>

      <ul className="divide-y divide-[var(--border)]">
        <AnimatePresence initial={false}>
          {visiveis.map((evento) => {
            const Icon = ICONE[evento.tipo];
            return (
              <motion.li
                key={evento.chave}
                layout={!reduzido}
                initial={reduzido ? false : { opacity: 0, y: -12, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={reduzido ? undefined : { opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="flex gap-3 px-5 py-3.5">
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--surface-2)] text-[var(--fg-subtle)]">
                    <Icon className="size-4" weight="duotone" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] leading-snug text-[var(--fg)]">
                      {evento.mensagem}
                    </p>
                    <p className="mt-0.5 truncate text-[11.5px] text-[var(--fg-muted)]">
                      {evento.detalhe}
                    </p>
                  </div>
                  <span className="shrink-0 text-[11px] tabular text-[var(--fg-subtle)]">
                    {formatarIdade(evento.segundos)}
                  </span>
                </div>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>

      <p className="border-t border-[var(--border)] px-5 py-3 text-[11px] leading-relaxed text-[var(--fg-subtle)]">
        Fluxo demonstrativo: os eventos percorrem um conjunto fixo de dados
        mockados, em intervalo constante.
      </p>
    </section>
  );
}

function formatarIdade(segundos: number) {
  if (segundos < 60) return `há ${Math.max(Math.round(segundos), 1)}s`;
  const minutos = Math.round(segundos / 60);
  if (minutos < 60) return `há ${minutos}min`;
  return `há ${Math.round(minutos / 60)}h`;
}
