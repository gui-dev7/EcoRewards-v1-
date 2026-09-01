import type { Metadata } from "next";
import { LeafMark } from "@/components/brand/leaf-mark";
import { Logo } from "@/components/brand/logo";
import { RetryButton } from "@/features/content/retry-button";

export const metadata: Metadata = {
  title: "Sem conexão",
  description: "O EcoRewards está temporariamente sem acesso à rede.",
};

const DISPONIVEL_OFFLINE = [
  "Seu saldo de EcoPontos e o extrato já carregado",
  "Vouchers resgatados, com código e validade",
  "Progresso dos desafios e medalhas conquistadas",
  "Preferências de tema e de exibição",
];

export default function OfflinePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <div className="flex h-[var(--header-h)] items-center px-4 lg:px-6">
        <Logo />
      </div>

      <main className="relative flex flex-1 items-center overflow-hidden">
        <div
          aria-hidden
          className="dot-texture pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_55%_60%_at_50%_45%,black,transparent)]"
        />

        <div className="relative mx-auto w-full max-w-[1360px] px-4 py-16 lg:px-6">
          <div className="max-w-2xl">
            <LeafMark className="size-11 text-[var(--fg-subtle)]" variant="outline" />

            <p className="mt-8 font-mono text-[13px] font-medium tracking-[0.14em] text-[var(--fg-subtle)]">
              SEM CONEXÃO
            </p>

            <h1 className="mt-4 text-balance font-display text-[clamp(2rem,4.5vw,3rem)] font-semibold leading-[1.08] tracking-[-0.032em] text-[var(--fg)]">
              A rede caiu, mas seu impacto continua registrado.
            </h1>

            <p className="mt-5 max-w-[54ch] text-[16px] leading-relaxed text-[var(--fg-muted)]">
              O EcoRewards guarda no seu dispositivo tudo o que você já viu. Assim
              que a conexão voltar, a navegação segue de onde parou.
            </p>

            <section className="mt-10 border-t border-[var(--border)] pt-6">
              <p className="eyebrow mb-4">Continua disponível offline</p>
              <ul className="space-y-2.5">
                {DISPONIVEL_OFFLINE.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-[14px] leading-relaxed text-[var(--fg-muted)]"
                  >
                    <span
                      aria-hidden
                      className="mt-[9px] size-1 shrink-0 rounded-full bg-[var(--accent)]"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <RetryButton />
          </div>
        </div>
      </main>
    </div>
  );
}
