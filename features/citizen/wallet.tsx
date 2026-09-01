"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  Gift,
  QrCode,
  Recycle,
  Sparkle,
  Wallet as WalletIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Segmented } from "@/components/ui/tabs";
import { EmptyState } from "@/components/ui/feedback";
import { Sparkline } from "@/components/charts/charts";
import { useWalletStore } from "@/stores";
import { useHydrated } from "@/hooks/use-hydrated";
import { formatDate, formatNumber } from "@/lib/format";
import { CITIZEN, CITIZEN_POINTS_HISTORY } from "@/mocks/citizen";
import { MATERIAL_BY_ID } from "@/mocks/materials";
import { cn } from "@/lib/utils";
import type { TransactionKind, WalletTransaction } from "@/types";

const FILTROS = [
  { value: "todos", label: "Tudo" },
  { value: "ganho", label: "Ganhos" },
  { value: "gasto", label: "Gastos" },
  { value: "bonus", label: "Bônus" },
] as const;

const PERIODOS = [
  { value: "30", label: "30 dias" },
  { value: "90", label: "90 dias" },
  { value: "tudo", label: "Tudo" },
] as const;

const ICONE_TIPO: Record<TransactionKind, React.ComponentType<{ className?: string; weight?: "fill" | "bold" | "regular" | "duotone" }>> = {
  ganho: Recycle,
  gasto: Gift,
  bonus: Sparkle,
  estorno: ArrowDown,
};

