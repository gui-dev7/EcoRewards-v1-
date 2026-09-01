"use client";

export { useAuthStore } from "./auth-store";
export { useWalletStore, type DisposalResult } from "./wallet-store";
export { useProgressStore } from "./progress-store";
export { useNotificationsStore } from "./notifications-store";
export { useCampaignsStore, type CampaignDraft } from "./campaigns-store";
export { usePreferencesStore } from "./preferences-store";

import { useWalletStore } from "./wallet-store";
import { useProgressStore } from "./progress-store";
import { useNotificationsStore } from "./notifications-store";
import { useCampaignsStore } from "./campaigns-store";
import { usePreferencesStore } from "./preferences-store";

/**
 * Restaura toda a demonstração ao estado inicial.
 * A sessão e a preferência de tema são preservadas de propósito:
 * quem está apresentando não é expulso do ambiente.
 */
export function restaurarDemonstracao() {
  useWalletStore.getState().restaurar();
  useProgressStore.getState().restaurar();
  useNotificationsStore.getState().restaurar();
  useCampaignsStore.getState().restaurar();
  usePreferencesStore.getState().restaurar();
}
