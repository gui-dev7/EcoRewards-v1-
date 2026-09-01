"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { CircleNotch } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[background-color,border-color,color,transform,box-shadow] duration-200 disabled:pointer-events-none disabled:opacity-45 outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] [&_svg]:shrink-0 active:translate-y-px",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--accent)] text-[var(--accent-fg)] hover:bg-[var(--accent-hover)] shadow-[var(--shadow-xs)]",
        secondary:
          "bg-[var(--surface-2)] text-[var(--fg)] border border-[var(--border)] hover:bg-[var(--surface-3)] hover:border-[var(--border-strong)]",
        outline:
          "border border-[var(--border-strong)] text-[var(--fg)] hover:bg-[var(--surface-2)] hover:border-[var(--accent)]",
        ghost: "text-[var(--fg-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--fg)]",
        soft: "bg-[var(--accent-soft)] text-[var(--accent)] hover:bg-[var(--accent-soft)] hover:brightness-[0.97]",
        danger:
          "bg-[var(--critical)] text-white hover:brightness-110 shadow-[var(--shadow-xs)]",
        link: "text-[var(--accent)] underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        xs: "h-7 rounded-[var(--radius-sm)] px-2.5 text-[12px] [&_svg]:size-3.5",
        sm: "h-9 rounded-[var(--radius-sm)] px-3.5 text-[13px] [&_svg]:size-4",
        md: "h-10 rounded-[var(--radius-md)] px-4 text-[14px] [&_svg]:size-[18px]",
        lg: "h-12 rounded-[var(--radius-md)] px-6 text-[15px] [&_svg]:size-5",
        icon: "h-9 w-9 rounded-[var(--radius-sm)] [&_svg]:size-[18px]",
        "icon-sm": "h-7 w-7 rounded-[var(--radius-xs)] [&_svg]:size-4",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && !asChild ? (
          <>
            <CircleNotch className="animate-spin" weight="bold" />
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };
