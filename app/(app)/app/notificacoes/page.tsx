"use client";

import * as React from "react";
import Link from "next/link";
import { BellSlash, CheckCircle, Trash } from "@phosphor-icons/react";
import { PageContainer, PageHeader } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/feedback";
import { RelativeTime } from "@/components/ui/relative-time";
import { NOTIFICATION_ICON } from "@/components/layout/notifications-menu";
import { useNotificationsStore } from "@/stores";
import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils";
import type { NotificationKind } from "@/types";

const TIPOS: { id: NotificationKind | "todos"; rotulo: string }[] = [
  { id: "todos", rotulo: "Todas" },
  { id: "pontos", rotulo: "Pontos" },
  { id: "recompensa", rotulo: "Recompensas" },
  { id: "desafio", rotulo: "Desafios" },
  { id: "conquista", rotulo: "Conquistas" },
  { id: "ecoponto", rotulo: "Ecopontos" },
  { id: "sistema", rotulo: "Sistema" },
];

export default function NotificacoesPage() {
  const hydrated = useHydrated();
  const itens = useNotificationsStore((s) => s.itens);
  const marcarLida = useNotificationsStore((s) => s.marcarLida);
  const marcarTodasLidas = useNotificationsStore((s) => s.marcarTodasLidas);
  const remover = useNotificationsStore((s) => s.remover);

  const [filtro, setFiltro] = React.useState<NotificationKind | "todos">("todos");
  const [soNaoLidas, setSoNaoLidas] = React.useState(false);

  const lista = hydrated ? itens : [];
  const naoLidas = lista.filter((item) => !item.lida).length;

  const visiveis = lista.filter((item) => {
    if (filtro !== "todos" && item.tipo !== filtro) return false;
    if (soNaoLidas && item.lida) return false;
    return true;
  });

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Central de avisos"
        titulo="Notificações"
        descricao="Tudo o que aconteceu na sua conta, agrupado por tipo. O estado de leitura fica salvo neste navegador."
        acoes={
          naoLidas > 0 && (
            <Button variant="secondary" onClick={marcarTodasLidas}>
              <CheckCircle weight="bold" />
              Marcar todas como lidas
            </Button>
          )
        }
      />

      <div className="flex flex-wrap items-center gap-1.5">
        {TIPOS.map((tipo) => {
          const total =
            tipo.id === "todos"
              ? lista.length
              : lista.filter((item) => item.tipo === tipo.id).length;

          return (
            <button
              key={tipo.id}
              type="button"
              onClick={() => setFiltro(tipo.id)}
              aria-pressed={filtro === tipo.id}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12.5px] font-medium transition-colors",
                filtro === tipo.id
                  ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                  : "border-[var(--border)] text-[var(--fg-muted)] hover:border-[var(--border-strong)] hover:text-[var(--fg)]",
              )}
            >
              {tipo.rotulo}
              <span className="tabular opacity-60">{total}</span>
            </button>
          );
        })}

        <span aria-hidden className="mx-1 h-4 w-px bg-[var(--border)]" />

        <button
          type="button"
          onClick={() => setSoNaoLidas((atual) => !atual)}
          aria-pressed={soNaoLidas}
          className={cn(
            "rounded-full border px-3 py-1.5 text-[12.5px] font-medium transition-colors",
            soNaoLidas
              ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
              : "border-[var(--border)] text-[var(--fg-muted)] hover:border-[var(--border-strong)] hover:text-[var(--fg)]",
          )}
        >
          Só não lidas
          {naoLidas > 0 && <span className="ml-1.5 tabular opacity-60">{naoLidas}</span>}
        </button>
      </div>

      <div className="mt-6">
        {visiveis.length === 0 ? (
          <EmptyState
            className="rounded-[var(--radius-lg)] border border-[var(--border)]"
            icon={<BellSlash />}
            title={soNaoLidas ? "Você está em dia." : "Nada por aqui."}
            description={
              soNaoLidas
                ? "Nenhuma notificação não lida com esses filtros."
                : "Novas notificações aparecem assim que houver movimento na sua conta."
            }
            action={
              filtro !== "todos" || soNaoLidas
                ? {
                    label: "Ver todas",
                    onClick: () => {
                      setFiltro("todos");
                      setSoNaoLidas(false);
                    },
                  }
                : undefined
            }
          />
        ) : (
          <ul className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
            {visiveis.map((item) => {
              const Icon = NOTIFICATION_ICON[item.tipo];

              return (
                <li
                  key={item.id}
                  className={cn(
                    "group flex gap-4 border-b border-[var(--border)] px-5 py-4 last:border-0",
                    !item.lida && "bg-[var(--accent-soft)]",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-sm)]",
                      item.lida
                        ? "bg-[var(--surface-2)] text-[var(--fg-subtle)]"
                        : "bg-[var(--surface)] text-[var(--accent)]",
                    )}
                  >
                    <Icon className="size-[18px]" weight="fill" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        "text-[13.5px] leading-snug",
                        item.lida ? "text-[var(--fg-muted)]" : "font-medium text-[var(--fg)]",
                      )}
                    >
                      {item.titulo}
                    </p>
                    <p className="mt-1 text-[12.5px] leading-relaxed text-[var(--fg-muted)]">
                      {item.mensagem}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-3">
                      <RelativeTime
                        date={item.data}
                        className="text-[11.5px] text-[var(--fg-subtle)]"
                      />
                      {item.href && (
                        <Link
                          href={item.href}
                          onClick={() => marcarLida(item.id)}
                          className="text-[11.5px] font-medium text-[var(--accent)] hover:underline"
                        >
                          Abrir
                        </Link>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-start gap-1">
                    {!item.lida && (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => marcarLida(item.id)}
                        aria-label={`Marcar "${item.titulo}" como lida`}
                      >
                        <CheckCircle />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => remover(item.id)}
                      aria-label={`Remover "${item.titulo}"`}
                      className="text-[var(--fg-subtle)] hover:text-[var(--critical)]"
                    >
                      <Trash />
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </PageContainer>
  );
}
