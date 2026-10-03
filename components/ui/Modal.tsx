import { HTMLAttributes, ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * El shell de diálogo que cada modal armaba por su cuenta — 4 veces, con
 * el mismo overlay letra por letra pero el panel divergiendo: dos en
 * bg-card (blanco) y dos en bg-background (Snow, un color distinto desde
 * que el fondo global dejó de ser Ivory), padding de header/footer en
 * tres valores, y la animación de entrada presente en dos, recortada en
 * una y ausente del todo en la cuarta — esa aparecía de golpe mientras
 * las demás hacían fade+zoom.
 *
 * No agrega comportamiento nuevo (cerrar al clickear el fondo, Escape):
 * ninguno de los cuatro lo tenía, y sumarlo es una decisión funcional,
 * no de estilo.
 */

export function Modal({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div
        className={cn(
          "w-full max-w-2xl bg-card rounded-xl shadow-md border border-border flex flex-col",
          "animate-in fade-in zoom-in-95 duration-200",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function ModalHeader({
  onClose,
  className,
  children,
}: {
  onClose: () => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "p-6 border-b border-border bg-muted/5 flex items-start justify-between gap-4",
        className
      )}
    >
      <div className="min-w-0">{children}</div>
      <button
        onClick={onClose}
        className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors shrink-0"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}

export function ModalBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex-1 overflow-y-auto p-6 space-y-6", className)} {...props} />
  );
}

export function ModalFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "p-4 border-t border-border bg-muted/5 flex justify-end gap-3 rounded-b-xl",
        className
      )}
      {...props}
    />
  );
}
