import type { Environment } from "@/types";

export const DEMO_PASSWORD = "EcoDemo@2026";

export interface DemoAccount {
  environment: Environment;
  email: string;
  senha: string;
  nome: string;
  subtitulo: string;
  descricao: string;
  /** Rota inicial do ambiente. */
  home: string;
  recursos: string[];
  cta: string;
}

export const DEMO_ACCOUNTS: Record<Environment, DemoAccount> = {
  cidadao: {
    environment: "cidadao",
    email: "cidadao.demo@ecorewards.app",
    senha: DEMO_PASSWORD,
    nome: "João Silva",
    subtitulo: "São Paulo · Nível Árvore",
    descricao:
      "A experiência de quem recicla: escaneia o ecoponto, acumula EcoPontos, cumpre desafios e troca por recompensas reais.",
    home: "/app",
    recursos: [
      "Scanner de QR com validação passo a passo",
      "Carteira de EcoPontos com extrato completo",
      "Catálogo de recompensas e resgate com voucher",
      "Desafios, medalhas, ranking e Impact Passport",
      "Mapa de ecopontos com rota e filtros",
    ],
    cta: "Explorar como cidadão",
  },
  empresa: {
    environment: "empresa",
    email: "empresa.demo@ecorewards.app",
    senha: DEMO_PASSWORD,
    nome: "EcoTech Brasil",
    subtitulo: "182 colaboradores · 3 unidades",
    descricao:
      "O painel corporativo: adesão dos colaboradores, metas ESG, campanhas internas e relatórios de sustentabilidade.",
    home: "/empresa",
    recursos: [
      "Analytics de resíduos, CO2 e participação",
      "Ranking por pessoas, equipes e departamentos",
      "CRUD completo de campanhas internas",
      "Módulo ESG com meta anual e projeção",
      "Report builder com exportação em PDF",
    ],
    cta: "Explorar como empresa",
  },
  governo: {
    environment: "governo",
    email: "governo.demo@ecorewards.app",
    senha: DEMO_PASSWORD,
    nome: "Secretaria de Meio Ambiente — Demo",
    subtitulo: "8 municípios · 21,4 mi de habitantes",
    descricao:
      "A visão pública: inteligência regional, mapas com camadas, orçamento executado e central de anomalias.",
    home: "/governo",
    recursos: [
      "Mapa com camadas, heatmap e clustering",
      "Ranking regional por adesão e custo",
      "Risk & Fraud Center com score por evento",
      "Execução orçamentária e economia com aterro",
      "Relatórios operacionais consolidados",
    ],
    cta: "Explorar como governo",
  },
};

export const DEMO_ACCOUNT_LIST = Object.values(DEMO_ACCOUNTS);

export const ENVIRONMENT_LABEL: Record<Environment, string> = {
  cidadao: "Cidadão",
  empresa: "Empresa",
  governo: "Governo",
};

export function findDemoAccount(email: string, senha: string): DemoAccount | null {
  const normalized = email.trim().toLowerCase();
  return (
    DEMO_ACCOUNT_LIST.find(
      (account) => account.email === normalized && account.senha === senha,
    ) ?? null
  );
}
