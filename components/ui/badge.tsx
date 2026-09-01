import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 whitespace-nowrap rounded-[var(--radius-xs)] border px-2 py-0.5 text-[11.5px] font-medium leading-5 [&_svg]:size-3.5",
  {
    variants: {
      tone: {
        neutral:
          "border-[var(--border)] bg-[var(--surface-2)] text-[var(--fg-muted)]",
        accent:
          "border-[var(--accent-line)] bg-[var(--accent-soft)] text-[var(--accent)]",
        good: "border-transparent bg-[var(--good-soft)] text-[var(--good)]",
        warning: "border-transparent bg-[var(--warning-soft)] text-[var(--warning)]",
        serious: "border-transparent bg-[var(--serious-soft)] text-[var(--serious)]",
        critical: "border-transparent bg-[var(--critical-soft)] text-[var(--critical)]",
        info: "border-transparent bg-[var(--info-soft)] text-[var(--info)]",
        outline: "border-[var(--border-strong)] bg-transparent text-[var(--fg-muted)]",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

export function Badge({
  className,
  tone,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}

/** Indicador de estado: ponto colorido + rótulo. Nunca cor sozinha. */
export function StatusDot({
  tone = "good",
  label,
  pulse,
  className,
}: {
  tone?: "good" | "warning" | "serious" | "critical" | "neutral";
  label: string;
  pulse?: boolean;
  className?: string;
}) {
  const color = {
    good: "var(--good)",
    warning: "var(--warning)",
    serious: "var(--serious)",
    critical: "var(--critical)",
    neutral: "var(--fg-subtle)",
  }[tone];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-[12.5px] text-[var(--fg-muted)]",
        className,
      )}
    >
      <span className="relative flex h-2 w-2 shrink-0">
        {pulse && (
          <span
            className="absolute inset-0 rounded-full animate-[pulse-ring_2.4s_cubic-bezier(0.24,0,0.38,1)_infinite]"
            style={{ background: color }}
          />
        )}
        <span
          className="relative h-2 w-2 rounded-full"
          style={{ background: color }}
        />
      </span>
      {label}
    </span>
  );
}

export { badgeVariants };
