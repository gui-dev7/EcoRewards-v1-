import type { Challenge } from "@/types";

/**
 * Desafios da conta demo (João Silva), com o ciclo aberto em 01/09/2026.
 * Desafios recorrentes reiniciam a cada ciclo: "Semana sem plástico" já foi
 * concluída no ciclo de agosto (ver `CITIZEN_TRANSACTIONS`) e aparece aqui
 * no ciclo corrente, com progresso parcial de 3 de 5 descartes.
 */
export const CHALLENGES: Challenge[] = [
  /* ------------------------------ Diários ------------------------------ */
  {
    id: "chl-d-001",
    titulo: "Descarte do dia",
    descricao:
      "Registre pelo menos um descarte válido em qualquer ecoponto da rede.",
    cadencia: "diario",
    meta: 1,
    progresso: 1,
    unidade: "descarte",
    recompensaPontos: 50,
    expiraEm: "2026-09-01T23:59:00-03:00",
    icone: "recycle",
    concluido: true,
  },
  {
    id: "chl-d-002",
    titulo: "Registro fotográfico",
    descricao:
      "Envie uma foto do material separado antes de levar ao ecoponto.",
    cadencia: "diario",
    meta: 1,
    progresso: 0,
    unidade: "foto",
    recompensaPontos: 30,
    expiraEm: "2026-09-01T23:59:00-03:00",
    icone: "camera",
  },
  {
    id: "chl-d-003",
    titulo: "Separe dois materiais",
    descricao:
      "Leve dois tipos diferentes de material no mesmo descarte e ganhe bônus.",
    cadencia: "diario",
    meta: 2,
    progresso: 1,
    unidade: "materiais",
    recompensaPontos: 60,
    expiraEm: "2026-09-01T23:59:00-03:00",
    icone: "squares-four",
  },
  {
    id: "chl-d-004",
    titulo: "Check-in no ecoponto",
    descricao:
      "Faça o check-in pelo aplicativo ao chegar em um ecoponto da rede.",
    cadencia: "diario",
    meta: 1,
    progresso: 1,
    unidade: "check-in",
    recompensaPontos: 40,
    expiraEm: "2026-09-01T23:59:00-03:00",
    icone: "map-pin",
    concluido: true,
  },

  /* ------------------------------ Semanais ----------------------------- */
  {
    id: "chl-s-001",
    titulo: "Semana sem plástico",
    descricao:
      "Faça cinco descartes de plástico ao longo da semana e reduza o que vai para o aterro.",
    cadencia: "semanal",
    meta: 5,
    progresso: 3,
    unidade: "descartes",
    recompensaPontos: 750,
    expiraEm: "2026-09-06T23:59:00-03:00",
    icone: "bottle",
  },
  {
    id: "chl-s-002",
    titulo: "Maratona de vidro",
    descricao:
      "Acumule 8 kg de vidro na semana. Garrafas e potes contam para a meta.",
    cadencia: "semanal",
    meta: 8,
    progresso: 5,
    unidade: "kg",
    recompensaPontos: 400,
    expiraEm: "2026-09-06T23:59:00-03:00",
    icone: "wine",
  },
  {
    id: "chl-s-003",
    titulo: "Papel em dia",
    descricao:
      "Descarte 10 kg de papel e papelão antes do fim da semana.",
    cadencia: "semanal",
    meta: 10,
    progresso: 10,
    unidade: "kg",
    recompensaPontos: 320,
    expiraEm: "2026-09-06T23:59:00-03:00",
    icone: "newspaper",
    concluido: true,
  },
  {
    id: "chl-s-004",
    titulo: "Óleo fora do ralo",
    descricao:
      "Entregue 2 litros de óleo de cozinha usado em recipiente fechado.",
    cadencia: "semanal",
    meta: 2,
    progresso: 1,
    unidade: "litros",
    recompensaPontos: 500,
    expiraEm: "2026-09-06T23:59:00-03:00",
    icone: "drop",
  },
  {
    id: "chl-s-005",
    titulo: "Rota completa",
    descricao:
      "Visite três ecopontos diferentes na mesma semana e conheça a rede do seu bairro.",
    cadencia: "semanal",
    meta: 3,
    progresso: 2,
    unidade: "ecopontos",
    recompensaPontos: 600,
    expiraEm: "2026-09-06T23:59:00-03:00",
    icone: "path",
  },

  /* ------------------------------ Mensais ------------------------------ */
  {
    id: "chl-m-001",
    titulo: "Meta mensal de 25 kg",
    descricao:
      "Recicle 25 kg de material no mês, somando todas as categorias aceitas.",
    cadencia: "mensal",
    meta: 25,
    progresso: 18,
    unidade: "kg",
    recompensaPontos: 1500,
    expiraEm: "2026-09-30T23:59:00-03:00",
    icone: "target",
  },
  {
    id: "chl-m-002",
    titulo: "Eletrônicos com destino certo",
    descricao:
      "Leve 3 kg de eletrônicos a um ponto habilitado para logística reversa.",
    cadencia: "mensal",
    meta: 3,
    progresso: 3,
    unidade: "kg",
    recompensaPontos: 1200,
    expiraEm: "2026-09-30T23:59:00-03:00",
    icone: "cpu",
    concluido: true,
  },
  {
    id: "chl-m-003",
    titulo: "Constância verde",
    descricao:
      "Complete 12 descartes no mês, com no mínimo dois por semana.",
    cadencia: "mensal",
    meta: 12,
    progresso: 9,
    unidade: "descartes",
    recompensaPontos: 1000,
    expiraEm: "2026-09-30T23:59:00-03:00",
    icone: "calendar-check",
  },

  /* --------------------------- Comunitários ---------------------------- */
  {
    id: "chl-c-001",
    titulo: "Mutirão do bairro — Pinheiros",
    descricao:
      "Meta coletiva dos moradores de Pinheiros: 1.500 kg reciclados até o fim de setembro.",
    cadencia: "comunitario",
    meta: 1500,
    progresso: 1120,
    unidade: "kg",
    recompensaPontos: 900,
    expiraEm: "2026-09-30T23:59:00-03:00",
    icone: "users-three",
    participantes: 284,
  },
  {
    id: "chl-c-002",
    titulo: "São Paulo sem lixo eletrônico",
    descricao:
      "Campanha metropolitana para recolher 5 toneladas de eletrônicos em 60 dias.",
    cadencia: "comunitario",
    meta: 5000,
    progresso: 3180,
    unidade: "kg",
    recompensaPontos: 1100,
    expiraEm: "2026-10-15T23:59:00-03:00",
    icone: "globe-hemisphere-west",
    participantes: 1642,
  },
];

export const COMPLETED_CHALLENGE_IDS: string[] = CHALLENGES.filter(
  (c) => c.concluido,
).map((c) => c.id);

export const CHALLENGE_BY_ID: Record<string, Challenge> = Object.fromEntries(
  CHALLENGES.map((c) => [c.id, c]),
);
