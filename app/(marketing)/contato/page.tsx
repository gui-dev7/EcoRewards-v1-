import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/features/content/contact-form";
import { Faq } from "@/features/content/faq";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Fale com o time do EcoRewards sobre produto, parcerias, poder público ou imprensa.",
};

const CANAIS = [
  {
    titulo: "Comercial e parcerias",
    descricao: "Para empresas que querem levar o programa ao time.",
    contato: "parcerias@ecorewards.app",
  },
  {
    titulo: "Poder público",
    descricao: "Municípios e secretarias interessados na camada de gestão.",
    contato: "publico@ecorewards.app",
  },
  {
    titulo: "Imprensa",
    descricao: "Dados da rede, entrevistas e material institucional.",
    contato: "imprensa@ecorewards.app",
  },
  {
    titulo: "Suporte",
    descricao: "Dúvidas sobre pontuação, resgates e ecopontos.",
    contato: "ajuda@ecorewards.app",
  },
];

export default function ContatoPage() {
  return (
    <div className="mx-auto max-w-[1360px] px-4 py-20 lg:px-6 lg:py-24">
      <div className="max-w-3xl">
        <p className="eyebrow">Contato</p>
        <h1 className="mt-5 text-balance font-display text-[clamp(2.25rem,5vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-[var(--fg)]">
          Vamos conversar.
        </h1>
        <p className="mt-6 max-w-[56ch] text-[17px] leading-relaxed text-[var(--fg-muted)]">
          Escolha o assunto e conte o contexto. Quanto mais específico, mais útil
          a resposta.
        </p>
      </div>

      <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_380px] lg:gap-16">
        <ContactForm />

        <aside className="space-y-10">
          <section>
            <h2 className="eyebrow mb-5">Canais diretos</h2>
            <ul className="space-y-px overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--border)]">
              {CANAIS.map((canal) => (
                <li key={canal.titulo} className="bg-[var(--surface)] px-4 py-4">
                  <p className="text-[13.5px] font-medium text-[var(--fg)]">
                    {canal.titulo}
                  </p>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-[var(--fg-muted)]">
                    {canal.descricao}
                  </p>
                  <p className="mt-2 font-mono text-[12.5px] text-[var(--accent)]">
                    {canal.contato}
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[11.5px] leading-relaxed text-[var(--fg-subtle)]">
              Endereços demonstrativos — não há caixa de entrada real associada.
            </p>
          </section>

          <section>
            <h2 className="eyebrow mb-4">Antes de escrever</h2>
            <p className="text-[13.5px] leading-relaxed text-[var(--fg-muted)]">
              A maior parte das dúvidas sobre o funcionamento do produto é
              respondida percorrendo a{" "}
              <Link
                href="/demo"
                className="font-medium text-[var(--accent)] underline-offset-4 hover:underline"
              >
                demonstração completa
              </Link>
              , que abre nos três ambientes sem cadastro.
            </p>
          </section>
        </aside>
      </div>

      <Faq />
    </div>
  );
}
