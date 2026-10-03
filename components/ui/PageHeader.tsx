import { ReactNode } from "react";

/**
 * Título + descripción + acción de cada página — 17 veces, 12 de ellas
 * ya coincidían letra por letra ("text-3xl font-bold tracking-tight
 * font-heading text-foreground"); las otras 5 divergían un poco. Esto
 * fija el patrón en un solo lugar.
 */

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-bold tracking-tight font-heading text-foreground">
          {title}
        </h2>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
