import type {
  ActivityEntry,
  CitizenProfile,
  MaterialId,
  TimePoint,
  WalletTransaction,
} from "@/types";

/**
 * Conta demo Cidadão. Todos os números abaixo são consistentes entre si:
 * 87 descartes -> 318,4 kg -> 641 kg de CO2 -> 4.250 EcoPontos disponíveis.
 */
export const CITIZEN: CitizenProfile = {
  id: "usr-joao-silva",
  nome: "João Silva",
  email: "cidadao.demo@ecorewards.app",
  avatarIniciais: "JS",
  cidade: "São Paulo",
  estado: "SP",
  membroDesde: "2024-03-18",
  ecoPontos: 4250,
  xp: 5480,
  ecoScore: 78,
  streakSemanas: 12,
  kgReciclados: 318.4,
  co2EvitadoKg: 641,
  descartes: 87,
  posicaoRankingGlobal: 127,
  posicaoRankingCidade: 18,
  totalUsuariosGlobal: 48213,
};

/** Distribuição acumulada por material — soma 318,4 kg. */
export const CITIZEN_MATERIAL_SPLIT: {
  materialId: MaterialId;
  kg: number;
  descartes: number;
}[] = [
  { materialId: "plastico", kg: 96.2, descartes: 31 },
  { materialId: "papel", kg: 84.5, descartes: 19 },
  { materialId: "vidro", kg: 71.8, descartes: 14 },
  { materialId: "metal", kg: 38.4, descartes: 12 },
  { materialId: "eletronico", kg: 15.9, descartes: 6 },
  { materialId: "oleo", kg: 11.6, descartes: 5 },
];

/** Últimos 12 meses de reciclagem do usuário, em kg. */
export const CITIZEN_MONTHLY: TimePoint[] = [
  { periodo: "Set/25", plastico: 5.2, papel: 4.1, vidro: 3.8, metal: 1.6 },
  { periodo: "Out/25", plastico: 6.4, papel: 5.0, vidro: 4.2, metal: 2.1 },
  { periodo: "Nov/25", plastico: 7.1, papel: 6.2, vidro: 5.6, metal: 2.4 },
  { periodo: "Dez/25", plastico: 9.8, papel: 8.4, vidro: 7.9, metal: 3.6 },
  { periodo: "Jan/26", plastico: 6.9, papel: 5.8, vidro: 5.1, metal: 2.2 },
  { periodo: "Fev/26", plastico: 7.6, papel: 6.4, vidro: 5.8, metal: 2.8 },
  { periodo: "Mar/26", plastico: 8.9, papel: 7.1, vidro: 6.4, metal: 3.1 },
  { periodo: "Abr/26", plastico: 9.4, papel: 7.8, vidro: 6.9, metal: 3.4 },
  { periodo: "Mai/26", plastico: 10.2, papel: 8.2, vidro: 7.1, metal: 3.8 },
  { periodo: "Jun/26", plastico: 11.6, papel: 9.1, vidro: 7.8, metal: 4.2 },
  { periodo: "Jul/26", plastico: 12.4, papel: 9.8, vidro: 8.4, metal: 4.6 },
  { periodo: "Ago/26", plastico: 13.1, papel: 10.4, vidro: 8.9, metal: 5.1 },
];

/** Evolução de EcoPontos acumulados nos últimos 12 meses. */
export const CITIZEN_POINTS_HISTORY: TimePoint[] = [
  { periodo: "Set/25", pontos: 620 },
  { periodo: "Out/25", pontos: 780 },
  { periodo: "Nov/25", pontos: 910 },
  { periodo: "Dez/25", pontos: 1340 },
  { periodo: "Jan/26", pontos: 860 },
  { periodo: "Fev/26", pontos: 980 },
  { periodo: "Mar/26", pontos: 1120 },
  { periodo: "Abr/26", pontos: 1210 },
  { periodo: "Mai/26", pontos: 1290 },
  { periodo: "Jun/26", pontos: 1460 },
  { periodo: "Jul/26", pontos: 1580 },
  { periodo: "Ago/26", pontos: 1690 },
];

