"use client";

import * as React from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MagnifyingGlass, MapPin, X } from "@phosphor-icons/react";
import { PageContainer, PageHeader } from "@/components/layout/app-shell";
import { Badge, StatusDot } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import { Sheet, SheetContent } from "@/components/ui/dialog";
import { ProgressBar, Table, Td, Th, Tr } from "@/components/ui/data-display";
import { EmptyState, Skeleton } from "@/components/ui/feedback";
import { COLLECTION_POINTS } from "@/mocks/collection-points";
import { REGIONS, REGION_BY_ID } from "@/mocks/government";
import { MATERIALS, MATERIAL_BY_ID } from "@/mocks/materials";
import { formatDate, formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { CollectionPoint, CollectionPointStatus, MaterialId } from "@/types";

const STATUS_ROTULO: Record<CollectionPointStatus, string> = {
  operacional: "Operacional",
  "quase-cheio": "Quase cheio",
  lotado: "Lotado",
  manutencao: "Em manutenção",
};

const STATUS_TOM: Record<CollectionPointStatus, "good" | "warning" | "critical" | "neutral"> = {
  operacional: "good",
  "quase-cheio": "warning",
  lotado: "critical",
  manutencao: "neutral",
};

export default function GovernmentPointsPage() {
  return (
    <Suspense fallback={<RedeSkeleton />}>
      <NetworkManager />
    </Suspense>
  );
}

function NetworkManager() {
  const router = useRouter();
  const parametros = useSearchParams();

  const [busca, setBusca] = React.useState("");
  const [regiao, setRegiao] = React.useState<string>("todas");
  const [status, setStatus] = React.useState<CollectionPointStatus | "todos">("todos");
  const [material, setMaterial] = React.useState<MaterialId | "todos">("todos");
  const [selecionado, setSelecionado] = React.useState<string | null>(
    parametros.get("ponto"),
  );

  const filtrados = React.useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return COLLECTION_POINTS.filter((ponto) => {
      if (regiao !== "todas" && ponto.regiaoId !== regiao) return false;
      if (status !== "todos" && ponto.status !== status) return false;
      if (material !== "todos" && !ponto.materiais.includes(material)) return false;
      if (!termo) return true;
      return `${ponto.nome} ${ponto.bairro} ${ponto.cidade} ${ponto.endereco}`
        .toLowerCase()
        .includes(termo);
    }).sort((a, b) => b.capacidadePercentual - a.capacidadePercentual);
  }, [busca, regiao, status, material]);

  const detalhe = selecionado
    ? (COLLECTION_POINTS.find((p) => p.id === selecionado) ?? null)
    : null;

  const abrir = (id: string) => {
    setSelecionado(id);
    router.replace(`/governo/ecopontos?ponto=${id}`, { scroll: false });
  };

  const fechar = () => {
    setSelecionado(null);
    router.replace("/governo/ecopontos", { scroll: false });
  };

  const limpar = () => {
    setBusca("");
    setRegiao("todas");
    setStatus("todos");
    setMaterial("todos");
  };

  const temFiltro =
    busca !== "" || regiao !== "todas" || status !== "todos" || material !== "todos";

  const contagemStatus = (alvo: CollectionPointStatus) =>
    COLLECTION_POINTS.filter((p) => p.status === alvo).length;

  return (
    <PageContainer wide>
      <PageHeader
        eyebrow="Operação"
        titulo="Rede de ecopontos"
        descricao={`${COLLECTION_POINTS.length} equipamentos monitorados na Região Metropolitana de São Paulo. A lista abre ordenada pela ocupação, do mais cheio ao mais vazio.`}
      />

      {/* Panorama por status */}
      <dl className="mb-6 grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2 xl:grid-cols-4">
        {(Object.keys(STATUS_ROTULO) as CollectionPointStatus[]).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setStatus(status === item ? "todos" : item)}
            className={cn(
              "px-5 py-4 text-left transition-colors",
              status === item
                ? "bg-[var(--accent-soft)]"
                : "bg-[var(--surface)] hover:bg-[var(--surface-2)]",
            )}
          >
            <dt>
              <StatusDot tone={STATUS_TOM[item]} label={STATUS_ROTULO[item]} />
            </dt>
            <dd className="mt-2 font-display text-[26px] font-semibold leading-none tabular tracking-[-0.03em] text-[var(--fg)]">
              {contagemStatus(item)}
            </dd>
          </button>
        ))}
      </dl>

      {/* Filtros */}
      <div className="mb-5 space-y-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-[240px] flex-1">
            <MagnifyingGlass
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--fg-subtle)]"
              weight="bold"
            />
            <label htmlFor="busca-rede" className="sr-only">
              Buscar ecopontos
            </label>
            <Input
              id="busca-rede"
              value={busca}
              onChange={(evento) => setBusca(evento.target.value)}
              placeholder="Buscar por nome, bairro, cidade ou endereço…"
              className="pl-9"
            />
          </div>
          {temFiltro && (
            <Button variant="ghost" onClick={limpar}>
              <X weight="bold" />
              Limpar filtros
            </Button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <Chip ativo={regiao === "todas"} onClick={() => setRegiao("todas")}>
            Todas as regiões
          </Chip>
          {REGIONS.map((item) => (
            <Chip
              key={item.id}
              ativo={regiao === item.id}
              onClick={() => setRegiao(item.id)}
            >
              {item.nome}
            </Chip>
          ))}

          <span aria-hidden className="mx-1 h-4 w-px bg-[var(--border)]" />

          <Chip ativo={material === "todos"} onClick={() => setMaterial("todos")}>
            Qualquer material
          </Chip>
          {MATERIALS.map((item) => (
            <Chip
              key={item.id}
              ativo={material === item.id}
              onClick={() => setMaterial(item.id)}
            >
              <span
                aria-hidden
                className="size-2 rounded-[2px]"
                style={{ background: item.cor }}
              />
              {item.nome}
            </Chip>
          ))}
        </div>
      </div>

      <p className="mb-3 text-[12.5px] text-[var(--fg-subtle)]">
        {filtrados.length} de {COLLECTION_POINTS.length} equipamentos listados
      </p>

      {filtrados.length === 0 ? (
        <EmptyState
          className="rounded-[var(--radius-lg)] border border-[var(--border)]"
          icon={<MapPin />}
          title="Nenhum ecoponto com esses filtros."
          description="Amplie a busca ou remova um dos filtros para ver mais equipamentos."
          action={{ label: "Limpar filtros", onClick: limpar }}
        />
      ) : (
        <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
          <Table>
            <thead>
              <tr>
                <Th>Ecoponto</Th>
                <Th className="hidden md:table-cell">Região</Th>
                <Th>Status</Th>
                <Th>Ocupação</Th>
                <Th numeric className="hidden lg:table-cell">
                  Descartes/mês
                </Th>
                <Th numeric className="hidden xl:table-cell">
                  Volume/mês
                </Th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((ponto) => (
                <Tr key={ponto.id} interactive onClick={() => abrir(ponto.id)}>
                  <Td>
                    <p className="text-[13.5px] font-medium text-[var(--fg)]">
                      {ponto.nome}
                    </p>
                    <p className="text-[11.5px] text-[var(--fg-subtle)]">
                      {ponto.bairro}, {ponto.cidade}
                    </p>
                  </Td>
                  <Td className="hidden text-[12.5px] text-[var(--fg-muted)] md:table-cell">
                    {REGION_BY_ID[ponto.regiaoId]?.nome ?? "—"}
                  </Td>
                  <Td>
                    <Badge tone={STATUS_TOM[ponto.status]}>
                      {STATUS_ROTULO[ponto.status]}
                    </Badge>
                  </Td>
                  <Td>
                    <div className="flex items-center gap-3">
                      <div className="min-w-[64px] flex-1">
                        <ProgressBar
                          value={ponto.capacidadePercentual}
                          size="xs"
                          tone={
                            ponto.capacidadePercentual >= 90
                              ? "critical"
                              : ponto.capacidadePercentual >= 70
                                ? "warning"
                                : "good"
                          }
                        />
                      </div>
                      <span className="shrink-0 text-[12.5px] tabular text-[var(--fg)]">
                        {ponto.capacidadePercentual}%
                      </span>
                    </div>
                  </Td>
                  <Td numeric className="hidden text-[13px] lg:table-cell">
                    {formatNumber(ponto.descartesMes)}
                  </Td>
                  <Td numeric className="hidden text-[13px] xl:table-cell">
                    {formatNumber(ponto.kgMes)} kg
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      <Sheet open={Boolean(detalhe)} onOpenChange={(aberto) => !aberto && fechar()}>
        <SheetContent side="right" width="sm:max-w-md" className="p-0">
          {detalhe && <PointDetail ponto={detalhe} />}
        </SheetContent>
      </Sheet>
    </PageContainer>
  );
}

function Chip({
  ativo,
  onClick,
  children,
}: {
  ativo: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={ativo}
      className={cn(
        "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-medium transition-colors",
        ativo
          ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
          : "border-[var(--border)] text-[var(--fg-muted)] hover:border-[var(--border-strong)] hover:text-[var(--fg)]",
      )}
    >
      {children}
    </button>
  );
}

function PointDetail({ ponto }: { ponto: CollectionPoint }) {
  return (
    <div className="flex h-full flex-col">
      <header className="border-b border-[var(--border)] px-6 py-5 pr-12">
        <Badge tone={STATUS_TOM[ponto.status]} className="mb-3">
          {STATUS_ROTULO[ponto.status]}
        </Badge>
        <h2 className="font-display text-[19px] font-semibold tracking-[-0.015em] text-[var(--fg)]">
          {ponto.nome}
        </h2>
        <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--fg-muted)]">
          {ponto.endereco}
        </p>
        <p className="mt-1 text-[12.5px] text-[var(--fg-subtle)]">
          {ponto.bairro}, {ponto.cidade} ·{" "}
          {REGION_BY_ID[ponto.regiaoId]?.nome ?? "região não atribuída"}
        </p>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-5">
        <section>
          <p className="eyebrow mb-2.5">Ocupação do contêiner</p>
          <ProgressBar
            value={ponto.capacidadePercentual}
            showValue
            tone={
              ponto.capacidadePercentual >= 90
                ? "critical"
                : ponto.capacidadePercentual >= 70
                  ? "warning"
                  : "good"
            }
          />
          <p className="mt-2 text-[12px] leading-relaxed text-[var(--fg-muted)]">
            {ponto.capacidadePercentual >= 90
              ? "Coleta prioritária recomendada nas próximas 24 horas."
              : ponto.capacidadePercentual >= 70
                ? "Incluir na rota de coleta desta semana."
                : "Dentro da faixa operacional normal."}
          </p>
        </section>

        <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--border)]">
          {[
            { rotulo: "Descartes no mês", valor: formatNumber(ponto.descartesMes) },
            { rotulo: "Volume no mês", valor: `${formatNumber(ponto.kgMes)} kg` },
            { rotulo: "Identificador", valor: ponto.id },
            {
              rotulo: "Em operação desde",
              valor: formatDate(ponto.instaladoEm, "mes"),
            },
          ].map((item) => (
            <div key={item.rotulo} className="bg-[var(--surface-2)] px-4 py-3.5">
              <dt className="text-[11.5px] text-[var(--fg-muted)]">{item.rotulo}</dt>
              <dd className="mt-1 truncate font-display text-[16px] font-semibold tabular text-[var(--fg)]">
                {item.valor}
              </dd>
            </div>
          ))}
        </dl>

        <section className="mt-6">
          <p className="eyebrow mb-3">Materiais aceitos</p>
          <ul className="flex flex-wrap gap-1.5">
            {ponto.materiais.map((materialId) => (
              <li
                key={materialId}
                className="flex items-center gap-1.5 rounded-full border border-[var(--border)] px-2.5 py-1 text-[12px] text-[var(--fg-muted)]"
              >
                <span
                  aria-hidden
                  className="size-2 rounded-[2px]"
                  style={{ background: MATERIAL_BY_ID[materialId].cor }}
                />
                {MATERIAL_BY_ID[materialId].nome}
              </li>
            ))}
          </ul>
        </section>

        <dl className="mt-6 space-y-px overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--border)]">
          {[
            { rotulo: "Horário de funcionamento", valor: ponto.horario },
            {
              rotulo: "Acessibilidade",
              valor: ponto.acessibilidade ? "Equipamento adaptado" : "Não adaptado",
            },
            {
              rotulo: "Coordenadas",
              valor: `${ponto.lat.toFixed(4)}, ${ponto.lng.toFixed(4)}`,
            },
          ].map((linha) => (
            <div
              key={linha.rotulo}
              className="flex items-center justify-between gap-4 bg-[var(--surface)] px-4 py-3"
            >
              <dt className="text-[12.5px] text-[var(--fg-muted)]">{linha.rotulo}</dt>
              <dd className="truncate text-[13px] font-medium tabular text-[var(--fg)]">
                {linha.valor}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

function RedeSkeleton() {
  return (
    <PageContainer wide>
      <Skeleton className="h-8 w-56" />
      <Skeleton className="mt-3 h-4 w-full max-w-2xl" />
      <Skeleton className="mt-8 h-24 w-full rounded-[var(--radius-lg)]" />
      <Skeleton className="mt-6 h-10 w-full max-w-md" />
      <Skeleton className="mt-6 h-[420px] w-full rounded-[var(--radius-lg)]" />
    </PageContainer>
  );
}
