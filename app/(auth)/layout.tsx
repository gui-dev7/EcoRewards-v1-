import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { LeafMark } from "@/components/brand/leaf-mark";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { PLATFORM_STATS } from "@/mocks/platform";
import { formatCompact } from "@/lib/format";

/**
 * Layout de autenticação: argumento editorial de um lado, formulário do
 * outro. No mobile o painel esquerdo some — quem chegou aqui já decidiu.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1.05fr_1fr]">
      {/* Painel editorial */}
      <aside className="relative hidden overflow-hidden border-r border-[var(--border)] bg-[var(--surface)] lg:flex lg:flex-col">
        <div
          aria-hidden
          className="grid-texture pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_70%_60%_at_40%_40%,black,transparent)]"
        />

        <div className="relative flex h-[var(--header-h)] items-center px-8">
          <Logo />
        </div>

        <div className="relative flex flex-1 flex-col justify-center px-8 pb-16 xl:px-14">
          <LeafMark className="size-9 text-[var(--accent)]" />
          <h2 className="mt-8 max-w-[16ch] text-balance font-display text-h1 text-[var(--fg)]">
            Seu impacto gera valor.
          </h2>
          <p className="mt-5 max-w-[46ch] text-[15px] leading-relaxed text-[var(--fg-muted)]">
            Cada descarte validado entra num fluxo que termina em recompensa
            para quem recicla e em indicador auditável para quem administra a
            cidade.
          </p>

          <dl className="mt-12 grid max-w-md grid-cols-3 gap-px overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--border)]">
            {PLATFORM_STATS.slice(0, 3).map((stat) => (
              <div key={stat.id} className="bg-[var(--surface)] px-4 py-3.5">
                <dt className="text-[11px] leading-tight text-[var(--fg-subtle)]">
                  {stat.rotulo}
                </dt>
                <dd className="mt-1.5 font-display text-[18px] font-semibold tabular tracking-[-0.02em] text-[var(--fg)]">
                  {formatCompact(stat.valor)}
                  {stat.sufixo && stat.sufixo !== "R$" && (
                    <span className="ml-0.5 text-[12px] font-medium text-[var(--fg-muted)]">
                      {stat.sufixo}
                    </span>
                  )}
                </dd>
              </div>
            ))}
          </dl>

          <p className="mt-10 max-w-[46ch] text-[12px] leading-relaxed text-[var(--fg-subtle)]">
            Projeto demonstrativo. Não há banco de dados nem autenticação real —
            as contas demo validam localmente, no seu navegador.
          </p>
        </div>
      </aside>

      {/* Formulário */}
      <div className="flex flex-col">
        <div className="flex h-[var(--header-h)] items-center justify-between px-4 lg:px-8">
          <Logo className="lg:hidden" />
          <Link
            href="/"
            className="ml-auto hidden text-[13px] text-[var(--fg-muted)] transition-colors hover:text-[var(--accent)] lg:block"
          >
            ← Voltar ao site
          </Link>
          <ThemeToggle className="ml-2" />
        </div>

        <main
          id="conteudo"
          className="flex flex-1 items-center justify-center px-4 py-10 lg:px-8"
        >
          <div className="w-full max-w-[420px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
