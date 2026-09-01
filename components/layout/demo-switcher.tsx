"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowsLeftRight, ArrowCounterClockwise, CaretUpDown, SignOut } from "@phosphor-icons/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DEMO_ACCOUNTS, DEMO_ACCOUNT_LIST } from "@/lib/demo-accounts";
import { ENVIRONMENT_ICON } from "./nav-config";
import { restaurarDemonstracao, useAuthStore } from "@/stores";
import { cn } from "@/lib/utils";
import type { Environment } from "@/types";

/**
 * Seletor discreto de ambiente demonstrativo.
 * Existe para que uma apresentação possa alternar entre cidadão,
 * empresa e governo sem sair da aplicação.
 */
export function DemoSwitcher({
  environment,
  collapsed,
}: {
  environment: Environment;
  collapsed?: boolean;
}) {
  const router = useRouter();
  const trocarAmbiente = useAuthStore((s) => s.trocarAmbiente);
  const sair = useAuthStore((s) => s.sair);
  const [resetAberto, setResetAberto] = useState(false);

  const conta = DEMO_ACCOUNTS[environment];
  const Icon = ENVIRONMENT_ICON[environment];

  const trocar = (destino: Environment) => {
    if (destino === environment) return;
    const rota = trocarAmbiente(destino);
    router.push(rota);
    toast.success(`Ambiente alterado para ${DEMO_ACCOUNTS[destino].nome}`, {
      description: "Os dados demonstrativos deste ambiente já estão carregados.",
    });
  };

  const restaurar = () => {
    restaurarDemonstracao();
    setResetAberto(false);
    toast.success("Demonstração restaurada", {
      description:
        "EcoPontos, resgates, desafios e notificações voltaram ao estado inicial.",
    });
    router.refresh();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              "group flex w-full items-center gap-2.5 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-2 text-left transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--surface-2)]",
              collapsed && "justify-center px-0",
            )}
            aria-label="Trocar ambiente demo"
          >
            <span className="flex size-7 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--accent-soft)] text-[var(--accent)]">
              <Icon className="size-4" weight="bold" />
            </span>
            {!collapsed && (
              <>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12.5px] font-medium text-[var(--fg)]">
                    {conta.nome}
                  </span>
                  <span className="block truncate text-[11px] text-[var(--fg-subtle)]">
                    Ambiente demonstrativo
                  </span>
                </span>
                <CaretUpDown className="size-3.5 shrink-0 text-[var(--fg-subtle)]" weight="bold" />
              </>
            )}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="w-[264px]">
          <DropdownMenuLabel>
            <span className="flex items-center gap-1.5">
              <ArrowsLeftRight className="size-3" weight="bold" />
              Trocar ambiente demo
            </span>
          </DropdownMenuLabel>

          {DEMO_ACCOUNT_LIST.map((item) => {
            const ItemIcon = ENVIRONMENT_ICON[item.environment];
            const ativo = item.environment === environment;
            return (
              <DropdownMenuItem
                key={item.environment}
                onSelect={() => trocar(item.environment)}
                className={cn(ativo && "bg-[var(--surface-2)]")}
              >
                <ItemIcon
                  className={cn("size-4", ativo && "text-[var(--accent)]")}
                  weight={ativo ? "fill" : "regular"}
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{item.nome}</span>
                  <span className="block truncate text-[11.5px] text-[var(--fg-subtle)]">
                    {item.subtitulo}
                  </span>
                </span>
                {ativo && (
                  <span className="size-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                )}
              </DropdownMenuItem>
            );
          })}

          <DropdownMenuSeparator />

          <DropdownMenuItem onSelect={() => setResetAberto(true)}>
            <ArrowCounterClockwise className="size-4" />
            Restaurar dados demo
          </DropdownMenuItem>

          <DropdownMenuItem
            destructive
            onSelect={() => {
              sair();
              router.push("/login");
            }}
          >
            <SignOut className="size-4" />
            Sair da demonstração
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={resetAberto} onOpenChange={setResetAberto}>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Restaurar dados demo?</DialogTitle>
            <DialogDescription>
              Tudo o que foi alterado durante esta sessão volta ao ponto inicial.
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            <ul className="space-y-2 text-[13px] text-[var(--fg-muted)]">
              {[
                "EcoPontos retornam a 4.250",
                "Resgates e vouchers gerados são removidos",
                "Progresso dos desafios volta ao valor original",
                "Notificações lidas reaparecem como não lidas",
                "Campanhas criadas na demonstração são descartadas",
              ].map((item) => (
                <li key={item} className="flex gap-2.5">
                  <span className="mt-[7px] size-1 shrink-0 rounded-full bg-[var(--fg-subtle)]" />
                  {item}
                </li>
              ))}
            </ul>
          </DialogBody>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setResetAberto(false)}>
              Cancelar
            </Button>
            <Button onClick={restaurar}>
              <ArrowCounterClockwise weight="bold" />
              Restaurar demonstração
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
