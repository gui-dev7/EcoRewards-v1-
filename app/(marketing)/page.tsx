import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Hero } from "@/features/home/hero";
import { FlowDiagram } from "@/features/home/flow-diagram";
import { Scrollytelling } from "@/features/home/scrollytelling";
import { ImpactCounters } from "@/features/home/impact-counters";
import { Ecosystem } from "@/features/home/ecosystem";
import { ImpactSimulator } from "@/features/home/impact-simulator";
import { Button } from "@/components/ui/button";
import { LeafMark } from "@/components/brand/leaf-mark";
import { PARTNERS } from "@/mocks/platform";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FlowDiagram />
      <ImpactCounters />
      <Scrollytelling />
      <Ecosystem />
      <ImpactSimulator />
      <Partners />
      <FinalCta />
    </>
  );
}

function Partners() {
  return (
    <section className="border-b border-[var(--border)]">
      <div className="mx-auto max-w-[1360px] px-4 py-14 lg:px-6">
        <p className="eyebrow text-center">Parceiros do catálogo de recompensas</p>
        <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 lg:grid-cols-6">
          {PARTNERS.map((parceiro) => (
            <li key={parceiro.id} className="text-center">
              <p className="truncate text-[13.5px] font-medium text-[var(--fg-muted)]">
                {parceiro.nome}
              </p>
              <p className="mt-0.5 truncate text-[11px] text-[var(--fg-subtle)]">
                {parceiro.setor}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="grid-texture pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_60%_70%_at_50%_50%,black,transparent)]"
      />
      <div className="relative mx-auto max-w-[1360px] px-4 py-24 text-center lg:px-6 lg:py-32">
        <LeafMark className="mx-auto size-10 text-[var(--accent)]" />
        <h2 className="mx-auto mt-8 max-w-[18ch] text-balance font-display text-h1 text-[var(--fg)]">
          Abra a demonstração e explore o produto inteiro.
        </h2>
        <p className="mx-auto mt-5 max-w-[52ch] text-[15px] leading-relaxed text-[var(--fg-muted)]">
          Três ambientes prontos, com dados coerentes entre si. Sem cadastro,
          sem configuração e sem serviço externo para funcionar.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/demo">
              Explorar demonstração
              <ArrowRight weight="bold" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/sobre">Conhecer o projeto</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
