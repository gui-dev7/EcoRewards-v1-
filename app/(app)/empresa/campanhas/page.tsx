"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  DotsThreeVertical,
  Megaphone,
  Pause,
  Pencil,
  Play,
  Plus,
  Trash,
  Users,
} from "@phosphor-icons/react";
import { PageContainer, PageHeader } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/data-display";
import { Field, Input, Textarea } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/controls";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Segmented } from "@/components/ui/tabs";
import { EmptyState } from "@/components/ui/feedback";
import { useCampaignsStore } from "@/stores";
import { useHydrated } from "@/hooks/use-hydrated";
import { formatDate, formatNumber } from "@/lib/format";
import { COMPANY, DEPARTMENTS } from "@/mocks/company";
import type { Campaign, CampaignStatus } from "@/types";

const STATUS_TOM: Record<CampaignStatus, "good" | "warning" | "neutral" | "info"> = {
  ativa: "good",
  pausada: "warning",
  encerrada: "neutral",
  rascunho: "info",
};

const STATUS_ROTULO: Record<CampaignStatus, string> = {
  ativa: "Ativa",
  pausada: "Pausada",
  encerrada: "Encerrada",
  rascunho: "Rascunho",
};

const schema = z
  .object({
    nome: z.string().min(4, "Dê um nome com ao menos 4 caracteres."),
    descricao: z.string().min(12, "Descreva a campanha em pelo menos 12 caracteres."),
    metaKg: z.coerce
      .number()
      .min(50, "A meta mínima é de 50 kg.")
      .max(100000, "A meta máxima é de 100.000 kg."),
    recompensaPontos: z.coerce
      .number()
      .min(100, "A recompensa mínima é de 100 EcoPontos.")
      .max(500000, "A recompensa máxima é de 500.000 EcoPontos."),
    unidade: z.string().min(1, "Escolha a unidade."),
    inicio: z.string().min(1, "Informe a data de início."),
    fim: z.string().min(1, "Informe a data de término."),
    status: z.enum(["ativa", "pausada", "encerrada", "rascunho"]),
  })
  .refine((dados) => new Date(dados.fim) > new Date(dados.inicio), {
    path: ["fim"],
    message: "O término precisa ser posterior ao início.",
  });

type Formulario = z.input<typeof schema>;