export function Wallet() {
  const hydrated = useHydrated();
  const saldo = useWalletStore((s) => s.ecoPontos);
  const transacoes = useWalletStore((s) => s.transacoes);

  const [filtro, setFiltro] = React.useState<(typeof FILTROS)[number]["value"]>("todos");
  const [periodo, setPeriodo] = React.useState<(typeof PERIODOS)[number]["value"]>("tudo");

  // Instante de referência fixado na montagem: recalcular a cada render
  // deixaria o corte do filtro escorregando enquanto a página está aberta.
  const [agora] = React.useState(() => Date.now());

  // Memoizado para não recriar o array vazio antes da hidratação, o que
  // invalidaria os cálculos derivados a cada render.
  const lista = React.useMemo(
    () => (hydrated ? transacoes : []),
    [hydrated, transacoes],
  );

  const filtradas = React.useMemo(() => {
    const limite =
      periodo === "tudo"
        ? 0
        : agora - Number(periodo) * 24 * 60 * 60 * 1000;

    return lista.filter((transacao) => {
      const tipoOk = filtro === "todos" || transacao.tipo === filtro;
      const dataOk = limite === 0 || new Date(transacao.data).getTime() >= limite;
      return tipoOk && dataOk;
    });
  }, [lista, filtro, periodo, agora]);

  const { ganhos, gastos } = React.useMemo(() => {
    return lista.reduce(
      (acumulado, transacao) => {
        if (transacao.pontos > 0) acumulado.ganhos += transacao.pontos;
        else acumulado.gastos += Math.abs(transacao.pontos);
        return acumulado;
      },
      { ganhos: 0, gastos: 0 },
    );
  }, [lista]);

  // Agrupa por mês para dar ritmo ao extrato.
  const grupos = React.useMemo(() => {
    const mapa = new Map<string, WalletTransaction[]>();
    for (const transacao of filtradas) {
      const chave = formatDate(transacao.data, "mes");
      const atual = mapa.get(chave) ?? [];
      atual.push(transacao);
      mapa.set(chave, atual);
    }
    return Array.from(mapa.entries());
  }, [filtradas]);

  return (
    <div className="space-y-6">
      {/* Resumo */}
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <section className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Saldo disponível</p>
              <p className="mt-3 font-display text-[44px] font-semibold leading-none tabular tracking-[-0.035em] text-[var(--fg)]">
                {formatNumber(hydrated ? saldo : CITIZEN.ecoPontos)}
              </p>
              <p className="mt-2 text-[13px] text-[var(--fg-muted)]">EcoPontos</p>
            </div>
            <span className="flex size-11 items-center justify-center rounded-[var(--radius-md)] bg-[var(--accent-soft)] text-[var(--accent)]">
              <WalletIcon className="size-5" weight="duotone" />
            </span>
          </div>

          <div className="mt-6 border-t border-[var(--border)] pt-4">
            <p className="mb-2 text-[11.5px] text-[var(--fg-subtle)]">
              EcoPontos ganhos por mês, últimos 12 meses
            </p>
            <Sparkline dados={CITIZEN_POINTS_HISTORY} chave="pontos" altura={54} />
          </div>

          <div className="mt-5 flex flex-wrap gap-2.5">
            <Button asChild>
              <Link href="/app/scanner">
                <QrCode weight="bold" />
                Ganhar pontos
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/app/recompensas">
                <Gift weight="bold" />
                Trocar pontos
              </Link>
            </Button>
          </div>
        </section>

        <dl className="grid gap-px self-start overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-1">
          <div className="bg-[var(--surface)] px-5 py-4">
            <dt className="flex items-center gap-2 text-[12.5px] font-medium text-[var(--fg-muted)]">
              <ArrowUp className="size-3.5 text-[var(--good)]" weight="bold" />
              Total ganho
            </dt>
            <dd className="mt-2 font-display text-[26px] font-semibold tabular tracking-[-0.03em] text-[var(--fg)]">
              {formatNumber(ganhos)}
            </dd>
            <p className="mt-1.5 text-[11.5px] text-[var(--fg-subtle)]">
              Descartes, desafios e bônus de sequência
            </p>
          </div>
          <div className="bg-[var(--surface)] px-5 py-4">
            <dt className="flex items-center gap-2 text-[12.5px] font-medium text-[var(--fg-muted)]">
              <ArrowDown className="size-3.5 text-[var(--fg-subtle)]" weight="bold" />
              Total gasto
            </dt>
            <dd className="mt-2 font-display text-[26px] font-semibold tabular tracking-[-0.03em] text-[var(--fg)]">
              {formatNumber(gastos)}
            </dd>
            <p className="mt-1.5 text-[11.5px] text-[var(--fg-subtle)]">
              Recompensas resgatadas no catálogo
            </p>
          </div>
        </dl>
      </div>

      {/* Extrato */}
      <section className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] px-5 py-4">
          <h2 className="font-display text-[15px] font-semibold text-[var(--fg)]">
            Extrato
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <Segmented
              size="sm"
              ariaLabel="Filtrar por tipo"
              options={[...FILTROS]}
              value={filtro}
              onChange={setFiltro}
            />
            <Segmented
              size="sm"
              ariaLabel="Filtrar por período"
              options={[...PERIODOS]}
              value={periodo}
              onChange={setPeriodo}
            />
          </div>
        </header>

        {!hydrated ? (
          <div className="divide-y divide-[var(--border)]">
            {Array.from({ length: 6 }).map((_, indice) => (
              <div key={indice} className="flex items-center gap-4 px-5 py-4">
                <span className="size-9 animate-[shimmer_1.6s_ease-in-out_infinite] rounded-[var(--radius-sm)] bg-[var(--surface-2)]" />
                <span className="h-3.5 flex-1 max-w-[240px] animate-[shimmer_1.6s_ease-in-out_infinite] rounded bg-[var(--surface-2)]" />
                <span className="h-3.5 w-16 animate-[shimmer_1.6s_ease-in-out_infinite] rounded bg-[var(--surface-2)]" />
              </div>
            ))}
          </div>
        ) : filtradas.length === 0 ? (
          <EmptyState
            icon={<WalletIcon />}
            title="Nenhuma movimentação neste filtro."
            description="Ajuste o período ou o tipo para ver outras entradas do extrato."
            action={{ label: "Limpar filtros", onClick: () => { setFiltro("todos"); setPeriodo("tudo"); } }}
          />
        ) : (
          <div>
            {grupos.map(([mes, itens]) => (
              <div key={mes}>
                <p className="sticky top-[var(--header-h)] z-10 border-b border-[var(--border)] bg-[var(--surface-2)] px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.09em] text-[var(--fg-subtle)]">
                  {mes}
                </p>
                <ul className="divide-y divide-[var(--border)]">
                  {itens.map((transacao) => (
                    <TransactionRow key={transacao.id} transacao={transacao} />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function TransactionRow({ transacao }: { transacao: WalletTransaction }) {
  const Icon = ICONE_TIPO[transacao.tipo];
  const positivo = transacao.pontos > 0;
  const material = transacao.materialId ? MATERIAL_BY_ID[transacao.materialId] : null;

  return (
    <li className="flex items-center gap-4 px-5 py-4">
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-sm)]",
          positivo
            ? "bg-[var(--accent-soft)] text-[var(--accent)]"
            : "bg-[var(--surface-2)] text-[var(--fg-subtle)]",
        )}
      >
        <Icon className="size-[18px]" weight="duotone" />
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[13.5px] font-medium text-[var(--fg)]">
          {transacao.descricao}
        </p>
        <p className="mt-0.5 truncate text-[12px] text-[var(--fg-muted)]">
          {transacao.origem}
        </p>
        {material && transacao.pesoKg && (
          <p className="mt-1 flex items-center gap-1.5 text-[11.5px] text-[var(--fg-subtle)]">
            <span
              aria-hidden
              className="size-1.5 rounded-[2px]"
              style={{ background: material.cor }}
            />
            {formatNumber(transacao.pesoKg, 1)} kg · {material.nome}
          </p>
        )}
      </div>

      <div className="shrink-0 text-right">
        <p
          className={cn(
            "text-[14px] font-semibold tabular",
            positivo ? "text-[var(--good)]" : "text-[var(--fg)]",
          )}
        >
          {positivo ? "+" : "−"}
          {formatNumber(Math.abs(transacao.pontos))}
        </p>
        <p className="mt-0.5 text-[11.5px] tabular text-[var(--fg-subtle)]">
          {formatDate(transacao.data)}
        </p>
      </div>

      <Badge
        tone={
          transacao.status === "concluido"
            ? "good"
            : transacao.status === "pendente"
              ? "warning"
              : "neutral"
        }
        className="hidden shrink-0 capitalize sm:inline-flex"
      >
        {transacao.status}
      </Badge>
    </li>
  );
}