/**
 * Sequência sustentável: 52 semanas, intensidade 0–4.
 * As últimas 12 posições são todas ativas (streak de 12 semanas).
 */
export const CITIZEN_STREAK_WEEKS: { semana: string; intensidade: number; descartes: number }[] =
  [
    2, 1, 0, 3, 2, 0, 0, 1, 2, 3, 1, 0, 2, 3, 4, 2, 0, 1, 3, 2, 4, 3, 1, 0, 2, 3,
    4, 3, 2, 0, 1, 3, 4, 2, 3, 1, 0, 2, 3, 4, 3, 2, 3, 4, 2, 3, 4, 3, 4, 3, 4, 4,
  ].map((intensidade, index) => {
    const date = new Date("2025-09-01T12:00:00Z");
    date.setUTCDate(date.getUTCDate() + index * 7);
    return {
      semana: date.toISOString().slice(0, 10),
      intensidade,
      descartes: intensidade,
    };
  });

export const CITIZEN_TRANSACTIONS: WalletTransaction[] = [
  {
    id: "trx-0087",
    data: "2026-08-29T09:12:00-03:00",
    descricao: "Descarte de plástico",
    origem: "Ecoponto Pinheiros — Rua dos Pinheiros",
    tipo: "ganho",
    pontos: 320,
    status: "concluido",
    materialId: "plastico",
    pesoKg: 6.8,
  },
  {
    id: "trx-0086",
    data: "2026-08-27T18:40:00-03:00",
    descricao: "Resgate — Passe de metrô (5 viagens)",
    origem: "Mobilidade Urbana SP",
    tipo: "gasto",
    pontos: -1200,
    status: "concluido",
  },
  {
    id: "trx-0085",
    data: "2026-08-25T08:05:00-03:00",
    descricao: "Desafio concluído — Semana sem plástico",
    origem: "Desafios semanais",
    tipo: "bonus",
    pontos: 750,
    status: "concluido",
  },
  {
    id: "trx-0084",
    data: "2026-08-22T16:22:00-03:00",
    descricao: "Descarte de eletrônicos",
    origem: "Ecoponto Vila Madalena",
    tipo: "ganho",
    pontos: 468,
    status: "concluido",
    materialId: "eletronico",
    pesoKg: 3.9,
  },
  {
    id: "trx-0083",
    data: "2026-08-19T11:30:00-03:00",
    descricao: "Descarte de papel e papelão",
    origem: "Ecoponto Butantã",
    tipo: "ganho",
    pontos: 184,
    status: "concluido",
    materialId: "papel",
    pesoKg: 8.4,
  },
  {
    id: "trx-0082",
    data: "2026-08-16T14:10:00-03:00",
    descricao: "Bônus de sequência — 10 semanas",
    origem: "Programa de consistência",
    tipo: "bonus",
    pontos: 250,
    status: "concluido",
  },
  {
    id: "trx-0081",
    data: "2026-08-14T09:48:00-03:00",
    descricao: "Descarte de vidro",
    origem: "Ecoponto Pinheiros — Rua dos Pinheiros",
    tipo: "ganho",
    pontos: 142,
    status: "concluido",
    materialId: "vidro",
    pesoKg: 7.9,
  },
  {
    id: "trx-0080",
    data: "2026-08-11T19:05:00-03:00",
    descricao: "Resgate — Cupom Mercado Verde",
    origem: "Mercado Verde",
    tipo: "gasto",
    pontos: -800,
    status: "concluido",
  },
  {
    id: "trx-0079",
    data: "2026-08-08T10:20:00-03:00",
    descricao: "Descarte de metal",
    origem: "Ecoponto Lapa",
    tipo: "ganho",
    pontos: 288,
    status: "concluido",
    materialId: "metal",
    pesoKg: 4.8,
  },
  {
    id: "trx-0078",
    data: "2026-08-05T08:35:00-03:00",
    descricao: "Descarte de óleo de cozinha",
    origem: "Ecoponto Perdizes",
    tipo: "ganho",
    pontos: 216,
    status: "concluido",
    materialId: "oleo",
    pesoKg: 2.7,
  },
  {
    id: "trx-0077",
    data: "2026-08-02T15:52:00-03:00",
    descricao: "Descarte de plástico",
    origem: "Ecoponto Vila Madalena",
    tipo: "ganho",
    pontos: 265,
    status: "concluido",
    materialId: "plastico",
    pesoKg: 5.6,
  },
  {
    id: "trx-0076",
    data: "2026-07-30T12:14:00-03:00",
    descricao: "Conquista desbloqueada — Reciclador de Elite",
    origem: "Conquistas",
    tipo: "bonus",
    pontos: 500,
    status: "concluido",
  },
  {
    id: "trx-0075",
    data: "2026-07-28T09:02:00-03:00",
    descricao: "Descarte de papel e papelão",
    origem: "Ecoponto Butantã",
    tipo: "ganho",
    pontos: 156,
    status: "concluido",
    materialId: "papel",
    pesoKg: 7.1,
  },
  {
    id: "trx-0074",
    data: "2026-07-24T17:41:00-03:00",
    descricao: "Resgate — Ingresso Museu do Amanhã",
    origem: "Cultura Viva",
    tipo: "gasto",
    pontos: -600,
    status: "concluido",
  },
  {
    id: "trx-0073",
    data: "2026-07-21T08:58:00-03:00",
    descricao: "Descarte de vidro",
    origem: "Ecoponto Pinheiros — Rua dos Pinheiros",
    tipo: "ganho",
    pontos: 128,
    status: "concluido",
    materialId: "vidro",
    pesoKg: 7.1,
  },
];

