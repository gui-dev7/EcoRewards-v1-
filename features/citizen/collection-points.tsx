"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowSquareOut,
  CornersOut,
  Crosshair,
  MagnifyingGlass,
  MapPin,
  X,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Badge, StatusDot } from "@/components/ui/badge";
import { Input } from "@/components/ui/field";
import { Sheet, SheetContent } from "@/components/ui/dialog";
import { ProgressBar } from "@/components/ui/data-display";
import { EmptyState, Skeleton } from "@/components/ui/feedback";
import { distanciaKm, useGeolocation } from "@/hooks/use-geolocation";
import { formatNumber } from "@/lib/format";
import { COLLECTION_POINTS, DEFAULT_MAP_CENTER } from "@/mocks/collection-points";
import { MATERIALS, MATERIAL_BY_ID } from "@/mocks/materials";
import { cn } from "@/lib/utils";
import type { CollectionPoint, CollectionPointStatus, MaterialId } from "@/types";

const CollectionPointsMap = dynamic(
  () => import("@/components/maps/collection-points-map").then((m) => m.CollectionPointsMap),
  {
    ssr: false,
    loading: () => <Skeleton className="size-full rounded-none" />,
  },
);

const STATUS_ROTULO: Record<CollectionPointStatus, string> = {
  operacional: "Operacional",
  "quase-cheio": "Quase cheio",
  lotado: "Lotado",
  manutencao: "Em manutenção",
};

const STATUS_TOM: Record<
  CollectionPointStatus,
  "good" | "warning" | "critical" | "neutral"
> = {
  operacional: "good",
  "quase-cheio": "warning",
  lotado: "critical",
  manutencao: "neutral",
};

