import { TableHTMLAttributes, ThHTMLAttributes, TdHTMLAttributes, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/**
 * Tabla de registros (no la grilla de reglas clínicas, que es un
 * spreadsheet con headers pegajosos e inputs por celda — otro patrón).
 * Antes cada tabla tenía su propio thead: Usuarios con fondo gris y
 * padding generoso, Conocimiento RAG sin hover en las filas y con la
 * mitad del padding — la misma pieza, dos niveles de pulido distintos.
 *
 * El header usa el "label" del manual (mono, 10px, tracking 0.16em,
 * Silver) en vez de gris genérico sans — es la firma tipográfica más
 * repetida del manual y el lugar más natural para usarla en un panel
 * de datos.
 */

export function Table({ className, ...props }: TableHTMLAttributes<HTMLTableElement>) {
  return <table className={cn("w-full text-sm text-left", className)} {...props} />;
}

export function TableHead({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn("bg-muted/50 border-b border-border", className)} {...props} />;
}

export function TableBody({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn("divide-y divide-border", className)} {...props} />;
}

export function TableRow({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={cn("hover:bg-muted/30 transition-colors", className)} {...props} />;
}

export function Th({ className, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        "px-6 py-4 font-mono text-[10px] font-medium uppercase tracking-label text-silver",
        className
      )}
      {...props}
    />
  );
}

export function Td({ className, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn("px-6 py-4", className)} {...props} />;
}
