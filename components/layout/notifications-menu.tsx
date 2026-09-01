"use client";

import Link from "next/link";
import {
  Bell,
  CheckCircle,
  Coins,
  Gift,
  MapPin,
  Medal,
  Target,
  Wrench,
} from "@phosphor-icons/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/feedback";
import { RelativeTime } from "@/components/ui/relative-time";
import { useNotificationsStore } from "@/stores";
import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils";
import type { NotificationKind } from "@/types";

export const NOTIFICATION_ICON: Record<
  NotificationKind,
  React.ComponentType<{ className?: string; weight?: "regular" | "bold" | "fill" }>
> = {
  pontos: Coins,
  recompensa: Gift,
  desafio: Target,
  conquista: Medal,
  ecoponto: MapPin,
  sistema: Wrench,
};

export function NotificationsMenu() {
  const itens = useNotificationsStore((s) => s.itens);
  const marcarLida = useNotificationsStore((s) => s.marcarLida);
  const marcarTodasLidas = useNotificationsStore((s) => s.marcarTodasLidas);
  const hydrated = useHydrated();

  const naoLidas = hydrated ? itens.filter((n) => !n.lida).length : 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={
            naoLidas > 0 ? `Notificações, ${naoLidas} não lidas` : "Notificações"
          }
        >
          <Bell weight="bold" />
          {naoLidas > 0 && (
            <span className="absolute right-1.5 top-1.5 flex min-w-[15px] items-center justify-center rounded-full bg-[var(--accent)] px-1 text-[9.5px] font-semibold leading-[15px] text-[var(--accent-fg)]">
              {naoLidas > 9 ? "9+" : naoLidas}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[360px] p-0">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
          <p className="font-display text-[14px] font-semibold text-[var(--fg)]">
            Notificações
          </p>
          {naoLidas > 0 && (
            <button
              onClick={marcarTodasLidas}
              className="flex items-center gap-1.5 text-[12px] font-medium text-[var(--accent)] hover:underline"
            >
              <CheckCircle className="size-3.5" weight="bold" />
              Marcar todas
            </button>
          )}
        </div>

        <div className="max-h-[380px] overflow-y-auto">
          {itens.length === 0 ? (
            <EmptyState
              compact
              title="Tudo em dia"
              description="Novas notificações aparecem aqui assim que houver movimento na sua conta."
            />
          ) : (
            <ul className="divide-y divide-[var(--border)]">
              {itens.slice(0, 8).map((item) => {
                const Icon = NOTIFICATION_ICON[item.tipo];
                const conteudo = (
                  <>
                    <span
                      className={cn(
                        "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)]",
                        item.lida
                          ? "bg-[var(--surface-2)] text-[var(--fg-subtle)]"
                          : "bg-[var(--accent-soft)] text-[var(--accent)]",
                      )}
                    >
                      <Icon className="size-4" weight="fill" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-start gap-2">
                        <span
                          className={cn(
                            "block flex-1 text-[13px] leading-snug",
                            item.lida
                              ? "text-[var(--fg-muted)]"
                              : "font-medium text-[var(--fg)]",
                          )}
                        >
                          {item.titulo}
                        </span>
                        {!item.lida && (
                          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                        )}
                      </span>
                      <span className="mt-0.5 block text-[12px] leading-relaxed text-[var(--fg-muted)]">
                        {item.mensagem}
                      </span>
                      <RelativeTime
                        date={item.data}
                        className="mt-1 block text-[11px] text-[var(--fg-subtle)]"
                      />
                    </span>
                  </>
                );

                return (
                  <li key={item.id}>
                    {item.href ? (
                      <Link
                        href={item.href}
                        onClick={() => marcarLida(item.id)}
                        className="flex gap-3 px-4 py-3 transition-colors hover:bg-[var(--surface-2)]"
                      >
                        {conteudo}
                      </Link>
                    ) : (
                      <button
                        onClick={() => marcarLida(item.id)}
                        className="flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--surface-2)]"
                      >
                        {conteudo}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="border-t border-[var(--border)] p-2">
          <Button asChild variant="ghost" size="sm" className="w-full">
            <Link href="/app/notificacoes">Ver todas as notificações</Link>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
