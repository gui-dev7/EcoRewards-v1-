"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle, Paperclip, X } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";

const TAMANHO_MAXIMO = 5 * 1024 * 1024;
const TIPOS_ACEITOS = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const schema = z.object({
  nome: z
    .string()
    .min(3, "Informe seu nome completo.")
    .refine((valor) => valor.trim().split(/\s+/).length >= 2, {
      message: "Informe nome e sobrenome.",
    }),
  email: z.string().min(1, "Informe o e-mail.").email("Digite um e-mail válido."),
  linkedin: z
    .string()
    .min(1, "Informe seu perfil no LinkedIn.")
    .refine((valor) => valor.includes("linkedin.com"), {
      message: "Cole a URL completa do seu perfil no LinkedIn.",
    }),
  github: z
    .string()
    .optional()
    .refine((valor) => !valor || valor.includes("github.com"), {
      message: "Cole a URL completa do seu perfil no GitHub.",
    }),
  apresentacao: z
    .string()
    .min(80, "Conte um pouco mais — pelo menos 80 caracteres.")
    .max(2000, "Máximo de 2.000 caracteres."),
});

type Formulario = z.infer<typeof schema>;

/**
 * Candidatura demonstrativa. O currículo é validado no navegador
 * (tipo e tamanho) e nunca sai do dispositivo — não há upload.
 */
export function ApplicationForm({ vaga }: { vaga: string }) {
  const [arquivo, setArquivo] = React.useState<File | null>(null);
  const [erroArquivo, setErroArquivo] = React.useState<string | null>(null);
  const [enviado, setEnviado] = React.useState(false);
  const inputArquivoRef = React.useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Formulario>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: "",
      email: "",
      linkedin: "",
      github: "",
      apresentacao: "",
    },
  });

  const selecionarArquivo = (evento: React.ChangeEvent<HTMLInputElement>) => {
    const selecionado = evento.target.files?.[0];
    setErroArquivo(null);

    if (!selecionado) {
      setArquivo(null);
      return;
    }

    if (!TIPOS_ACEITOS.includes(selecionado.type)) {
      setErroArquivo("Envie um arquivo PDF, DOC ou DOCX.");
      setArquivo(null);
      return;
    }

    if (selecionado.size > TAMANHO_MAXIMO) {
      setErroArquivo("O arquivo precisa ter no máximo 5 MB.");
      setArquivo(null);
      return;
    }

    setArquivo(selecionado);
  };

  const removerArquivo = () => {
    setArquivo(null);
    setErroArquivo(null);
    if (inputArquivoRef.current) inputArquivoRef.current.value = "";
  };

  const aoEnviar = handleSubmit(async () => {
    if (!arquivo) {
      setErroArquivo("Anexe seu currículo para continuar.");
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 800));
    setEnviado(true);
  });

  if (enviado) {
    return (
      <div className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-[var(--good-soft)] text-[var(--good)]">
          <CheckCircle className="size-6" weight="fill" />
        </span>
        <h3 className="mt-6 font-display text-h3 text-[var(--fg)]">
          Candidatura validada.
        </h3>
        <p className="mx-auto mt-3 max-w-[46ch] text-[13.5px] leading-relaxed text-[var(--fg-muted)]">
          Em um ambiente de produção, sua inscrição para{" "}
          <span className="font-medium text-[var(--fg)]">{vaga}</span> seguiria para
          o time de recrutamento. Nesta demonstração nada foi enviado: o formulário
          apenas validou os dados no seu navegador.
        </p>
        <Button
          variant="secondary"
          className="mt-6"
          onClick={() => {
            setEnviado(false);
            removerArquivo();
          }}
        >
          Preencher novamente
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
      <h3 className="font-display text-h3 text-[var(--fg)]">Candidatar-se</h3>
      <p className="mt-2 text-[13px] leading-relaxed text-[var(--fg-muted)]">
        Formulário demonstrativo. A validação é real, mas nenhum dado sai do seu
        navegador.
      </p>

      <div className="mt-7 space-y-4">
        <Field label="Nome completo" htmlFor="cand-nome" error={errors.nome?.message} required>
          <Input
            id="cand-nome"
            autoComplete="name"
            placeholder="Seu nome"
            aria-invalid={Boolean(errors.nome)}
            {...register("nome")}
          />
        </Field>

        <Field label="E-mail" htmlFor="cand-email" error={errors.email?.message} required>
          <Input
            id="cand-email"
            type="email"
            autoComplete="email"
            placeholder="voce@exemplo.com"
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />
        </Field>

        <Field
          label="LinkedIn"
          htmlFor="cand-linkedin"
          error={errors.linkedin?.message}
          required
        >
          <Input
            id="cand-linkedin"
            type="url"
            placeholder="https://linkedin.com/in/seu-perfil"
            aria-invalid={Boolean(errors.linkedin)}
            {...register("linkedin")}
          />
        </Field>

        <Field
          label="GitHub"
          htmlFor="cand-github"
          hint="opcional"
          error={errors.github?.message}
        >
          <Input
            id="cand-github"
            type="url"
            placeholder="https://github.com/seu-usuario"
            aria-invalid={Boolean(errors.github)}
            {...register("github")}
          />
        </Field>

        {/* Currículo */}
        <Field label="Currículo" htmlFor="cand-curriculo" error={erroArquivo ?? undefined} required>
          {arquivo ? (
            <div className="flex items-center gap-3 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2.5">
              <Paperclip className="size-4 shrink-0 text-[var(--accent)]" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-[var(--fg)]">
                  {arquivo.name}
                </p>
                <p className="text-[11.5px] tabular text-[var(--fg-subtle)]">
                  {(arquivo.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                type="button"
                onClick={removerArquivo}
                aria-label="Remover arquivo"
                className="shrink-0 rounded-[var(--radius-xs)] p-1 text-[var(--fg-subtle)] transition-colors hover:bg-[var(--surface-3)] hover:text-[var(--fg)]"
              >
                <X className="size-3.5" weight="bold" />
              </button>
            </div>
          ) : (
            <label
              htmlFor="cand-curriculo"
              className="flex cursor-pointer items-center gap-3 rounded-[var(--radius-sm)] border border-dashed border-[var(--border-strong)] px-3 py-4 transition-colors hover:border-[var(--accent)] hover:bg-[var(--surface-2)]"
            >
              <Paperclip className="size-4 shrink-0 text-[var(--fg-subtle)]" />
              <span className="text-[13px] text-[var(--fg-muted)]">
                Escolher arquivo · PDF, DOC ou DOCX até 5 MB
              </span>
              <input
                ref={inputArquivoRef}
                id="cand-curriculo"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={selecionarArquivo}
                className="sr-only"
              />
            </label>
          )}
        </Field>

        <Field
          label="Apresentação"
          htmlFor="cand-apresentacao"
          error={errors.apresentacao?.message}
          hint="mínimo 80 caracteres"
          required
        >
          <Textarea
            id="cand-apresentacao"
            placeholder="Conte o que te aproxima desta vaga e um problema que você resolveu recentemente."
            aria-invalid={Boolean(errors.apresentacao)}
            {...register("apresentacao")}
          />
        </Field>
      </div>

      <Button type="submit" size="lg" className="mt-6 w-full" loading={isSubmitting}>
        Enviar candidatura
      </Button>

      <p className="mt-4 text-[11.5px] leading-relaxed text-[var(--fg-subtle)]">
        O arquivo escolhido permanece no seu dispositivo. Não há upload, servidor
        de destino nem armazenamento nesta demonstração.
      </p>
    </form>
  );
}