export const CITIZEN_ACTIVITY: ActivityEntry[] = [
  {
    id: "act-1",
    descricao: "Descarte validado no Ecoponto Pinheiros",
    detalhe: "6,8 kg de plástico · +320 EcoPontos",
    data: "2026-08-29T09:12:00-03:00",
    icone: "recycle",
    pontos: 320,
  },
  {
    id: "act-2",
    descricao: "Passe de metrô resgatado",
    detalhe: "Voucher ECO-4K2M-71QP · válido por 60 dias",
    data: "2026-08-27T18:40:00-03:00",
    icone: "ticket",
    pontos: -1200,
  },
  {
    id: "act-3",
    descricao: "Desafio Semana sem plástico concluído",
    detalhe: "5 de 5 descartes · +750 EcoPontos",
    data: "2026-08-25T08:05:00-03:00",
    icone: "target",
    pontos: 750,
  },
  {
    id: "act-4",
    descricao: "Você subiu 14 posições no ranking da cidade",
    detalhe: "#32 -> #18 em São Paulo",
    data: "2026-08-24T21:00:00-03:00",
    icone: "trend-up",
  },
  {
    id: "act-5",
    descricao: "Descarte validado no Ecoponto Vila Madalena",
    detalhe: "3,9 kg de eletrônicos · +468 EcoPontos",
    data: "2026-08-22T16:22:00-03:00",
    icone: "recycle",
    pontos: 468,
  },
  {
    id: "act-6",
    descricao: "Conquista desbloqueada",
    detalhe: "Reciclador de Elite · +500 XP",
    data: "2026-07-30T12:14:00-03:00",
    icone: "medal",
  },
];

/** Entradas para o cálculo do Eco Score exibido no dashboard. */
export const CITIZEN_ECO_SCORE_INPUT = {
  frequencia: 9,
  consistencia: 12,
  materiaisDistintos: 6,
  desafiosConcluidos: 5,
  impactoKg: 27.5,
};
