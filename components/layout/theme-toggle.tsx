"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Hint } from "@/components/ui/tooltip";
import { useHydrated } from "@/hooks/use-hydrated";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const hydrated = useHydrated();
  const escuro = resolvedTheme === "dark";

  return (
    <Hint label={escuro ? "Tema claro" : "Tema escuro"}>
      <Button
        variant="ghost"
        size="icon"
        className={className}
        onClick={() => setTheme(escuro ? "light" : "dark")}
        aria-label={escuro ? "Ativar tema claro" : "Ativar tema escuro"}
      >
        {hydrated && escuro ? <Sun weight="bold" /> : <Moon weight="bold" />}
      </Button>
    </Hint>
  );
}
