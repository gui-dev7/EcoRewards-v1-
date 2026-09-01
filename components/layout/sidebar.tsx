"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { SidebarSimple } from "@phosphor-icons/react";
import { Logo } from "@/components/brand/logo";
import { Hint } from "@/components/ui/tooltip";
import { NAV_BY_ENVIRONMENT } from "./nav-config";
import { DemoSwitcher } from "./demo-switcher";
import { usePreferencesStore } from "@/stores";
import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils";
import type { Environment } from "@/types";

export function Sidebar({ environment }: { environment: Environment }) {
  const pathname = usePathname();
  const hydrated = useHydrated();
  const recolhidaPersistida = usePreferencesStore((s) => s.sidebarRecolhida);
  const alternar = usePreferencesStore((s) => s.alternarSidebar);
  const recolhida = hydrated && recolhidaPersistida;

  const grupos = NAV_BY_ENVIRONMENT[environment];

  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-[var(--border)] bg-[var(--surface)] transition-[width] duration-300 ease-out lg:flex",
        recolhida ? "w-[var(--sidebar-w-collapsed)]" : "w-[var(--sidebar-w)]",
      )}
    >
      <div
        className={cn(
          "flex h-[var(--header-h)] items-center border-b border-[var(--border)]",
          recolhida ? "justify-center px-2" : "justify-between px-4",
        )}
      >
        <Logo variant={recolhida ? "mark" : "full"} size="sm" href={`/${environment === "cidadao" ? "app" : environment}`} />
        {!recolhida && (
          <button
            onClick={alternar}
            className="rounded-[var(--radius-xs)] p-1.5 text-[var(--fg-subtle)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--fg)]"
            aria-label="Recolher menu lateral"
          >
            <SidebarSimple className="size-4" weight="bold" />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Navegação principal">
        {grupos.map((grupo, indice) => (
          <div key={grupo.titulo} className={cn(indice > 0 && "mt-6")}>
            {!recolhida && (
              <p className="eyebrow mb-2 px-2.5 text-[10px]">{grupo.titulo}</p>
            )}
            <ul className="space-y-0.5">
              {grupo.itens.map((item) => {
                const ativo =
                  pathname === item.href ||
                  (item.href !== `/${environment}` &&
                    item.href !== "/app" &&
                    pathname.startsWith(`${item.href}/`));

                const conteudo = (
                  <Link
                    href={item.href}
                    aria-current={ativo ? "page" : undefined}
                    className={cn(
                      "group relative flex items-center gap-2.5 rounded-[var(--radius-sm)] py-2 text-[13.5px] font-medium transition-colors",
                      recolhida ? "justify-center px-0" : "px-2.5",
                      ativo
                        ? "text-[var(--fg)]"
                        : "text-[var(--fg-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--fg)]",
                    )}
                  >
                    {ativo && (
                      <motion.span
                        layoutId={`sidebar-active-${environment}`}
                        className="absolute inset-0 rounded-[var(--radius-sm)] bg-[var(--accent-soft)]"
                        transition={{ type: "spring", stiffness: 420, damping: 36 }}
                      />
                    )}
                    {ativo && !recolhida && (
                      <motion.span
                        layoutId={`sidebar-rail-${environment}`}
                        className="absolute -left-3 top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-r-full bg-[var(--accent)]"
                        transition={{ type: "spring", stiffness: 420, damping: 36 }}
                      />
                    )}
                    <item.icon
                      className={cn(
                        "relative z-10 size-[18px] shrink-0",
                        ativo && "text-[var(--accent)]",
                      )}
                      weight={ativo ? "fill" : "regular"}
                    />
                    {!recolhida && <span className="relative z-10 truncate">{item.label}</span>}
                  </Link>
                );

                return (
                  <li key={item.href}>
                    {recolhida ? (
                      <Hint label={item.label} side="right">
                        {conteudo}
                      </Hint>
                    ) : (
                      conteudo
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-[var(--border)] p-3">
        <DemoSwitcher environment={environment} collapsed={recolhida} />
        {recolhida && (
          <button
            onClick={alternar}
            className="mt-2 flex w-full justify-center rounded-[var(--radius-xs)] p-1.5 text-[var(--fg-subtle)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--fg)]"
            aria-label="Expandir menu lateral"
          >
            <SidebarSimple className="size-4 rotate-180" weight="bold" />
          </button>
        )}
      </div>
    </aside>
  );
}

/** Mesma navegação em formato de gaveta, usada no mobile e no tablet. */
export function SidebarDrawerContent({
  environment,
  onNavigate,
}: {
  environment: Environment;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const grupos = NAV_BY_ENVIRONMENT[environment];

  return (
    <div className="flex h-full flex-col">
      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Navegação principal">
        {grupos.map((grupo, indice) => (
          <div key={grupo.titulo} className={cn(indice > 0 && "mt-6")}>
            <p className="eyebrow mb-2 px-2.5 text-[10px]">{grupo.titulo}</p>
            <ul className="space-y-0.5">
              {grupo.itens.map((item) => {
                const ativo = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      aria-current={ativo ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-[var(--radius-sm)] px-2.5 py-2.5 text-[14px] font-medium transition-colors",
                        ativo
                          ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                          : "text-[var(--fg-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--fg)]",
                      )}
                    >
                      <item.icon className="size-[19px] shrink-0" weight={ativo ? "fill" : "regular"} />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="border-t border-[var(--border)] p-3">
        <DemoSwitcher environment={environment} />
      </div>
    </div>
  );
}
