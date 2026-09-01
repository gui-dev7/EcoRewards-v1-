"use client";

import * as React from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Info, ShieldWarning } from "@phosphor-icons/react";
import { PageContainer, PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/dialog";
import { Segmented } from "@/components/ui/tabs";
import { EmptyState, Skeleton } from "@/components/ui/feedback";
import { ProgressBar } from "@/components/ui/data-display";
import { RelativeTime } from "@/components/ui/relative-time";
import { ANOMALIES } from "@/mocks/government";
import { formatDateTime, formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Anomaly, AnomalyType } from "@/types";

const TIPO_ROTULO: Record<AnomalyType, string> = {
  "duplicacao-qr": "Duplicação de QR",
  "volume-incompativel": "Volume incompatível",
  "frequencia-atipica": "Frequência atípica",
  "geolocalizacao-divergente": "Geolocalização divergente",
  "conta-multipla": "Contas múltiplas",
};

const STATUS_ROTULO: Record<Anomaly["status"], string> = {
  aberto: "Aberto",
  "em-analise": "Em análise",
  resolvido: "Resolvido",
  descartado: "Descartado",
};

const STATUS_TOM: Record<Anomaly["status"], "critical" | "warning" | "good" | "neutral"> = {
  aberto: "critical",
  "em-analise": "warning",
  resolvido: "good",
  descartado: "neutral",
};

function faixaRisco(score: number) {
  if (score >= 85) return { rotulo: "Crítico", tom: "critical" as const };
  if (score >= 70) return { rotulo: "Alto", tom: "serious" as const };
  if (score >= 45) return { rotulo: "Moderado", tom: "warning" as const };
  return { rotulo: "Baixo", tom: "neutral" as const };
}

export default function FraudCenterPage() {
  return (
    <Suspense fallback={<CentralSkeleton />}>
      <FraudCenter />
    </Suspense>
  );
}

function FraudCenter() {
  const router = useRouter();
  const parametros = useSearchParams();

  const [ordenacao, setOrdenacao] = React.useState<"score" | "data">("score");
  const [tipo, setTipo] = React.useState<AnomalyType | "todos">("todos");
  const [status, setStatus] = React.useState<Anomaly["status"] | "todos">("todos");
  const [selecionada, setSelecionada] = React.useState<string | null>(
    parametros.get("evento"),
  );

  const lista = React.useMemo(() => {
    const filtradas = ANOMALIES.filter((anomalia) => {
      if (tipo !== "todos" && anomalia.tipo !== tipo) return false;
      if (status !== "todos" && anomalia.status !== status) return false;
      return true;
    });

    return [...filtradas].sort((a, b) =>
      ordenacao === "score"
        ? b.riskScore - a.riskScore
        : new Date(b.data).getTime() - new Date(a.data).getTime(),
    );
  }, [tipo, status, ordenacao]);

  const detalhe = selecionada
    ? (ANOMALIES.find((a) => a.id === selecionada) ?? null)
    : null;

  const abrir = (id: string) => {
    setSelecionada(id);
    router.replace(`/governo/fraudes?evento=${id}`, { scroll: false });
  };

  const fechar = () => {
    setSelecionada(null);
    router.replace("/governo/fraudes", { scroll: false });
  };

  const abertas = ANOMALIES.filter((a) => a.status === "aberto");
  const criticas = abertas.filter((a) => a.riskScore >= 85);

  return (
    <PageContainer wide>
      <PageHeader
        eyebrow="Integridade da rede"
        titulo="Risk & Fraud Center"
        descricao="Eventos sinalizados por regras determinísticas sobre os registros de validação. Cada um recebe um Risk Score de 0 a 100."
      />

      {/* Aviso metodológico — a demo não finge ter IA */}
      <div className="mb-6 flex gap-3 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-2)] p-4">
        <Info className="mt-0.5 size-4 shrink-0 text-[var(--fg-subtle)]" weight="duotone" />
        <div>
          <p className="text-[13px] font-medium text-[var(--fg)]">
            Sistema de detecção de anomalias demonstrativo
          </p>
          <p className="mt-1 max-w-[92ch] text-[12.5px] leading-relaxed text-[var(--fg-muted)]">
            O Risk Score é calculado por regras fixas e explícitas — limites de
            frequência, divergência de peso e distância entre leituras — aplicadas
            a dados fictícios. Não há modelo de aprendizado de máquina, inferência
            estatística ou inteligência artificial envolvidos.
          </p>
        </div>
      </div>

      <dl className="mb-6 grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--border)] sm:grid-cols-3">
        {[
          { rotulo: "Eventos em aberto", valor: formatNumber(abertas.length) },
          { rotulo: "Score crítico (≥ 85)", valor: formatNumber(criticas.length) },
          { rotulo: "Total sinalizado", valor: formatNumber(ANOMALIES.length) },
        ].map((item) => (
          <div key={item.rotulo} className="bg-[var(--surface)] px-5 py-4">
            <dt className="text-[12.5px] font-medium text-[var(--fg-muted)]">
              {item.rotulo}
            </dt>
            <dd className="mt-2 font-display text-[28px] font-semibold leading-none tabular tracking-[-0.03em] text-[var(--fg)]">
              {item.valor}
            </dd>
          </div>
        ))}
      </dl>

      {/* Filtros */}
      <div className="mb-5 flex flex-wrap items-center gap-2.5">
        <Segmented
          size="sm"
          ariaLabel="Ordenar eventos"
          options={[
            { value: "score", label: "Maior score" },
            { value: "data", label: "Mais recentes" },
          ]}
          value={ordenacao}
          onChange={setOrdenacao}
        />

        <span aria-hidden className="h-4 w-px bg-[var(--border)]" />

        <FiltroChip
          rotulo="Todos os tipos"
          ativo={tipo === "todos"}
          onClick={() => setTipo("todos")}
        />
        {(Object.keys(TIPO_ROTULO) as AnomalyType[]).map((item) => (
          <FiltroChip
            key={item}
            rotulo={TIPO_ROTULO[item]}
            ativo={tipo === item}
            onClick={() => setTipo(item)}
          />
        ))}

        <span aria-hidden className="h-4 w-px bg-[var(--border)]" />

        <FiltroChip
          rotulo="Qualquer status"
          ativo={status === "todos"}
          onClick={() => setStatus("todos")}
        />
        {(Object.keys(STATUS_ROTULO) as Anomaly["status"][]).map((item) => (
          <FiltroChip
            key={item}
            rotulo={STATUS_ROTULO[item]}
            ativo={status === item}
            onClick={() => setStatus(item)}
          />
        ))}
      </div>

      {lista.length === 0 ? (
        <EmptyState
          className="rounded-[var(--radius-lg)] border border-[var(--border)]"
          icon={<ShieldWarning />}
          title="Nenhum evento com esses filtros."
          description="Amplie os filtros para ver os demais eventos sinalizados pela rede."
          action={{
            label: "Limpar filtros",
            onClick: () => {
              setTipo("todos");
              setStatus("todos");
            },
          }}
        />
      ) : (
        <ul className="space-y-2">
          {lista.map((anomalia) => (
            <AnomalyRow
              key={anomalia.id}
              anomalia={anomalia}
              onAbrir={() => abrir(anomalia.id)}
            />
          ))}
        </ul>
      )}

      <Sheet open={Boolean(detalhe)} onOpenChange={(aberto) => !aberto && fechar()}>
        <SheetContent side="right" width="sm:max-w-lg" className="p-0">
          {detalhe && <AnomalyDetail anomalia={detalhe} />}
        </SheetContent>
      </Sheet>
    </PageContainer>
  );
}

function FiltroChip({
  rotulo,
  ativo,
  onClick,
}: {
  rotulo: string;
  ativo: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={ativo}
      className={cn(
        "rounded-full border px-2.5 py-1 text-[12px] font-medium transition-colors",
        ativo
          ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
          : "border-[var(--border)] text-[var(--fg-muted)] hover:border-[var(--border-strong)] hover:text-[var(--fg)]",
      )}
    >
      {rotulo}
    </button>
  );
}

function AnomalyRow({
  anomalia,
  onAbrir,
}: {
  anomalia: Anomaly;
  onAbrir: () => void;
}) {
  const faixa = faixaRisco(anomalia.riskScore);

  return (
    <li>
      <button
        type="button"
        onClick={onAbrir}
        className="flex w-full items-center gap-4 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-4 text-left transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--surface-2)]"
      >
        {/* Score: número grande e legível, com rótulo — nunca só cor */}
        <div className="shrink-0 text-center">
          <span
            className={cn(
              "flex size-12 items-center justify-center rounded-[var(--radius-md)] font-display text-[19px] font-semibold tabular",
              faixa.tom === "critical" && "bg-[var(--critical-soft)] text-[var(--critical)]",
              faixa.tom === "serious" && "bg-[var(--serious-soft)] text-[var(--serious)]",
              faixa.tom === "warning" && "bg-[var(--warning-soft)] text-[var(--warning)]",
              faixa.tom === "neutral" && "bg-[var(--surface-2)] text-[var(--fg-muted)]",
            )}
          >
            {anomalia.riskScore}
          </span>
          <span className="mt-1 block text-[10px] font-medium uppercase tracking-[0.06em] text-[var(--fg-subtle)]">
            {faixa.rotulo}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[14px] font-medium text-[var(--fg)]">
              {anomalia.titulo}
            </p>
            <Badge tone={STATUS_TOM[anomalia.status]}>
              {STATUS_ROTULO[anomalia.status]}
            </Badge>
          </div>
          <p className="mt-1 text-[12.5px] text-[var(--fg-muted)]">
            {anomalia.cidade} — {anomalia.ecoponto}
          </p>
          <p className="mt-1.5 line-clamp-1 text-[12px] text-[var(--fg-subtle)]">
            {anomalia.descricao}
          </p>
        </div>

        <div className="hidden shrink-0 text-right sm:block">
          <Badge tone="neutral">{TIPO_ROTULO[anomalia.tipo]}</Badge>
          <RelativeTime
            date={anomalia.data}
            className="mt-2 block text-[11.5px] text-[var(--fg-subtle)]"
          />
        </div>
      </button>
    </li>
  );
}

function AnomalyDetail({ anomalia }: { anomalia: Anomaly }) {
  const faixa = faixaRisco(anomalia.riskScore);

  return (
    <div className="flex h-full flex-col">
      <header className="border-b border-[var(--border)] px-6 py-5 pr-12">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="neutral">{TIPO_ROTULO[anomalia.tipo]}</Badge>
          <Badge tone={STATUS_TOM[anomalia.status]}>
            {STATUS_ROTULO[anomalia.status]}
          </Badge>
        </div>
        <h2 className="mt-3 font-display text-[21px] font-semibold tracking-[-0.015em] text-[var(--fg)]">
          {anomalia.titulo}
        </h2>
        <p className="mt-2 text-[13px] leading-relaxed text-[var(--fg-muted)]">
          {anomalia.descricao}
        </p>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-5">
        {/* Score */}
        <section>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Risk Score</p>
              <p className="mt-2 font-display text-[40px] font-semibold leading-none tabular tracking-[-0.035em] text-[var(--fg)]">
                {anomalia.riskScore}
                <span className="ml-1 text-[15px] font-medium text-[var(--fg-muted)]">
                  / 100
                </span>
              </p>
            </div>
            <Badge
              tone={
                faixa.tom === "critical"
                  ? "critical"
                  : faixa.tom === "serious"
                    ? "serious"
                    : faixa.tom === "warning"
                      ? "warning"
                      : "neutral"
              }
            >
              Risco {faixa.rotulo.toLowerCase()}
            </Badge>
          </div>
          <div className="mt-4">
            <ProgressBar
              value={anomalia.riskScore}
              tone={
                anomalia.riskScore >= 85
                  ? "critical"
                  : anomalia.riskScore >= 45
                    ? "warning"
                    : "good"
              }
            />
          </div>
        </section>

        {/* Regras acionadas */}
        <section className="mt-7">
          <h3 className="eyebrow mb-3">Regras acionadas</h3>
          <ul className="space-y-2.5">
            {anomalia.motivo.map((motivo) => (
              <li
                key={motivo}
                className="flex gap-2.5 text-[12.5px] leading-relaxed text-[var(--fg-muted)]"
              >
                <span
                  aria-hidden
                  className="mt-[7px] size-1 shrink-0 rounded-full bg-[var(--critical)]"
                />
                {motivo}
              </li>
            ))}
          </ul>
        </section>

        {/* Contexto */}
        <section className="mt-7">
          <h3 className="eyebrow mb-3">Contexto do evento</h3>
          <dl className="space-y-px overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--border)]">
            {[
              { rotulo: "Data e hora", valor: formatDateTime(anomalia.data) },
              { rotulo: "Usuário", valor: anomalia.usuario },
              { rotulo: "Ecoponto", valor: anomalia.ecoponto },
              { rotulo: "Identificador", valor: anomalia.ecopontoId },
              { rotulo: "Cidade", valor: anomalia.cidade },
              {
                rotulo: "Eventos relacionados",
                valor: formatNumber(anomalia.eventosRelacionados),
              },
            ].map((linha) => (
              <div
                key={linha.rotulo}
                className="flex items-center justify-between gap-4 bg-[var(--surface)] px-4 py-3"
              >
                <dt className="text-[12.5px] text-[var(--fg-muted)]">
                  {linha.rotulo}
                </dt>
                <dd className="truncate text-[13px] font-medium text-[var(--fg)]">
                  {linha.valor}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Recomendação */}
        <section className="mt-7">
          <h3 className="eyebrow mb-3">Recomendação operacional</h3>
          <div className="rounded-[var(--radius-md)] border border-[var(--accent-line)] bg-[var(--accent-soft)] p-4">
            <p className="text-[13px] leading-relaxed text-[var(--fg)]">
              {anomalia.recomendacao}
            </p>
          </div>
        </section>

        <p className="mt-7 border-t border-[var(--border)] pt-4 text-[11.5px] leading-relaxed text-[var(--fg-subtle)]">
          Evento fictício, gerado para demonstração. O usuário citado é um
          identificador anonimizado sem correspondência com pessoa real.
        </p>
      </div>

      <footer className="border-t border-[var(--border)] px-6 py-4">
        <div className="flex gap-2">
          <Button variant="secondary" className="flex-1" disabled>
            Encaminhar à fiscalização
          </Button>
          <Button variant="ghost" disabled>
            Descartar
          </Button>
        </div>
        <p className="mt-2.5 text-center text-[11.5px] text-[var(--fg-subtle)]">
          Ações de fiscalização não estão habilitadas na demonstração
        </p>
      </footer>
    </div>
  );
}

function CentralSkeleton() {
  return (
    <PageContainer wide>
      <Skeleton className="h-8 w-64" />
      <Skeleton className="mt-3 h-4 w-full max-w-2xl" />
      <Skeleton className="mt-8 h-24 w-full rounded-[var(--radius-lg)]" />
      <div className="mt-6 space-y-2">
        {Array.from({ length: 6 }).map((_, indice) => (
          <Skeleton key={indice} className="h-[86px] w-full rounded-[var(--radius-lg)]" />
        ))}
      </div>
    </PageContainer>
  );
}
