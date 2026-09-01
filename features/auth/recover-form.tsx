"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, EnvelopeSimple } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";

const schema = z.object({
  email: z.string().min(1, "Informe o e-mail.").email("Digite um e-mail válido."),
});

type Formulario = z.infer<typeof schema>;

/** Fluxo em dois passos: pedir o e-mail e confirmar o envio. */
export function RecoverForm() {
  const [enviadoPara, setEnviadoPara] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Formulario>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const aoEnviar = handleSubmit(async (dados) => {
    await new Promise((resolve) => setTimeout(resolve, 650));
    setEnviadoPara(dados.email);
  });

  if (enviadoPara) {
    return (
      <div>
        <span className="flex size-12 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
          <EnvelopeSimple className="size-6" weight="duotone" />
        </span>

        <h1 className="mt-6 font-display text-h2 text-[var(--fg)]">
          Instruções enviadas.
        </h1>
        <p className="mt-3 text-[14px] leading-relaxed text-[var(--fg-muted)]">
          Se houvesse uma conta associada a{" "}
          <span className="font-medium text-[var(--fg)]">{enviadoPara}</span>, o
          link de redefinição chegaria em alguns minutos.
        </p>

        <div className="mt-6 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-2)] p-4">
          <p className="text-[12.5px] leading-relaxed text-[var(--fg-muted)]">
            Este é um projeto demonstrativo: nenhum e-mail foi disparado. Para
            entrar, use a senha das contas demo —{" "}
            <span className="font-mono text-[var(--fg)]">EcoDemo@2026</span>.
          </p>
        </div>

        <div className="mt-7 space-y-2.5">
          <Button asChild size="lg" className="w-full">
            <Link href="/login">
              Voltar para o login
              <ArrowRight weight="bold" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="w-full"
            onClick={() => setEnviadoPara(null)}
          >
            Usar outro e-mail
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-h2 text-[var(--fg)]">Recuperar senha</h1>
      <p className="mt-2 text-[14px] leading-relaxed text-[var(--fg-muted)]">
        Informe o e-mail da conta e enviaremos as instruções de redefinição.
      </p>

      <form onSubmit={aoEnviar} noValidate className="mt-8 space-y-4">
        <Field
          label="E-mail da conta"
          htmlFor="email-recuperar"
          error={errors.email?.message}
          required
        >
          <Input
            id="email-recuperar"
            type="email"
            autoComplete="email"
            placeholder="voce@exemplo.com"
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />
        </Field>

        <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
          Enviar instruções
          {!isSubmitting && <ArrowRight weight="bold" />}
        </Button>
      </form>

      <p className="mt-6 text-center text-[13px] text-[var(--fg-muted)]">
        Lembrou a senha?{" "}
        <Link
          href="/login"
          className="font-medium text-[var(--accent)] underline-offset-4 hover:underline"
        >
          Voltar ao login
        </Link>
      </p>
    </div>
  );
}
