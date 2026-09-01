"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowRight, Eye, EyeSlash, Sparkle } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { ENVIRONMENT_ICON } from "@/components/layout/nav-config";
import { DEMO_ACCOUNTS, DEMO_ACCOUNT_LIST } from "@/lib/demo-accounts";
import { useAuthStore } from "@/stores";
import type { Environment } from "@/types";

const schema = z.object({
  email: z
    .string()
    .min(1, "Informe o e-mail.")
    .email("Digite um e-mail válido."),
  senha: z.string().min(8, "A senha precisa ter ao menos 8 caracteres."),
});

type Formulario = z.infer<typeof schema>;

export function LoginForm() {
  const router = useRouter();
  const [mostrarSenha, setMostrarSenha] = React.useState(false);
  const [erroGeral, setErroGeral] = React.useState<string | null>(null);
  const [entrando, setEntrando] = React.useState<Environment | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Formulario>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", senha: "" },
  });

  const entrarDemo = (environment: Environment) => {
    setEntrando(environment);
    const destino = useAuthStore.getState().entrarComoDemo(environment);
    toast.success(`Entrando como ${DEMO_ACCOUNTS[environment].nome}`);
    router.push(destino);
  };

  const preencher = (environment: Environment) => {
    const conta = DEMO_ACCOUNTS[environment];
    setValue("email", conta.email, { shouldValidate: true });
    setValue("senha", conta.senha, { shouldValidate: true });
    setErroGeral(null);
    toast.info("Credenciais preenchidas", {
      description: `Conta ${conta.nome}. Agora é só entrar.`,
    });
  };

  const aoEnviar = handleSubmit(async (dados) => {
    setErroGeral(null);
    // Pequena espera para que o estado de carregamento seja perceptível.
    await new Promise((resolve) => setTimeout(resolve, 450));

    const resultado = useAuthStore
      .getState()
      .entrarComCredenciais(dados.email, dados.senha);

    if (!resultado.ok) {
      setErroGeral(resultado.erro);
      toast.error("Não foi possível entrar", { description: resultado.erro });
      return;
    }

    toast.success("Bem-vindo de volta");
    router.push(resultado.destino);
  });

  return (
    <div>
      <h1 className="font-display text-h2 text-[var(--fg)]">Entrar</h1>
      <p className="mt-2 text-[14px] leading-relaxed text-[var(--fg-muted)]">
        Use uma das contas demonstrativas ou entre direto em um dos ambientes.
      </p>

      {/* Atalho principal da demonstração */}
      <section
        aria-labelledby="explorar-demo"
        className="mt-8 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-4"
      >
        <div className="flex items-center gap-2">
          <Sparkle className="size-4 text-[var(--accent)]" weight="fill" />
          <h2
            id="explorar-demo"
            className="text-[13px] font-semibold text-[var(--fg)]"
          >
            Explorar demonstração
          </h2>
        </div>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-[var(--fg-muted)]">
          Entra direto no ambiente escolhido, sem preencher nada.
        </p>

        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {DEMO_ACCOUNT_LIST.map((conta) => {
            const Icon = ENVIRONMENT_ICON[conta.environment];
            return (
              <button
                key={conta.environment}
                type="button"
                data-env={conta.environment}
                onClick={() => entrarDemo(conta.environment)}
                disabled={entrando !== null}
                className="flex flex-col items-center gap-2 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg)] px-3 py-3.5 transition-colors hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] disabled:opacity-50"
              >
                <Icon className="size-5 text-[var(--accent)]" weight="duotone" />
                <span className="text-[12.5px] font-medium text-[var(--fg)]">
                  {conta.environment === "cidadao"
                    ? "Cidadão"
                    : conta.environment === "empresa"
                      ? "Empresa"
                      : "Governo"}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <div className="my-7 flex items-center gap-3">
        <span className="h-px flex-1 bg-[var(--border)]" />
        <span className="text-[11.5px] uppercase tracking-[0.1em] text-[var(--fg-subtle)]">
          ou use as credenciais
        </span>
        <span className="h-px flex-1 bg-[var(--border)]" />
      </div>

      <form onSubmit={aoEnviar} noValidate className="space-y-4">
        <Field label="E-mail" htmlFor="email" error={errors.email?.message} required>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="cidadao.demo@ecorewards.app"
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />
        </Field>

        <Field label="Senha" htmlFor="senha" error={errors.senha?.message} required>
          <div className="relative">
            <Input
              id="senha"
              type={mostrarSenha ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              className="pr-11"
              aria-invalid={Boolean(errors.senha)}
              {...register("senha")}
            />
            <button
              type="button"
              onClick={() => setMostrarSenha((atual) => !atual)}
              aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-[var(--radius-xs)] p-1.5 text-[var(--fg-subtle)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--fg)]"
            >
              {mostrarSenha ? <EyeSlash className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </Field>

        {erroGeral && (
          <p
            role="alert"
            className="rounded-[var(--radius-sm)] border border-[var(--critical)]/30 bg-[var(--critical-soft)] px-3 py-2.5 text-[12.5px] text-[var(--critical)]"
          >
            {erroGeral}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <PreencherCredenciais onEscolher={preencher} />
          <Link
            href="/recuperar-senha"
            className="text-[12.5px] text-[var(--fg-muted)] transition-colors hover:text-[var(--accent)]"
          >
            Esqueci minha senha
          </Link>
        </div>

        <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
          Entrar
          {!isSubmitting && <ArrowRight weight="bold" />}
        </Button>
      </form>

      <p className="mt-6 text-center text-[13px] text-[var(--fg-muted)]">
        Ainda não tem conta?{" "}
        <Link
          href="/cadastro"
          className="font-medium text-[var(--accent)] underline-offset-4 hover:underline"
        >
          Criar conta
        </Link>
      </p>
    </div>
  );
}

function PreencherCredenciais({
  onEscolher,
}: {
  onEscolher: (environment: Environment) => void;
}) {
  const [aberto, setAberto] = React.useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setAberto((atual) => !atual)}
        aria-expanded={aberto}
        className="text-[12.5px] font-medium text-[var(--accent)] underline-offset-4 hover:underline"
      >
        Preencher credenciais
      </button>

      {aberto && (
        <div className="absolute bottom-full left-0 z-10 mb-2 w-56 overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-1 shadow-[var(--shadow-lg)]">
          {DEMO_ACCOUNT_LIST.map((conta) => {
            const Icon = ENVIRONMENT_ICON[conta.environment];
            return (
              <button
                key={conta.environment}
                type="button"
                onClick={() => {
                  onEscolher(conta.environment);
                  setAberto(false);
                }}
                className="flex w-full items-center gap-2.5 rounded-[var(--radius-xs)] px-2.5 py-2 text-left text-[13px] text-[var(--fg)] transition-colors hover:bg-[var(--surface-2)]"
              >
                <Icon className="size-4 text-[var(--fg-subtle)]" />
                <span className="min-w-0 flex-1 truncate">{conta.nome}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
