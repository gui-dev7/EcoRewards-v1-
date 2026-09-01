"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import {
  Check,
  Copy,
  Heart,
  MagnifyingGlass,
  Sparkle,
  Ticket,
  X,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/field";
import { Segmented, Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/feedback";
import { ProgressBar } from "@/components/ui/data-display";
import { useWalletStore } from "@/stores";
import { useHydrated } from "@/hooks/use-hydrated";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { formatCurrency, formatDate, formatNumber } from "@/lib/format";
import { REWARDS, REWARD_CATEGORIES } from "@/mocks/rewards";
import { CITIZEN } from "@/mocks/citizen";
import { cn } from "@/lib/utils";
import type { Redemption, Reward, RewardCategory } from "@/types";

type Ordenacao = "relevancia" | "menor" | "maior";

export function RewardsCatalog() {
  const router = useRouter();
  const parametros = useSearchParams();
  const hydrated = useHydrated();

  const saldo = useWalletStore((s) => s.ecoPontos);
  const favoritos = useWalletStore((s) => s.favoritos);
  const resgates = useWalletStore((s) => s.resgates);
  const alternarFavorito = useWalletStore((s) => s.alternarFavorito);
  const resgatar = useWalletStore((s) => s.resgatar);

  const [busca, setBusca] = React.useState("");
  const [categoria, setCategoria] = React.useState<RewardCategory | "todas">("todas");
  const [ordenacao, setOrdenacao] = React.useState<Ordenacao>("relevancia");
  const [soFavoritos, setSoFavoritos] = React.useState(false);
  const [soAlcancaveis, setSoAlcancaveis] = React.useState(false);

  const [detalheManual, setDetalheManual] = React.useState<Reward | null>(null);
  const [confirmando, setConfirmando] = React.useState<Reward | null>(null);
  const [voucher, setVoucher] = React.useState<Redemption | null>(null);

  const saldoAtual = hydrated ? saldo : CITIZEN.ecoPontos;

  /**
   * O detalhe aberto é derivado, não espelhado: vem do `?item=` da URL ou
   * de um clique na grade. Assim um link direto para a recompensa abre o
   * diálogo sem precisar de efeito.
   */
  const itemNaUrl = parametros.get("item");
  const detalhe =
    detalheManual ?? (itemNaUrl ? (REWARDS.find((r) => r.id === itemNaUrl) ?? null) : null);

  const fecharDetalhe = () => {
    setDetalheManual(null);
    if (itemNaUrl) router.replace("/app/recompensas");
  };

  const filtradas = React.useMemo(() => {
    const termo = busca.trim().toLowerCase();

    const lista = REWARDS.filter((reward) => {
      if (categoria !== "todas" && reward.categoria !== categoria) return false;
      if (soFavoritos && !favoritos.includes(reward.id)) return false;
      if (soAlcancaveis && reward.pontos > saldoAtual) return false;
      if (!termo) return true;
      return (
        reward.nome.toLowerCase().includes(termo) ||
        reward.parceiro.toLowerCase().includes(termo) ||
        reward.descricao.toLowerCase().includes(termo)
      );
    });

    if (ordenacao === "menor") return [...lista].sort((a, b) => a.pontos - b.pontos);
    if (ordenacao === "maior") return [...lista].sort((a, b) => b.pontos - a.pontos);
    return [...lista].sort((a, b) => Number(Boolean(b.destaque)) - Number(Boolean(a.destaque)));
  }, [busca, categoria, ordenacao, soFavoritos, soAlcancaveis, favoritos, saldoAtual]);

  const confirmarResgate = () => {
    if (!confirmando) return;
    const resultado = resgatar(confirmando);

    if (!resultado.ok) {
      toast.error("Saldo insuficiente", { description: resultado.erro });
      setConfirmando(null);
      return;
    }

    setConfirmando(null);
    fecharDetalhe();
    setVoucher(resultado.resgate);
  };

  return (
    <Tabs defaultValue="catalogo">
      <TabsList>
        <TabsTrigger value="catalogo" layoutId="rewards-tab">
          Catálogo
        </TabsTrigger>
        <TabsTrigger value="resgates" layoutId="rewards-tab">
          Meus resgates
          {hydrated && resgates.length > 0 && (
            <span className="ml-1.5 rounded-full bg-[var(--surface-3)] px-1.5 text-[11px] tabular">
              {resgates.length}
            </span>
          )}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="catalogo" className="pt-6">
        {/* Controles em uma única linha acima da grade */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative min-w-[220px] flex-1">
              <MagnifyingGlass
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--fg-subtle)]"
                weight="bold"
              />
              <label htmlFor="busca-recompensas" className="sr-only">
                Buscar recompensas
              </label>
              <Input
                id="busca-recompensas"
                value={busca}
                onChange={(evento) => setBusca(evento.target.value)}
                placeholder="Buscar por nome ou parceiro…"
                className="pl-9"
              />
            </div>

            <Segmented
              size="sm"
              ariaLabel="Ordenar recompensas"
              options={[
                { value: "relevancia", label: "Destaques" },
                { value: "menor", label: "Menor custo" },
                { value: "maior", label: "Maior custo" },
              ]}
              value={ordenacao}
              onChange={setOrdenacao}
            />

            <button
              type="button"
              onClick={() => setSoAlcancaveis((atual) => !atual)}
              aria-pressed={soAlcancaveis}
              className={cn(
                "flex h-9 items-center gap-1.5 rounded-[var(--radius-sm)] border px-3 text-[12.5px] font-medium transition-colors",
                soAlcancaveis
                  ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                  : "border-[var(--border)] text-[var(--fg-muted)] hover:border-[var(--border-strong)] hover:text-[var(--fg)]",
              )}
            >
              <Sparkle className="size-3.5" weight={soAlcancaveis ? "fill" : "regular"} />
              Posso resgatar
            </button>

            <button
              type="button"
              onClick={() => setSoFavoritos((atual) => !atual)}
              aria-pressed={soFavoritos}
              className={cn(
                "flex h-9 items-center gap-1.5 rounded-[var(--radius-sm)] border px-3 text-[12.5px] font-medium transition-colors",
                soFavoritos
                  ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                  : "border-[var(--border)] text-[var(--fg-muted)] hover:border-[var(--border-strong)] hover:text-[var(--fg)]",
              )}
            >
              <Heart className="size-3.5" weight={soFavoritos ? "fill" : "regular"} />
              Favoritos
            </button>
          </div>

          {/* Categorias */}
          <div className="fade-edges-x -mx-1 overflow-x-auto px-1 pb-1 no-scrollbar">
            <div className="flex w-max items-center gap-1.5">
              <CategoriaChip
                ativo={categoria === "todas"}
                onClick={() => setCategoria("todas")}
                rotulo="Todas"
                total={REWARDS.length}
              />
              {REWARD_CATEGORIES.map((cat) => (
                <CategoriaChip
                  key={cat.id}
                  ativo={categoria === cat.id}
                  onClick={() => setCategoria(cat.id)}
                  rotulo={cat.nome}
                  total={REWARDS.filter((r) => r.categoria === cat.id).length}
                />
              ))}
            </div>
          </div>
        </div>

        <p className="mt-5 text-[12.5px] text-[var(--fg-subtle)]">
          {filtradas.length}{" "}
          {filtradas.length === 1 ? "recompensa encontrada" : "recompensas encontradas"}
          {" · "}
          <span className="tabular">{formatNumber(saldoAtual)}</span> EcoPontos disponíveis
        </p>

        {filtradas.length === 0 ? (
          <EmptyState
            className="mt-8 rounded-[var(--radius-lg)] border border-[var(--border)]"
            icon={<Ticket />}
            title="Nenhuma recompensa com esses filtros."
            description="Tente outra categoria, limpe a busca ou desative os filtros ativos."
            action={{
              label: "Limpar filtros",
              onClick: () => {
                setBusca("");
                setCategoria("todas");
                setSoFavoritos(false);
                setSoAlcancaveis(false);
              },
            }}
          />
        ) : (
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtradas.map((reward) => (
              <RewardCard
                key={reward.id}
                reward={reward}
                saldo={saldoAtual}
                favorito={hydrated && favoritos.includes(reward.id)}
                onFavoritar={() => alternarFavorito(reward.id)}
                onAbrir={() => setDetalheManual(reward)}
              />
            ))}
          </ul>
        )}
      </TabsContent>

      <TabsContent value="resgates" className="pt-6">
        <RedemptionsList resgates={hydrated ? resgates : []} />
      </TabsContent>

      {/* Detalhe */}
      <Dialog open={Boolean(detalhe)} onOpenChange={(aberto) => !aberto && fecharDetalhe()}>
        <DialogContent size="md">
          {detalhe && (
            <>
              <DialogHeader>
                <Badge tone="neutral" className="mb-3 capitalize">
                  {REWARD_CATEGORIES.find((c) => c.id === detalhe.categoria)?.nome}
                </Badge>
                <DialogTitle>{detalhe.nome}</DialogTitle>
                <DialogDescription>{detalhe.descricao}</DialogDescription>
              </DialogHeader>

              <DialogBody>
                <p className="text-[13.5px] leading-relaxed text-[var(--fg-muted)]">
                  {detalhe.detalhes}
                </p>

                <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--border)]">
                  {[
                    { rotulo: "Custo", valor: `${formatNumber(detalhe.pontos)} pts` },
                    { rotulo: "Valor estimado", valor: formatCurrency(detalhe.valorEstimado) },
                    { rotulo: "Parceiro", valor: detalhe.parceiro },
                    { rotulo: "Válido até", valor: formatDate(detalhe.validade) },
                  ].map((linha) => (
                    <div key={linha.rotulo} className="bg-[var(--surface-2)] px-4 py-3">
                      <dt className="text-[11.5px] text-[var(--fg-muted)]">
                        {linha.rotulo}
                      </dt>
                      <dd className="mt-1 truncate text-[13.5px] font-medium text-[var(--fg)]">
                        {linha.valor}
                      </dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-6">
                  <div className="mb-2 flex items-baseline justify-between">
                    <span className="text-[12.5px] text-[var(--fg-muted)]">
                      Seu saldo em relação ao custo
                    </span>
                    <span className="text-[12.5px] font-medium tabular text-[var(--fg)]">
                      {formatNumber(saldoAtual)} / {formatNumber(detalhe.pontos)}
                    </span>
                  </div>
                  <ProgressBar
                    value={Math.min(saldoAtual, detalhe.pontos)}
                    max={detalhe.pontos}
                    size="sm"
                    tone={saldoAtual >= detalhe.pontos ? "good" : "accent"}
                  />
                </div>

                <div className="mt-6">
                  <p className="eyebrow mb-2.5">Condições</p>
                  <ul className="space-y-2">
                    {detalhe.termos.map((termo) => (
                      <li
                        key={termo}
                        className="flex gap-2.5 text-[12.5px] leading-relaxed text-[var(--fg-muted)]"
                      >
                        <span
                          aria-hidden
                          className="mt-[7px] size-1 shrink-0 rounded-full bg-[var(--fg-subtle)]"
                        />
                        {termo}
                      </li>
                    ))}
                  </ul>
                </div>
              </DialogBody>

              <DialogFooter>
                <Button variant="ghost" onClick={fecharDetalhe}>
                  Fechar
                </Button>
                <Button
                  disabled={saldoAtual < detalhe.pontos}
                  onClick={() => setConfirmando(detalhe)}
                >
                  {saldoAtual < detalhe.pontos
                    ? `Faltam ${formatNumber(detalhe.pontos - saldoAtual)} pts`
                    : `Resgatar por ${formatNumber(detalhe.pontos)} pts`}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmação */}
      <Dialog open={Boolean(confirmando)} onOpenChange={(aberto) => !aberto && setConfirmando(null)}>
        <DialogContent size="sm">
          {confirmando && (
            <>
              <DialogHeader>
                <DialogTitle>Confirmar resgate?</DialogTitle>
                <DialogDescription>
                  {formatNumber(confirmando.pontos)} EcoPontos serão descontados do
                  seu saldo e um voucher demonstrativo será gerado.
                </DialogDescription>
              </DialogHeader>

              <DialogBody>
                <dl className="space-y-px overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--border)]">
                  <div className="flex items-center justify-between gap-4 bg-[var(--surface-2)] px-4 py-3">
                    <dt className="text-[12.5px] text-[var(--fg-muted)]">Recompensa</dt>
                    <dd className="truncate text-[13px] font-medium text-[var(--fg)]">
                      {confirmando.nome}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4 bg-[var(--surface-2)] px-4 py-3">
                    <dt className="text-[12.5px] text-[var(--fg-muted)]">Saldo após</dt>
                    <dd className="text-[13px] font-medium tabular text-[var(--fg)]">
                      {formatNumber(saldoAtual - confirmando.pontos)} pts
                    </dd>
                  </div>
                </dl>
              </DialogBody>

              <DialogFooter>
                <Button variant="ghost" onClick={() => setConfirmando(null)}>
                  Cancelar
                </Button>
                <Button onClick={confirmarResgate}>Confirmar resgate</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <VoucherReveal resgate={voucher} onFechar={() => setVoucher(null)} />
    </Tabs>
  );
}

/* ------------------------------------------------------------------ */

function CategoriaChip({
  ativo,
  onClick,
  rotulo,
  total,
}: {
  ativo: boolean;
  onClick: () => void;
  rotulo: string;
  total: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={ativo}
      className={cn(
        "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12.5px] font-medium transition-colors",
        ativo
          ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
          : "border-[var(--border)] text-[var(--fg-muted)] hover:border-[var(--border-strong)] hover:text-[var(--fg)]",
      )}
    >
      {rotulo}
      <span className="tabular opacity-60">{total}</span>
    </button>
  );
}

function RewardCard({
  reward,
  saldo,
  favorito,
  onFavoritar,
  onAbrir,
}: {
  reward: Reward;
  saldo: number;
  favorito: boolean;
  onFavoritar: () => void;
  onAbrir: () => void;
}) {
  const alcancavel = saldo >= reward.pontos;
  const progresso = Math.min((saldo / reward.pontos) * 100, 100);

  return (
    <li className="group relative flex flex-col rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] transition-[border-color,box-shadow] duration-300 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-sm)]">
      <button
        type="button"
        onClick={onFavoritar}
        aria-pressed={favorito}
        aria-label={favorito ? `Remover ${reward.nome} dos favoritos` : `Favoritar ${reward.nome}`}
        className="absolute right-3 top-3 z-10 rounded-full p-1.5 text-[var(--fg-subtle)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--critical)]"
      >
        <Heart
          className={cn("size-4", favorito && "text-[var(--critical)]")}
          weight={favorito ? "fill" : "regular"}
        />
      </button>

      <button
        type="button"
        onClick={onAbrir}
        className="flex flex-1 flex-col p-5 text-left outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
      >
        <div className="flex items-center gap-2">
          {reward.destaque && (
            <Badge tone="accent">
              <Sparkle className="size-3" weight="fill" />
              Destaque
            </Badge>
          )}
          <span className="truncate text-[11.5px] text-[var(--fg-subtle)]">
            {reward.parceiro}
          </span>
        </div>

        <h3 className="mt-3 pr-6 font-display text-[15px] font-semibold leading-snug text-[var(--fg)]">
          {reward.nome}
        </h3>
        <p className="mt-1.5 line-clamp-2 flex-1 text-[12.5px] leading-relaxed text-[var(--fg-muted)]">
          {reward.descricao}
        </p>

        <div className="mt-5">
          <div className="flex items-baseline justify-between gap-3">
            <span
              className={cn(
                "font-display text-[19px] font-semibold tabular tracking-[-0.02em]",
                alcancavel ? "text-[var(--accent)]" : "text-[var(--fg)]",
              )}
            >
              {formatNumber(reward.pontos)}
              <span className="ml-1 text-[11.5px] font-medium text-[var(--fg-muted)]">
                pts
              </span>
            </span>
            <span className="text-[11.5px] text-[var(--fg-subtle)]">
              ≈ {formatCurrency(reward.valorEstimado)}
            </span>
          </div>

          <div className="mt-3">
            <ProgressBar
              value={progresso}
              size="xs"
              tone={alcancavel ? "good" : "accent"}
            />
          </div>
          <p className="mt-2 text-[11.5px] text-[var(--fg-subtle)]">
            {alcancavel
              ? "Disponível para resgate"
              : `Faltam ${formatNumber(reward.pontos - saldo)} EcoPontos`}
          </p>
        </div>
      </button>
    </li>
  );
}

function RedemptionsList({ resgates }: { resgates: Redemption[] }) {
  const marcarUsado = useWalletStore((s) => s.marcarResgateUsado);

  const copiar = async (codigo: string) => {
    try {
      await navigator.clipboard.writeText(codigo);
      toast.success("Código copiado");
    } catch {
      toast.error("Não foi possível copiar o código");
    }
  };

  if (resgates.length === 0) {
    return (
      <EmptyState
        className="rounded-[var(--radius-lg)] border border-[var(--border)]"
        icon={<Ticket />}
        title="Você ainda não resgatou nada."
        description="Assim que trocar EcoPontos por uma recompensa, o voucher aparece aqui com código e validade."
      />
    );
  }

  return (
    <ul className="space-y-3">
      {resgates.map((resgate) => (
        <li
          key={resgate.id}
          className="flex flex-wrap items-center gap-4 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--accent-soft)] text-[var(--accent)]">
            <Ticket className="size-5" weight="duotone" />
          </span>

          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] font-medium text-[var(--fg)]">
              {resgate.nome}
            </p>
            <p className="mt-0.5 truncate text-[12px] text-[var(--fg-muted)]">
              {resgate.parceiro} · resgatado em {formatDate(resgate.resgatadoEm)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <code className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-2)] px-2.5 py-1.5 font-mono text-[12.5px] tracking-wider text-[var(--fg)]">
              {resgate.codigo}
            </code>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => copiar(resgate.codigo)}
              aria-label={`Copiar código de ${resgate.nome}`}
            >
              <Copy />
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <Badge
              tone={
                resgate.status === "ativo"
                  ? "good"
                  : resgate.status === "usado"
                    ? "neutral"
                    : "warning"
              }
              className="capitalize"
            >
              {resgate.status}
            </Badge>
            {resgate.status === "ativo" && (
              <Button
                variant="ghost"
                size="xs"
                onClick={() => marcarUsado(resgate.id)}
              >
                Marcar como usado
              </Button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* Revelação do voucher                                                */
/* ------------------------------------------------------------------ */

function VoucherReveal({
  resgate,
  onFechar,
}: {
  resgate: Redemption | null;
  onFechar: () => void;
}) {
  const reduzido = useReducedMotion();
  const [copiado, setCopiado] = React.useState(false);

  const copiar = async () => {
    if (!resgate) return;
    try {
      await navigator.clipboard.writeText(resgate.codigo);
      setCopiado(true);
      window.setTimeout(() => setCopiado(false), 2000);
    } catch {
      toast.error("Não foi possível copiar o código");
    }
  };

  return (
    <Dialog open={Boolean(resgate)} onOpenChange={(aberto) => !aberto && onFechar()}>
      <DialogContent size="sm" hideClose className="overflow-visible">
        {resgate && (
          <>
            <DialogHeader className="border-0 pb-0 pr-6">
              <DialogTitle className="sr-only">Voucher gerado</DialogTitle>
              <DialogDescription className="sr-only">
                Código demonstrativo do resgate de {resgate.nome}.
              </DialogDescription>
              <button
                onClick={onFechar}
                aria-label="Fechar"
                className="absolute right-4 top-4 rounded-[var(--radius-xs)] p-1 text-[var(--fg-subtle)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--fg)]"
              >
                <X className="size-4" weight="bold" />
              </button>
            </DialogHeader>

            <DialogBody className="pt-2">
              <AnimatePresence>
                <motion.div
                  initial={reduzido ? false : { opacity: 0, y: 24, rotateX: -12 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--accent-line)] bg-[var(--accent-soft)] p-6 text-center"
                >
                  {/* Recortes laterais do bilhete */}
                  <span
                    aria-hidden
                    className="absolute -left-3 top-1/2 size-6 -translate-y-1/2 rounded-full bg-[var(--surface)]"
                  />
                  <span
                    aria-hidden
                    className="absolute -right-3 top-1/2 size-6 -translate-y-1/2 rounded-full bg-[var(--surface)]"
                  />

                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">
                    Voucher demonstrativo
                  </p>
                  <p className="mt-3 font-display text-[17px] font-semibold text-[var(--fg)]">
                    {resgate.nome}
                  </p>
                  <p className="mt-1 text-[12.5px] text-[var(--fg-muted)]">
                    {resgate.parceiro}
                  </p>

                  <div className="my-5 border-t border-dashed border-[var(--accent-line)]" />

                  <motion.p
                    initial={reduzido ? false : { opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: reduzido ? 0 : 0.45, duration: 0.4 }}
                    className="font-mono text-[24px] font-semibold tracking-[0.16em] text-[var(--fg)]"
                  >
                    {resgate.codigo}
                  </motion.p>

                  <p className="mt-4 text-[11.5px] text-[var(--fg-muted)]">
                    Válido até {formatDate(resgate.validade)} ·{" "}
                    {formatNumber(resgate.pontos)} EcoPontos
                  </p>
                </motion.div>
              </AnimatePresence>

              <p className="mt-5 text-center text-[12px] leading-relaxed text-[var(--fg-subtle)]">
                Este código é fictício e existe apenas nesta demonstração. Nenhum
                parceiro real foi acionado.
              </p>
            </DialogBody>

            <DialogFooter>
              <Button variant="secondary" onClick={copiar} className="flex-1">
                {copiado ? (
                  <>
                    <Check weight="bold" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy weight="bold" />
                    Copiar código
                  </>
                )}
              </Button>
              <Button onClick={onFechar} className="flex-1">
                Ver meus resgates
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
