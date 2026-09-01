import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Superfície contida por um fio de 1px. Deliberadamente sem sombra:
 * a hierarquia vem do espaço e da tipografia, não da elevação.
 */
export function Panel({
  className,
  interactive,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { interactive?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]",
        interactive &&
          "transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-px hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-md)]",
        className,
      )}
      {...props}
    />
  );
}

export function PanelHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-start justify-between gap-3 border-b border-[var(--border)] px-5 py-4",
        className,
      )}
      {...props}
    />
  );
}

export function PanelTitle({
  className,
  as: Tag = "h3",
  ...props
}: React.HTMLAttributes<HTMLHeadingElement> & { as?: "h2" | "h3" | "h4" }) {
  return (
    <Tag
      className={cn(
        "font-display text-[15px] font-semibold tracking-[-0.01em] text-[var(--fg)]",
        className,
      )}
      {...props}
    />
  );
}

export function PanelDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("mt-1 text-[13px] leading-relaxed text-[var(--fg-muted)]", className)}
      {...props}
    />
  );
}

export function PanelBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5", className)} {...props} />;
}

export function PanelFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 border-t border-[var(--border)] px-5 py-3.5",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Cabeçalho de seção editorial: sobrancelha, título e ação à direita.
 * Substitui o padrão de "tudo dentro de um card".
 */
export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-end justify-between gap-4 border-b border-[var(--border)] pb-4",
        className,
      )}
    >
      <div className="min-w-0">
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <h2 className="font-display text-h3 text-[var(--fg)]">{title}</h2>
        {description && (
          <p className="mt-1.5 max-w-2xl text-[13.5px] leading-relaxed text-[var(--fg-muted)]">
            {description}
          </p>
        )}
      </div>
      {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
    </div>
  );
}
