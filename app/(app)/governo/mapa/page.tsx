"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { CornersOut } from "@phosphor-icons/react";
import { PageContainer, PageHeader } from "@/components/layout/app-shell";
import { Sheet, SheetContent } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/controls";
import { Label } from "@/components/ui/field";
import { Segmented } from "@/components/ui/tabs";
import { Badge, StatusDot } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/data-display";
import { Skeleton } from "@/components/ui/feedback";
import { Button } from "@/components/ui/button";
import type { CamadaId, HeatmapId } from "@/components/maps/government-map";
import { COLLECTION_POINT_BY_ID } from "@/mocks/collection-points";
import { REGION_BY_ID } from "@/mocks/government";
import { MATERIAL_BY_ID } from "@/mocks/materials";
import { formatCompact, formatCurrencyCompact, formatNumber } from "@/lib/format";

const GovernmentMap = dynamic(
  () => import("@/components/maps/government-map").then((m) => m.GovernmentMap),
  { ssr: false, loading: () => <Skeleton className="size-full rounded-none" /> },
);

const CAMADAS: { id: CamadaId; rotulo: string; descricao: string }[] = [
  { id: "ecopontos", rotulo: "Ecopontos", descricao: "Todos os 42 pontos da rede" },
  { id: "usuarios", rotulo: "Densidade de usuários", descricao: "Contas ativas por região" },
  { id: "lotados", rotulo: "Pontos lotados", descricao: "Capacidade acima de 90%" },
  { id: "manutencao", rotulo: "Em manutenção", descricao: "Equipamentos fora de operação" },
  { id: "baixa-adesao", rotulo: "Baixa adesão", descricao: "Menos de 220 descartes no mês" },
];

const HEATMAPS: { value: HeatmapId; label: string }[] = [
  { value: "reciclagem", label: "Volume reciclado" },
  { value: "adesao", label: "Adesão populacional" },
  { value: "risco", label: "Risco operacional" },
  { value: "nenhum", label: "Sem camada" },
];

const HEATMAP_LEGENDA: Record<Exclude<HeatmapId, "nenhum">, { titulo: string; min: string; max: string }> = {
  reciclagem: {
    titulo: "Volume reciclado por região",
    min: "menor volume",
    max: "maior volume",
  },
  adesao: {
    titulo: "Adesão populacional",
    min: "menor adesão",
    max: "maior adesão",
  },
  risco: {
    titulo: "Risco operacional",
    min: "menor risco",
    max: "maior risco",
  },
};

export default function GovernmentMapPage() {
  const [camadas, setCamadas] = React.useState<CamadaId[]>(["ecopontos"]);
  const [heatmap, setHeatmap] = React.useState<HeatmapId>("reciclagem");
  const [pontoSelecionado, setPontoSelecionado] = React.useState<string | null>(null);
  const [regiaoSelecionada, setRegiaoSelecionada] = React.useState<string | null>(null);
  const [telaCheia, setTelaCheia] = React.useState(false);

  const alternarCamada = (id: CamadaId) =>
    setCamadas((atual) =>
      atual.includes(id) ? atual.filter((item) => item !== id) : [...atual, id],
    );

  const ponto = pontoSelecionado ? COLLECTION_POINT_BY_ID[pontoSelecionado] : null;
  const regiao = regiaoSelecionada ? REGION_BY_ID[regiaoSelecionada] : null;

  const mapa = (
    <GovernmentMap
      className="size-full"
      camadas={camadas}
      heatmap={heatmap}
      onSelecionarPonto={(id) => {
        setRegiaoSelecionada(null);
        setPontoSelecionado(id);
      }}
      onSelecionarRegiao={(id) => {
        setPontoSelecionado(null);
        setRegiaoSelecionada(id);
      }}
    />
  );

  return (
    <PageContainer wide>
      <PageHeader
        eyebrow="Inteligência territorial"
        titulo="Mapa operacional"
        descricao="Camadas de operação sobre um heatmap regional. Clique num ecoponto ou num centro de região para abrir o detalhe."
      />

      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        {/* Controles */}
        <aside className="space-y-6 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:self-start">
          <section className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-4">
            <h2 className="eyebrow mb-3">Heatmap regional</h2>
            <Segmented
              size="sm"
              ariaLabel="Escolher heatmap"
              options={HEATMAPS.slice(0, 2)}
              value={heatmap === "risco" || heatmap === "nenhum" ? HEATMAPS[0].value : heatmap}
              onChange={setHeatmap}
              className="w-full"
            />
            <div className="mt-2 flex flex-col gap-1.5">
              {HEATMAPS.slice(2).map((opcao) => (
                <button
                  key={opcao.value}
                  type="button"
                  onClick={() => setHeatmap(opcao.value)}
                  aria-pressed={heatmap === opcao.value}
                  className={
                    heatmap === opcao.value
                      ? "rounded-[var(--radius-sm)] border border-[var(--accent)] bg-[var(--accent-soft)] px-3 py-1.5 text-left text-[12.5px] font-medium text-[var(--accent)]"
                      : "rounded-[var(--radius-sm)] border border-[var(--border)] px-3 py-1.5 text-left text-[12.5px] font-medium text-[var(--fg-muted)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--fg)]"
                  }
                >
                  {opcao.label}
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-4">
            <h2 className="eyebrow mb-3">Camadas operacionais</h2>
            <ul className="space-y-3">
              {CAMADAS.map((camada) => (
                <li key={camada.id} className="flex items-start gap-2.5">
                  <Checkbox
                    id={`camada-${camada.id}`}
                    checked={camadas.includes(camada.id)}
                    onCheckedChange={() => alternarCamada(camada.id)}
                    className="mt-0.5"
                  />
                  <div className="min-w-0">
                    <Label
                      htmlFor={`camada-${camada.id}`}
                      className="text-[13px] text-[var(--fg)]"
                    >
                      {camada.rotulo}
                    </Label>
                    <p className="mt-0.5 text-[11.5px] leading-snug text-[var(--fg-muted)]">
                      {camada.descricao}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <p className="text-[11.5px] leading-relaxed text-[var(--fg-subtle)]">
            As camadas se sobrepõem ao heatmap. Um ponto pode aparecer em mais de
            uma camada quando atende a mais de um critério.
          </p>
        </aside>

        {/* Mapa */}
        <div className="relative h-[520px] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] lg:h-[calc(100dvh-var(--header-h)-14rem)] lg:min-h-[560px]">
          {mapa}

          <button
            type="button"
            onClick={() => setTelaCheia(true)}
            className="absolute left-3 top-3 flex items-center gap-1.5 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1.5 text-[12px] font-medium text-[var(--fg-muted)] shadow-[var(--shadow-sm)] transition-colors hover:text-[var(--fg)] lg:hidden"
          >
            <CornersOut className="size-3.5" weight="bold" />
            Tela cheia
          </button>

          {heatmap !== "nenhum" && <HeatmapLegend heatmap={heatmap} />}
        </div>
      </div>

      {/* Detalhe do ecoponto */}
      <Sheet
        open={Boolean(ponto)}
        onOpenChange={(aberto) => !aberto && setPontoSelecionado(null)}
      >
        <SheetContent side="right" width="sm:max-w-md" className="p-0">
          {ponto && (
            <div className="flex h-full flex-col">
              <header className="border-b border-[var(--border)] px-6 py-5 pr-12">
                <Badge
                  tone={
                    ponto.status === "operacional"
                      ? "good"
                      : ponto.status === "lotado"
                        ? "critical"
                        : ponto.status === "quase-cheio"
                          ? "warning"
                          : "neutral"
                  }
                  className="mb-3"
                >
                  {ponto.status.replace("-", " ")}
                </Badge>
                <h2 className="font-display text-[19px] font-semibold text-[var(--fg)]">
                  {ponto.nome}
                </h2>
                <p className="mt-1.5 text-[13px] text-[var(--fg-muted)]">
                  {ponto.endereco} · {ponto.bairro}
                </p>
              </header>

              <div className="flex-1 overflow-y-auto px-6 py-5">
                <p className="eyebrow mb-2.5">Ocupação</p>
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

                <dl className="mt-6 space-y-px overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--border)]">
                  {[
                    { rotulo: "Descartes no mês", valor: formatNumber(ponto.descartesMes) },
                    { rotulo: "Volume no mês", valor: `${formatNumber(ponto.kgMes)} kg` },
                    { rotulo: "Horário", valor: ponto.horario },
                    { rotulo: "Região", valor: REGION_BY_ID[ponto.regiaoId]?.nome ?? "—" },
                  ].map((linha) => (
                    <div
                      key={linha.rotulo}
                      className="flex items-center justify-between gap-4 bg-[var(--surface)] px-4 py-3"
                    >
                      <dt className="text-[12.5px] text-[var(--fg-muted)]">
                        {linha.rotulo}
                      </dt>
                      <dd className="text-[13px] font-medium text-[var(--fg)]">
                        {linha.valor}
                      </dd>
                    </div>
                  ))}
                </dl>

                <p className="eyebrow mb-2.5 mt-6">Materiais aceitos</p>
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
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Detalhe da região */}
      <Sheet
        open={Boolean(regiao)}
        onOpenChange={(aberto) => !aberto && setRegiaoSelecionada(null)}
      >
        <SheetContent side="right" width="sm:max-w-md" className="p-0">
          {regiao && (
            <div className="flex h-full flex-col">
              <header className="border-b border-[var(--border)] px-6 py-5 pr-12">
                <p className="eyebrow">{regiao.municipio}</p>
                <h2 className="mt-2 font-display text-[19px] font-semibold text-[var(--fg)]">
                  {regiao.nome}
                </h2>
                <p className="mt-1.5 text-[13px] text-[var(--fg-muted)]">
                  {formatCompact(regiao.populacao)} habitantes ·{" "}
                  {regiao.ecopontos} ecopontos
                </p>
              </header>

              <div className="flex-1 overflow-y-auto px-6 py-5">
                <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--border)]">
                  {[
                    {
                      rotulo: "Usuários ativos",
                      valor: formatCompact(regiao.usuariosAtivos),
                    },
                    {
                      rotulo: "Adesão",
                      valor: `${regiao.adesaoPercentual}%`,
                    },
                    {
                      rotulo: "Reciclado no ano",
                      valor: `${formatCompact(regiao.toneladasRecicladas)} t`,
                    },
                    {
                      rotulo: "Aterro evitado",
                      valor: `${formatCompact(regiao.aterroEvitadoToneladas)} t`,
                    },
                    {
                      rotulo: "CO2 evitado",
                      valor: `${formatCompact(regiao.co2EvitadoToneladas)} t`,
                    },
                    {
                      rotulo: "Economia estimada",
                      valor: formatCurrencyCompact(regiao.economiaEstimada),
                    },
                  ].map((item) => (
                    <div key={item.rotulo} className="bg-[var(--surface-2)] px-4 py-3.5">
                      <dt className="text-[11.5px] text-[var(--fg-muted)]">
                        {item.rotulo}
                      </dt>
                      <dd className="mt-1 font-display text-[17px] font-semibold tabular text-[var(--fg)]">
                        {item.valor}
                      </dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-6">
                  <p className="eyebrow mb-2.5">Risco operacional</p>
                  <ProgressBar
                    value={regiao.riscoOperacional}
                    showValue
                    tone={
                      regiao.riscoOperacional >= 70
                        ? "critical"
                        : regiao.riscoOperacional >= 40
                          ? "warning"
                          : "good"
                    }
                  />
                  <p className="mt-2 text-[12px] leading-relaxed text-[var(--fg-muted)]">
                    Índice composto por ocorrências operacionais, ocupação média
                    dos equipamentos e anomalias abertas na região.
                  </p>
                </div>

                <Button asChild variant="secondary" className="mt-6 w-full">
                  <a href="/governo/regioes">Ver comparação entre regiões</a>
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Tela cheia no mobile */}
      <Sheet open={telaCheia} onOpenChange={setTelaCheia}>
        <SheetContent side="bottom" className="h-[92dvh] p-0">
          <div className="flex h-[var(--header-h)] items-center border-b border-[var(--border)] px-4">
            <p className="font-display text-[15px] font-semibold text-[var(--fg)]">
              Mapa operacional
            </p>
          </div>
          <div className="relative flex-1">
            {mapa}
            {heatmap !== "nenhum" && <HeatmapLegend heatmap={heatmap} />}
          </div>
        </SheetContent>
      </Sheet>
    </PageContainer>
  );
}

function HeatmapLegend({ heatmap }: { heatmap: Exclude<HeatmapId, "nenhum"> }) {
  const legenda = HEATMAP_LEGENDA[heatmap];

  return (
    <div className="absolute bottom-3 left-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] px-3 py-2.5 backdrop-blur-sm">
      <p className="text-[10px] font-semibold uppercase tracking-[0.09em] text-[var(--fg-subtle)]">
        {legenda.titulo}
      </p>
      <div className="mt-2 flex items-center gap-1">
        {[2, 3, 4, 5, 6].map((nivel) => (
          <span
            key={nivel}
            className="h-2 w-8 first:rounded-l-full last:rounded-r-full"
            style={{ background: `var(--seq-${nivel})` }}
          />
        ))}
      </div>
      <div className="mt-1.5 flex justify-between gap-4 text-[10px] text-[var(--fg-subtle)]">
        <span>{legenda.min}</span>
        <span>{legenda.max}</span>
      </div>

      <div className="mt-3 space-y-1 border-t border-[var(--border)] pt-2.5">
        <StatusDot tone="good" label="Operacional" />
        <StatusDot tone="critical" label="Lotado" />
        <StatusDot tone="warning" label="Baixa adesão" />
        <StatusDot tone="neutral" label="Em manutenção" />
      </div>
    </div>
  );
}
