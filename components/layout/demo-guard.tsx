"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores";
import { useHydrated } from "@/hooks/use-hydrated";
import { LeafMark } from "@/components/brand/leaf-mark";
import type { Environment } from "@/types";

/**
 * Garante que há uma sessão demonstrativa antes de entrar num ambiente.
 * Se não houver, autentica automaticamente no ambiente pedido — a demo
 * precisa ser acessível por link direto, sem tela de bloqueio.
 */
export function DemoGuard({
  environment,
  children,
}: {
  environment: Environment;
  children: React.ReactNode;
}) {
  const hydrated = useHydrated();
  const atual = useAuthStore((s) => s.environment);
  const entrarComoDemo = useAuthStore((s) => s.entrarComoDemo);
  const router = useRouter();

  useEffect(() => {
    if (!hydrated) return;
    if (!atual) entrarComoDemo(environment);
    else if (atual !== environment) useAuthStore.getState().trocarAmbiente(environment);
  }, [hydrated, atual, environment, entrarComoDemo, router]);

  if (!hydrated) {
    return (
      <div
        data-env={environment}
        className="flex min-h-dvh items-center justify-center bg-[var(--bg)]"
      >
        <LeafMark
          className="size-8 animate-[shimmer_1.6s_ease-in-out_infinite] text-[var(--accent)]"
          variant="outline"
        />
        <span className="sr-only">Carregando ambiente demonstrativo</span>
      </div>
    );
  }

  return <>{children}</>;
}
