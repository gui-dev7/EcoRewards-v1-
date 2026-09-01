"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { LeafMark } from "@/components/brand/leaf-mark";

/* ------------------------------------------------------------------ */
/* Skeleton                                                            */
/* ------------------------------------------------------------------ */

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden
      className={cn(
        "animate-[shimmer_1.6s_ease-in-out_infinite] rounded-[var(--radius-sm)] bg-[var(--surface-2)]",
        className,
      )}
      {...props}
    />
  );
}

/** Esqueleto de um KPI — reproduz o layout final, não um retângulo genérico. */
export function SkeletonStat({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-[var(--radius-lg)] border border-[var(--border)] p-5", className)}>
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-4 h-8 w-32" />
      <Skeleton className="mt-3 h-3 w-20" />
    </div>
  );
}

export function SkeletonChart({ className }: { className?: string }) {
  const alturas = [46, 68, 54, 82, 61, 90, 72, 96, 66, 88, 78, 100];
  return (
    <div className={cn("flex h-full min-h-56 items-end gap-2 px-1", className)}>
      {alturas.map((altura, index) => (
        <Skeleton
          key={index}
          className="flex-1 rounded-t-[4px] rounded-b-none"
          style={{ height: `${altura}%`, animationDelay: `${index * 60}ms` }}
        />
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 6 }: { rows?: number }) {
  return (
    <div className="divide-y divide-[var(--border)]">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex items-center gap-4 px-5 py-3.5">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-3.5 flex-1 max-w-[220px]" />
          <Skeleton className="h-3.5 w-16" />
          <Skeleton className="h-3.5 w-20" />
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Empty state                                                         */
/* ------------------------------------------------------------------ */

export function EmptyState({
  title,
  description,
  action,
  icon,
  className,
  compact,
}: {
  title: string;
  description?: string;
  action?: { label: string; onClick?: () => void; href?: string };
  icon?: React.ReactNode;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        compact ? "px-6 py-10" : "px-6 py-16",
        className,
      )}
    >
      <div className="mb-4 flex size-12 items-center justify-center rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-2)] text-[var(--fg-subtle)] [&_svg]:size-6">
        {icon ?? <LeafMark variant="outline" className="size-6" />}
      </div>
      <p className="font-display text-[15px] font-semibold text-[var(--fg)]">{title}</p>
      {description && (
        <p className="mt-1.5 max-w-sm text-[13px] leading-relaxed text-[var(--fg-muted)]">
          {description}
        </p>
      )}
      {action && (
        <Button
          variant="secondary"
          size="sm"
          className="mt-5"
          onClick={action.onClick}
          asChild={Boolean(action.href)}
        >
          {action.href ? <a href={action.href}>{action.label}</a> : action.label}
        </Button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Error state                                                         */
/* ------------------------------------------------------------------ */

export function ErrorState({
  title = "Não foi possível carregar",
  description = "Tente novamente em alguns instantes.",
  onRetry,
  className,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center px-6 py-14 text-center", className)}>
      <div className="mb-4 flex size-12 items-center justify-center rounded-[var(--radius-lg)] border border-[var(--critical)]/30 bg-[var(--critical-soft)] text-[var(--critical)]">
        <svg viewBox="0 0 24 24" fill="none" className="size-6" aria-hidden>
          <path
            d="M12 8v5M12 16.5v.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      </div>
      <p className="font-display text-[15px] font-semibold text-[var(--fg)]">{title}</p>
      <p className="mt-1.5 max-w-sm text-[13px] leading-relaxed text-[var(--fg-muted)]">
        {description}
      </p>
      {onRetry && (
        <Button variant="secondary" size="sm" className="mt-5" onClick={onRetry}>
          Tentar novamente
        </Button>
      )}
    </div>
  );
}
