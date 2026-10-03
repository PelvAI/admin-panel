import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Botón único del panel. Antes cada página escribía el suyo a mano —
 * "bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2
 * rounded-lg font-medium shadow-sm", repetido con variaciones en 9
 * archivos distintos. Un cambio de marca futuro tocaba 9 lugares; ahora
 * toca uno.
 */

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "default" | "sm" | "icon";

const base =
  "inline-flex items-center justify-center gap-2 font-medium transition-colors " +
  "disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
  secondary: "bg-primary/10 text-primary hover:bg-primary/20",
  outline: "border border-input bg-transparent hover:bg-muted text-foreground",
  ghost: "text-muted-foreground hover:bg-muted hover:text-foreground",
  danger: "text-danger hover:bg-danger-wash",
};

const sizes: Record<Size, string> = {
  default: "h-10 px-4 rounded-lg text-sm",
  sm: "h-8 px-3 rounded-lg text-xs",
  icon: "h-9 w-9 rounded-lg p-0",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  )
);
Button.displayName = "Button";
