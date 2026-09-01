"use client";

import { useTheme } from "next-themes";
import { toast } from "sonner";
import { ArrowCounterClockwise, Monitor, Moon, Sun } from "@phosphor-icons/react";
import { AppShell, PageContainer, PageHeader } from "@/components/layout/app-shell";
import { DemoGuard } from "@/components/layout/demo-guard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/field";
import { Switch } from "@/components/ui/controls";
import { Separator } from "@/components/ui/data-display";
import { Segmented } from "@/components/ui/tabs";
import { DEMO_ACCOUNTS, ENVIRONMENT_LABEL } from "@/lib/demo-accounts";
import { restaurarDemonstracao, useAuthStore, usePreferencesStore } from "@/stores";
import { useHydrated } from "@/hooks/use-hydrated";
import type { Environment } from "@/types";

/**
 * Configurações gerais, acessíveis de qualquer ambiente.
 * A casca herda o ambiente da sessão para que o acento permaneça coerente.
 */
export default function ConfiguracoesPage() {
  const hydrated = useHydrated();
  const environment = useAuthStore((s) => s.environment);
  const ambiente: Environment = environment ?? "cidadao";

  return (
    <DemoGuard environment={ambiente}>
      <AppShell environment={ambiente} titulo="Configurações">
        <PageContainer>
          <PageHeader
            eyebrow="Preferências"
            titulo="Configurações"
            descricao="Ajustes de aparência, notificações e controle da demonstração. Tudo fica salvo apenas neste navegador."
          />

          <div className="max-w-2xl space-y-10">
            <AppearanceSection />
            <NotificationsSection />
            <DemoSection ambiente={ambiente} hydrated={hydrated} />
          </div>
        </PageContainer>
      </AppShell>
    </DemoGuard>
  );
}

function AppearanceSection() {
  const { theme, setTheme } = useTheme();
  const hydrated = useHydrated();
  const densidade = usePreferencesStore((s) => s.densidade);
  const sidebarRecolhida = usePreferencesStore((s) => s.sidebarRecolhida);
  const definir = usePreferencesStore((s) => s.definir);

  return (
    <section>
      <h2 className="font-display text-h3 text-[var(--fg)]">Aparência</h2>
      <p className="mt-1.5 text-[13px] text-[var(--fg-muted)]">
        O tema escuro tem paleta própria — superfícies, gráficos e mapas foram
        ajustados para ele, não apenas invertidos.
      </p>

      <div className="mt-5 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Label className="text-[13.5px] text-[var(--fg)]">Tema</Label>
            <p className="mt-1 text-[12.5px] text-[var(--fg-muted)]">
              A preferência acompanha o sistema por padrão.
            </p>
          </div>
          <Segmented
            ariaLabel="Escolher tema"
            options={[
              { value: "light", label: "Claro", icon: <Sun className="size-3.5" /> },
              { value: "dark", label: "Escuro", icon: <Moon className="size-3.5" /> },
              { value: "system", label: "Sistema", icon: <Monitor className="size-3.5" /> },
            ]}
            value={hydrated ? (theme ?? "system") : "system"}
            onChange={setTheme}
          />
        </div>

        <Separator />

        <div className="flex items-start justify-between gap-6">
          <div>
            <Label htmlFor="cfg-densidade" className="text-[13.5px] text-[var(--fg)]">
              Interface compacta
            </Label>
            <p className="mt-1 text-[12.5px] text-[var(--fg-muted)]">
              Reduz o espaçamento em listas e tabelas.
            </p>
          </div>
          <Switch
            id="cfg-densidade"
            checked={hydrated && densidade === "compacta"}
            onCheckedChange={(valor) =>
              definir("densidade", valor ? "compacta" : "confortavel")
            }
          />
        </div>

        <div className="flex items-start justify-between gap-6">
          <div>
            <Label htmlFor="cfg-sidebar" className="text-[13.5px] text-[var(--fg)]">
              Menu lateral recolhido
            </Label>
            <p className="mt-1 text-[12.5px] text-[var(--fg-muted)]">
              Mostra apenas os ícones, com o rótulo no foco ou no hover.
            </p>
          </div>
          <Switch
            id="cfg-sidebar"
            checked={hydrated && sidebarRecolhida}
            onCheckedChange={(valor) => definir("sidebarRecolhida", valor)}
          />
        </div>
      </div>
    </section>
  );
}

