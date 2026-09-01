import type { TimePoint } from "@/types";

/**
 * Números agregados da plataforma, usados nos contadores da home.
 * São totais acumulados desde o lançamento, somando os três ambientes
 * (cidadão, empresa e governo).
 */
export const PLATFORM_STATS: {
  id: string;
  valor: number;
  sufixo: string;
  rotulo: string;
  descricao: string;
}[] = [
  {
    id: "materiais-reciclados",
    valor: 125482,
    sufixo: "t",
    rotulo: "Materiais reciclados",
    descricao:
      "Toneladas devolvidas à cadeia produtiva desde o lançamento da plataforma.",
  },
  {
    id: "co2-evitado",
    valor: 38291,
    sufixo: "t",
    rotulo: "CO2 evitado",
    descricao:
      "Estimativa de emissões não lançadas na atmosfera, pelos fatores de cada material.",
  },
  {
    id: "acoes-sustentaveis",
    valor: 4532291,
    sufixo: "",
    rotulo: "Ações sustentáveis",
    descricao:
      "Descartes validados, desafios concluídos e resgates realizados pelos usuários.",
  },
  {
    id: "economia-estimada",
    valor: 45800000,
    sufixo: "R$",
    rotulo: "Economia estimada",
    descricao:
      "Custo de aterro evitado pelos municípios e empresas participantes.",
  },
];

/**
 * Volume agregado da plataforma nos últimos 12 meses.
 * `reciclado` e `co2` em toneladas; `usuarios` são contas ativas no mês.
 * Janeiro recua por causa do recesso e das férias escolares.
 */
export const PLATFORM_MONTHLY: TimePoint[] = [
  { periodo: "Set/25", reciclado: 3980, co2: 1214, usuarios: 318400, acoes: 118600 },
  { periodo: "Out/25", reciclado: 4260, co2: 1299, usuarios: 334100, acoes: 126900 },
  { periodo: "Nov/25", reciclado: 4520, co2: 1379, usuarios: 351800, acoes: 134700 },
  { periodo: "Dez/25", reciclado: 5140, co2: 1568, usuarios: 372600, acoes: 153200 },
  { periodo: "Jan/26", reciclado: 3720, co2: 1135, usuarios: 361900, acoes: 110800 },
  { periodo: "Fev/26", reciclado: 4680, co2: 1428, usuarios: 384200, acoes: 139500 },
  { periodo: "Mar/26", reciclado: 5060, co2: 1543, usuarios: 402700, acoes: 150800 },
  { periodo: "Abr/26", reciclado: 5380, co2: 1641, usuarios: 419300, acoes: 160400 },
  { periodo: "Mai/26", reciclado: 5620, co2: 1714, usuarios: 434800, acoes: 167600 },
  { periodo: "Jun/26", reciclado: 5940, co2: 1812, usuarios: 452100, acoes: 177100 },
  { periodo: "Jul/26", reciclado: 6280, co2: 1915, usuarios: 469500, acoes: 187300 },
  { periodo: "Ago/26", reciclado: 6420, co2: 1958, usuarios: 486320, acoes: 191500 },
];

/** Parceiros que recebem ou concedem EcoPontos na plataforma. */
export const PARTNERS: { id: string; nome: string; setor: string }[] = [
  { id: "prt-mobilidade-sp", nome: "Mobilidade Urbana SP", setor: "Transporte público" },
  { id: "prt-mercado-verde", nome: "Mercado Verde", setor: "Varejo alimentar" },
  { id: "prt-cultura-viva", nome: "Cultura Viva", setor: "Cultura e lazer" },
  { id: "prt-fluxo-streaming", nome: "Fluxo Streaming", setor: "Entretenimento digital" },
  { id: "prt-solar-coop", nome: "Solar Coop", setor: "Energia renovável" },
  { id: "prt-raiz-utilidades", nome: "Raiz Utilidades", setor: "Bens de consumo" },
  { id: "prt-trilha-viva", nome: "Trilha Viva", setor: "Ecoturismo" },
  { id: "prt-bike-livre", nome: "Bike Livre SP", setor: "Micromobilidade" },
  { id: "prt-cozinha-raiz", nome: "Cozinha Raiz", setor: "Alimentação fora do lar" },
  { id: "prt-casa-consciente", nome: "Casa Consciente", setor: "Higiene e limpeza" },
  { id: "prt-som-aberto", nome: "Som Aberto", setor: "Streaming de música" },
  { id: "prt-feira-do-bairro", nome: "Feira do Bairro", setor: "Agricultura familiar" },
];
