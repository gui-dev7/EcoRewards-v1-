"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle, PaperPlaneTilt } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/controls";

const TIPOS = [
  { valor: "produto", rotulo: "Dúvida sobre o produto" },
  { valor: "empresa", rotulo: "Quero levar para minha empresa" },
  { valor: "publico", rotulo: "Sou do poder público" },
  { valor: "parceria", rotulo: "Proposta de parceria" },
  { valor: "imprensa", rotulo: "Imprensa" },
  { valor: "outro", rotulo: "Outro assunto" },
];

const schema = z.object({
  nome: z.string().min(3, "Informe seu nome."),
  email: z.string().min(1, "Informe o e-mail.").email("Digite um e-mail válido."),
  tipo: z.string().min(1, "Escolha o tipo de contato."),
  assunto: z.string().min(4, "Escreva um assunto com ao menos 4 caracteres."),
  mensagem: z
    .string()
    .min(20, "Detalhe um pouco mais — pelo menos 20 caracteres.")
    .max(1500, "Máximo de 1.500 caracteres."),
});

type Formulario = z.infer<typeof schema>;

export function ContactForm() {
  const [enviado, setEnviado] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Formulario>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: "",
      email: "",
      tipo: "produto",
      assunto: "",
      mensagem: "",
    },
  });

  const tipo = watch("tipo");

  const aoEnviar = handleSubmit(async () => {
    await new Promise((resolve) => setTimeout(resolve, 900));
    setEnviado(true);
  });

  if (enviado) {
    return (
      <div className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-[var(--good-soft)] text-[var(--good)]">
          <CheckCircle className="size-6" weight="fill" />
        </span>
        <h2 className="mt-6 font-display text-h3 text-[var(--fg)]">
          Mensagem validada.
        </h2>
        <p className="mx-auto mt-3 max-w-[46ch] text-[13.5px] leading-relaxed text-[var(--fg-muted)]">
          Em produção, sua mensagem seguiria para o time responsável pelo assunto
          selecionado. Nesta demonstração nada foi enviado — o formulário apenas
          validou os campos no navegador.
        </p>
        <Button
          variant="secondary"
          className="mt-6"
          onClick={() => {
            reset();
            setEnviado(false);
          }}
        >
          Enviar outra mensagem
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={aoEnviar}
      noValidate
      className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-6 lg:p-8"
    >
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nome" htmlFor="ct-nome" error={errors.nome?.message} required>
            <Input
              id="ct-nome"
              autoComplete="name"
              placeholder="Seu nome"
              aria-invalid={Boolean(errors.nome)}
              {...register("nome")}
            />
          </Field>

          <Field label="E-mail" htmlFor="ct-email" error={errors.email?.message} required>
            <Input
              id="ct-email"
              type="email"
              autoComplete="email"
              placeholder="voce@exemplo.com"
              aria-invalid={Boolean(errors.email)}
              {...register("email")}
            />
          </Field>
        </div>

        <Field label="Tipo de contato" error={errors.tipo?.message} required>
          <Select
            value={tipo}
            onValueChange={(valor) => setValue("tipo", valor, { shouldValidate: true })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIPOS.map((item) => (
                <SelectItem key={item.valor} value={item.valor}>
                  {item.rotulo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Assunto" htmlFor="ct-assunto" error={errors.assunto?.message} required>
          <Input
            id="ct-assunto"
            placeholder="Resuma o motivo do contato"
            aria-invalid={Boolean(errors.assunto)}
            {...register("assunto")}
          />
        </Field>

        <Field
          label="Mensagem"
          htmlFor="ct-mensagem"
          error={errors.mensagem?.message}
          hint="mínimo 20 caracteres"
          required
        >
          <Textarea
            id="ct-mensagem"
            placeholder="Escreva sua mensagem com o máximo de contexto possível."
            aria-invalid={Boolean(errors.mensagem)}
            {...register("mensagem")}
          />
        </Field>
      </div>

      <Button type="submit" size="lg" className="mt-6 w-full" loading={isSubmitting}>
        {!isSubmitting && <PaperPlaneTilt weight="bold" />}
        Enviar mensagem
      </Button>

      <p className="mt-4 text-[11.5px] leading-relaxed text-[var(--fg-subtle)]">
        Formulário demonstrativo. Nenhuma mensagem é transmitida ou armazenada.
      </p>
    </form>
  );
}