function NotificationsSection() {
  const hydrated = useHydrated();
  const emailNotificacoes = usePreferencesStore((s) => s.emailNotificacoes);
  const pushNotificacoes = usePreferencesStore((s) => s.pushNotificacoes);
  const resumoSemanal = usePreferencesStore((s) => s.resumoSemanal);
  const definir = usePreferencesStore((s) => s.definir);

  const itens = [
    {
      id: "cfg-email",
      titulo: "E-mail",
      descricao: "Resumo de pontos creditados, resgates e conquistas.",
      valor: emailNotificacoes,
      chave: "emailNotificacoes" as const,
    },
    {
      id: "cfg-push",
      titulo: "Notificações push",
      descricao: "Avisos imediatos quando um descarte é validado.",
      valor: pushNotificacoes,
      chave: "pushNotificacoes" as const,
    },
    {
      id: "cfg-resumo",
      titulo: "Resumo semanal",
      descricao: "Panorama do impacto toda segunda-feira.",
      valor: resumoSemanal,
      chave: "resumoSemanal" as const,
    },
  ];

  return (
    <section>
      <h2 className="font-display text-h3 text-[var(--fg)]">Notificações</h2>
      <div className="mt-5 space-y-5">
        {itens.map((item) => (
          <div key={item.id} className="flex items-start justify-between gap-6">
            <div>
              <Label htmlFor={item.id} className="text-[13.5px] text-[var(--fg)]">
                {item.titulo}
              </Label>
              <p className="mt-1 text-[12.5px] text-[var(--fg-muted)]">
                {item.descricao}
              </p>
            </div>
            <Switch
              id={item.id}
              checked={hydrated && item.valor}
              onCheckedChange={(valor) => definir(item.chave, valor)}
            />
          </div>
        ))}
      </div>
      <p className="mt-4 text-[12px] leading-relaxed text-[var(--fg-subtle)]">
        Nenhuma mensagem é realmente enviada: não há serviço de e-mail nem push
        nesta demonstração.
      </p>
    </section>
  );
}

function DemoSection({
  ambiente,
  hydrated,
}: {
  ambiente: Environment;
  hydrated: boolean;
}) {
  const conta = DEMO_ACCOUNTS[ambiente];

  const restaurar = () => {
    restaurarDemonstracao();
    toast.success("Demonstração restaurada", {
      description:
        "EcoPontos, resgates, desafios, notificações e campanhas voltaram ao estado inicial.",
    });
  };

  return (
    <section>
      <h2 className="font-display text-h3 text-[var(--fg)]">Demonstração</h2>

      <dl className="mt-5 space-y-px overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--border)]">
        <div className="flex items-center justify-between gap-4 bg-[var(--surface)] px-4 py-3">
          <dt className="text-[12.5px] text-[var(--fg-muted)]">Ambiente atual</dt>
          <dd className="text-[13px] font-medium text-[var(--fg)]">
            {hydrated ? ENVIRONMENT_LABEL[ambiente] : "—"}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-4 bg-[var(--surface)] px-4 py-3">
          <dt className="text-[12.5px] text-[var(--fg-muted)]">Conta</dt>
          <dd className="truncate font-mono text-[12.5px] text-[var(--fg)]">
            {conta.email}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-4 bg-[var(--surface)] px-4 py-3">
          <dt className="text-[12.5px] text-[var(--fg-muted)]">Persistência</dt>
          <dd className="text-[13px] font-medium text-[var(--fg)]">
            Local, neste navegador
          </dd>
        </div>
      </dl>

      <p className="mt-4 max-w-[58ch] text-[13px] leading-relaxed text-[var(--fg-muted)]">
        Restaurar desfaz tudo o que foi alterado na sessão: saldo, vouchers,
        progresso dos desafios, medalhas simuladas, notificações lidas e campanhas
        criadas.
      </p>

      <Button variant="secondary" className="mt-4" onClick={restaurar}>
        <ArrowCounterClockwise weight="bold" />
        Restaurar dados demo
      </Button>
    </section>
  );
}
