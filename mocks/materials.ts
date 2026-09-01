import type { Material, MaterialId } from "@/types";

/**
 * Fatores de pontuação e CO2 herdados da tabela TIPO_MATERIAL do
 * projeto original, ajustados para uma escala coerente com os dashboards.
 */
export const MATERIALS: Material[] = [
  {
    id: "plastico",
    nome: "Plástico",
    pontosPorKg: 45,
    co2PorKg: 1.8,
    pesoUnitarioKg: 0.03,
    cor: "var(--series-2)",
    icone: "bottle",
    descricao: "PET, PEAD e embalagens flexíveis",
  },
  {
    id: "papel",
    nome: "Papel e papelão",
    pontosPorKg: 22,
    co2PorKg: 0.9,
    pesoUnitarioKg: 0.08,
    cor: "var(--series-3)",
    icone: "newspaper",
    descricao: "Jornais, caixas, revistas e escritório",
  },
  {
    id: "vidro",
    nome: "Vidro",
    pontosPorKg: 18,
    co2PorKg: 0.55,
    pesoUnitarioKg: 0.35,
    cor: "var(--series-1)",
    icone: "wine",
    descricao: "Garrafas, potes e frascos",
  },
  {
    id: "metal",
    nome: "Metal",
    pontosPorKg: 60,
    co2PorKg: 4.5,
    pesoUnitarioKg: 0.015,
    cor: "var(--series-5)",
    icone: "cube",
    descricao: "Alumínio, aço e latas de bebida",
  },
  {
    id: "eletronico",
    nome: "Eletrônico",
    pontosPorKg: 120,
    co2PorKg: 12.4,
    pesoUnitarioKg: 0.4,
    cor: "var(--series-4)",
    icone: "cpu",
    descricao: "Celulares, cabos, placas e periféricos",
  },
  {
    id: "oleo",
    nome: "Óleo de cozinha",
    pontosPorKg: 80,
    co2PorKg: 2.6,
    pesoUnitarioKg: 0.9,
    cor: "var(--series-6)",
    icone: "drop",
    descricao: "Óleo usado, coletado em recipiente fechado",
  },
  {
    id: "organico",
    nome: "Orgânico",
    pontosPorKg: 12,
    co2PorKg: 0.4,
    pesoUnitarioKg: 0.2,
    cor: "var(--seq-4)",
    icone: "leaf",
    descricao: "Resíduo compostável de cozinha",
  },
];

export const MATERIAL_BY_ID = Object.fromEntries(
  MATERIALS.map((m) => [m.id, m]),
) as Record<MaterialId, Material>;

export const MATERIAL_LABEL: Record<MaterialId, string> = Object.fromEntries(
  MATERIALS.map((m) => [m.id, m.nome]),
) as Record<MaterialId, string>;
