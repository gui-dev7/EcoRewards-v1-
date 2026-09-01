import type { BadgeRarity } from "@/types";

/**
 * Tom de cada raridade. São cores próprias da gamificação, fora da paleta
 * categórica dos gráficos — nunca reaproveitadas como série de dados.
 */
export const RARIDADE_TOM: Record<BadgeRarity, string> = {
  bronze: "var(--series-3)",
  prata: "var(--fg-subtle)",
  ouro: "var(--warning)",
  lendaria: "var(--series-5)",
};

export const RARIDADE_ROTULO: Record<BadgeRarity, string> = {
  bronze: "Bronze",
  prata: "Prata",
  ouro: "Ouro",
  lendaria: "Lendária",
};

export const RARIDADE_ORDEM: BadgeRarity[] = ["lendaria", "ouro", "prata", "bronze"];