export function CollectionPointsExplorer() {
  const router = useRouter();
  const parametros = useSearchParams();
  const { status: geoStatus, position, solicitar } = useGeolocation();

  const [busca, setBusca] = React.useState("");
  const [materiaisAtivos, setMateriaisAtivos] = React.useState<MaterialId[]>([]);
  const [statusAtivos, setStatusAtivos] = React.useState<CollectionPointStatus[]>([]);
  const [selecionado, setSelecionado] = React.useState<string | null>(
    parametros.get("ponto"),
  );
  const [telaCheia, setTelaCheia] = React.useState(false);

  const referencia = position.real ? position : DEFAULT_MAP_CENTER;

  const pontos = React.useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return COLLECTION_POINTS.map((ponto) => ({
      ...ponto,
      distancia: distanciaKm(referencia, ponto),
    }))
      .filter((ponto) => {
        if (
          materiaisAtivos.length > 0 &&
          !materiaisAtivos.some((material) => ponto.materiais.includes(material))
        ) {
          return false;
        }
        if (statusAtivos.length > 0 && !statusAtivos.includes(ponto.status)) {
          return false;
        }
        if (!termo) return true;
        return (
          ponto.nome.toLowerCase().includes(termo) ||
          ponto.bairro.toLowerCase().includes(termo) ||
          ponto.cidade.toLowerCase().includes(termo) ||
          ponto.endereco.toLowerCase().includes(termo)
        );
      })
      .sort((a, b) => a.distancia - b.distancia);
  }, [busca, materiaisAtivos, statusAtivos, referencia]);

  const detalhe = React.useMemo(
    () => pontos.find((ponto) => ponto.id === selecionado) ?? null,
    [pontos, selecionado],
  );

  const selecionar = (id: string) => {
    setSelecionado(id);
    router.replace(`/app/ecopontos?ponto=${id}`, { scroll: false });
  };

  const fecharDetalhe = () => {
    setSelecionado(null);
    router.replace("/app/ecopontos", { scroll: false });
  };

  const alternarMaterial = (material: MaterialId) =>
    setMateriaisAtivos((atual) =>
      atual.includes(material)
        ? atual.filter((item) => item !== material)
        : [...atual, material],
    );

  const alternarStatus = (status: CollectionPointStatus) =>
    setStatusAtivos((atual) =>
      atual.includes(status)
        ? atual.filter((item) => item !== status)
        : [...atual, status],
    );

  const limparFiltros = () => {
    setBusca("");
    setMateriaisAtivos([]);
    setStatusAtivos([]);
  };

  const temFiltro =
    busca.length > 0 || materiaisAtivos.length > 0 || statusAtivos.length > 0;

  return (
    <div className="space-y-5">
      {/* Filtros numa única faixa */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-[220px] flex-1">
            <MagnifyingGlass
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--fg-subtle)]"
              weight="bold"
            />
            <label htmlFor="busca-ecopontos" className="sr-only">
              Buscar ecopontos
            </label>
            <Input
              id="busca-ecopontos"
              value={busca}
              onChange={(evento) => setBusca(evento.target.value)}
              placeholder="Buscar por nome, bairro ou endereço…"
              className="pl-9"
            />
          </div>

          <Button
            variant={position.real ? "soft" : "outline"}
            onClick={solicitar}
            loading={geoStatus === "carregando"}
          >
            <Crosshair weight="bold" />
            {position.real ? "Usando sua localização" : "Usar minha localização"}
          </Button>

          {temFiltro && (
            <Button variant="ghost" onClick={limparFiltros}>
              <X weight="bold" />
              Limpar
            </Button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {MATERIALS.map((material) => {
            const ativo = materiaisAtivos.includes(material.id);
            return (
              <button
                key={material.id}
                type="button"
                onClick={() => alternarMaterial(material.id)}
                aria-pressed={ativo}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-medium transition-colors",
                  ativo
                    ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                    : "border-[var(--border)] text-[var(--fg-muted)] hover:border-[var(--border-strong)] hover:text-[var(--fg)]",
                )}
              >
                <span
                  aria-hidden
                  className="size-2 rounded-[2px]"
                  style={{ background: material.cor }}
                />
                {material.nome}
              </button>
            );
          })}

          <span aria-hidden className="mx-1 h-4 w-px bg-[var(--border)]" />

          {(Object.keys(STATUS_ROTULO) as CollectionPointStatus[]).map((status) => {
            const ativo = statusAtivos.includes(status);
            return (
              <button
                key={status}
                type="button"
                onClick={() => alternarStatus(status)}
                aria-pressed={ativo}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[12px] font-medium transition-colors",
                  ativo
                    ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                    : "border-[var(--border)] text-[var(--fg-muted)] hover:border-[var(--border-strong)] hover:text-[var(--fg)]",
                )}
              >
                {STATUS_ROTULO[status]}
              </button>
            );
          })}
        </div>
      </div>

      {geoStatus === "negada" && (
        <p className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-[12.5px] leading-relaxed text-[var(--fg-muted)]">
          Sem acesso à sua localização, as distâncias são calculadas a partir da
          Av. Paulista — o ponto de referência padrão desta demonstração.
        </p>
      )}

      <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
        {/* Lista */}
        <div className="order-2 lg:order-1">
          <p className="mb-3 text-[12.5px] text-[var(--fg-subtle)]">
            {pontos.length} {pontos.length === 1 ? "ecoponto" : "ecopontos"} na rede
          </p>

          {pontos.length === 0 ? (
            <EmptyState
              className="rounded-[var(--radius-lg)] border border-[var(--border)]"
              icon={<MapPin />}
              title="Nenhum ecoponto encontrado."
              description="Nenhum ponto da rede combina com esses filtros. Tente ampliar a busca."
              action={{ label: "Limpar filtros", onClick: limparFiltros }}
              compact
            />
          ) : (
            <ul className="max-h-[560px] space-y-2 overflow-y-auto pr-1">
              {pontos.map((ponto) => (
                <li key={ponto.id}>
                  <button
                    type="button"
                    onClick={() => selecionar(ponto.id)}
                    className={cn(
                      "w-full rounded-[var(--radius-lg)] border p-4 text-left transition-colors",
                      selecionado === ponto.id
                        ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                        : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)]",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-[13.5px] font-medium text-[var(--fg)]">
                          {ponto.nome}
                        </p>
                        <p className="mt-0.5 truncate text-[12px] text-[var(--fg-muted)]">
                          {ponto.bairro}, {ponto.cidade}
                        </p>
                      </div>
                      <span className="shrink-0 text-[12px] tabular text-[var(--fg-muted)]">
                        {ponto.distancia} km
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <StatusDot
                        tone={STATUS_TOM[ponto.status]}
                        label={STATUS_ROTULO[ponto.status]}
                      />
                      <span className="text-[11.5px] text-[var(--fg-subtle)]">
                        · {ponto.materiais.length} materiais
                      </span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Mapa */}
        <div className="relative order-1 lg:order-2">
          <div className="relative h-[420px] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] lg:h-[560px]">
            <CollectionPointsMap
              className="size-full"
              pontos={pontos}
              selecionado={selecionado}
              onSelecionar={selecionar}
              centro={referencia}
              usuario={position.real ? position : null}
            />

            <button
              type="button"
              onClick={() => setTelaCheia(true)}
              className="absolute left-3 top-3 flex items-center gap-1.5 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1.5 text-[12px] font-medium text-[var(--fg-muted)] shadow-[var(--shadow-sm)] transition-colors hover:text-[var(--fg)] lg:hidden"
            >
              <CornersOut className="size-3.5" weight="bold" />
              Tela cheia
            </button>

            <MapLegend />
          </div>
        </div>
      </div>

      {/* Painel de detalhe */}
      <Sheet open={Boolean(detalhe)} onOpenChange={(aberto) => !aberto && fecharDetalhe()}>
        <SheetContent side="right" width="sm:max-w-md" className="p-0">
          {detalhe && <PointDetail ponto={detalhe} />}
        </SheetContent>
      </Sheet>

      {/* Mapa em tela cheia no mobile */}
      <Sheet open={telaCheia} onOpenChange={setTelaCheia}>
        <SheetContent side="bottom" className="h-[92dvh] p-0">
          <div className="flex h-[var(--header-h)] items-center border-b border-[var(--border)] px-4">
            <p className="font-display text-[15px] font-semibold text-[var(--fg)]">
              Mapa de ecopontos
            </p>
          </div>
          <div className="relative flex-1">
            <CollectionPointsMap
              className="size-full"
              pontos={pontos}
              selecionado={selecionado}
              onSelecionar={selecionar}
              centro={referencia}
              usuario={position.real ? position : null}
            />
            <MapLegend />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function MapLegend() {
  return (
    <div className="absolute bottom-3 left-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] px-3 py-2.5 backdrop-blur-sm">
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.09em] text-[var(--fg-subtle)]">
        Status
      </p>
      <ul className="space-y-1">
        {(Object.keys(STATUS_ROTULO) as CollectionPointStatus[]).map((status) => (
          <li key={status}>
            <StatusDot tone={STATUS_TOM[status]} label={STATUS_ROTULO[status]} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function PointDetail({ ponto }: { ponto: CollectionPoint & { distancia?: number } }) {
  const rota = `https://www.google.com/maps/dir/?api=1&destination=${ponto.lat},${ponto.lng}`;

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
          {ponto.bairro}, {ponto.cidade}
          {ponto.distancia !== undefined && ` · a ${ponto.distancia} km de você`}
        </p>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-5">
        <section>
          <p className="eyebrow mb-3">Materiais aceitos</p>
          <ul className="flex flex-wrap gap-1.5">
            {ponto.materiais.map((materialId) => {
              const material = MATERIAL_BY_ID[materialId];
              return (
                <li
                  key={materialId}
                  className="flex items-center gap-1.5 rounded-full border border-[var(--border)] px-2.5 py-1 text-[12px] text-[var(--fg-muted)]"
                >
                  <span
                    aria-hidden
                    className="size-2 rounded-[2px]"
                    style={{ background: material.cor }}
                  />
                  {material.nome}
                  <span className="tabular text-[var(--fg-subtle)]">
                    {material.pontosPorKg} pts/kg
                  </span>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="mt-6">
          <p className="eyebrow mb-2.5">Ocupação atual</p>
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
              ? "Contêiner praticamente cheio. Prefira outro ponto próximo hoje."
              : ponto.capacidadePercentual >= 70
                ? "Ocupação alta. Ainda aceita descartes, mas com espaço limitado."
                : "Espaço disponível para novos descartes."}
          </p>
        </section>

        <dl className="mt-6 space-y-px overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--border)]">
          {[
            { rotulo: "Horário", valor: ponto.horario },
            {
              rotulo: "Descartes no mês",
              valor: formatNumber(ponto.descartesMes),
            },
            { rotulo: "Volume no mês", valor: `${formatNumber(ponto.kgMes)} kg` },
            {
              rotulo: "Acessibilidade",
              valor: ponto.acessibilidade ? "Adaptado" : "Não adaptado",
            },
            {
              rotulo: "Em operação desde",
              valor: new Date(ponto.instaladoEm).getFullYear().toString(),
            },
          ].map((linha) => (
            <div
              key={linha.rotulo}
              className="flex items-center justify-between gap-4 bg-[var(--surface)] px-4 py-3"
            >
              <dt className="text-[12.5px] text-[var(--fg-muted)]">{linha.rotulo}</dt>
              <dd className="text-[13px] font-medium text-[var(--fg)]">
                {linha.valor}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <footer className="border-t border-[var(--border)] px-6 py-4">
        <Button asChild className="w-full">
          <a href={rota} target="_blank" rel="noopener noreferrer">
            <ArrowSquareOut weight="bold" />
            Traçar rota
          </a>
        </Button>
        <p className="mt-2.5 text-center text-[11.5px] text-[var(--fg-subtle)]">
          Abre o Google Maps em uma nova aba
        </p>
      </footer>
    </div>
  );
}
