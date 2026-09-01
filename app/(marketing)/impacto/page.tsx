import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { Table, Td, Th, Tr } from "@/components/ui/data-display";
import { PlatformChart } from "@/features/content/platform-chart";
import { impactEquivalences } from "@/lib/eco";
import { MATERIALS } from "@/mocks/materials";
import { PLATFORM_STATS } from "@/mocks/platform";
import { formatNumber } from "@/lib/format";

export const metadata: Metadata = {
  title: "Impacto",
  description:
    "Volume reciclado, CO2 evitado e economia gerada pela plataforma, com a metodologia de cálculo aberta.",
};

export default function ImpactoPage() {
  const co2Total = PLATFORM_STATS.find((s) => s.id === "co2-evitado")!.valor * 1000;
  const equivalencias = impactEquivalences(co2Total);

  return (
    <>
      <section className="border-b border-[var(--border)]">
        <div className="mx-auto max-w-[1360px] px-4 py-20 lg:px-6 lg:py-24">
          <div className="max-w-3xl">
            <p className="eyebrow">Impacto</p>
            <h1 className="mt-5 text-balance font-display text-[clamp(2.25rem,5vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-[var(--fg)]">
              O que a rede já moveu, e como esse número é calculado.
            </h1>
            <p className="mt-7 max-w-[62ch] text-[17px] leading-relaxed text-[var(--fg-muted)]">
              Cada tonelada aqui veio de descartes validados individualmente, com
              material identificado e peso aferido. A conversão para CO2 usa
              fatores públicos por material — os mesmos que creditam o ponto do
              usuário.
            </p>
          </div>

          <dl className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {PLATFORM_STATS.map((stat, indice) => (
              <div key={stat.id} className="border-t border-[var(--border)] pt-5">
                <dd className="font-display text-[clamp(2rem,4vw,2.75rem)] font-semibold leading-none tracking-[-0.035em] text-[var(--fg)]">
                  <AnimatedNumber
                    value={stat.valor}
                    formato={stat.id === "economia-estimada" ? "moeda" : "compacto"}
                    atraso={indice * 110}
                  />
                  {stat.id !== "economia-estimada" && stat.sufixo && (
                    <span className="ml-1 text-[18px] font-medium text-[var(--fg-muted)]">
                      {stat.sufixo}
                    </span>
                  )}
                </dd>
                <dt className="mt-3 text-[13.5px] font-medium text-[var(--fg)]">
                  {stat.rotulo}
                </dt>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-[var(--fg-muted)]">
                  {stat.descricao}
                </p>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Séries */}
      <section className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-[1360px] px-4 py-16 lg:px-6 lg:py-20">
          <PlatformChart />
        </div>
      </section>

      {/* Equivalências */}
      <section className="border-b border-[var(--border)]">
        <div className="mx-auto max-w-[1360px] px-4 py-16 lg:px-6 lg:py-20">
          <div className="max-w-2xl">
            <p className="eyebrow">Tradução</p>
            <h2 className="mt-4 text-balance font-display text-h1 text-[var(--fg)]">
              {formatNumber(co2Total / 1000)} toneladas de CO2 é muito?
            </h2>
            <p className="mt-4 max-w-[56ch] text-[15px] leading-relaxed text-[var(--fg-muted)]">
              Emissão evitada é uma grandeza difícil de dimensionar. As
              equivalências abaixo usam fatores de referência para tornar o número
              tangível.
            </p>
          </div>

          <ul className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-3">
            {equivalencias.map((item) => (
              <li key={item.id} className="border-t border-[var(--border)] pt-5">
                <p className="font-display text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold leading-none tabular tracking-[-0.035em] text-[var(--fg)]">
                  <AnimatedNumber value={item.valor} formato="compacto" />
                  <span className="ml-1.5 text-[16px] font-medium text-[var(--fg-muted)]">
                    {item.unidade}
                  </span>
                </p>
                <p className="mt-3 max-w-[30ch] text-[13.5px] leading-relaxed text-[var(--fg-muted)]">
                  {item.descricao}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Metodologia */}
      <section className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-[1360px] px-4 py-16 lg:px-6 lg:py-20">
          <div className="max-w-2xl">
            <p className="eyebrow">Metodologia</p>
            <h2 className="mt-4 text-balance font-display text-h1 text-[var(--fg)]">
              Os fatores por material são abertos.
            </h2>
            <p className="mt-4 max-w-[62ch] text-[15px] leading-relaxed text-[var(--fg-muted)]">
              A pontuação e a emissão evitada saem da mesma tabela. Um quilo de
              alumínio vale mais EcoPontos que um quilo de vidro porque evita mais
              emissão na cadeia produtiva — não porque um seja mais valioso que o
              outro no mercado.
            </p>
          </div>

          <div className="mt-10 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg)]">
            <Table>
              <thead>
                <tr>
                  <Th>Material</Th>
                  <Th className="hidden sm:table-cell">O que entra</Th>
                  <Th numeric>EcoPontos por kg</Th>
                  <Th numeric>kg de CO2 evitado por kg</Th>
                </tr>
              </thead>
              <tbody>
                {MATERIALS.map((material) => (
                  <Tr key={material.id}>
                    <Td>
                      <span className="flex items-center gap-2.5">
                        <span
                          aria-hidden
                          className="size-2.5 shrink-0 rounded-[2px]"
                          style={{ background: material.cor }}
                        />
                        <span className="text-[13.5px] font-medium text-[var(--fg)]">
                          {material.nome}
                        </span>
                      </span>
                    </Td>
                    <Td className="hidden text-[12.5px] text-[var(--fg-muted)] sm:table-cell">
                      {material.descricao}
                    </Td>
                    <Td numeric className="text-[13px] font-medium">
                      {material.pontosPorKg}
                    </Td>
                    <Td numeric className="text-[13px]">
                      {formatNumber(material.co2PorKg, 1)}
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          </div>

          <p className="mt-5 max-w-[80ch] text-[12.5px] leading-relaxed text-[var(--fg-subtle)]">
            Os fatores de CO2 são médias de referência para a cadeia brasileira e
            servem para estimativa, não para inventário certificado. Todos os
            números desta página são demonstrativos: a aplicação não possui banco
            de dados nem integração com fonte externa.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1360px] px-4 py-20 text-center lg:px-6">
        <h2 className="mx-auto max-w-[20ch] text-balance font-display text-h1 text-[var(--fg)]">
          Calcule o seu impacto antes de começar.
        </h2>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/#simulador">
              Simular meu impacto
              <ArrowRight weight="bold" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/demo">Explorar demonstração</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
