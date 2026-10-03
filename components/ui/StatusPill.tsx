import { cn } from "@/lib/utils";

/**
 * La píldora de estado única del panel: "Publicado", "Activo", "Admin",
 * los avisos de error del chat. Antes cada ocurrencia elegía su color de
 * Tailwind por defecto sin ningún criterio — 128 usos de red/green/blue/
 * amber/purple/gray repartidos en 11 archivos, ninguno de la paleta ALMA.
 *
 * El mapeo de tono sigue la regla de significado que ya define el manual
 * de marca: Sage es ciencia y validación → success. Gold es logro y
 * excelencia → warning/destacado. Danger es el único tono nuevo, porque
 * el manual no define ninguno para alarma (Rose está reservado para
 * "salud, vitalidad", no para error).
 */

type Tone = "success" | "warning" | "danger" | "info" | "neutral";

const tones: Record<Tone, string> = {
  success: "bg-success-wash text-sage-dark",
  warning: "bg-warning-wash text-gold-ink",
  danger: "bg-danger-wash text-danger",
  info: "bg-info-wash text-primary",
  neutral: "bg-muted text-muted-foreground",
};

export function StatusPill({
  tone = "neutral",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
