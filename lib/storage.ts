/**
 * Abstração única sobre o armazenamento do navegador.
 * Nenhum componente deve tocar em localStorage/sessionStorage diretamente.
 */

const PREFIX = "ecorewards:";

type Driver = "local" | "session";

function getStore(driver: Driver): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return driver === "session" ? window.sessionStorage : window.localStorage;
  } catch {
    // Modo privado ou cookies bloqueados: a aplicação segue sem persistência.
    return null;
  }
}

export function readStorage<T>(key: string, fallback: T, driver: Driver = "local"): T {
  const store = getStore(driver);
  if (!store) return fallback;
  try {
    const raw = store.getItem(PREFIX + key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T, driver: Driver = "local") {
  const store = getStore(driver);
  if (!store) return;
  try {
    store.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* cota excedida — ignorado de propósito numa demo */
  }
}

export function removeStorage(key: string, driver: Driver = "local") {
  const store = getStore(driver);
  if (!store) return;
  try {
    store.removeItem(PREFIX + key);
  } catch {
    /* noop */
  }
}

/** Remove todo o estado da demonstração, preservando a preferência de tema. */
export function clearDemoStorage(preserve: string[] = ["theme"]) {
  const store = getStore("local");
  if (!store) return;
  const preserved = preserve.map((k) => PREFIX + k);
  const remover: string[] = [];
  for (let i = 0; i < store.length; i += 1) {
    const key = store.key(i);
    if (key?.startsWith(PREFIX) && !preserved.includes(key)) remover.push(key);
  }
  remover.forEach((key) => store.removeItem(key));
}

export const STORAGE_KEYS = {
  auth: "auth",
  wallet: "wallet",
  challenges: "challenges",
  notifications: "notifications",
  rewards: "rewards",
  campaigns: "campaigns",
  preferences: "preferences",
  sidebar: "sidebar",
} as const;
