"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Briefcase, X } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/feedback";
import { CAREER_AREAS, CAREER_LOCATIONS, JOB_OPENINGS } from "@/mocks/careers";
import { cn } from "@/lib/utils";
import type { JobOpening } from "@/types";

const MODALIDADES: { id: JobOpening["modalidade"]; rotulo: string }[] = [
  { id: "remoto", rotulo: "Remoto" },
  { id: "hibrido", rotulo: "Híbrido" },
  { id: "presencial", rotulo: "Presencial" },
];

const SENIORIDADES: { id: JobOpening["senioridade"]; rotulo: string }[] = [
  { id: "estagio", rotulo: "Estágio" },
  { id: "junior", rotulo: "Júnior" },
  { id: "pleno", rotulo: "Pleno" },
  { id: "senior", rotulo: "Sênior" },
  { id: "lideranca", rotulo: "Liderança" },
];

export function CareersIndex() {
  const [area, setArea] = React.useState("todas");
  const [local, setLocal] = React.useState("todas");
  const [modalidade, setModalidade] = React.useState<JobOpening["modalidade"] | "todas">(
    "todas",
  );
  const [senioridade, setSenioridade] = React.useState<
    JobOpening["senioridade"] | "todas"
  >("todas");

  const vagas = JOB_OPENINGS.filter((vaga) => {
    if (area !== "todas" && vaga.area !== area) return false;
    if (local !== "todas" && vaga.localizacao !== local) return false;
    if (modalidade !== "todas" && vaga.modalidade !== modalidade) return false;
    if (senioridade !== "todas" && vaga.senioridade !== senioridade) return false;
    return true;
  });

  const limpar = () => {
    setArea("todas");
    setLocal("todas");
    setModalidade("todas");
    setSenioridade("todas");
  };

  const temFiltro =
    area !== "todas" ||
    local !== "todas" ||
    modalidade !== "todas" ||
    senioridade !== "todas";

  return (
    <div className="mx-auto max-w-[1360px] px-4 py-14 lg:px-6 lg:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--border)] pb-5">
        <div>
          <h2 className="font-display text-h2 text-[var(--fg)]">Vagas abertas</h2>
          <p className="mt-2 text-[13.5px] text-[var(--fg-muted)]">
            {vagas.length} {vagas.length === 1 ? "posição" : "posições"} de{" "}
            {JOB_OPENINGS.length} no total
          </p>
        </div>
        {temFiltro && (
          <Button variant="ghost" size="sm" onClick={limpar}>
            <X weight="bold" />
            Limpar filtros
          </Button>
        )}
      </div>

      {/* Filtros combináveis */}
      <div className="mt-6 space-y-3">
        <GrupoFiltro
          rotulo="Área"
          opcoes={[
            { valor: "todas", rotulo: "Todas" },
            ...CAREER_AREAS.map((item) => ({ valor: item, rotulo: item })),
          ]}
          valor={area}
          onChange={setArea}
        />
        <GrupoFiltro
          rotulo="Local"
          opcoes={[
            { valor: "todas", rotulo: "Todos" },
            ...CAREER_LOCATIONS.map((item) => ({ valor: item, rotulo: item })),
          ]}
          valor={local}
          onChange={setLocal}
        />
        <GrupoFiltro
          rotulo="Modalidade"
          opcoes={[
            { valor: "todas", rotulo: "Todas" },
            ...MODALIDADES.map((item) => ({ valor: item.id, rotulo: item.rotulo })),
          ]}
          valor={modalidade}
          onChange={(valor) => setModalidade(valor as JobOpening["modalidade"] | "todas")}
        />
        <GrupoFiltro
          rotulo="Senioridade"
          opcoes={[
            { valor: "todas", rotulo: "Todas" },
            ...SENIORIDADES.map((item) => ({ valor: item.id, rotulo: item.rotulo })),
          ]}
          valor={senioridade}
          onChange={(valor) =>
            setSenioridade(valor as JobOpening["senioridade"] | "todas")
          }
        />
      </div>

      {vagas.length === 0 ? (
        <EmptyState
          className="mt-10 rounded-[var(--radius-lg)] border border-[var(--border)]"
          icon={<Briefcase />}
          title="Nenhuma vaga com esses filtros."
          description="Ajuste os critérios ou deixe seu contato pela página de contato — avisamos quando abrir algo do seu perfil."
          action={{ label: "Limpar filtros", onClick: limpar }}
        />
      ) : (
        <ul className="mt-10 divide-y divide-[var(--border)] border-y border-[var(--border)]">
          {vagas.map((vaga) => (
            <li key={vaga.id}>
              <Link
                href={`/carreiras/${vaga.slug}`}
                className="group flex flex-wrap items-center gap-x-6 gap-y-3 py-6 transition-colors hover:bg-[var(--surface-2)] sm:px-2"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="neutral">{vaga.area}</Badge>
                    <Badge tone="neutral">
                      {MODALIDADES.find((m) => m.id === vaga.modalidade)?.rotulo}
                    </Badge>
                    <Badge tone="neutral">
                      {SENIORIDADES.find((s) => s.id === vaga.senioridade)?.rotulo}
                    </Badge>
                  </div>
                  <h3 className="mt-3 font-display text-[18px] font-semibold tracking-[-0.015em] text-[var(--fg)] transition-colors group-hover:text-[var(--accent)]">
                    {vaga.titulo}
                  </h3>
                  <p className="mt-2 max-w-[68ch] text-[13.5px] leading-relaxed text-[var(--fg-muted)]">
                    {vaga.resumo}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-6">
                  <span className="text-[13px] text-[var(--fg-muted)]">
                    {vaga.localizacao}
                  </span>
                  <ArrowRight
                    className="size-4 text-[var(--fg-subtle)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--accent)]"
                    weight="bold"
                    aria-hidden
                  />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function GrupoFiltro({
  rotulo,
  opcoes,
  valor,
  onChange,
}: {
  rotulo: string;
  opcoes: { valor: string; rotulo: string }[];
  valor: string;
  onChange: (valor: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <span className="w-24 shrink-0 text-[12px] font-medium text-[var(--fg-subtle)]">
        {rotulo}
      </span>
      <div className="flex flex-wrap gap-1.5">
        {opcoes.map((opcao) => (
          <button
            key={opcao.valor}
            type="button"
            onClick={() => onChange(opcao.valor)}
            aria-pressed={valor === opcao.valor}
            className={cn(
              "rounded-full border px-2.5 py-1 text-[12px] font-medium transition-colors",
              valor === opcao.valor
                ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                : "border-[var(--border)] text-[var(--fg-muted)] hover:border-[var(--border-strong)] hover:text-[var(--fg)]",
            )}
          >
            {opcao.rotulo}
          </button>
        ))}
      </div>
    </div>
  );
}
