"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowRight, CheckCircle, Eye, EyeSlash } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Field, Input, Label } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/controls";
import { useAuthStore } from "@/stores";
import { cn } from "@/lib/utils";

const schema = z
  .object({
    nome: z
      .string()
      .min(3, "Informe seu nome completo.")
      .refine((valor) => valor.trim().split(/\s+/).length >= 2, {
        message: "Informe nome e sobrenome.",
      }),
    email: z.string().min(1, "Informe o e-mail.").email("Digite um e-mail válido."),
    cidade: z.string().min(2, "Informe sua cidade."),
    senha: z
      .string()
      .min(8, "A senha precisa ter ao menos 8 caracteres.")
      .regex(/[a-z]/, "Inclua ao menos uma letra minúscula.")
      .regex(/[A-Z]/, "Inclua ao menos uma letra maiúscula.")
      .regex(/[0-9]/, "Inclua ao menos um número."),
    confirmacao: z.string().min(1, "Repita a senha."),
    termos: z.literal(true, {
      message: "É preciso aceitar os termos para continuar.",
    }),
  })
  .refine((dados) => dados.senha === dados.confirmacao, {
    path: ["confirmacao"],
    message: "As senhas não coincidem.",
  });

type Formulario = z.infer<typeof schema>;

/** Força da senha em quatro faixas, avaliada por critérios explícitos. */
function avaliarSenha(senha: string) {
  const criterios = [
    { id: "tamanho", rotulo: "8 caracteres ou mais", ok: senha.length >= 8 },
    { id: "minuscula", rotulo: "Uma letra minúscula", ok: /[a-z]/.test(senha) },
    { id: "maiuscula", rotulo: "Uma letra maiúscula", ok: /[A-Z]/.test(senha) },
    { id: "numero", rotulo: "Um número", ok: /[0-9]/.test(senha) },
  ];
  const atendidos = criterios.filter((c) => c.ok).length;
  const rotulos = ["Muito fraca", "Fraca", "Razoável", "Boa", "Forte"] as const;
  const tons = [
    "var(--critical)",
    "var(--critical)",
    "var(--warning)",
    "var(--good)",
    "var(--good)",
  ];
  return { criterios, atendidos, rotulo: rotulos[atendidos], tom: tons[atendidos] };
}