export default function CampaignsPage() {
  const hydrated = useHydrated();
  const campanhas = useCampaignsStore((s) => s.itens);
  const criar = useCampaignsStore((s) => s.criar);
  const atualizar = useCampaignsStore((s) => s.atualizar);
  const alterarStatus = useCampaignsStore((s) => s.alterarStatus);
  const excluir = useCampaignsStore((s) => s.excluir);

  const [filtro, setFiltro] = React.useState<CampaignStatus | "todas">("todas");
  const [editorAberto, setEditorAberto] = React.useState(false);
  const [emEdicao, setEmEdicao] = React.useState<Campaign | null>(null);
  const [confirmandoExclusao, setConfirmandoExclusao] = React.useState<Campaign | null>(
    null,
  );

  const lista = hydrated ? campanhas : [];
  const visiveis =
    filtro === "todas" ? lista : lista.filter((c) => c.status === filtro);

  const abrirCriacao = () => {
    setEmEdicao(null);
    setEditorAberto(true);
  };

  const abrirEdicao = (campanha: Campaign) => {
    setEmEdicao(campanha);
    setEditorAberto(true);
  };

  const salvar = (dados: z.output<typeof schema>) => {
    if (emEdicao) {
      atualizar(emEdicao.id, dados);
      toast.success("Campanha atualizada", { description: dados.nome });
    } else {
      criar({ ...dados, departamentos: [] });
      toast.success("Campanha criada", {
        description: `${dados.nome} está salva localmente nesta demonstração.`,
      });
    }
    setEditorAberto(false);
    setEmEdicao(null);
  };

  const confirmarExclusao = () => {
    if (!confirmandoExclusao) return;
    excluir(confirmandoExclusao.id);
    toast.success("Campanha excluída", { description: confirmandoExclusao.nome });
    setConfirmandoExclusao(null);
  };

  return (
    <PageContainer wide>
      <PageHeader
        eyebrow="Engajamento"
        titulo="Campanhas"
        descricao="Metas coletivas com prazo, participantes e recompensa. Criar, editar, pausar e excluir funcionam de verdade — o estado fica salvo neste navegador."
        acoes={
          <Button onClick={abrirCriacao}>
            <Plus weight="bold" />
            Nova campanha
          </Button>
        }
      />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Segmented
          ariaLabel="Filtrar campanhas por status"
          options={[
            { value: "todas", label: "Todas" },
            { value: "ativa", label: "Ativas" },
            { value: "pausada", label: "Pausadas" },
            { value: "encerrada", label: "Encerradas" },
            { value: "rascunho", label: "Rascunhos" },
          ]}
          value={filtro}
          onChange={setFiltro}
        />
        <p className="text-[12.5px] text-[var(--fg-subtle)]">
          {visiveis.length} {visiveis.length === 1 ? "campanha" : "campanhas"}
        </p>
      </div>

      {visiveis.length === 0 ? (
        <EmptyState
          className="rounded-[var(--radius-lg)] border border-[var(--border)]"
          icon={<Megaphone />}
          title="Nenhuma campanha neste filtro."
          description="Crie uma nova campanha ou alterne o filtro para ver as demais."
          action={{ label: "Nova campanha", onClick: abrirCriacao }}
        />
      ) : (
        <ul className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {visiveis.map((campanha) => (
            <CampaignCard
              key={campanha.id}
              campanha={campanha}
              onEditar={() => abrirEdicao(campanha)}
              onAlternarStatus={() =>
                alterarStatus(
                  campanha.id,
                  campanha.status === "ativa" ? "pausada" : "ativa",
                )
              }
              onEncerrar={() => {
                alterarStatus(campanha.id, "encerrada");
                toast.success("Campanha encerrada", { description: campanha.nome });
              }}
              onExcluir={() => setConfirmandoExclusao(campanha)}
            />
          ))}
        </ul>
      )}

      <CampaignEditor
        aberto={editorAberto}
        onOpenChange={setEditorAberto}
        campanha={emEdicao}
        onSalvar={salvar}
      />

      <Dialog
        open={Boolean(confirmandoExclusao)}
        onOpenChange={(aberto) => !aberto && setConfirmandoExclusao(null)}
      >
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Excluir campanha?</DialogTitle>
            <DialogDescription>
              {confirmandoExclusao?.nome} será removida da lista. A ação vale
              apenas nesta demonstração e pode ser desfeita com “Restaurar dados
              demo”.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setConfirmandoExclusao(null)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={confirmarExclusao}>
              <Trash weight="bold" />
              Excluir campanha
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}

/* ------------------------------------------------------------------ */

function CampaignCard({
  campanha,
  onEditar,
  onAlternarStatus,
  onEncerrar,
  onExcluir,
}: {
  campanha: Campaign;
  onEditar: () => void;
  onAlternarStatus: () => void;
  onEncerrar: () => void;
  onExcluir: () => void;
}) {
  const progresso = (campanha.progressoKg / campanha.metaKg) * 100;
  const encerrada = campanha.status === "encerrada";

  return (
    <li className="flex flex-col rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Badge tone={STATUS_TOM[campanha.status]}>
            {STATUS_ROTULO[campanha.status]}
          </Badge>
          <h3 className="mt-3 font-display text-[16px] font-semibold text-[var(--fg)]">
            {campanha.nome}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-[12.5px] leading-relaxed text-[var(--fg-muted)]">
            {campanha.descricao}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`Ações da campanha ${campanha.nome}`}
            >
              <DotsThreeVertical weight="bold" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={onEditar}>
              <Pencil />
              Editar
            </DropdownMenuItem>
            {!encerrada && (
              <DropdownMenuItem onSelect={onAlternarStatus}>
                {campanha.status === "ativa" ? <Pause /> : <Play />}
                {campanha.status === "ativa" ? "Pausar" : "Retomar"}
              </DropdownMenuItem>
            )}
            {!encerrada && (
              <DropdownMenuItem onSelect={onEncerrar}>
                <Megaphone />
                Encerrar campanha
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem destructive onSelect={onExcluir}>
              <Trash />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-auto pt-6">
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <span className="text-[12.5px] tabular text-[var(--fg-muted)]">
            {formatNumber(campanha.progressoKg)} / {formatNumber(campanha.metaKg)} kg
          </span>
          <span className="text-[12.5px] font-medium tabular text-[var(--fg)]">
            {Math.round(progresso)}%
          </span>
        </div>
        <ProgressBar
          value={progresso}
          size="md"
          tone={encerrada ? "good" : campanha.status === "pausada" ? "warning" : "accent"}
        />

        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-[var(--border)] pt-4">
          <div>
            <dt className="text-[11px] text-[var(--fg-subtle)]">Participantes</dt>
            <dd className="mt-0.5 flex items-center gap-1.5 text-[13px] font-medium tabular text-[var(--fg)]">
              <Users className="size-3.5 text-[var(--fg-subtle)]" />
              {formatNumber(campanha.participantes)}
            </dd>
          </div>
          <div>
            <dt className="text-[11px] text-[var(--fg-subtle)]">Recompensa</dt>
            <dd className="mt-0.5 text-[13px] font-medium tabular text-[var(--accent)]">
              +{formatNumber(campanha.recompensaPontos)}
            </dd>
          </div>
          <div className="col-span-2">
            <dt className="text-[11px] text-[var(--fg-subtle)]">Período</dt>
            <dd className="mt-0.5 text-[12.5px] tabular text-[var(--fg-muted)]">
              {formatDate(campanha.inicio)} — {formatDate(campanha.fim)} ·{" "}
              {campanha.unidade}
            </dd>
          </div>
        </dl>
      </div>
    </li>
  );
}

/* ------------------------------------------------------------------ */

function CampaignEditor({
  aberto,
  onOpenChange,
  campanha,
  onSalvar,
}: {
  aberto: boolean;
  onOpenChange: (aberto: boolean) => void;
  campanha: Campaign | null;
  onSalvar: (dados: z.output<typeof schema>) => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Formulario, unknown, z.output<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: "",
      descricao: "",
      metaKg: 1000,
      recompensaPontos: 5000,
      unidade: COMPANY.unidades[0],
      inicio: "2026-09-01",
      fim: "2026-12-31",
      status: "ativa",
    },
  });

  React.useEffect(() => {
    if (!aberto) return;
    if (campanha) {
      reset({
        nome: campanha.nome,
        descricao: campanha.descricao,
        metaKg: campanha.metaKg,
        recompensaPontos: campanha.recompensaPontos,
        unidade: campanha.unidade,
        inicio: campanha.inicio.slice(0, 10),
        fim: campanha.fim.slice(0, 10),
        status: campanha.status,
      });
    } else {
      reset({
        nome: "",
        descricao: "",
        metaKg: 1000,
        recompensaPontos: 5000,
        unidade: COMPANY.unidades[0],
        inicio: "2026-09-01",
        fim: "2026-12-31",
        status: "ativa",
      });
    }
  }, [aberto, campanha, reset]);

  const unidade = watch("unidade");
  const status = watch("status");

  return (
    <Dialog open={aberto} onOpenChange={onOpenChange}>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>
            {campanha ? "Editar campanha" : "Nova campanha"}
          </DialogTitle>
          <DialogDescription>
            A campanha é salva localmente e passa a aparecer nos filtros de
            analytics.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSalvar)} noValidate>
          <DialogBody className="space-y-4">
            <Field label="Nome da campanha" htmlFor="cmp-nome" error={errors.nome?.message} required>
              <Input
                id="cmp-nome"
                placeholder="Escritório Zero Waste"
                aria-invalid={Boolean(errors.nome)}
                {...register("nome")}
              />
            </Field>

            <Field
              label="Descrição"
              htmlFor="cmp-descricao"
              error={errors.descricao?.message}
              required
            >
              <Textarea
                id="cmp-descricao"
                placeholder="Explique o objetivo, o que conta como participação e como a recompensa é distribuída."
                aria-invalid={Boolean(errors.descricao)}
                {...register("descricao")}
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Meta de coleta (kg)"
                htmlFor="cmp-meta"
                error={errors.metaKg?.message}
                required
              >
                <Input
                  id="cmp-meta"
                  type="number"
                  min={50}
                  step={50}
                  aria-invalid={Boolean(errors.metaKg)}
                  {...register("metaKg")}
                />
              </Field>

              <Field
                label="Recompensa (EcoPontos)"
                htmlFor="cmp-recompensa"
                error={errors.recompensaPontos?.message}
                required
              >
                <Input
                  id="cmp-recompensa"
                  type="number"
                  min={100}
                  step={100}
                  aria-invalid={Boolean(errors.recompensaPontos)}
                  {...register("recompensaPontos")}
                />
              </Field>

              <Field label="Unidade" error={errors.unidade?.message} required>
                <Select
                  value={unidade}
                  onValueChange={(valor) =>
                    setValue("unidade", valor, { shouldValidate: true })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COMPANY.unidades.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Status" error={errors.status?.message} required>
                <Select
                  value={status}
                  onValueChange={(valor) =>
                    setValue("status", valor as CampaignStatus, {
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(STATUS_ROTULO) as CampaignStatus[]).map((item) => (
                      <SelectItem key={item} value={item}>
                        {STATUS_ROTULO[item]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field
                label="Início"
                htmlFor="cmp-inicio"
                error={errors.inicio?.message}
                required
              >
                <Input
                  id="cmp-inicio"
                  type="date"
                  aria-invalid={Boolean(errors.inicio)}
                  {...register("inicio")}
                />
              </Field>

              <Field label="Término" htmlFor="cmp-fim" error={errors.fim?.message} required>
                <Input
                  id="cmp-fim"
                  type="date"
                  aria-invalid={Boolean(errors.fim)}
                  {...register("fim")}
                />
              </Field>
            </div>

            <p className="text-[12px] leading-relaxed text-[var(--fg-subtle)]">
              Departamentos elegíveis podem ser definidos depois. Por padrão, a
              campanha vale para os {DEPARTMENTS.length} departamentos da unidade
              selecionada.
            </p>
          </DialogBody>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" loading={isSubmitting}>
              {campanha ? "Salvar alterações" : "Criar campanha"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
