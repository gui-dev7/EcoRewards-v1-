"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { List, X } from "@phosphor-icons/react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { PUBLIC_NAV } from "./site-nav";
import { cn } from "@/lib/utils";

/**
 * Navbar da landing: transparente no topo, ganha superfície e um fio
 * inferior assim que a página rola. A mudança acontece uma vez, em 8px —
 * não acompanha o scroll continuamente.
 */
export function SiteHeader() {
  const [rolou, setRolou] = React.useState(false);
  const [menuAberto, setMenuAberto] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    const onScroll = () => setRolou(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300",
        rolou
          ? "border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--bg)_82%,transparent)] backdrop-blur-lg"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-[var(--header-h)] max-w-[1360px] items-center gap-6 px-4 lg:px-6">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Navegação do site">
          {PUBLIC_NAV.map((item) => {
            const ativo = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={ativo ? "page" : undefined}
                className={cn(
                  "relative rounded-[var(--radius-sm)] px-3 py-1.5 text-[13.5px] font-medium transition-colors",
                  ativo
                    ? "text-[var(--fg)]"
                    : "text-[var(--fg-muted)] hover:text-[var(--fg)]",
                )}
              >
                {item.label}
                {ativo && (
                  <span className="absolute inset-x-3 -bottom-px h-px bg-[var(--accent)]" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle className="hidden sm:inline-flex" />
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link href="/login">Entrar</Link>
          </Button>
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/demo">Explorar demonstração</Link>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMenuAberto((aberto) => !aberto)}
            aria-expanded={menuAberto}
            aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
          >
            {menuAberto ? <X weight="bold" /> : <List weight="bold" />}
          </Button>
        </div>
      </div>

      {menuAberto && (
        <div className="border-t border-[var(--border)] bg-[var(--surface)] md:hidden">
          <nav className="mx-auto max-w-[1360px] px-4 py-3" aria-label="Navegação do site">
            <ul className="space-y-0.5">
              {PUBLIC_NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMenuAberto(false)}
                    className="block rounded-[var(--radius-sm)] px-3 py-2.5 text-[14px] font-medium text-[var(--fg-muted)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--fg)]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-center gap-2 border-t border-[var(--border)] pt-3">
              <Button asChild variant="secondary" size="sm" className="flex-1">
                <Link href="/login">Entrar</Link>
              </Button>
              <Button asChild size="sm" className="flex-1">
                <Link href="/demo">Explorar demo</Link>
              </Button>
              <ThemeToggle />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
