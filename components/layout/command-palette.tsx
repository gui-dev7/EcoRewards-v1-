"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { useTheme } from "next-themes";
import {
  ArrowCounterClockwise,
  Gift,
  MagnifyingGlass,
  MapPin,
  Moon,
  Sun,
  Target,
} from "@phosphor-icons/react";
import { Dialog, DialogPortal, DialogOverlay } from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { NAV_BY_ENVIRONMENT } from "./nav-config";
import { REWARDS } from "@/mocks/rewards";
import { COLLECTION_POINTS } from "@/mocks/collection-points";
import { CHALLENGES } from "@/mocks/challenges";
import { restaurarDemonstracao } from "@/stores";
import { formatEcoPoints } from "@/lib/format";
import { toast } from "sonner";
import type { Environment } from "@/types";

const itemClasses =
  "flex cursor-pointer select-none items-center gap-3 rounded-[var(--radius-sm)] px-3 py-2.5 text-[13.5px] text-[var(--fg)] outline-none data-[selected=true]:bg-[var(--surface-2)] [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-[var(--fg-subtle)]";

/**
 * Paleta de comandos (Ctrl/Cmd + K). Pesquisa páginas, recompensas,
 * ecopontos e desafios sobre os dados demonstrativos locais.
 */
export function CommandPalette({ environment }: { environment: Environment }) {
  const [open, setOpen] = React.useState(false);
  const [busca, setBusca] = React.useState("");
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((atual) => !atual);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const executar = React.useCallback(
    (acao: () => void) => {
      setOpen(false);
      setBusca("");
      acao();
    },
    [],
  );

  const paginas = NAV_BY_ENVIRONMENT[environment].flatMap((grupo) =>
    grupo.itens.map((item) => ({ ...item, grupo: grupo.titulo })),
  );

  const recompensas = busca.length > 1 ? REWARDS.slice(0, 40) : REWARDS.slice(0, 5);
  const ecopontos = busca.length > 1 ? COLLECTION_POINTS.slice(0, 40) : [];
  const desafios = busca.length > 1 ? CHALLENGES : [];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group flex h-9 w-full max-w-[280px] items-center gap-2.5 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-2)] px-3 text-left text-[13px] text-[var(--fg-subtle)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--fg-muted)]"
      >
        <MagnifyingGlass className="size-4 shrink-0" weight="bold" />
        <span className="flex-1 truncate">Buscar…</span>
        <kbd className="hidden shrink-0 rounded-[3px] border border-[var(--border)] bg-[var(--surface)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--fg-subtle)] sm:block">
          Ctrl K
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogPortal>
          <DialogOverlay />
          <DialogPrimitive.Content
            className="fixed left-1/2 top-[12vh] z-50 w-[calc(100vw-2rem)] max-w-xl -translate-x-1/2 overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-lg)] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
            aria-label="Busca global"
          >
            <DialogPrimitive.Title className="sr-only">Busca global</DialogPrimitive.Title>
            <DialogPrimitive.Description className="sr-only">
              Pesquise páginas, recompensas, ecopontos e desafios.
            </DialogPrimitive.Description>

            <Command shouldFilter loop>
              <div className="flex items-center gap-3 border-b border-[var(--border)] px-4">
                <MagnifyingGlass className="size-4 shrink-0 text-[var(--fg-subtle)]" weight="bold" />
                <Command.Input
                  value={busca}
                  onValueChange={setBusca}
                  placeholder="Buscar páginas, recompensas, ecopontos…"
                  className="h-12 w-full bg-transparent text-[14px] text-[var(--fg)] outline-none placeholder:text-[var(--fg-subtle)]"
                />
                <kbd className="shrink-0 rounded-[3px] border border-[var(--border)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--fg-subtle)]">
                  Esc
                </kbd>
              </div>

              <Command.List className="max-h-[min(420px,60dvh)] overflow-y-auto p-2">
                <Command.Empty className="px-3 py-8 text-center text-[13px] text-[var(--fg-muted)]">
                  Nada encontrado para “{busca}”.
                </Command.Empty>

                <Command.Group
                  heading="Navegação"
                  className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.09em] [&_[cmdk-group-heading]]:text-[var(--fg-subtle)]"
                >
                  {paginas.map((pagina) => (
                    <Command.Item
                      key={pagina.href}
                      value={`${pagina.label} ${pagina.descricao} ${pagina.grupo}`}
                      onSelect={() => executar(() => router.push(pagina.href))}
                      className={itemClasses}
                    >
                      <pagina.icon />
                      <span className="flex-1">{pagina.label}</span>
                      <span className="text-[11.5px] text-[var(--fg-subtle)]">
                        {pagina.descricao}
                      </span>
                    </Command.Item>
                  ))}
                </Command.Group>

                <Command.Group
                  heading="Recompensas"
                  className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.09em] [&_[cmdk-group-heading]]:text-[var(--fg-subtle)]"
                >
                  {recompensas.map((reward) => (
                    <Command.Item
                      key={reward.id}
                      value={`${reward.nome} ${reward.parceiro} ${reward.categoria}`}
                      onSelect={() =>
                        executar(() => router.push(`/app/recompensas?item=${reward.id}`))
                      }
                      className={itemClasses}
                    >
                      <Gift />
                      <span className="flex-1 truncate">{reward.nome}</span>
                      <span className="shrink-0 text-[11.5px] tabular text-[var(--fg-subtle)]">
                        {formatEcoPoints(reward.pontos)} pts
                      </span>
                    </Command.Item>
                  ))}
                </Command.Group>

                {ecopontos.length > 0 && (
                  <Command.Group
                    heading="Ecopontos"
                    className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.09em] [&_[cmdk-group-heading]]:text-[var(--fg-subtle)]"
                  >
                    {ecopontos.map((ponto) => (
                      <Command.Item
                        key={ponto.id}
                        value={`${ponto.nome} ${ponto.bairro} ${ponto.cidade}`}
                        onSelect={() =>
                          executar(() =>
                            router.push(
                              environment === "governo"
                                ? `/governo/ecopontos?ponto=${ponto.id}`
                                : `/app/ecopontos?ponto=${ponto.id}`,
                            ),
                          )
                        }
                        className={itemClasses}
                      >
                        <MapPin />
                        <span className="flex-1 truncate">{ponto.nome}</span>
                        <span className="shrink-0 text-[11.5px] text-[var(--fg-subtle)]">
                          {ponto.bairro}
                        </span>
                      </Command.Item>
                    ))}
                  </Command.Group>
                )}

                {desafios.length > 0 && (
                  <Command.Group
                    heading="Desafios"
                    className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.09em] [&_[cmdk-group-heading]]:text-[var(--fg-subtle)]"
                  >
                    {desafios.map((desafio) => (
                      <Command.Item
                        key={desafio.id}
                        value={`${desafio.titulo} ${desafio.descricao}`}
                        onSelect={() => executar(() => router.push("/app/desafios"))}
                        className={itemClasses}
                      >
                        <Target />
                        <span className="flex-1 truncate">{desafio.titulo}</span>
                        <span className="shrink-0 text-[11.5px] text-[var(--fg-subtle)]">
                          {desafio.cadencia}
                        </span>
                      </Command.Item>
                    ))}
                  </Command.Group>
                )}

                <Command.Group
                  heading="Ações"
                  className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.09em] [&_[cmdk-group-heading]]:text-[var(--fg-subtle)]"
                >
                  <Command.Item
                    value="alternar tema claro escuro dark mode"
                    onSelect={() =>
                      executar(() => setTheme(resolvedTheme === "dark" ? "light" : "dark"))
                    }
                    className={itemClasses}
                  >
                    {resolvedTheme === "dark" ? <Sun /> : <Moon />}
                    Alternar tema
                  </Command.Item>
                  <Command.Item
                    value="restaurar dados demo reset demonstração"
                    onSelect={() =>
                      executar(() => {
                        restaurarDemonstracao();
                        toast.success("Demonstração restaurada");
                        router.refresh();
                      })
                    }
                    className={itemClasses}
                  >
                    <ArrowCounterClockwise />
                    Restaurar dados demo
                  </Command.Item>
                </Command.Group>
              </Command.List>
            </Command>
          </DialogPrimitive.Content>
        </DialogPortal>
      </Dialog>
    </>
  );
}
