"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { TrendDown, TrendUp } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { formatDelta } from "@/lib/format";

/* ------------------------------ Separator ---------------------------- */

export const Separator = React.forwardRef<
  React.ComponentRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => (
  <SeparatorPrimitive.Root
    ref={ref}
    decorative={decorative}
    orientation={orientation}
    className={cn(
      "shrink-0 bg-[var(--border)]",
      orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
      className,
    )}
    {...props}
  />
));
Separator.displayName = "Separator";

/* ------------------------------- Avatar ------------------------------ */

export function Avatar({
  iniciais,
  src,
  alt,
  size = "md",
  className,
  tone = "accent",
}: {
  iniciais: string;
  src?: string;
  alt?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  tone?: "accent" | "neutral";
}) {
  const dimensions = {
    xs: "size-6 text-[10px]",
    sm: "size-8 text-[11.5px]",
    md: "size-10 text-[13px]",
    lg: "size-14 text-[17px]",
    xl: "size-20 text-[24px]",
  }[size];

  return (
    <AvatarPrimitive.Root
      className={cn(
        "relative flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full",
        dimensions,
        className,
      )}
    >
      {src && (
        <AvatarPrimitive.Image src={src} alt={alt ?? iniciais} className="size-full object-cover" />
      )}
      <AvatarPrimitive.Fallback
        className={cn(
          "flex size-full items-center justify-center font-semibold tracking-tight",
          tone === "accent"
            ? "bg-[var(--accent-soft)] text-[var(--accent)]"
            : "bg-[var(--surface-2)] text-[var(--fg-muted)]",
        )}
      >
        {iniciais}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
}

/* ------------------------------- Delta ------------------------------- */

export function Delta({
  value,
  invertido,
  className,
  suffix = "vs. mês anterior",
  showSuffix = false,
}: {
  value: number;
  /** Quando verdadeiro, queda é positiva (ex.: custo operacional). */
  invertido?: boolean;
  className?: string;
  suffix?: string;
  showSuffix?: boolean;
}) {
  const positivo = invertido ? value < 0 : value > 0;
  const neutro = value === 0;
  const Icon = value >= 0 ? TrendUp : TrendDown;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-[12.5px] font-medium tabular",
        neutro
          ? "text-[var(--fg-subtle)]"
          : positivo
            ? "text-[var(--good)]"
            : "text-[var(--critical)]",
        className,
      )}
    >
      {!neutro && <Icon className="size-3.5" weight="bold" aria-hidden />}
      {formatDelta(value)}
      {showSuffix && (
        <span className="font-normal text-[var(--fg-subtle)]">{suffix}</span>
      )}
    </span>
  );
}

/* -------------------------------- Stat ------------------------------- */

/**
 * Número-herói de um KPI. Sem plotagem, sem hover: quando há
 * apenas um valor para comunicar, um número grande lê melhor que um gráfico.
 */
export function Stat({
  label,
  value,
  unit,
  delta,
  deltaInvertido,
  hint,
  icon,
  footer,
  className,
  size = "md",
}: {
  label: string;
  value: React.ReactNode;
  unit?: string;
  delta?: number;
  deltaInvertido?: boolean;
  hint?: string;
  icon?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const valueSize = {
    sm: "text-[22px]",
    md: "text-[30px]",
    lg: "text-[40px]",
  }[size];

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-[12.5px] font-medium text-[var(--fg-muted)]">{label}</p>
        {icon && <span className="text-[var(--fg-subtle)] [&_svg]:size-4">{icon}</span>}
      </div>
      <div className="mt-2 flex items-baseline gap-1.5">
        <span
          className={cn(
            "font-display font-semibold leading-none tracking-[-0.03em] tabular text-[var(--fg)]",
            valueSize,
          )}
        >
          {value}
        </span>
        {unit && (
          <span className="text-[13px] font-medium text-[var(--fg-muted)]">{unit}</span>
        )}
      </div>
      {(delta !== undefined || hint) && (
        <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1">
          {delta !== undefined && <Delta value={delta} invertido={deltaInvertido} />}
          {hint && <span className="text-[12px] text-[var(--fg-subtle)]">{hint}</span>}
        </div>
      )}
      {footer}
    </div>
  );
}

/* ------------------------------- Tabela ------------------------------ */

export function Table({
  className,
  ...props
}: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto">
      <table
        className={cn("w-full border-collapse text-[13.5px]", className)}
        {...props}
      />
    </div>
  );
}

export function Th({
  className,
  numeric,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement> & { numeric?: boolean }) {
  return (
    <th
      scope="col"
      className={cn(
        "border-b border-[var(--border)] px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--fg-subtle)]",
        numeric && "text-right",
        className,
      )}
      {...props}
    />
  );
}

export function Td({
  className,
  numeric,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement> & { numeric?: boolean }) {
  return (
    <td
      className={cn(
        "border-b border-[var(--border)] px-4 py-3 text-[var(--fg)] align-middle",
        numeric && "text-right tabular",
        className,
      )}
      {...props}
    />
  );
}

export function Tr({
  className,
  interactive,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement> & { interactive?: boolean }) {
  return (
    <tr
      className={cn(
        interactive && "cursor-pointer transition-colors hover:bg-[var(--surface-2)]",
        className,
      )}
      {...props}
    />
  );
}

/* --------------------------- Barra de progresso ---------------------- */

export function ProgressBar({
  value,
  max = 100,
  label,
  showValue,
  size = "md",
  tone = "accent",
  className,
}: {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: "xs" | "sm" | "md";
  tone?: "accent" | "good" | "warning" | "critical";
  className?: string;
}) {
  const percentual = Math.min(Math.max((value / max) * 100, 0), 100);
  const height = { xs: "h-1", sm: "h-1.5", md: "h-2" }[size];
  const color = {
    accent: "var(--accent)",
    good: "var(--good)",
    warning: "var(--warning)",
    critical: "var(--critical)",
  }[tone];

  return (
    <div className={cn("w-full", className)}>
      {(label || showValue) && (
        <div className="mb-1.5 flex items-baseline justify-between gap-3">
          {label && <span className="text-[12.5px] text-[var(--fg-muted)]">{label}</span>}
          {showValue && (
            <span className="text-[12.5px] font-medium tabular text-[var(--fg)]">
              {Math.round(percentual)}%
            </span>
          )}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={Math.round(percentual)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        className={cn("w-full overflow-hidden rounded-full bg-[var(--surface-3)]", height)}
      >
        <div
          className="h-full rounded-full transition-[width] duration-700 ease-out"
          style={{ width: `${percentual}%`, background: color }}
        />
      </div>
    </div>
  );
}

/* ----------------------------- Progress ring ------------------------- */

export function ProgressRing({
  value,
  max = 100,
  size = 96,
  strokeWidth = 6,
  children,
  tone = "accent",
  className,
  trackOpacity = 1,
}: {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  children?: React.ReactNode;
  tone?: "accent" | "good" | "warning" | "critical";
  className?: string;
  trackOpacity?: number;
}) {
  const percentual = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentual / 100) * circumference;
  const color = {
    accent: "var(--accent)",
    good: "var(--good)",
    warning: "var(--warning)",
    critical: "var(--critical)",
  }[tone];

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--surface-3)"
          strokeWidth={strokeWidth}
          opacity={trackOpacity}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 900ms cubic-bezier(0.16,1,0.3,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
}
