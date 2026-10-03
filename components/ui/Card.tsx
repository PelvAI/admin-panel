import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

/**
 * El panel blanco con borde que cada vista arma a mano — 32 veces, con
 * el radio dividido entre rounded-lg (8) y rounded-xl (23) sin ningún
 * criterio. Fija el radio en "lg" (20px), que es el que el token de
 * globals.css documenta para cards.
 */

const paddings = {
  none: "",
  sm: "p-4",
  default: "p-6",
  lg: "p-8",
} as const;

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: keyof typeof paddings;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, padding = "default", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "bg-card border border-border rounded-lg shadow-sm",
        paddings[padding],
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";
