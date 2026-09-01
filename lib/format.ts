const LOCALE = "pt-BR";

const decimal0 = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 0 });
const decimal1 = new Intl.NumberFormat(LOCALE, {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const decimal2 = new Intl.NumberFormat(LOCALE, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const currency = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});
const currencyCents = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: "BRL",
});
const percent = new Intl.NumberFormat(LOCALE, {
  style: "percent",
  maximumFractionDigits: 1,
});

export function formatEcoPoints(value: number) {
  return decimal0.format(Math.round(value));
}

export function formatNumber(value: number, digits: 0 | 1 | 2 = 0) {
  if (digits === 1) return decimal1.format(value);
  if (digits === 2) return decimal2.format(value);
  return decimal0.format(value);
}

/** 1.240.000 -> "1,24 mi". Usado apenas em KPIs onde o espaço é curto. */
export function formatCompact(value: number) {
  if (Math.abs(value) >= 1_000_000)
    return `${decimal2.format(value / 1_000_000).replace(",00", "")} mi`;
  if (Math.abs(value) >= 10_000)
    return `${decimal1.format(value / 1_000).replace(",0", "")} mil`;
  return decimal0.format(value);
}

export function formatCurrency(value: number, cents = false) {
  return cents ? currencyCents.format(value) : currency.format(value);
}

export function formatCurrencyCompact(value: number) {
  if (Math.abs(value) >= 1_000_000)
    return `R$ ${decimal1.format(value / 1_000_000).replace(",0", "")} mi`;
  if (Math.abs(value) >= 1_000)
    return `R$ ${decimal0.format(value / 1_000)} mil`;
  return currency.format(value);
}

export function formatPercent(value: number, base: 1 | 100 = 100) {
  return percent.format(base === 100 ? value / 100 : value);
}

export function formatDelta(value: number) {
  const sign = value > 0 ? "+" : value < 0 ? "−" : "";
  return `${sign}${decimal1.format(Math.abs(value)).replace(",0", "")}%`;
}

export function formatWeight(kg: number) {
  if (kg >= 1000) return `${decimal1.format(kg / 1000)} t`;
  return `${decimal1.format(kg).replace(",0", "")} kg`;
}

export function formatTons(tons: number) {
  return `${decimal1.format(tons).replace(",0", "")} t`;
}

export function formatDate(iso: string, style: "curto" | "longo" | "mes" = "curto") {
  const date = new Date(iso);
  if (style === "longo")
    return date.toLocaleDateString(LOCALE, {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  if (style === "mes")
    return date.toLocaleDateString(LOCALE, { month: "short", year: "numeric" });
  return date.toLocaleDateString(LOCALE, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatDateTime(iso: string) {
  const date = new Date(iso);
  return `${formatDate(iso)} · ${date.toLocaleTimeString(LOCALE, {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

/** "há 4 minutos", "há 2 dias". Base fixa para não variar entre servidor e cliente. */
export function formatRelative(iso: string, now = Date.now()) {
  const diff = now - new Date(iso).getTime();
  const minutes = Math.round(diff / 60000);
  if (minutes < 1) return "agora";
  if (minutes < 60) return `há ${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `há ${hours} h`;
  const days = Math.round(hours / 24);
  if (days < 30) return `há ${days} ${days === 1 ? "dia" : "dias"}`;
  const months = Math.round(days / 30);
  if (months < 12) return `há ${months} ${months === 1 ? "mês" : "meses"}`;
  const years = Math.round(months / 12);
  return `há ${years} ${years === 1 ? "ano" : "anos"}`;
}

export function formatCo2(kg: number) {
  if (kg >= 1000) return `${decimal1.format(kg / 1000).replace(",0", "")} t`;
  return `${decimal0.format(kg)} kg`;
}
