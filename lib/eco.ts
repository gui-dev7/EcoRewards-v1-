import { MATERIALS, MATERIAL_BY_ID } from "@/mocks/materials";
import { ECO_LEVELS } from "@/mocks/levels";
import { clamp } from "@/lib/utils";
import type { Challenge, EcoLevel, MaterialId } from "@/types";

/* ------------------------------------------------------------------ */
/* Regras de pontuação                                                 */
/* ------------------------------------------------------------------ */

/**
 * EcoPontos de um descarte.
 * Base: pontos/kg do material. Multiplicador de streak recompensa
 * consistência, limitado a 1,25x para não distorcer o ranking.
 */
export function calculateEcoPoints(
  materialId: MaterialId,
  pesoKg: number,
  streakSemanas = 0,
): number {
  const material = MATERIAL_BY_ID[materialId];
  if (!material || pesoKg <= 0) return 0;
  const base = material.pontosPorKg * pesoKg;
  const multiplicador = 1 + clamp(streakSemanas * 0.01, 0, 0.25);
  return Math.round(base * multiplicador);
}

/** CO2 evitado (kg) por um descarte. */
export function estimateCarbonAvoided(
  materialId: MaterialId,
  pesoKg: number,
): number {
  const material = MATERIAL_BY_ID[materialId];
  if (!material || pesoKg <= 0) return 0;
  return Number((material.co2PorKg * pesoKg).toFixed(2));
}

/* ------------------------------------------------------------------ */
/* Progressão                                                          */
/* ------------------------------------------------------------------ */

export interface EcoLevelProgress {
  atual: EcoLevel;
  proximo: EcoLevel | null;
  xpNoNivel: number;
  xpParaProximo: number;
  progresso: number;
}

export function calculateEcoLevel(xp: number): EcoLevelProgress {
  const ordenados = [...ECO_LEVELS].sort((a, b) => a.xpMinimo - b.xpMinimo);
  let atual = ordenados[0];
  for (const nivel of ordenados) if (xp >= nivel.xpMinimo) atual = nivel;

  const proximo = ordenados.find((n) => n.xpMinimo > atual.xpMinimo) ?? null;
  const xpNoNivel = xp - atual.xpMinimo;
  const xpParaProximo = proximo ? proximo.xpMinimo - atual.xpMinimo : 0;

  return {
    atual,
    proximo,
    xpNoNivel,
    xpParaProximo,
    progresso: proximo ? clamp((xpNoNivel / xpParaProximo) * 100, 0, 100) : 100,
  };
}

/* ------------------------------------------------------------------ */
/* Eco Score                                                           */
/* ------------------------------------------------------------------ */

export interface EcoScoreInput {
  /** Descartes nos últimos 30 dias. */
  frequencia: number;
  /** Semanas consecutivas com ao menos um descarte. */
  consistencia: number;
  /** Quantos materiais distintos o usuário já reciclou. */
  materiaisDistintos: number;
  /** Desafios concluídos no período. */
  desafiosConcluidos: number;
  /** kg reciclados nos últimos 30 dias. */
  impactoKg: number;
}

export interface EcoScoreBreakdown {
  total: number;
  fatores: {
    id: keyof EcoScoreInput;
    nome: string;
    descricao: string;
    pontos: number;
    maximo: number;
  }[];
}

const ECO_SCORE_PESOS = {
  frequencia: { max: 30, teto: 12, nome: "Frequência", descricao: "Descartes nos últimos 30 dias" },
  consistencia: { max: 25, teto: 16, nome: "Consistência", descricao: "Semanas consecutivas de atividade" },
  materiaisDistintos: { max: 15, teto: 6, nome: "Diversidade", descricao: "Tipos de material reciclados" },
  desafiosConcluidos: { max: 15, teto: 8, nome: "Desafios", descricao: "Desafios concluídos no período" },
  impactoKg: { max: 15, teto: 40, nome: "Impacto", descricao: "Quilos reciclados nos últimos 30 dias" },
} as const;

/**
 * Eco Score 0–100. É um indicador interno demonstrativo, sem
 * qualquer modelo estatístico por trás — apenas uma soma ponderada.
 */
export function calculateEcoScore(input: EcoScoreInput): EcoScoreBreakdown {
  const fatores = (Object.keys(ECO_SCORE_PESOS) as (keyof EcoScoreInput)[]).map(
    (id) => {
      const peso = ECO_SCORE_PESOS[id];
      const pontos = Math.round(
        clamp(input[id] / peso.teto, 0, 1) * peso.max,
      );
      return {
        id,
        nome: peso.nome,
        descricao: peso.descricao,
        pontos,
        maximo: peso.max,
      };
    },
  );

  return {
    total: fatores.reduce((soma, f) => soma + f.pontos, 0),
    fatores,
  };
}

/* ------------------------------------------------------------------ */
/* Desafios                                                            */
/* ------------------------------------------------------------------ */

export function calculateChallengeProgress(challenge: Challenge) {
  const percentual = clamp((challenge.progresso / challenge.meta) * 100, 0, 100);
  return {
    percentual,
    restante: Math.max(challenge.meta - challenge.progresso, 0),
    concluido: challenge.progresso >= challenge.meta,
    rotulo: `${challenge.progresso} / ${challenge.meta} ${challenge.unidade}`,
  };
}

/* ------------------------------------------------------------------ */
/* Equivalências de impacto — tornam o número abstrato tangível        */
/* ------------------------------------------------------------------ */

export interface ImpactEquivalence {
  id: string;
  valor: number;
  unidade: string;
  descricao: string;
  icone: string;
}

export function impactEquivalences(co2Kg: number): ImpactEquivalence[] {
  return [
    {
      id: "arvores",
      valor: Math.round(co2Kg / 21.7),
      unidade: "árvores",
      descricao: "equivalente ao CO2 absorvido em um ano",
      icone: "tree",
    },
    {
      id: "km",
      valor: Math.round(co2Kg / 0.192),
      unidade: "km",
      descricao: "de carro a combustão não percorridos",
      icone: "car",
    },
    {
      id: "energia",
      valor: Math.round(co2Kg / 0.0817),
      unidade: "kWh",
      descricao: "de energia da rede brasileira",
      icone: "lightning",
    },
  ];
}

export const MATERIAL_OPTIONS = MATERIALS;
