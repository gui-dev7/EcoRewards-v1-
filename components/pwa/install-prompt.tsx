"use client";

import * as React from "react";
import { DeviceMobile, X } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { readStorage, writeStorage } from "@/lib/storage";
import { cn } from "@/lib/utils";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const CHAVE_DISPENSADO = "pwa-dispensado";

/**
 * Registra o service worker e, quando o navegador oferece, apresenta
 * o convite de instalação. Só aparece uma vez: quem dispensa não vê de novo.
 */
export function InstallPrompt() {
  const [evento, setEvento] = React.useState<BeforeInstallPromptEvent | null>(null);
  const [visivel, setVisivel] = React.useState(false);

  React.useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* sem service worker a aplicação segue normalmente */
      });
    }

    if (readStorage(CHAVE_DISPENSADO, false)) return;

    const onPrompt = (event: Event) => {
      event.preventDefault();
      setEvento(event as BeforeInstallPromptEvent);
      setVisivel(true);
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  const dispensar = () => {
    setVisivel(false);
    writeStorage(CHAVE_DISPENSADO, true);
  };

  const instalar = async () => {
    if (!evento) return;
    await evento.prompt();
    await evento.userChoice;
    setVisivel(false);
    writeStorage(CHAVE_DISPENSADO, true);
  };

  if (!visivel || !evento) return null;

  return (
    <div
      role="dialog"
      aria-label="Instalar o EcoRewards"
      className={cn(
        "fixed inset-x-4 bottom-[calc(env(safe-area-inset-bottom)+84px)] z-50 flex items-start gap-3 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-lg)]",
        "lg:inset-x-auto lg:bottom-6 lg:right-6 lg:max-w-sm",
      )}
    >
      <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--accent-soft)] text-[var(--accent)]">
        <DeviceMobile className="size-5" weight="fill" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[13.5px] font-medium text-[var(--fg)]">
          Instalar o EcoRewards
        </p>
        <p className="mt-1 text-[12.5px] leading-relaxed text-[var(--fg-muted)]">
          Abra direto da tela inicial e continue navegando mesmo sem conexão.
        </p>
        <div className="mt-3 flex gap-2">
          <Button size="xs" onClick={instalar}>
            Instalar
          </Button>
          <Button size="xs" variant="ghost" onClick={dispensar}>
            Agora não
          </Button>
        </div>
      </div>
      <button
        onClick={dispensar}
        aria-label="Fechar"
        className="shrink-0 rounded-[var(--radius-xs)] p-1 text-[var(--fg-subtle)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--fg)]"
      >
        <X className="size-3.5" weight="bold" />
      </button>
    </div>
  );
}
