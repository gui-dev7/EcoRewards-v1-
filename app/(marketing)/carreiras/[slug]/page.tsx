import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check } from "@phosphor-icons/react/dist/ssr";
import { Badge } from "@/components/ui/badge";
import { ApplicationForm } from "@/features/content/application-form";
import { JOB_OPENINGS } from "@/mocks/careers";
import { formatDate } from "@/lib/format";

const MODALIDADE_ROTULO: Record<string, string> = {
  remoto: "Remoto",
  hibrido: "Híbrido",
  presencial: "Presencial",
};

const SENIORIDADE_ROTULO: Record<string, string> = {
  estagio: "Estágio",
  junior: "Júnior",
  pleno: "Pleno",
  senior: "Sênior",
  lideranca: "Liderança",
};

export function generateStaticParams() {
  return JOB_OPENINGS.map((vaga) => ({ slug: vaga.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const vaga = JOB_OPENINGS.find((item) => item.slug === slug);
  if (!vaga) return { title: "Vaga não encontrada" };

  return { title: vaga.titulo, description: vaga.resumo };
}

export default async function VagaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vaga = JOB_OPENINGS.find((item) => item.slug === slug);
  if (!vaga) notFound();

  const secoes = [
    { titulo: "Sobre a posição", itens: vaga.descricao, lista: false },
    { titulo: "O que esperamos", itens: vaga.requisitos, lista: true },
    { titulo: "Diferenciais", itens: vaga.diferenciais, lista: true },
    { titulo: "Benefícios", itens: vaga.beneficios, lista: true },
  ];

  return (
    <div className="mx-auto max-w-[1360px] px-4 py-14 lg:px-6 lg:py-20">
      <Link
        href="/carreiras"
        className="inline-flex items-center gap-1.5 text-[13px] text-[var(--fg-muted)] transition-colors hover:text-[var(--accent)]"
      >
        <ArrowLeft className="size-4" weight="bold" />
        Todas as vagas
      </Link>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_400px] lg:gap-16">
        <article>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="accent">{vaga.area}</Badge>
            <Badge tone="neutral">{MODALIDADE_ROTULO[vaga.modalidade]}</Badge>
            <Badge tone="neutral">{SENIORIDADE_ROTULO[vaga.senioridade]}</Badge>
          </div>

          <h1 className="mt-5 max-w-[22ch] text-balance font-display text-[clamp(1.875rem,4vw,2.75rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-[var(--fg)]">
            {vaga.titulo}
          </h1>

          <p className="mt-5 max-w-[62ch] text-[16px] leading-relaxed text-[var(--fg-muted)]">
            {vaga.resumo}
          </p>

          <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4 border-y border-[var(--border)] py-5">
            {[
              { rotulo: "Localização", valor: vaga.localizacao },
              { rotulo: "Modalidade", valor: MODALIDADE_ROTULO[vaga.modalidade] },
              { rotulo: "Nível", valor: SENIORIDADE_ROTULO[vaga.senioridade] },
              { rotulo: "Publicada em", valor: formatDate(vaga.publicadaEm) },
            ].map((item) => (
              <div key={item.rotulo}>
                <dt className="text-[11.5px] text-[var(--fg-subtle)]">
                  {item.rotulo}
                </dt>
                <dd className="mt-1 text-[13.5px] font-medium text-[var(--fg)]">
                  {item.valor}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 space-y-10">
            {secoes.map((secao) => (
              <section key={secao.titulo}>
                <h2 className="font-display text-h3 text-[var(--fg)]">
                  {secao.titulo}
                </h2>

                {secao.lista ? (
                  <ul className="mt-4 space-y-3">
                    {secao.itens.map((item) => (
                      <li
                        key={item}
                        className="flex gap-3 text-[15px] leading-relaxed text-[var(--fg-muted)]"
                      >
                        <Check
                          className="mt-1 size-4 shrink-0 text-[var(--accent)]"
                          weight="bold"
                          aria-hidden
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="mt-4 max-w-[68ch] space-y-4">
                    {secao.itens.map((paragrafo) => (
                      <p
                        key={paragrafo}
                        className="text-[15.5px] leading-[1.75] text-[var(--fg-muted)]"
                      >
                        {paragrafo}
                      </p>
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>

          <p className="mt-12 border-t border-[var(--border)] pt-6 text-[12.5px] leading-relaxed text-[var(--fg-subtle)]">
            Vaga fictícia, criada para a demonstração do EcoRewards. Não há
            processo seletivo real associado a esta página.
          </p>
        </article>

        <aside className="lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:self-start">
          <ApplicationForm vaga={vaga.titulo} />
        </aside>
      </div>
    </div>
  );
}
