import type { Metadata } from "next";
import { DemoChooser } from "@/features/auth/demo-chooser";

export const metadata: Metadata = {
  title: "Explorar demonstração",
  description:
    "Escolha entre os ambientes de cidadão, empresa e governo e explore o EcoRewards imediatamente, sem cadastro.",
};

export default function DemoPage() {
  return (
    <div className="mx-auto max-w-[1360px] px-4 py-16 lg:px-6 lg:py-24">
      <div className="max-w-2xl">
        <p className="eyebrow">Demonstração</p>
        <h1 className="mt-4 text-balance font-display text-h1 text-[var(--fg)]">
          Escolha como deseja explorar o EcoRewards.
        </h1>
        <p className="mt-5 max-w-[56ch] text-[15px] leading-relaxed text-[var(--fg-muted)]">
          Cada ambiente já vem carregado com dados coerentes entre si. Você entra
          direto, sem criar conta, e pode alternar entre eles a qualquer momento
          pelo seletor dentro da aplicação.
        </p>
      </div>

      <DemoChooser />

      <section className="mt-20 border-t border-[var(--border)] pt-10">
        <h2 className="font-display text-h3 text-[var(--fg)]">
          O que esperar da demonstração
        </h2>
        <ul className="mt-6 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              titulo: "Dados fixos e coerentes",
              texto:
                "Nada é sorteado a cada recarregamento. Se uma empresa tem 182 colaboradores, os gráficos e rankings refletem esse número.",
            },
            {
              titulo: "Estado local de verdade",
              texto:
                "Resgatar uma recompensa desconta os pontos, gera voucher e entra no extrato. Tudo fica no seu navegador.",
            },
            {
              titulo: "Restauração a qualquer momento",
              texto:
                "O comando Restaurar dados demo devolve pontos, resgates, desafios e notificações ao estado inicial.",
            },
            {
              titulo: "Sem banco de dados",
              texto:
                "Não há back-end, autenticação real nem integração de persistência. A camada de dados é toda mockada.",
            },
            {
              titulo: "Mapas reais",
              texto:
                "Os ecopontos têm coordenadas de verdade na Região Metropolitana de São Paulo e são renderizados com MapLibre.",
            },
            {
              titulo: "Detecção de anomalias por regras",
              texto:
                "O Risk & Fraud Center pontua eventos com regras determinísticas sobre dados fictícios. Não há modelo de IA envolvido.",
            },
          ].map((item) => (
            <li key={item.titulo}>
              <h3 className="text-[14px] font-medium text-[var(--fg)]">
                {item.titulo}
              </h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--fg-muted)]">
                {item.texto}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
