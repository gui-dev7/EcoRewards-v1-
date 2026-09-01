"use client";

import * as React from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { InstallPrompt } from "@/components/pwa/install-prompt";
import { CheckCircle, Info, WarningCircle, XCircle } from "@phosphor-icons/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="ecorewards:theme"
    >
      <TooltipProvider delayDuration={220} skipDelayDuration={400}>
        {children}
        <Toaster
          position="bottom-right"
          gap={10}
          offset={20}
          toastOptions={{
            unstyled: true,
            classNames: {
              toast:
                "flex w-full items-start gap-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-3.5 shadow-[var(--shadow-lg)]",
              title: "text-[13.5px] font-medium text-[var(--fg)]",
              description: "mt-0.5 text-[12.5px] leading-relaxed text-[var(--fg-muted)]",
              actionButton:
                "ml-auto shrink-0 rounded-[var(--radius-xs)] bg-[var(--accent)] px-2.5 py-1 text-[12px] font-medium text-[var(--accent-fg)]",
              cancelButton:
                "shrink-0 rounded-[var(--radius-xs)] px-2 py-1 text-[12px] text-[var(--fg-muted)]",
            },
          }}
          icons={{
            success: <CheckCircle weight="fill" className="size-[18px] text-[var(--good)]" />,
            error: <XCircle weight="fill" className="size-[18px] text-[var(--critical)]" />,
            warning: <WarningCircle weight="fill" className="size-[18px] text-[var(--warning)]" />,
            info: <Info weight="fill" className="size-[18px] text-[var(--info)]" />,
          }}
        />
        <InstallPrompt />
      </TooltipProvider>
    </ThemeProvider>
  );
}
