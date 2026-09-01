import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { LeafMark } from "@/components/brand/leaf-mark";
import { Logo } from "@/components/brand/logo";

const CAMINHOS = [
  { href: "/", titulo: "Página inicial", descricao: "Como a plataforma funciona" },
  { href: "/demo", titulo: "Demonstração", descricao: "Os três ambientes, sem cadastro" },
  { href: "/ecopontos", titulo: "Ecopontos", descricao: "A rede de pontos de coleta" },
  { href: "/contato", titulo: "Contato", descricao: "Falar com o time" },
];

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col">
      <div className="flex h-[var(--header-h)] items-center px-4 lg:px-6">
        <Logo />
      </div>

      <main className="relative flex flex-1 items-center overflow-hidden">
        <div
          aria-hidden
          className="grid-texture pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_45%,black,transparent)]"
        />

        <div className="relative mx-auto w-full max-w-[1360px] px-4 py-16 lg:px-6">
          <div className="max-w-2xl">
            <LeafMark className="size-11 text-[var(--accent)]" variant="outline" />

            <p className="mt-8 font-mono text-[13px] font-medium tracking-[0.14em] text-[var(--fg-subtle)]">
              ERRO 404
            </p>

            <h1 className="mt-4 text-balance font-display text-[clamp(2rem,4.5vw,3rem)] font-semibold leading-[1.08] tracking-[-0.032em] text-[var(--fg)]">
              Parece que essa trilha não leva a um ecoponto.
            </h1>

            <p className="mt-5 max-w-[52ch] text-[16px] leading-relaxed text-[var(--fg-muted)]">
              A página que você procurou não existe ou mudou de endereço. Abaixo
              estão os caminhos que levam a algum lugar.
            </p>

            <ul className="mt-10 divide-y divide-[var(--border)] border-y border-[var(--border)]">
              {CAMINHOS.map((caminho) => (
                <li key={caminho.href}>
                  <Link
                    href={caminho.href}
                    className="group flex items-center justify-between gap-4 py-4"
                  >
                    <span className="min-w-0">
                      <span className="block text-[15px] font-medium text-[var(--fg)] transition-colors group-hover:text-[var(--accent)]">
                        {caminho.titulo}
                      </span>
                      <span className="mt-0.5 block text-[12.5px] text-[var(--fg-muted)]">
                        {caminho.descricao}
                      </span>
                    </span>
                    <ArrowRight
                      className="size-4 shrink-0 text-[var(--fg-subtle)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--accent)]"
                      weight="bold"
                      aria-hidden
                    />
                  </Link>
                </li>
              ))}
            </ul>

            <Button asChild size="lg" className="mt-10">
              <Link href="/">Voltar ao início</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
