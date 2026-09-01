"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { List } from "@phosphor-icons/react";
import { Sheet, SheetContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";
import { Sidebar, SidebarDrawerContent } from "./sidebar";
import { CommandPalette } from "./command-palette";
import { NotificationsMenu } from "./notifications-menu";
import { ThemeToggle } from "./theme-toggle";
import { BottomNav } from "./bottom-nav";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import type { Environment } from "@/types";

/**
 * Casca comum aos três ambientes. O que muda entre eles é o token
 * `--accent` (via `data-env`) e o conjunto de rotas — a estrutura é a mesma,
 * de propósito: quem alterna entre ambientes não precisa reaprender a interface.
 */
export function AppShell({
  environment,
  children,
  titulo,
  acoes,
}: {
  environment: Environment;
  children: React.ReactNode;
  titulo?: string;
  acoes?: React.ReactNode;
}) {
  const [drawerAberto, setDrawerAberto] = React.useState(false);
  const pathname = usePathname();
  const reduced = useReducedMotion();

  return (
    <div data-env={environment} className="flex min-h-dvh bg-[var(--bg)]">
      <Sidebar environment={environment} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-[var(--header-h)] items-center gap-3 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--bg)_86%,transparent)] px-4 backdrop-blur-md lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setDrawerAberto(true)}
            aria-label="Abrir menu"
          >
            <List weight="bold" />
          </Button>

          <Logo variant="mark" size="sm" className="lg:hidden" href={environment === "cidadao" ? "/app" : `/${environment}`} />

          {titulo && (
            <h1 className="hidden truncate font-display text-[15px] font-semibold text-[var(--fg)] lg:block">
              {titulo}
            </h1>
          )}

          <div className="ml-auto flex items-center gap-1.5">
            <div className="hidden md:block">
              <CommandPalette environment={environment} />
            </div>
            {acoes}
            <NotificationsMenu />
            <ThemeToggle />
          </div>
        </header>

        <main
          id="conteudo"
          className="flex-1 pb-[calc(env(safe-area-inset-bottom)+72px)] lg:pb-0"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={pathname}
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -4 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <Sheet open={drawerAberto} onOpenChange={setDrawerAberto}>
        <SheetContent side="left" width="max-w-[290px]" className="p-0">
          <div className="flex h-[var(--header-h)] items-center border-b border-[var(--border)] px-4">
            <Logo size="sm" href={environment === "cidadao" ? "/app" : `/${environment}`} />
          </div>
          <SidebarDrawerContent
            environment={environment}
            onNavigate={() => setDrawerAberto(false)}
          />
        </SheetContent>
      </Sheet>

      {environment === "cidadao" && <BottomNav />}
    </div>
  );
}

/** Contêiner padrão de página: largura máxima, respiro e ritmo verticais. */
export function PageContainer({
  children,
  className,
  wide,
}: {
  children: React.ReactNode;
  className?: string;
  wide?: boolean;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 py-6 lg:px-6 lg:py-8",
        wide ? "max-w-[1600px]" : "max-w-[1360px]",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Cabeçalho de página com trilha, título, descrição e ações. */
export function PageHeader({
  eyebrow,
  titulo,
  descricao,
  acoes,
  voltar,
  className,
}: {
  eyebrow?: string;
  titulo: string;
  descricao?: string;
  acoes?: React.ReactNode;
  voltar?: { href: string; label: string };
  className?: string;
}) {
  return (
    <div className={cn("mb-6 lg:mb-8", className)}>
      {voltar && (
        <Link
          href={voltar.href}
          className="mb-3 inline-flex items-center gap-1.5 text-[12.5px] text-[var(--fg-muted)] transition-colors hover:text-[var(--accent)]"
        >
          <span aria-hidden>←</span>
          {voltar.label}
        </Link>
      )}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
          <h1 className="font-display text-h2 text-[var(--fg)]">{titulo}</h1>
          {descricao && (
            <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-[var(--fg-muted)]">
              {descricao}
            </p>
          )}
        </div>
        {acoes && <div className="flex shrink-0 flex-wrap items-center gap-2">{acoes}</div>}
      </div>
    </div>
  );
}
