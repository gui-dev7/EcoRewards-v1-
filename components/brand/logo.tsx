"use client";

import Link from "next/link";
import { LeafMark } from "./leaf-mark";
import { cn } from "@/lib/utils";

interface LogoProps {
  href?: string;
  className?: string;
  /** `full` mostra o logotipo escrito; `mark` mostra apenas a folha. */
  variant?: "full" | "mark";
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: { mark: "h-6 w-6", text: "text-[15px]" },
  md: { mark: "h-7 w-7", text: "text-[17px]" },
  lg: { mark: "h-9 w-9", text: "text-[21px]" },
} as const;

/**
 * A folha gira sutilmente no hover — 4 graus, o suficiente para
 * o logotipo parecer vivo sem virar enfeite.
 */
export function Logo({
  href = "/",
  className,
  variant = "full",
  size = "md",
}: LogoProps) {
  const content = (
    <>
      <LeafMark
        className={cn(
          sizes[size].mark,
          "text-[var(--accent)] transition-transform duration-500 ease-out group-hover:-rotate-[4deg] group-hover:scale-[1.06]",
        )}
      />
      {variant === "full" && (
        <span
          className={cn(
            "font-display font-semibold tracking-[-0.02em] text-[var(--fg)]",
            sizes[size].text,
          )}
        >
          Eco<span className="text-[var(--accent)]">Rewards</span>
        </span>
      )}
    </>
  );

  const classes = cn("group inline-flex items-center gap-2.5", className);

  if (!href) return <span className={classes}>{content}</span>;

  return (
    <Link href={href} className={classes} aria-label="EcoRewards — página inicial">
      {content}
    </Link>
  );
}
