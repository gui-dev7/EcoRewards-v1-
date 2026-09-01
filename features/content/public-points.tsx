"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight, MagnifyingGlass, MapPin } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import { StatusDot } from "@/components/ui/badge";
import { EmptyState, Skeleton } from "@/components/ui/feedback";
import { COLLECTION_POINTS, DEFAULT_MAP_CENTER } from "@/mocks/collection-points";
import { MATERIALS, MATERIAL_BY_ID } from "@/mocks/materials";
import { cn } from "@/lib/utils";
import type { CollectionPointStatus, MaterialId } from "@/types";

const CollectionPointsMap = dynamic(
  () =>
    import("@/components/maps/collection-points-map").then(
      (m) => m.CollectionPointsMap,
    ),
  { ssr: false, loading: () => <Skeleton className="size-full rounded-none" /> },
);

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

/**
 * Versão pública do explorador de ecopontos: sem geolocalização e sem
 * distância, com convite para a demonstração no lugar das ações do app.
 */
export function PublicPoints() {
  const [busca, setBusca] = React.useState("");
  const [material, setMaterial] = React.useState<MaterialId | "todos">("todos");
  const [selecionado, setSelecionado] = React.useState<string | null>(null);

  const pontos = React.useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return COLLECTION_POINTS.filter((ponto) => {
      if (material !== "todos" && !ponto.materiais.includes(material)) return false;
      if (!termo) return true;
      return `${ponto.nome} ${ponto.bairro} ${ponto.cidade} ${ponto.endereco}`
        .toLowerCase()
        .includes(termo);
    });
  }, [busca, material]);

  const detalhe = pontos.find((ponto) => ponto.id === selecionado) ?? null;

  return (
    <div className="mx-auto max-w-[1360px] px-4 py-14 lg:px-6 lg:py-16">
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative min-w-[240px] flex-1">
          <MagnifyingGlass
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--fg-subtle)]"
            weight="bold"
          />
          <label htmlFor="busca-publica" className="sr-only">
            Buscar ecopontos
          </label>
          <Input
            id="busca-publica"
            value={busca}
            onChange={(evento) => setBusca(evento.target.value)}
            placeholder="Buscar por bairro, cidade ou endereço…"
            className="pl-9"
          />
        </div>
        <Button asChild variant="outline">
          <Link href="/demo">
            Ver no aplicativo
            <ArrowRight weight="bold" />
          </Link>
        </Button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => setMaterial("todos")}
          aria-pressed={material === "todos"}
          className={cn(
            "rounded-full border px-2.5 py-1 text-[12px] font-medium transition-colors",
            material === "todos"
              ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
              : "border-[var(--border)] text-[var(--fg-muted)] hover:border-[var(--border-strong)] hover:text-[var(--fg)]",
          )}
        >
          Todos os materiais
        </button>
        {MATERIALS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setMaterial(item.id)}
            aria-pressed={material === item.id}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-medium transition-colors",
              material === item.id
                ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                : "border-[var(--border)] text-[var(--fg-muted)] hover:border-[var(--border-strong)] hover:text-[var(--fg)]",
            )}
          >
            <span
              aria-hidden
              className="size-2 rounded-[2px]"
              style={{ background: item.cor }}
            />
            {item.nome}
          </button>
        ))}
      </div>

      <p className="mt-5 text-[12.5px] text-[var(--fg-subtle)]">
        {pontos.length} de {COLLECTION_POINTS.length} ecopontos na rede
      </p>

      <div className="mt-4 grid gap-5 lg:grid-cols-[340px_1fr]">
        <div className="order-2 lg:order-1">
          {pontos.length === 0 ? (
            <EmptyState
              className="rounded-[var(--radius-lg)] border border-[var(--border)]"
              icon={<MapPin />}
              title="Nenhum ecoponto encontrado."
              description="Tente outro bairro ou remova o filtro de material."
              compact
              action={{
                label: "Limpar busca",
                onClick: () => {
                  setBusca("");
                  setMaterial("todos");
                },
              }}
            />
          ) : (
            <ul className="max-h-[520px] space-y-2 overflow-y-auto pr-1">
              {pontos.map((ponto) => (
                <li key={ponto.id}>
                  <button
                    type="button"
                    onClick={() => setSelecionado(ponto.id)}
                    className={cn(
                      "w-full rounded-[var(--radius-lg)] border p-4 text-left transition-colors",
                      selecionado === ponto.id
                        ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                        : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)]",
                    )}
                  >
                    <p className="truncate text-[13.5px] font-medium text-[var(--fg)]">
                      {ponto.nome}
                    </p>
                    <p className="mt-0.5 truncate text-[12px] text-[var(--fg-muted)]">
                      {ponto.bairro}, {ponto.cidade}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <StatusDot
                        tone={STATUS_TOM[ponto.status]}
                        label={STATUS_ROTULO[ponto.status]}
                      />
                      <span className="text-[11.5px] text-[var(--fg-subtle)]">
                        · {ponto.horario}
                      </span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="order-1 h-[400px] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] lg:order-2 lg:h-[520px]">
          <CollectionPointsMap
            className="size-full"
            pontos={pontos}
            selecionado={selecionado}
            onSelecionar={setSelecionado}
            centro={DEFAULT_MAP_CENTER}
          />
        </div>
      </div>

      {/* Detalhe inline, sem painel lateral na versão pública */}
      {detalhe && (
        <div className="mt-6 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="font-display text-h3 text-[var(--fg)]">
                {detalhe.nome}
              </h3>
              <p className="mt-1.5 text-[13.5px] text-[var(--fg-muted)]">
                {detalhe.endereco} · {detalhe.bairro}, {detalhe.cidade}
              </p>
              <p className="mt-1 text-[12.5px] text-[var(--fg-subtle)]">
                {detalhe.horario}
                {detalhe.acessibilidade && " · equipamento adaptado"}
              </p>
            </div>
            <Button asChild>
              <Link href="/demo">
                Registrar um descarte
                <ArrowRight weight="bold" />
              </Link>
            </Button>
          </div>

          <div className="mt-5 border-t border-[var(--border)] pt-4">
            <p className="eyebrow mb-3">Materiais aceitos</p>
            <ul className="flex flex-wrap gap-1.5">
              {detalhe.materiais.map((materialId) => (
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
                  <span className="tabular text-[var(--fg-subtle)]">
                    {MATERIAL_BY_ID[materialId].pontosPorKg} pts/kg
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
