"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { WarningCircle } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export const Label = React.forwardRef<
  React.ComponentRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      "text-[12.5px] font-medium text-[var(--fg-muted)] peer-disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
Label.displayName = "Label";

const controlBase =
  "w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-3 text-[14px] text-[var(--fg)] placeholder:text-[var(--fg-subtle)] transition-[border-color,box-shadow] outline-none focus:border-[var(--accent)] focus:ring-[3px] focus:ring-[var(--accent-glow)] disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-[var(--critical)] aria-[invalid=true]:focus:ring-[color-mix(in_srgb,var(--critical)_20%,transparent)]";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input ref={ref} className={cn(controlBase, "h-10", className)} {...props} />
));
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(controlBase, "min-h-[112px] resize-y py-2.5 leading-relaxed", className)}
    {...props}
  />
));
Textarea.displayName = "Textarea";

/** Campo completo: rótulo, controle, dica e mensagem de erro acessível. */
export function Field({
  label,
  htmlFor,
  hint,
  error,
  required,
  children,
  className,
}: {
  label?: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <div className="flex items-baseline justify-between gap-3">
          <Label htmlFor={htmlFor}>
            {label}
            {required && (
              <span className="ml-0.5 text-[var(--critical)]" aria-hidden>
                *
              </span>
            )}
          </Label>
          {hint && !error && (
            <span className="text-[11.5px] text-[var(--fg-subtle)]">{hint}</span>
          )}
        </div>
      )}
      {children}
      {error && (
        <p
          role="alert"
          className="flex items-center gap-1.5 text-[12px] text-[var(--critical)]"
        >
          <WarningCircle weight="fill" className="size-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
