"use client";

import * as React from "react";
import { CaretDown, CaretUp, MagnifyingGlass, Users } from "@phosphor-icons/react";
import { PageContainer, PageHeader } from "@/components/layout/app-shell";
import { Avatar, Delta, ProgressBar, Table, Td, Th, Tr } from "@/components/ui/data-display";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/controls";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/ui/feedback";
import { COMPANY, DEPARTMENTS, DEPARTMENT_BY_ID, EMPLOYEES } from "@/mocks/company";
import { ECO_LEVEL_BY_ID } from "@/mocks/levels";
import { formatNumber, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Employee } from "@/types";

type ColunaOrdenavel = "pontos" | "kgReciclados" | "descartes" | "nome";

export default function CollaboratorsPage() {
  return (
    <PageContainer wide>
      <PageHeader
        eyebrow="Programa interno"
        titulo="Colaboradores"
        descricao={`${COMPANY.colaboradoresAtivos} de ${COMPANY.colaboradores} colaboradores participam ativamente. O ranking usa os EcoPontos acumulados no ano.`}
      />

      <Tabs defaultValue="pessoas">
        <TabsList>
          <TabsTrigger value="pessoas" layoutId="colab-tab">
            Pessoas
          </TabsTrigger>
          <TabsTrigger value="equipes" layoutId="colab-tab">
            Equipes
          </TabsTrigger>
          <TabsTrigger value="departamentos" layoutId="colab-tab">
            Departamentos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pessoas" className="pt-6">
          <PeopleTable />
        </TabsContent>
        <TabsContent value="equipes" className="pt-6">
          <TeamsView />
        </TabsContent>
        <TabsContent value="departamentos" className="pt-6">
          <DepartmentsTable />
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}

/* ------------------------------------------------------------------ */
/* Pessoas                                                             */
/* ------------------------------------------------------------------ */

function PeopleTable() {
  const [busca, setBusca] = React.useState("");
  const [unidade, setUnidade] = React.useState("todas");
  const [departamento, setDepartamento] = React.useState("todos");
  const [coluna, setColuna] = React.useState<ColunaOrdenavel>("pontos");
  const [descendente, setDescendente] = React.useState(true);

  const filtrados = React.useMemo(() => {
    const termo = busca.trim().toLowerCase();

    const lista = EMPLOYEES.filter((colaborador) => {
      if (unidade !== "todas" && colaborador.unidade !== unidade) return false;
      if (departamento !== "todos" && colaborador.departamentoId !== departamento)
        return false;
      if (!termo) return true;
      return `${colaborador.nome} ${colaborador.cargo}`.toLowerCase().includes(termo);
    });

    return [...lista].sort((a, b) => {
      const valorA = a[coluna];
      const valorB = b[coluna];
      const comparacao =
        typeof valorA === "string" && typeof valorB === "string"
          ? valorA.localeCompare(valorB, "pt-BR")
          : Number(valorA) - Number(valorB);
      return descendente ? -comparacao : comparacao;
    });
  }, [busca, unidade, departamento, coluna, descendente]);

  const ordenarPor = (nova: ColunaOrdenavel) => {
    if (nova === coluna) setDescendente((atual) => !atual);
    else {
      setColuna(nova);
      setDescendente(nova !== "nome");
    }
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-2.5">
        <div className="relative min-w-[220px] flex-1">
          <MagnifyingGlass
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--fg-subtle)]"
            weight="bold"
          />
          <label htmlFor="busca-colaboradores" className="sr-only">
            Buscar colaboradores
          </label>
          <Input
            id="busca-colaboradores"
            value={busca}
            onChange={(evento) => setBusca(evento.target.value)}
            placeholder="Buscar por nome ou cargo…"
            className="pl-9"
          />
        </div>

        <Select value={unidade} onValueChange={setUnidade}>
          <SelectTrigger className="h-10 w-auto min-w-[180px] text-[13px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas as unidades</SelectItem>
            {COMPANY.unidades.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={departamento} onValueChange={setDepartamento}>
          <SelectTrigger className="h-10 w-auto min-w-[190px] text-[13px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os departamentos</SelectItem>
            {DEPARTMENTS.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <p className="mb-3 text-[12.5px] text-[var(--fg-subtle)]">
        {filtrados.length} de {EMPLOYEES.length} colaboradores listados
      </p>

      {filtrados.length === 0 ? (
        <EmptyState
          className="rounded-[var(--radius-lg)] border border-[var(--border)]"
          icon={<Users />}
          title="Nenhum colaborador encontrado."
          description="Ajuste a busca ou remova um dos filtros para ampliar a lista."
          action={{
            label: "Limpar filtros",
            onClick: () => {
              setBusca("");
              setUnidade("todas");
              setDepartamento("todos");
            },
          }}
        />
      ) : (
        <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
          <Table>
            <thead>
              <tr>
                <Th className="w-14">#</Th>
                <ThOrdenavel
                  rotulo="Colaborador"
                  ativo={coluna === "nome"}
                  descendente={descendente}
                  onClick={() => ordenarPor("nome")}
                />
                <Th className="hidden md:table-cell">Departamento</Th>
                <Th className="hidden lg:table-cell">Nível</Th>
                <ThOrdenavel
                  rotulo="Descartes"
                  numeric
                  ativo={coluna === "descartes"}
                  descendente={descendente}
                  onClick={() => ordenarPor("descartes")}
                  className="hidden sm:table-cell"
                />
                <ThOrdenavel
                  rotulo="Reciclado"
                  numeric
                  ativo={coluna === "kgReciclados"}
                  descendente={descendente}
                  onClick={() => ordenarPor("kgReciclados")}
                />
                <ThOrdenavel
                  rotulo="EcoPontos"
                  numeric
                  ativo={coluna === "pontos"}
                  descendente={descendente}
                  onClick={() => ordenarPor("pontos")}
                />
              </tr>
            </thead>
            <tbody>
              {filtrados.map((colaborador, indice) => (
                <EmployeeRow
                  key={colaborador.id}
                  colaborador={colaborador}
                  posicao={indice + 1}
                />
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
}

function ThOrdenavel({
  rotulo,
  ativo,
  descendente,
  onClick,
  numeric,
  className,
}: {
  rotulo: string;
  ativo: boolean;
  descendente: boolean;
  onClick: () => void;
  numeric?: boolean;
  className?: string;
}) {
  return (
    <Th numeric={numeric} className={className} aria-sort={ativo ? (descendente ? "descending" : "ascending") : "none"}>
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "inline-flex items-center gap-1 transition-colors hover:text-[var(--fg)]",
          ativo && "text-[var(--fg)]",
        )}
      >
        {rotulo}
        {ativo &&
          (descendente ? (
            <CaretDown className="size-3" weight="bold" aria-hidden />
          ) : (
            <CaretUp className="size-3" weight="bold" aria-hidden />
          ))}
      </button>
    </Th>
  );
}

function EmployeeRow({
  colaborador,
  posicao,
}: {
  colaborador: Employee;
  posicao: number;
}) {
  const departamento = DEPARTMENT_BY_ID[colaborador.departamentoId];

  return (
    <Tr>
      <Td className="text-[12.5px] tabular text-[var(--fg-subtle)]">{posicao}</Td>
      <Td>
        <div className="flex items-center gap-3">
          <Avatar iniciais={colaborador.iniciais} size="sm" tone="neutral" />
          <div className="min-w-0">
            <p className="truncate text-[13.5px] font-medium text-[var(--fg)]">
              {colaborador.nome}
            </p>
            <p className="truncate text-[11.5px] text-[var(--fg-subtle)]">
              {colaborador.cargo}
            </p>
          </div>
        </div>
      </Td>
      <Td className="hidden md:table-cell">
        <p className="text-[12.5px] text-[var(--fg-muted)]">{departamento?.nome}</p>
        <p className="text-[11px] text-[var(--fg-subtle)]">{colaborador.unidade}</p>
      </Td>
      <Td className="hidden lg:table-cell">
        <Badge tone="neutral">{ECO_LEVEL_BY_ID[colaborador.nivel].nome}</Badge>
      </Td>
      <Td numeric className="hidden text-[13px] sm:table-cell">
        {formatNumber(colaborador.descartes)}
      </Td>
      <Td numeric className="text-[13px]">
        {formatNumber(colaborador.kgReciclados, 1)} kg
      </Td>
      <Td numeric className="text-[13px] font-medium">
        {formatNumber(colaborador.pontos)}
      </Td>
    </Tr>
  );
}

/* ------------------------------------------------------------------ */
/* Equipes — agrupamento por unidade                                   */
/* ------------------------------------------------------------------ */

function TeamsView() {
  const equipes = React.useMemo(
    () =>
      COMPANY.unidades
        .map((unidade) => {
          const departamentos = DEPARTMENTS.filter((d) => d.unidade === unidade);
          const colaboradores = departamentos.reduce(
            (soma, d) => soma + d.colaboradores,
            0,
          );
          const kg = departamentos.reduce((soma, d) => soma + d.kgReciclados, 0);
          const pontos = departamentos.reduce((soma, d) => soma + d.pontos, 0);
          const adesao =
            departamentos.reduce(
              (soma, d) => soma + d.adesaoPercentual * d.colaboradores,
              0,
            ) / Math.max(colaboradores, 1);

          return { unidade, departamentos, colaboradores, kg, pontos, adesao };
        })
        .sort((a, b) => b.kg - a.kg),
    [],
  );

  return (
    <ul className="space-y-4">
      {equipes.map((equipe) => (
        <li
          key={equipe.unidade}
          className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="font-display text-[16px] font-semibold text-[var(--fg)]">
                {equipe.unidade}
              </h3>
              <p className="mt-1 text-[12.5px] text-[var(--fg-muted)]">
                {equipe.departamentos.length} departamentos ·{" "}
                {formatNumber(equipe.colaboradores)} colaboradores
              </p>
            </div>

            <dl className="flex flex-wrap gap-x-8 gap-y-3">
              {[
                { rotulo: "Reciclado", valor: `${formatNumber(equipe.kg / 1000, 1)} t` },
                { rotulo: "EcoPontos", valor: formatNumber(equipe.pontos) },
                { rotulo: "Adesão média", valor: formatPercent(equipe.adesao) },
              ].map((item) => (
                <div key={item.rotulo}>
                  <dt className="text-[11.5px] text-[var(--fg-subtle)]">
                    {item.rotulo}
                  </dt>
                  <dd className="mt-1 font-display text-[17px] font-semibold tabular text-[var(--fg)]">
                    {item.valor}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <ul className="mt-5 space-y-2.5 border-t border-[var(--border)] pt-4">
            {equipe.departamentos.map((departamento) => (
              <li key={departamento.id} className="flex items-center gap-3">
                <span className="w-32 shrink-0 truncate text-[12.5px] text-[var(--fg-muted)]">
                  {departamento.nome}
                </span>
                <div className="flex-1">
                  <ProgressBar
                    value={departamento.kgReciclados}
                    max={Math.max(...equipe.departamentos.map((d) => d.kgReciclados))}
                    size="sm"
                  />
                </div>
                <span className="w-20 shrink-0 text-right text-[12.5px] tabular text-[var(--fg)]">
                  {formatNumber(departamento.kgReciclados)} kg
                </span>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* Departamentos                                                       */
/* ------------------------------------------------------------------ */

function DepartmentsTable() {
  const ordenados = [...DEPARTMENTS].sort((a, b) => b.kgReciclados - a.kgReciclados);
  const maiorVolume = ordenados[0].kgReciclados;

  return (
    <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
      <Table>
        <thead>
          <tr>
            <Th className="w-12">#</Th>
            <Th>Departamento</Th>
            <Th className="hidden md:table-cell">Unidade</Th>
            <Th numeric>Pessoas</Th>
            <Th numeric className="hidden sm:table-cell">
              Adesão
            </Th>
            <Th>Volume no ano</Th>
            <Th numeric className="hidden lg:table-cell">
              Variação
            </Th>
          </tr>
        </thead>
        <tbody>
          {ordenados.map((departamento, indice) => (
            <Tr key={departamento.id}>
              <Td className="text-[12.5px] tabular text-[var(--fg-subtle)]">
                {indice + 1}
              </Td>
              <Td>
                <p className="text-[13.5px] font-medium text-[var(--fg)]">
                  {departamento.nome}
                </p>
                <p className="text-[11.5px] tabular text-[var(--fg-subtle)]">
                  {formatNumber(departamento.pontos)} EcoPontos distribuídos
                </p>
              </Td>
              <Td className="hidden text-[12.5px] text-[var(--fg-muted)] md:table-cell">
                {departamento.unidade}
              </Td>
              <Td numeric className="text-[13px]">
                {departamento.colaboradores}
              </Td>
              <Td numeric className="hidden text-[13px] sm:table-cell">
                {departamento.adesaoPercentual}%
              </Td>
              <Td>
                <div className="flex items-center gap-3">
                  <div className="min-w-[80px] flex-1">
                    <ProgressBar
                      value={departamento.kgReciclados}
                      max={maiorVolume}
                      size="xs"
                    />
                  </div>
                  <span className="shrink-0 text-[12.5px] tabular text-[var(--fg)]">
                    {formatNumber(departamento.kgReciclados)} kg
                  </span>
                </div>
              </Td>
              <Td numeric className="hidden lg:table-cell">
                <Delta value={departamento.variacaoMensal} />
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
