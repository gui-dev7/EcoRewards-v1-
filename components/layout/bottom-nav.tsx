"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CITIZEN_BOTTOM_NAV } from "./nav-config";
import { cn } from "@/lib/utils";

/**
 * Navegação inferior do B2C no mobile.
 * O scanner ocupa o centro e ganha destaque — é a ação que o produto
 * quer que aconteça, e fica no alcance do polegar.
 */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegação rápida"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] pb-[env(safe-area-inset-bottom)] backdrop-blur-lg lg:hidden"
    >
      <ul className="mx-auto flex max-w-md items-end justify-around px-2">
        {CITIZEN_BOTTOM_NAV.map((item) => {
          const ativo = pathname === item.href;

          if (item.destaque) {
            return (
              <li key={item.href} className="-mt-5">
                <Link
                  href={item.href}
                  aria-current={ativo ? "page" : undefined}
                  className="flex flex-col items-center gap-1"
                >
                  <span
                    className={cn(
                      "flex size-12 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--accent-fg)] shadow-[0_6px_20px_-6px_var(--accent-glow)] transition-transform active:scale-95",
                      ativo && "ring-4 ring-[var(--accent-soft)]",
                    )}
                  >
                    <item.icon className="size-6" weight="bold" />
                  </span>
                  <span className="pb-1.5 text-[10.5px] font-medium text-[var(--fg-muted)]">
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          }

          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                aria-current={ativo ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 transition-colors",
                  ativo ? "text-[var(--accent)]" : "text-[var(--fg-subtle)]",
                )}
              >
                <item.icon className="size-[22px]" weight={ativo ? "fill" : "regular"} />
                <span className="text-[10.5px] font-medium">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
