"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Copy } from "@phosphor-icons/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ENVIRONMENT_ICON } from "@/components/layout/nav-config";
import { DEMO_ACCOUNT_LIST } from "@/lib/demo-accounts";
import { useAuthStore } from "@/stores";
import { cn } from "@/lib/utils";
import type { Environment } from "@/types";

/**
 * Os três ambientes lado a lado. Cada coluna herda o próprio acento
 * via `data-env`, então o cartão do governo é azul e o da empresa é
 * teal sem nenhuma cor escrita à mão.
 */
export function DemoChooser({ compacto }: { compacto?: boolean }) {
  const router = useRouter();
  const entrarComoDemo = useAuthStore((s) => s.entrarComoDemo);
  const [copiado, setCopiado] = React.useState<string | null>(null);

  const entrar = (environment: Environment, nome: string) => {
    const destino = entrarComoDemo(environment);
    toast.success(`Entrando como ${nome}`, {
      description: "Ambiente demonstrativo carregado com dados locais.",
    });
    router.push(destino);
  };

  const copiar = async (texto: string, chave: string) => {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(chave);
      window.setTimeout(() => setCopiado(null), 1800);
    } catch {
      toast.error("Não foi possível copiar", {
        description: "Selecione o texto manualmente para copiar.",
      });
    }
  };

  return (
    <div
      className={cn(
        "grid gap-6 lg:grid-cols-3",
        compacto ? "mt-8" : "mt-12 lg:gap-8",
      )}
    >
      {DEMO_ACCOUNT_LIST.map((conta) => {
        const Icon = ENVIRONMENT_ICON[conta.environment];

        return (
          <article
            key={conta.environment}
            data-env={conta.environment}
            className="group flex flex-col rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] transition-[border-color,box-shadow] duration-300 hover:border-[var(--border-accent)] hover:shadow-[var(--shadow-md)]"
          >
            <header className="border-b border-[var(--border)] p-6">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--accent-soft)] text-[var(--accent)]">
                  <Icon className="size-5" weight="duotone" />
                </span>
                <div className="min-w-0">
                  <h2 className="font-display text-[17px] font-semibold text-[var(--fg)]">
                    {conta.nome}
                  </h2>
                  <p className="truncate text-[12px] text-[var(--fg-subtle)]">
                    {conta.subtitulo}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-[13.5px] leading-relaxed text-[var(--fg-muted)]">
                {conta.descricao}
              </p>
            </header>

            <div className="flex-1 p-6">
              <p className="eyebrow mb-3">Principais recursos</p>
              <ul className="space-y-2.5">
                {conta.recursos.map((recurso) => (
                  <li key={recurso} className="flex gap-2.5 text-[13px] leading-snug text-[var(--fg-muted)]">
                    <Check
                      className="mt-0.5 size-3.5 shrink-0 text-[var(--accent)]"
                      weight="bold"
                      aria-hidden
                    />
                    {recurso}
                  </li>
                ))}
              </ul>

              <div className="mt-6 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-2)] p-3">
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.09em] text-[var(--fg-subtle)]">
                  Credenciais demo
                </p>
                <dl className="mt-2 space-y-1.5">
                  {[
                    { rotulo: "E-mail", valor: conta.email, chave: `${conta.environment}-email` },
                    { rotulo: "Senha", valor: conta.senha, chave: `${conta.environment}-senha` },
                  ].map((linha) => (
                    <div key={linha.chave} className="flex items-center gap-2">
                      <dt className="w-12 shrink-0 text-[11.5px] text-[var(--fg-subtle)]">
                        {linha.rotulo}
                      </dt>
                      <dd className="min-w-0 flex-1 truncate font-mono text-[11.5px] text-[var(--fg-muted)]">
                        {linha.valor}
                      </dd>
                      <button
                        type="button"
                        onClick={() => copiar(linha.valor, linha.chave)}
                        aria-label={`Copiar ${linha.rotulo.toLowerCase()}`}
                        className="shrink-0 rounded-[var(--radius-xs)] p-1 text-[var(--fg-subtle)] transition-colors hover:bg-[var(--surface-3)] hover:text-[var(--fg)]"
                      >
                        {copiado === linha.chave ? (
                          <Check className="size-3.5 text-[var(--good)]" weight="bold" />
                        ) : (
                          <Copy className="size-3.5" />
                        )}
                      </button>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            <footer className="border-t border-[var(--border)] p-6 pt-5">
              <Button
                className="w-full"
                onClick={() => entrar(conta.environment, conta.nome)}
              >
                {conta.cta}
                <ArrowRight weight="bold" />
              </Button>
            </footer>
          </article>
        );
      })}
    </div>
  );
}
