import type { EcoLevel, EcoLevelId } from "@/types";

export const ECO_LEVELS: EcoLevel[] = [
  {
    id: "semente",
    nome: "Semente",
    ordem: 1,
    xpMinimo: 0,
    descricao: "Primeiros descartes registrados na plataforma.",
  },
  {
    id: "broto",
    nome: "Broto",
    ordem: 2,
    xpMinimo: 500,
    descricao: "Hábito em formação: descartes recorrentes no mês.",
  },
  {
    id: "folha",
    nome: "Folha",
    ordem: 3,
    xpMinimo: 1800,
    descricao: "Rotina estabelecida e variedade de materiais.",
  },
  {
    id: "arvore",
    nome: "Árvore",
    ordem: 4,
    xpMinimo: 4200,
    descricao: "Impacto consistente e participação em desafios.",
  },
  {
    id: "floresta",
    nome: "Floresta",
    ordem: 5,
    xpMinimo: 9000,
    descricao: "Referência local, influencia a adesão da vizinhança.",
  },
  {
    id: "guardiao",
    nome: "Guardião Verde",
    ordem: 6,
    xpMinimo: 18000,
    descricao: "Topo da progressão. Impacto sustentado por anos.",
  },
];

export const ECO_LEVEL_BY_ID = Object.fromEntries(
  ECO_LEVELS.map((l) => [l.id, l]),
) as Record<EcoLevelId, EcoLevel>;