export function SignupForm() {
  const router = useRouter();
  const [mostrarSenha, setMostrarSenha] = React.useState(false);
  const [concluido, setConcluido] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Formulario>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: "",
      email: "",
      cidade: "",
      senha: "",
      confirmacao: "",
      termos: false as unknown as true,
    },
  });

  const senha = watch("senha");
  const termos = watch("termos");
  const forca = avaliarSenha(senha ?? "");

  const aoEnviar = handleSubmit(async () => {
    await new Promise((resolve) => setTimeout(resolve, 700));
    setConcluido(true);
    toast.success("Cadastro validado");
  });

  if (concluido) {
    return (
      <div className="text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-[var(--good-soft)] text-[var(--good)]">
          <CheckCircle className="size-6" weight="fill" />
        </span>
        <h1 className="mt-6 font-display text-h2 text-[var(--fg)]">
          Cadastro validado.
        </h1>
        <p className="mx-auto mt-3 max-w-[42ch] text-[14px] leading-relaxed text-[var(--fg-muted)]">
          Este é um projeto demonstrativo: nenhuma conta foi criada e nada foi
          enviado a servidor algum. Para ver o produto funcionando, entre com a
          conta de cidadão.
        </p>

        <div className="mt-8 space-y-2.5">
          <Button
            size="lg"
            className="w-full"
            onClick={() => {
              const destino = useAuthStore.getState().entrarComoDemo("cidadao");
              router.push(destino);
            }}
          >
            Entrar na demonstração
            <ArrowRight weight="bold" />
          </Button>
          <Button asChild variant="ghost" size="lg" className="w-full">
            <Link href="/demo">Ver os três ambientes</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-h2 text-[var(--fg)]">Criar conta</h1>
      <p className="mt-2 text-[14px] leading-relaxed text-[var(--fg-muted)]">
        A validação é real, mas o cadastro é demonstrativo — nada sai do seu
        navegador.
      </p>

      <form onSubmit={aoEnviar} noValidate className="mt-8 space-y-4">
        <Field label="Nome completo" htmlFor="nome" error={errors.nome?.message} required>
          <Input
            id="nome"
            autoComplete="name"
            placeholder="João Silva"
            aria-invalid={Boolean(errors.nome)}
            {...register("nome")}
          />
        </Field>

        <Field label="E-mail" htmlFor="email-cadastro" error={errors.email?.message} required>
          <Input
            id="email-cadastro"
            type="email"
            autoComplete="email"
            placeholder="voce@exemplo.com"
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />
        </Field>

        <Field label="Cidade" htmlFor="cidade" error={errors.cidade?.message} required>
          <Input
            id="cidade"
            autoComplete="address-level2"
            placeholder="São Paulo"
            aria-invalid={Boolean(errors.cidade)}
            {...register("cidade")}
          />
        </Field>

        <Field label="Senha" htmlFor="senha-cadastro" error={errors.senha?.message} required>
          <div className="relative">
            <Input
              id="senha-cadastro"
              type={mostrarSenha ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••"
              className="pr-11"
              aria-invalid={Boolean(errors.senha)}
              aria-describedby="forca-senha"
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

        {senha && (
          <div id="forca-senha" className="-mt-1">
            <div className="flex items-center gap-2">
              <div className="flex flex-1 gap-1">
                {[0, 1, 2, 3].map((indice) => (
                  <span
                    key={indice}
                    className="h-1 flex-1 rounded-full transition-colors"
                    style={{
                      background:
                        indice < forca.atendidos ? forca.tom : "var(--surface-3)",
                    }}
                  />
                ))}
              </div>
              <span
                className="shrink-0 text-[11.5px] font-medium"
                style={{ color: forca.tom }}
              >
                {forca.rotulo}
              </span>
            </div>
            <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1">
              {forca.criterios.map((criterio) => (
                <li
                  key={criterio.id}
                  className={cn(
                    "flex items-center gap-1.5 text-[11.5px]",
                    criterio.ok ? "text-[var(--good)]" : "text-[var(--fg-subtle)]",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "size-1.5 rounded-full",
                      criterio.ok ? "bg-[var(--good)]" : "bg-[var(--border-strong)]",
                    )}
                  />
                  {criterio.rotulo}
                </li>
              ))}
            </ul>
          </div>
        )}

        <Field
          label="Confirmar senha"
          htmlFor="confirmacao"
          error={errors.confirmacao?.message}
          required
        >
          <Input
            id="confirmacao"
            type={mostrarSenha ? "text" : "password"}
            autoComplete="new-password"
            placeholder="••••••••"
            aria-invalid={Boolean(errors.confirmacao)}
            {...register("confirmacao")}
          />
        </Field>

        <div className="pt-1">
          <div className="flex items-start gap-2.5">
            <Checkbox
              id="termos"
              checked={Boolean(termos)}
              onCheckedChange={(marcado) =>
                setValue("termos", marcado === true ? true : (false as unknown as true), {
                  shouldValidate: true,
                })
              }
              aria-invalid={Boolean(errors.termos)}
              className="mt-0.5"
            />
            <Label htmlFor="termos" className="leading-relaxed">
              Li e aceito os termos de uso e a política de privacidade do projeto
              demonstrativo.
            </Label>
          </div>
          {errors.termos && (
            <p role="alert" className="mt-1.5 text-[12px] text-[var(--critical)]">
              {errors.termos.message}
            </p>
          )}
        </div>

        <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
          Criar conta
          {!isSubmitting && <ArrowRight weight="bold" />}
        </Button>
      </form>

      <p className="mt-6 text-center text-[13px] text-[var(--fg-muted)]">
        Já tem conta?{" "}
        <Link
          href="/login"
          className="font-medium text-[var(--accent)] underline-offset-4 hover:underline"
        >
          Entrar
        </Link>
      </p>
    </div>
  );
}
