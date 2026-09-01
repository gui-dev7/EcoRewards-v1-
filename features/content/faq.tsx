"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { CaretDown } from "@phosphor-icons/react";

const PERGUNTAS = [
  {
    id: "dados",
    pergunta: "Os números da plataforma são reais?",
    resposta:
      "Não. Este é um projeto demonstrativo: todos os dados são fictícios e ficam em arquivos de mock dentro da própria aplicação. Não existe banco de dados, back-end ou integração com fonte externa de dados.",
  },
  {
    id: "conta",
    pergunta: "Preciso criar uma conta para explorar?",
    resposta:
      "Não. A página de demonstração dá acesso imediato aos três ambientes — cidadão, empresa e governo. O login tradicional também funciona com as credenciais demo, exibidas na própria tela.",
  },
  {
    id: "pontos",
    pergunta: "Como a pontuação por material é definida?",
    resposta:
      "Cada material tem um fator de EcoPontos por quilo e um fator de CO2 evitado por quilo. Alumínio pontua mais que vidro porque evita mais emissão na cadeia produtiva. A tabela completa está aberta na página de impacto.",
  },
  {
    id: "resgate",
    pergunta: "O que acontece quando resgato uma recompensa na demonstração?",
    resposta:
      "O saldo é descontado, um voucher com código fictício é gerado e a transação entra no seu extrato. Tudo permanece no armazenamento local do navegador e pode ser desfeito a qualquer momento com o comando Restaurar dados demo.",
  },
  {
    id: "fraude",
    pergunta: "A detecção de anomalias usa inteligência artificial?",
    resposta:
      "Não. O Risk Score é calculado por regras determinísticas explícitas — limites de frequência, divergência entre peso declarado e aferido, distância improvável entre leituras. Cada regra acionada é listada no detalhe do evento.",
  },
  {
    id: "privacidade",
    pergunta: "Meus dados são armazenados em algum lugar?",
    resposta:
      "Apenas no seu navegador, via localStorage, e somente o que a demonstração precisa para manter o estado entre páginas: saldo, resgates, progresso de desafios, notificações lidas e preferências. Nada é transmitido.",
  },
];

export function Faq() {
  return (
    <section className="mt-20 border-t border-[var(--border)] pt-14">
      <div className="grid gap-10 lg:grid-cols-[300px_1fr] lg:gap-16">
        <div>
          <p className="eyebrow">Dúvidas frequentes</p>
          <h2 className="mt-4 text-balance font-display text-h2 text-[var(--fg)]">
            O que costumam nos perguntar.
          </h2>
        </div>

        <Accordion.Root type="single" collapsible className="w-full">
          {PERGUNTAS.map((item) => (
            <Accordion.Item
              key={item.id}
              value={item.id}
              className="border-b border-[var(--border)]"
            >
              <Accordion.Header>
                <Accordion.Trigger className="group flex w-full items-center justify-between gap-4 py-5 text-left">
                  <span className="text-[15.5px] font-medium text-[var(--fg)]">
                    {item.pergunta}
                  </span>
                  <CaretDown
                    className="size-4 shrink-0 text-[var(--fg-subtle)] transition-transform duration-300 group-data-[state=open]:rotate-180"
                    weight="bold"
                    aria-hidden
                  />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                <p className="max-w-[68ch] pb-5 text-[14.5px] leading-relaxed text-[var(--fg-muted)]">
                  {item.resposta}
                </p>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </section>
  );
}
