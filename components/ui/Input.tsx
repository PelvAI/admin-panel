import { InputHTMLAttributes, forwardRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * El campo de texto que cada formulario escribía a mano — 36 veces,
 * con el radio dividido entre rounded-lg y rounded-xl (login, el único
 * outlier) y el padding entre px-3/py-2 y px-4/py-3 sin ningún criterio.
 * Fija el radio en "lg", el mismo que Button y Card, y el padding en el
 * valor que ya usaba la mayoría (px-3 py-2).
 */

const base =
  "w-full rounded-lg border border-input bg-background text-sm outline-none " +
  "transition-all placeholder:text-muted-foreground " +
  "focus:border-primary focus:ring-2 focus:ring-primary/20 " +
  "disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-muted";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, ...props }, ref) => {
    if (icon) {
      return (
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            {icon}
          </span>
          <input
            ref={ref}
            className={cn(base, "pl-9 pr-3 py-2", className)}
            {...props}
          />
        </div>
      );
    }

    return (
      <input
        ref={ref}
        className={cn(base, "px-3 py-2", className)}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
