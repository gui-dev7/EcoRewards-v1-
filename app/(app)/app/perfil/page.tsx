"use client";

import * as React from "react";
import { toast } from "sonner";
import { ArrowCounterClockwise, Check, ShieldCheck } from "@phosphor-icons/react";
import { PageContainer } from "@/components/layout/app-shell";
import { Avatar, ProgressBar, Separator } from "@/components/ui/data-display";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Field, Input, Label } from "@/components/ui/field";
import { Switch } from "@/components/ui/controls";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImpactPassport } from "@/features/citizen/impact-passport";
import { restaurarDemonstracao, usePreferencesStore, useWalletStore } from "@/stores";
import { useHydrated } from "@/hooks/use-hydrated";
import { calculateEcoLevel, impactEquivalences } from "@/lib/eco";
import { formatDate, formatNumber } from "@/lib/format";
import { CITIZEN, CITIZEN_MATERIAL_SPLIT } from "@/mocks/citizen";
import { MATERIAL_BY_ID } from "@/mocks/materials";

export default function PerfilPage() {
  const hydrated = useHydrated();
  const xp = useWalletStore((s) => s.xp);
  const nivel = calculateEcoLevel(hydrated ? xp : CITIZEN.xp);

  return (
    <PageContainer>
      <div className="mb-7 flex flex-wrap items-center gap-5 border-b border-[var(--border)] pb-7">
        <Avatar iniciais={CITIZEN.avatarIniciais} size="xl" />
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-h2 text-[var(--fg)]">{CITIZEN.nome}</h1>
          <p className="mt-1.5 text-[13.5px] text-[var(--fg-muted)]">
            {CITIZEN.email}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge tone="accent">{nivel.atual.nome}</Badge>
            <Badge tone="neutral">
              {CITIZEN.cidade}, {CITIZEN.estado}
            </Badge>
            <Badge tone="neutral">
              Membro desde {formatDate(CITIZEN.membroDesde, "mes")}
            </Badge>
          </div>
        </div>
      </div>

      <Tabs defaultValue="conta">
        <TabsList className="fade-edges-x overflow-x-auto no-scrollbar">
          {[
            { value: "conta", label: "Minha conta" },
            { value: "impacto", label: "Impacto" },
            { value: "seguranca", label: "Segurança" },
            { value: "preferencias", label: "Preferências" },
            { value: "notificacoes", label: "Notificações" },
          ].map((aba) => (
            <TabsTrigger
              key={aba.value}
              value={aba.value}
              layoutId="perfil-tab"
              className="shrink-0"
            >
              {aba.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="conta" className="pt-8">
          <AccountTab />
        </TabsContent>
        <TabsContent value="impacto" className="pt-8">
          <ImpactTab />
        </TabsContent>
        <TabsContent value="seguranca" className="pt-8">
          <SecurityTab />
        </TabsContent>
        <TabsContent value="preferencias" className="pt-8">
          <PreferencesTab />
        </TabsContent>
        <TabsContent value="notificacoes" className="pt-8">
          <NotificationsTab />
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}

/* ------------------------------------------------------------------ */

function AccountTab() {
  const [salvo, setSalvo] = React.useState(false);

  const salvar = (evento: React.FormEvent) => {
    evento.preventDefault();
    setSalvo(true);
    toast.success("Dados atualizados", {
      description: "As alterações ficam salvas apenas neste navegador.",
    });
    window.setTimeout(() => setSalvo(false), 2200);
  };

  return (
    <form onSubmit={salvar} className="max-w-2xl space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nome completo" htmlFor="perfil-nome">
          <Input id="perfil-nome" defaultValue={CITIZEN.nome} />
        </Field>
        <Field label="E-mail" htmlFor="perfil-email">
          <Input id="perfil-email" type="email" defaultValue={CITIZEN.email} />
        </Field>
        <Field label="Cidade" htmlFor="perfil-cidade">
          <Input id="perfil-cidade" defaultValue={CITIZEN.cidade} />
        </Field>
        <Field label="Estado" htmlFor="perfil-estado">
          <Input id="perfil-estado" defaultValue={CITIZEN.estado} />
        </Field>
      </div>

      <Separator />

      <div className="flex items-center gap-3">
        <Button type="submit">
          {salvo ? (
            <>
              <Check weight="bold" />
              Salvo
            </>
          ) : (
            "Salvar alterações"
          )}
        </Button>
        <p className="text-[12px] text-[var(--fg-subtle)]">
          Conta demonstrativa — nada é enviado a servidores.
        </p>
      </div>
    </form>
  );
}

function ImpactTab() {
  const hydrated = useHydrated();
  const kg = useWalletStore((s) => s.kgReciclados);
  const co2 = useWalletStore((s) => s.co2EvitadoKg);
  const descartes = useWalletStore((s) => s.descartes);

  const valores = {
    kg: hydrated ? kg : CITIZEN.kgReciclados,
    co2: hydrated ? co2 : CITIZEN.co2EvitadoKg,
    descartes: hydrated ? descartes : CITIZEN.descartes,
  };

  const totalKg = CITIZEN_MATERIAL_SPLIT.reduce((soma, item) => soma + item.kg, 0);

  return (
    <div className="space-y-10">
      <ImpactPassport />

      <section>
        <h2 className="font-display text-h3 text-[var(--fg)]">
          Detalhamento por material
        </h2>
        <p className="mt-1.5 text-[13px] text-[var(--fg-muted)]">
          {formatNumber(valores.kg, 1)} kg em {valores.descartes} descartes validados.
        </p>

        <ul className="mt-5 space-y-3">
          {CITIZEN_MATERIAL_SPLIT.map((item) => {
            const material = MATERIAL_BY_ID[item.materialId];
            return (
              <li key={item.materialId}>
                <div className="mb-1.5 flex items-baseline justify-between gap-3">
                  <span className="flex items-center gap-2 text-[13px] text-[var(--fg)]">
                    <span
                      aria-hidden
                      className="size-2 rounded-[2px]"
                      style={{ background: material.cor }}
                    />
                    {material.nome}
                  </span>
                  <span className="text-[12.5px] tabular text-[var(--fg-muted)]">
                    {formatNumber(item.kg, 1)} kg · {item.descartes} descartes
                  </span>
                </div>
                <ProgressBar value={item.kg} max={totalKg} size="sm" />
              </li>
            );
          })}
        </ul>
      </section>

      <section>
        <h2 className="font-display text-h3 text-[var(--fg)]">
          Equivalências de {formatNumber(valores.co2)} kg de CO2
        </h2>
        <ul className="mt-5 grid gap-6 sm:grid-cols-3">
          {impactEquivalences(valores.co2).map((item) => (
            <li key={item.id} className="border-t border-[var(--border)] pt-4">
              <p className="font-display text-[28px] font-semibold tabular tracking-[-0.03em] text-[var(--fg)]">
                {formatNumber(item.valor)}
                <span className="ml-1.5 text-[15px] font-medium text-[var(--fg-muted)]">
                  {item.unidade}
                </span>
              </p>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-[var(--fg-muted)]">
                {item.descricao}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function SecurityTab() {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex gap-3 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-2)] p-4">
        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-[var(--accent)]" weight="duotone" />
        <div>
          <p className="text-[13.5px] font-medium text-[var(--fg)]">
            Esta demonstração não tem autenticação real
          </p>
          <p className="mt-1 text-[12.5px] leading-relaxed text-[var(--fg-muted)]">
            Não existe back-end, banco de dados nem senha armazenada. Os campos
            abaixo mostram como a tela funcionaria em produção, mas nenhuma
            alteração sai do seu navegador.
          </p>
        </div>
      </div>

      <div className="space-y-5">
        <Field label="Senha atual" htmlFor="senha-atual">
          <Input id="senha-atual" type="password" placeholder="••••••••" disabled />
        </Field>
        <Field label="Nova senha" htmlFor="senha-nova">
          <Input id="senha-nova" type="password" placeholder="••••••••" disabled />
        </Field>
        <Button disabled>Alterar senha</Button>
      </div>

      <Separator />

      <div>
        <h3 className="text-[14px] font-medium text-[var(--fg)]">
          Sessões ativas
        </h3>
        <ul className="mt-3 space-y-px overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--border)]">
          {[
            { dispositivo: "Este navegador", local: "São Paulo, BR", atual: true },
          ].map((sessao) => (
            <li
              key={sessao.dispositivo}
              className="flex items-center justify-between gap-4 bg-[var(--surface)] px-4 py-3"
            >
              <div>
                <p className="text-[13px] font-medium text-[var(--fg)]">
                  {sessao.dispositivo}
                </p>
                <p className="mt-0.5 text-[11.5px] text-[var(--fg-subtle)]">
                  {sessao.local}
                </p>
              </div>
              {sessao.atual && <Badge tone="good">Sessão atual</Badge>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function PreferencesTab() {
  const hydrated = useHydrated();
  const densidade = usePreferencesStore((s) => s.densidade);
  const perfilPublico = usePreferencesStore((s) => s.perfilPublico);
  const mostrarNoRanking = usePreferencesStore((s) => s.mostrarNoRanking);
  const definir = usePreferencesStore((s) => s.definir);

  const restaurar = () => {
    restaurarDemonstracao();
    toast.success("Demonstração restaurada", {
      description: "Pontos, resgates, desafios e notificações voltaram ao início.",
    });
  };

  return (
    <div className="max-w-2xl space-y-8">
      <section>
        <h2 className="font-display text-h4 text-[var(--fg)]">Exibição</h2>
        <div className="mt-4 space-y-px overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--border)]">
          <ToggleRow
            id="pref-densidade"
            titulo="Interface compacta"
            descricao="Reduz o espaçamento das listas e tabelas."
            marcado={hydrated && densidade === "compacta"}
            onChange={(valor) => definir("densidade", valor ? "compacta" : "confortavel")}
          />
        </div>
      </section>

      <section>
        <h2 className="font-display text-h4 text-[var(--fg)]">Privacidade</h2>
        <div className="mt-4 space-y-px overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--border)]">
          <ToggleRow
            id="pref-publico"
            titulo="Perfil público"
            descricao="Permite que outros participantes vejam seu nome e nível."
            marcado={hydrated && perfilPublico}
            onChange={(valor) => definir("perfilPublico", valor)}
          />
          <ToggleRow
            id="pref-ranking"
            titulo="Aparecer no ranking"
            descricao="Sua posição continua sendo calculada, mas fica oculta para os demais."
            marcado={hydrated && mostrarNoRanking}
            onChange={(valor) => definir("mostrarNoRanking", valor)}
          />
        </div>
      </section>

      <Separator />

      <section>
        <h2 className="font-display text-h4 text-[var(--fg)]">Demonstração</h2>
        <p className="mt-2 max-w-[56ch] text-[13px] leading-relaxed text-[var(--fg-muted)]">
          Restaurar devolve o saldo a {formatNumber(CITIZEN.ecoPontos)} EcoPontos,
          remove os vouchers gerados, reverte o progresso dos desafios e faz as
          notificações voltarem a aparecer como não lidas.
        </p>
        <Button variant="secondary" className="mt-4" onClick={restaurar}>
          <ArrowCounterClockwise weight="bold" />
          Restaurar dados demo
        </Button>
      </section>
    </div>
  );
}

function NotificationsTab() {
  const hydrated = useHydrated();
  const emailNotificacoes = usePreferencesStore((s) => s.emailNotificacoes);
  const pushNotificacoes = usePreferencesStore((s) => s.pushNotificacoes);
  const resumoSemanal = usePreferencesStore((s) => s.resumoSemanal);
  const definir = usePreferencesStore((s) => s.definir);

  return (
    <div className="max-w-2xl">
      <h2 className="font-display text-h4 text-[var(--fg)]">Como quer ser avisado</h2>
      <div className="mt-4 space-y-px overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--border)]">
        <ToggleRow
          id="notif-email"
          titulo="E-mail"
          descricao="Resumo de pontos creditados, resgates e conquistas."
          marcado={hydrated && emailNotificacoes}
          onChange={(valor) => definir("emailNotificacoes", valor)}
        />
        <ToggleRow
          id="notif-push"
          titulo="Notificações push"
          descricao="Avisos imediatos quando um descarte é validado."
          marcado={hydrated && pushNotificacoes}
          onChange={(valor) => definir("pushNotificacoes", valor)}
        />
        <ToggleRow
          id="notif-resumo"
          titulo="Resumo semanal"
          descricao="Um panorama do seu impacto toda segunda-feira."
          marcado={hydrated && resumoSemanal}
          onChange={(valor) => definir("resumoSemanal", valor)}
        />
      </div>

      <p className="mt-4 text-[12px] leading-relaxed text-[var(--fg-subtle)]">
        As preferências ficam salvas neste navegador. Nenhuma mensagem é enviada —
        não há serviço de e-mail ou push nesta demonstração.
      </p>
    </div>
  );
}

function ToggleRow({
  id,
  titulo,
  descricao,
  marcado,
  onChange,
}: {
  id: string;
  titulo: string;
  descricao: string;
  marcado: boolean;
  onChange: (valor: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-6 bg-[var(--surface)] px-4 py-4">
      <div className="min-w-0">
        <Label htmlFor={id} className="text-[13.5px] text-[var(--fg)]">
          {titulo}
        </Label>
        <p className="mt-1 text-[12.5px] leading-relaxed text-[var(--fg-muted)]">
          {descricao}
        </p>
      </div>
      <Switch
        id={id}
        checked={marcado}
        onCheckedChange={onChange}
        className="mt-0.5 shrink-0"
      />
    </div>
  );
}
